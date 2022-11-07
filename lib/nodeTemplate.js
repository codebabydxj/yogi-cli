/*
 * @Author: yogi
 * @Date: 2022-11-02 15:35:07
 * @LastEditors: yogi
 * @Description: 重写node模板
 */
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const program = require("commander");
const latestVersion = require("latest-version");
const { devDependencies, dependencies } = require("./packageConfig");

function getViteConfigTemplate(answers) {
  const ejsTemplateData = fs.readFileSync(
    path.resolve(__dirname, "./nodeTemplate/vite.config.ejs")
  );
  const indexTemplateData = ejs.render(ejsTemplateData.toString(), {
    name: program.args[0],
    port: answers.port,
    // modules: config.modules,
  });
  return prettier.format(indexTemplateData, { parser: "babel" });
}

async function getPackageTemplate(answers) {
  for (const key in dependencies) {
    dependencies[key] = await latestVersion(key);
  }
  for (const key in devDependencies) {
    devDependencies[key] = await latestVersion(key);
  }
  const ejsTemplateData = fs.readFileSync(
    path.resolve(__dirname, "./nodeTemplate/package.ejs")
  );
  const packageTemplateData = ejs.render(ejsTemplateData.toString(), {
    name: program.args[0],
    description: answers.description,
    author: answers.author,
    modules: answers.modules,
    dependencies,
    devDependencies,
  });
  return prettier.format(packageTemplateData, { parser: "json" });
}

module.exports = {
  getViteConfigTemplate,
  getPackageTemplate
}