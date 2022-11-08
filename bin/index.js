#!/usr/bin/env node
// 使用Node开发命令行工具所执行的Javascript脚本必须在顶部加入 #!/usr/bin/env node

const ora = require('ora');
const chalk = require('chalk');
const program = require('commander');
const logSymbols = require('log-symbols');
const version = require("../package.json").version;
const latestVersion = require("latest-version");
const {
  mkdirByProjectName,
  choiceTemplate,
  downloadByGit,
  installModules,
} = require("../lib/create");
const { nodeProjectQuestion } = require("../lib/questions");

program
  .command('init <project-template>')
  .description('「 初始化项目模板 」')
  .action((templateName) => {
    console.log(
      chalk.greenBright(`
          ┏┓　    ┏┓
        ┏┛┻━━━┛┻┓
        ┃            ┃
        ┃     -      ┃
        ┃  ＞   ＜   ┃
        ┃　          ┃
        ┃ ... 々 ...  ┃
        ┃　          ┃
        ┗━┓　    ┏━┛
            ┃　    ┃
            ┃　    ┃  神兽保佑
            ┃　    ┃  永无BUG
            ┃　    ┗━━━┓
            ┃　           ┣┓⌒ 
            ┃　           ┏┛  ⌒ ︶
            ┗┓┓┏━┳┓┏┛
              ┃┫┫　┃┫┫
              ┗┻┛　┗┻┛
      `)
    );
    console.log();
    cliStart(templateName);
  })

program.on('--help', function () {
  console.log();
  console.log(chalk.green('创建项目：yogi init <projectName>'));
  console.log();
});

// process.argv原生获取命令行参数的方式
program.version(version, '-v, --version').parse(process.argv);
if (program.args.length < 2) program.help();

async function cliStart(templateName) {
  /** 1. 版本检测 */
  const spiner = ora(`${logSymbols.warning}  「 请稍等，版本检测中... 」`).start()
  spiner.color = "yellow";
  const onLineVersion = await latestVersion("yogi-cli");
  spiner.stop();
  if (version !== onLineVersion) {
    console.log(
      chalk.yellow(
        "⚠️  请关闭运行程序，使用: < npm install -g yogi-cli@latest > 升级后再创建项目"
      )
    );
    console.log();
  } else {
    console.log(chalk.green(`✅ 项目名称：<${templateName}>`));

    /** 2. 检测创建的项目目录是否存在 */
    await mkdirByProjectName();

    /** 3. 选择对应的模板 */
    const { choice } = await choiceTemplate();

    /** 4. 执行用户信息输入 */
    let answers = await nodeProjectQuestion();

    /** 5. 下载模板 */
    await downloadByGit(choice, answers);

    /** 6. 安装依赖 */
    await installModules();
  }
}
