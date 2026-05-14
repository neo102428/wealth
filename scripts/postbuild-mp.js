const fs = require('fs')
const path = require('path')

const distDir = path.resolve(__dirname, '../dist/build/mp-weixin')
const configFile = path.join(distDir, 'project.config.json')
const miniappFile = path.join(distDir, 'project.miniapp.json')
const appConfigFile = path.join(distDir, 'app.json')
const appMiniappFile = path.join(distDir, 'app.miniapp.json')
const packageFile = path.resolve(__dirname, '../package.json')

if (!fs.existsSync(configFile)) {
  console.log('[postbuild] project.config.json not found, skipping')
  process.exit(0)
}

// 读取 uni-app 生成的配置
const raw = fs.readFileSync(configFile, 'utf-8')
const config = JSON.parse(raw)

// 写入 project.miniapp.json（多端应用模式需要的入口文件）
const miniappConfig = {
  miniprogramRoot: './',
  compileType: config.compileType || 'miniprogram',
  setting: config.setting || {},
  appid: config.appid || '',
  projectname: config.projectname || '资产管家',
  libVersion: config.libVersion || '',
  condition: config.condition || {},
}

fs.writeFileSync(miniappFile, JSON.stringify(miniappConfig, null, 2), 'utf-8')
console.log('[postbuild] project.miniapp.json generated for multi-platform mode')

if (fs.existsSync(appConfigFile)) {
  const appRaw = fs.readFileSync(appConfigFile, 'utf-8')
  const appConfig = JSON.parse(appRaw)

  if ('projectArchitecture' in appConfig) {
    delete appConfig.projectArchitecture
    fs.writeFileSync(appConfigFile, JSON.stringify(appConfig, null, 2), 'utf-8')
    console.log('[postbuild] removed projectArchitecture from app.json')
  }
}

const packageRaw = fs.readFileSync(packageFile, 'utf-8')
const packageConfig = JSON.parse(packageRaw)
const appMiniappConfig = {
  miniVersion: 'v2',
  name: config.projectname || packageConfig.name || 'uni-app',
  version: packageConfig.version || '0.0.1',
  versionCode: 100,
  i18nFilePath: 'i18n',
  'mini-ohos': {
    sdkVersion: '',
  },
  'mini-android': {
    sdkVersion: '1.6.24',
    toolkitVersion: '0.11.0',
    enableVConsole: 'open',
    privacy: {
      enable: true,
    },
  },
  'mini-ios': {
    sdkVersion: '1.7.0',
    toolkitVersion: '0.0.9',
    enableVConsole: 'open',
    privacy: {
      enable: false,
    },
    enableOpenUrlNavigate: true,
  },
}

fs.writeFileSync(appMiniappFile, JSON.stringify(appMiniappConfig, null, 2), 'utf-8')
console.log('[postbuild] app.miniapp.json generated for identity service API')
