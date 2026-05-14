# Wealth Tracker

个人资产管理系统，基于 uni-app、Vue 3、Pinia 和 TypeScript 构建，当前重点支持微信开发者工具的多端应用模式，同时保留 H5 构建能力。

## 功能

- 首页资产看板：净资产、资产负债率、资产分类汇总。
- 资产管理：资产列表、分类筛选、新增、编辑、删除、估值历史。
- 负债管理：负债列表、分类筛选、新增、编辑、删除。
- 报表：每日快照和月结表。
- 个人页：用户信息展示和退出登录入口。

## 技术栈

- uni-app 3
- Vue 3
- Pinia
- TypeScript
- Vite
- Sass

## 开发

安装依赖：

```bash
npm install
```

微信小程序开发：

```bash
npm run dev:mp-weixin
```

微信小程序构建：

```bash
npm run build:mp-weixin
```

构建后使用微信开发者工具导入：

```text
dist/build/mp-weixin
```

该项目使用微信开发者工具多端应用模式，`build:mp-weixin` 会在 uni-app 构建后运行 `scripts/postbuild-mp.js`，生成 `project.miniapp.json` 和 `app.miniapp.json`。不要只单独运行 `uni build -p mp-weixin` 后导入。

H5 开发和构建：

```bash
npm run dev:h5
npm run build:h5
```

## 质量检查

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run check
```

`npm run check` 会依次执行类型检查、lint、测试和微信多端构建。

## 目录说明

```text
src/api          API 请求封装与接口声明
src/components   公共组件
src/mock         本地 mock 数据
src/pages        页面
src/stores       Pinia 状态
src/types        业务类型与枚举文案
src/utils        通用工具
scripts          构建后处理脚本
```

## 备注

当前业务数据主要来自 mock 初始化和本地 storage 持久化，API 层已预留接口。后续接入服务端时，建议先统一 store 与 API 的数据流边界。
