/*
 * @Author: yogi
 * @Date: 2022-11-02 15:35:07
 * @LastEditors: yogi
 * @Description: 创建模板的流程
 */
const fs = require("fs");
const path = require("path");
const program = require("commander");
const ora = require("ora");
const chalk = require("chalk");
const rimraf = require("rimraf");
const download = require('download-git-repo');
const logSymbols = require('log-symbols');
const execa = require("execa");
const { isRemoveDirQuestion, choiceTemplateQuestion } = require("./questions");
const { getPackageTemplate, getViteConfigTemplate } = require("./nodeTemplate");

/**检测创建文件夹 */
async function mkdirByProjectName() {
  // 创建文件夹判断是否需要覆盖同名目录
  if (fs.existsSync(program.args[0])) {
    console.log(chalk.red(`<${program.args[0]}> 文件夹已存在`));
    let answers = await isRemoveDirQuestion();
    if (answers.ok) {
      const spiner = ora(`${logSymbols.warning}  「 正在清理文件，请稍后... 」`).start();
      rimraf.sync(getProjectName());
      spiner.succeed(`<${program.args[0]}> 文件夹已清空`);
    } else {
      console.log(chalk.yellow("「 程序已关闭 」"));
      process.exit(1);
    }
  }
}

/**选择模板 */
async function choiceTemplate() {
  return await choiceTemplateQuestion();
}

/**下载模板 */
async function downloadByGit(url, answers) {
  const spiner = ora("正在拉取模板中，请稍后...").start();
  console.log();
  return new Promise((resolve, reject) => {
    download(url, getProjectName(), { clone: false }, async function (err) {
      spiner.stop();
      if (err) {
        spiner.fail("「 模板拉取失败！！！ 」");
        console.log(logSymbols.error, chalk.red(err))
        reject();
        process.exit(1);
      }
      spiner.succeed(chalk.yellow("「 模板创建成功 」"));
      await rewriteNodeTemplate(answers);
      console.log(logSymbols.success, chalk.yellow("「 初始化模板完成 」"))
      console.log();
      resolve();
    });
  });
}

/**模板文件下载成功，重写本地文件 */
async function rewriteNodeTemplate(answers) {
  /** 1. 把项目下的package.json文件读取出来 */
  /** 2. 使用向导的方式采集用户输入的值 */
  /** 3. 使用模板引擎把用户输入的数据解析到package.json文件中 */
  /** 4. 解析完毕，把解析之后的结果重新写入package.json文件中 */
  /** 5. 重写到本地文件 */

  fs.writeFileSync(
    getProjectName() + "/vite.config.ts",
    getViteConfigTemplate(answers)
  );

  fs.writeFileSync(
    getProjectName() + "/package.json",
    await getPackageTemplate(answers)
  );
}

/**安装依赖 */
async function installModules() {
  const spiner = ora("正在安装依赖...").start();
  await execa("yarn", { cwd: getProjectName() }, ["install"])
    .then(() => {
      spiner.succeed(chalk.yellow("「 依赖安装完成 」"));
      console.log(chalk.yellow(`😊 Hello World`));
      console.log(chalk.yellow(`😊 请执行以下命令，开启你的code之旅吧~`));
      console.log(chalk.yellow(`😊 cd ${program.args[0]}`));
      console.log(chalk.yellow(`😊 yarn dev`));
      console.log();
    })
    .catch((err) => {
      console.log(chalk.red(err));
      spiner.stop();
    });
}

/**获取模板名称 */
function getProjectName() {
  return path.resolve(process.cwd(), program.args[0]);
}

module.exports = {
  mkdirByProjectName,
  choiceTemplate,
  downloadByGit,
  installModules,
};