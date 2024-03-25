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
    // 针对一些包做特殊版本的处理
    if (key === '@wangeditor/editor-for-vue') {
      dependencies['@wangeditor/editor-for-vue'] = '5.1.12';
    } else if (key === 'driver.js') {
      dependencies['driver.js'] = '1.3.1';
    } else if (key === 'vuedraggable') {
      dependencies['vuedraggable'] = '4.1.0';
    } else {
      dependencies[key] = await latestVersion(key);
    }
  }
  for (const key in devDependencies) {
    // 控制vite版本  并且node版本是
    if (key === 'vite' && (!process.version.startsWith('18') || !process.version.startsWith('20'))) {
      devDependencies['vite'] = '4.5.0';
    } else {
      devDependencies[key] = await latestVersion(key);
    }
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