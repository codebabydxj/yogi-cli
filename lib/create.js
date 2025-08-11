/*
 * @Author: yogi
 * @Date: 2025-01-09
 * @LastEditors: yogi
 * @Description: 创建模板的流程
 */
const fs = require("fs");
const program = require("commander");
const path = require("path");
const chalk = require("chalk");
const rimraf = require("rimraf");
const download = require("./download.js");
const ora = require("ora");
const execa = require("execa");
const { isRemoveDirQuestion, choiceTemplateQuestion } = require("./questions");
const { getViteConfigTemplate, getPackageTemplate } = require("./nodeTemplate");

/**检测创建文件夹 */
async function mkdirByProjectName() {
  // 创建文件夹判断是否需要覆盖同名目录
  if (fs.existsSync(program.args[0])) {
    console.log(chalk.red(`⚠️ <${program.args[0]}> 文件夹已存在`));
    let answers = await isRemoveDirQuestion();
    if (answers.ok) {
      const loading = ora('「 正在清理文件，请稍后... 」').start();
      rimraf.sync(getProjectName());
      loading.succeed(`<${program.args[0]}> 文件夹已清空`);
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


/**模板文件下载成功，重写本地文件 */
async function rewriteNodeTemplate(choice, answers) {
  /** 1. 把项目下的package.json文件读取出来 */
  /** 2. 使用向导的方式采集用户输入的值 */
  /** 3. 使用模板引擎把用户输入的数据解析到package.json文件中 */
  /** 4. 解析完毕，把解析之后的结果重新写入package.json文件中 */
  /** 5. 重写到本地文件 */

  fs.writeFileSync(
    getProjectName() + "/vite.config.ts",
    getViteConfigTemplate(choice, answers)
  );

  fs.writeFileSync(
    getProjectName() + "/package.json",
    await getPackageTemplate(choice, answers)
  );
}

/**下载模板 */
async function downloadByGit(choice, answers) {
  const loading = ora("正在拉取模板中，请稍后...").start();
  console.log();
  return new Promise((resolve, reject) => {
    download(choice.url, getProjectName(), { clone: false }, async function (err) {
      loading.stop();
      if (err) {
        loading.fail("「 模板拉取失败！！！ 」");
        console.log(chalk.red(err))
        reject();
        process.exit(1);
      }
      if ([0, 1, 2].includes(choice.id)) await rewriteNodeTemplate(choice, answers);
      loading.succeed(chalk.yellow("「 模板创建成功 」"));
      console.log();
      resolve();
    });
  });
}

/**安装依赖 */
async function installModules(builder) {
  const loading = ora("正在安装依赖,请稍等...").start();
  process.chdir(`./${program.args[0]}`)
  await execa(builder, ["install"])
    .then(() => {
      loading.succeed(chalk.yellow("「 依赖安装完成 」"));
      console.log(chalk.yellow(`😊 「 Hello world 」`));
      console.log(chalk.yellow(`😊 「 请执行以下命令，开启你的code之旅吧~ 」`));
      console.log(chalk.yellow(`😊 「 cd ${program.args[0]} 」`));
      console.log(chalk.yellow(`😊 「 ${builder} dev 」`));
      console.log();
    })
    .catch((err) => {
      console.log(chalk.red(err));
      loading.stop();
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