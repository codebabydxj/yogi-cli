/*
 * @Author: yogi
 * @Date: 2022-11-02 15:35:07
 * @LastEditors: yogi
 * @Description: 用户交互模块，需要用户输入、选择
 */
const inquirer = require("inquirer");

function isRemoveDirQuestion() {
  return inquirer.prompt([
    {
      type: "confirm",
      message: "是否覆盖原文件夹?",
      name: "ok",
    },
  ]);
}

function choiceTemplateQuestion() {
  return inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "请选择应用模板:",
      choices: [
        {
          value: "https://github.com:codebabydxj/vue3-templete#main",
          name: "「 vue3x+vite3x+typescript+pinia+element-plus 」",
          description: 'vue3项目',
        },
        {
          value: "https://github.com:codebabydxj/vue3_vite#main",
          name: "「 vue3x+vite4.3+typescript+pinia+element-plus 」",
          description: 'vite4.3项目',
        },
      ],
    },
  ]);
}

function nodeProjectQuestion() {
  return inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "请输入项目名称",
      validate: function (name) {
        name = name.replace(/\s+/g, '')
        if (name) return true;
        return "请输入项目名称";
      },
    },
    {
      type: "input",
      name: "projectCode",
      message: "请输入项目编码",
      validate(name) {
        if (!name) return "请输入项目编码";
        if (!/^[a-zA-Z]\w{1,15}$/.test(name)) return "请输入以字母开头的编码(至少两位)";
        return true;
      },
    },
    {
      type: "input",
      name: "projectId",
      message: "请输入项目ID",
      validate: function (input) {
        if (input) {
          if (!Number(input)) {
            return "请输入数字";
          } else {
            return true;
          }
        } else {
          return "请输入项目ID";
        }
      },
    },
    {
      type: "input",
      name: "description",
      message: "请输入项目描述",
      validate: function (name) {
        return true;
      },
    },
    {
      type: "input",
      name: "author",
      message: "请输入作者名称(英文)",
      validate: function (name) {
        name = name.replace(/\s+/g, '')
        return true;
      },
    },
    {
      type: "input",
      name: "port",
      message: "请输入运行端口,默认9001",
      default() {
        return 9001;
      },
      validate: function (input) {
        if (!Number(input)) {
          return "请输入数字";
        } else {
          return true;
        }
      },
    },
    // {
    //   type: "checkbox",
    //   name: "modules",
    //   message: "选择要使用的中间件或依赖",
    //   choices: [
    //     { name: "cors" },
    //     { name: "bodyParser" },
    //     { name: "fs" },
    //     { name: "static" },
    //     { name: "axios" },
    //     { name: "qs" },
    //     { name: "lodash" },
    //   ],
    // },
  ]);
}

module.exports = {
  isRemoveDirQuestion,
  choiceTemplateQuestion,
  nodeProjectQuestion,
};