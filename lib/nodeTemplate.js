/*
 * @Author: yogi
 * @Date: 2025-01-14
 * @LastEditors: yogi
 * @Description: 重写node模板
 */
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const program = require("commander");
const latestVersion = require("latest-version");
const { devDependencies, dependencies, devDependenciesVite5, dependenciesVite5 } = require("./packageConfig");

function getViteConfigTemplate(choice, config) {
  let dirname = path.resolve(__dirname, "./nodeTemplate/vite.config.ejs");
  if (choice.id === 1) dirname = path.resolve(__dirname, "./nodeTemplate2/vite.config.ejs");
  const ejsTemplateData = fs.readFileSync(dirname);
  const indexTemplateData = ejs.render(ejsTemplateData.toString(), {
    name: program.args[0],
    port: config.port,
    // modules: config.modules,
  });
  return prettier.format(indexTemplateData, { parser: "babel" });
}

async function getPackageTemplate(choice, config) {
  let _dependencies = dependencies;
  if (choice.id === 1) _dependencies = dependenciesVite5;
  for (const key in _dependencies) {
    // 针对一些包做特殊版本的处理
    if (key === '@wangeditor/editor-for-vue') {
      _dependencies['@wangeditor/editor-for-vue'] = '5.1.12';
    } else if (key === 'driver.js') {
      _dependencies['driver.js'] = '1.3.1';
    } else if (key === 'vuedraggable') {
      _dependencies['vuedraggable'] = '4.1.0';
    } else if (key === 'vue' && choice.id === 0) {
      _dependencies['vue'] = '3.4.35';
    } else if (key === 'vue-router' && choice.id === 0) {
      _dependencies['vue-router'] = '4.4.5';
    } else {
      _dependencies[key] = await latestVersion(key);
    }
  }
  let _devDependencies = devDependencies;
  if (choice.id === 1) _devDependencies = devDependenciesVite5;
  for (const key in _devDependencies) {
    // 控制vite版本  vite5x 不再支持v14/v16/v17/v19
    if (key === 'vite') {
      if (choice.id === 0 || (process.version.startsWith('v14') || process.version.startsWith('v16') || process.version.startsWith('v17') || process.version.startsWith('v19'))) { // vite4x
        _devDependencies['vite'] = '4.5.3';
      } else {
        _devDependencies['vite'] = '5.4.11'
      }
    } else if (key === 'sass' && choice.id === 0) {
      _dependencies['sass'] = '1.77.6';
    } else if (key === '@vitejs/plugin-vue') {
      if (choice.id === 0) {
        _dependencies['@vitejs/plugin-vue'] = '4.6.2';
      } else {
        _dependencies['@vitejs/plugin-vue'] = '5.2.1';
      }
    } else {
      _devDependencies[key] = await latestVersion(key);
    }
  }
  let dirname = path.resolve(__dirname, "./nodeTemplate/package.ejs");
  if (choice.id === 1) dirname = path.resolve(__dirname, "./nodeTemplate2/package.ejs");
  const ejsTemplateData = fs.readFileSync(dirname);
  const packageTemplateData = ejs.render(ejsTemplateData.toString(), {
    name: program.args[0],
    description: config.description,
    author: config.author,
    modules: config.modules,
    dependencies: _dependencies,
    devDependencies: _devDependencies,
  });
  return prettier.format(packageTemplateData, { parser: "json" });
}

module.exports = {
  getViteConfigTemplate,
  getPackageTemplate
}