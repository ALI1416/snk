const fs = require('fs')

generateAnimation()

/**
 * 生成动画
 */
async function generateAnimation() {
  let userName = process.argv[2]
  let year = process.argv[3]
  let array = await getGitHubContribution(userName, year)
  fs.mkdirSync('./dist/images/', {recursive: true})
  fs.writeFileSync('./dist/images/snk.svg', draw(array))
  fs.writeFileSync('./dist/images/snk.light.svg', draw(array, true))
  fs.writeFileSync('./dist/images/snk.dark.svg', draw(array, false))
}

/**
 * 绘制
 */
function draw(array, light) {
  let svg = `<svg width="880" height="192" viewBox="0 0 880 192" xmlns="http://www.w3.org/2000/svg">
<defs>
<rect id="r" width="10" height="10" rx="2" ry="2"/>
</defs>
`
  svg += styles(array, light)
  svg += uses(array)
  svg += `</svg>`
  return svg
}

/**
 * 样式
 */
function styles(array, light) {
  let style = `<style>\n`
  style += styleRoot(light)
  style += `.c{
shape-rendering:geometricPrecision;
fill:var(--c0);
stroke-width:1px;
stroke:rgba(27,31,35,0.06);
}
`
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      let level = array[i][j]
      if (level > 0) {
        style += `.c${i}-${j}{
fill:var(--c${level});
}
`
      }
    }
  }
  style += `</style>\n`
  return style
}

/**
 * 引用
 */
function uses(array) {
  let use = ""
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      let level = array[i][j]
      if (level > -1) {
        use += `<use href="#r" x="${i * 14}" y="${j * 14}" class="c`
        if (level === 0) {
          use += `"/>\n`
        } else {
          use += ` c${i}-${j}"/>\n`
        }
      }
    }
  }
  return use
}

/**
 * 样式root
 */
function styleRoot(light) {
  if (typeof light === "undefined") {
    return `:root{
--c0:#ebedf0;
--c1:#9be9a8;
--c2:#40c463;
--c3:#30a14e;
--c4:#216e39;
}
@media(prefers-color-scheme:dark){
:root{
--c0:#161b22;
--c1:#0e4429;
--c2:#006d32;
--c3:#26a641;
--c4:#39d353;
}}
`
  } else if (light) {
    return `:root{
--c0:#ebedf0;
--c1:#9be9a8;
--c2:#40c463;
--c3:#30a14e;
--c4:#216e39;
}
`
  } else {
    return `:root{
--c0:#161b22;
--c1:#0e4429;
--c2:#006d32;
--c3:#26a641;
--c4:#39d353;
}
`
  }
}

/**
 * 获取GitHub用户贡献级别
 * @param userName 用户名
 * @param year 年
 * @return number[53][7]
 */
async function getGitHubContribution(userName, year) {
  let url = `https://api.404z.cn/api/github/contribution/${userName}`
  if (typeof year !== "undefined") {
    url += `?year=${year}`
  }
  // let res = await (await fetch(url)).text()
  let res = fs.readFileSync('./reference/contribution.json').toString()
  // 解析
  let array = []
  let data = JSON.parse(res)[1]
  // 第1周
  let w1 = []
  let w1d = data[0].length
  for (let i = 0; i < 7 - w1d; i++) {
    w1.push(-1)
  }
  for (let i = 0; i < w1d; i++) {
    w1.push(data[0][i][0])
  }
  array.push(w1)
  // 第2-52周
  for (let i = 1; i < 52; i++) {
    let w = []
    for (let j = 0; j < 7; j++) {
      w.push(data[i][j][0])
    }
    array.push(w)
  }
  // 第53周
  let w53 = []
  let w53d = data[52].length
  for (let i = 0; i < w53d; i++) {
    w53.push(data[52][i][0])
  }
  for (let i = 0; i < 7 - w53d; i++) {
    w53.push(-1)
  }
  array.push(w53)
  return array
}
