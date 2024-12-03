# GitHub Contribution Graph Animation GitHub贡献图动画

[![License](https://img.shields.io/github/license/ALI1416/snk?label=License)](https://www.apache.org/licenses/LICENSE-2.0.txt)
[![Node Support](https://img.shields.io/badge/Node-14+-green)](https://nodejs.org/)
[![NPM](https://img.shields.io/npm/v/@ali1416/snk?label=NPM)](https://www.npmjs.com/package/@ali1416/snk)
[![Tag](https://img.shields.io/github/v/tag/ALI1416/snk?label=Tag)](https://github.com/ALI1416/snk/tags)
[![Repo Size](https://img.shields.io/github/repo-size/ALI1416/snk?label=Repo%20Size&color=success)](https://github.com/ALI1416/snk/archive/refs/heads/master.zip)

[![Node CI](https://github.com/ALI1416/snk/actions/workflows/ci.yml/badge.svg)](https://github.com/ALI1416/snk/actions/workflows/ci.yml)

## 简介

本项目参考了[Platane/snk](https://github.com/Platane/snk)，只保留了SVG图片，并对处理逻辑进行了大量优化，构建后`snk.min.js`文件仅`7kb`

[在线示例](https://www.404z.cn/demo/snk.html)

## 依赖导入

### 网页

<https://unpkg.com/@ali1416/snk/dist/snk.min.js>

### node

```sh
npm install @ali1416/snk
```

## 方法和参数

| 参数名   | 中文名   | 类型   | 默认值   |
| -------- | -------- | ------ | -------- |
| userName | 用户名   | string | (无)     |
| type     | 主题模式 | number | 0        |
| year     | 年       | string | (一年前) |

### 主题模式 type

| 值  | 主题模式     | 备注           |
| --- | ------------ | -------------- |
| 0   | 混合         | 返回字符串     |
| 1   | 亮           | 返回字符串     |
| 2   | 暗           | 返回字符串     |
| 3   | [混合,亮,暗] | 返回字符串数组 |

## 使用示例

```js
// node test-js.js
const fs = require('fs')

const snk = require('../dist/snk.js')
snk('ali1416', 3).then((res) => {
  fs.writeFileSync('E:/snk.svg', res[0])
  fs.writeFileSync('E:/snk.light.svg', res[1])
  fs.writeFileSync('E:/snk.dark.svg', res[2])
})
```

更多请见[测试](./test)

## 更新日志

[点击查看](./CHANGELOG.md)

## 参考

- [Platane/snk](https://github.com/Platane/snk)

## 关于

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://www.404z.cn/images/about.dark.svg">
  <img alt="About" src="https://www.404z.cn/images/about.light.svg">
</picture>
