/*
 * @Author: yogi
 * @Date: 2024-03-24 00:00:00
 * @LastEditors: yogi
 * @Description: 用户交互模块，需要用户输入、选择
 */
const inquirer = require("inquirer");

function builderSelected() {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'builder',
      message: '选择要使用的构建工具',
      choices: [
        { name: 'pnpm', value: 'pnpm' },
        { name: 'yarn', value: 'yarn' },
        { name: 'npm', value: 'npm' },
        { name: '手动安装', value: '' }
      ]
    }
  ])
}

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
          value: {
            url: "github:codebabydxj/vue3_vite#main",
            id: 0
          },
          name: "「 vue3x + vite4.5 + ts + pinia + element-plus 」",
          description: "vite4.5开源项目",
        },
        // {
        //   value: {
        //     url: "github:codebabydxj/vue2_cli3#master",
        //     id: 1
        //   },
        //   name: "「 vue2x-cli3 + vuex + element + axios 」",
        //   description: "vue2x开源项目(不再没维护)",
        // },
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
      message: "请输入运行端口,默认3000",
      default() {
        return 3000;
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
  builderSelected
};