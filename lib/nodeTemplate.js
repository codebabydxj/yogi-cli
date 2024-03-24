/*
 * @Author: yogi
 * @Date: 2024-03-24 00:00:00
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

function getViteConfigTemplate(config) {
  const ejsTemplateData = fs.readFileSync(
    path.resolve(__dirname, "./nodeTemplate/vite.config.ejs")
  );
  const indexTemplateData = ejs.render(ejsTemplateData.toString(), {
    name: program.args[0],
    port: config.port,
    // modules: config.modules,
  });
  return prettier.format(indexTemplateData, { parser: "babel" });
}

async function getPackageTemplate(config) {
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
    description: config.description,
    author: config.author,
    modules: config.modules,
    dependencies,
    devDependencies,
  });
  return prettier.format(packageTemplateData, { parser: "json" });
}

module.exports = {
  getViteConfigTemplate,
  getPackageTemplate
}