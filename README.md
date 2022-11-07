<!--
 * @Author: yogi
 * @Date: 2022-10-27 16:52:27
 * @LastEditors: yogi
 * @LastEditTime: 2022-11-07 16:30:34
 * @Description: Nothing Impossible
-->
## yogi-cli

### 打造自己的脚手架工具，实现思路

- 项目模板放在github/gitlab上
- 用户通过命令交互的方式下载不同的模板
- 经过模板引擎渲染定制项目模板
- 模板变动，只需要更新模板即可，不需要用户更新脚手架

****
### 涉及知识点及模块

- NodeJs
  
  基于Node.js开发命令行工具

- ECMAScript 6

  使用最新版本语言进行开发

- npm 发包

  npm包的发布及更新流程 
  
  ```『 <npm login> 登录 <npm publish> 发布 』```

  登录失败E403 试试执行 

  ```『 npm config set registry https://registry.npmjs.org 』```

  全局下载yogi-cli失败可以试试

  ```『 npm config set registry=https://registry.npm.taobao.org 』```

  全局更新工具包

  ```『 npm update <name> -g 』```

- commander.js

  可以自动的解析命令和参数，用于处理用户输入的命令

- download-git-repo

  下载并提取git仓库，用于下载项目模板

- Inquirer.js
  
  通用的命令行用户界面集合，用于和用户进行交互

- handlebars.js

  模板引擎，将用户提交的信息动态填充到文件中

- ora

  下载过程久的话。可以用于显示下载中的动画效果

- chalk

  可以给终端的字体加上颜色

- log-symbols

  可以在终端上显示出√|×等提示图标

****
### 全局安装
```
npm install yogi-cli -g
```

### 初始化项目
```
yogi init <projectName>
```