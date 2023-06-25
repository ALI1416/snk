const fs = require('fs')

generateAnimation()

/**
 * 生成动画
 */
async function generateAnimation() {
  let userName = process.argv[2]
  let year = process.argv[3]
  let array = await getGitHubContribution(userName, year)
  // console.log(calculatePath(array))
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
 * 计算路径
 */
function calculatePath(array) {
  // 路径[x,y,距离上一点长度,贡献级别]
  let path = []
  let x
  let y
  let level
  let distance
  // 找到起始点
  for (let j = 0; j < 7; j++) {
    let value = array[j][0]
    if (value > -1) {
      x = 0
      y = j
      level = value
      break
    }
  }
  // 计算起始点
  if (level > 0) {
    // 有贡献
    path.push([y, x, 0, level])
    array[y][0] = -2
    distance = 0
  } else {
    // 无贡献
    path.push([y, x, -1, -1])
    distance = 1
  }
  // 计算剩余点
  while (true) {
    let nextPoint = calculateNextPoint(array, x, y, distance)
    if (nextPoint[0] === -1) {
      return path
    } else {
      path.push(nextPoint)
      y = nextPoint[0]
      x = nextPoint[1]
      distance = 0
    }
  }
}

/**
 * 计算下一个点
 * @return [] x,y,距离上一点长度,贡献级别
 */
function calculateNextPoint(array, x, y, distance) {
  if (distance > 53) {
    return [-1, -1, -1, -1]
  }
  for (let i = -distance; i <= distance; i++) {
    for (let j = -distance; j <= distance; j++) {
      if ((Math.abs(i) + Math.abs(j) === distance) && ((i + x) > -1 && (j + y) > -1) && ((i + x) < 53 && (j + y) < 7)) {
        let level = array[j + y][i + x]
        if (level > 0) {
          array[j + y][i + x] = -2
          return [j + y, i + x, distance, level]
        }
      }
    }
  }
  return calculateNextPoint(array, x, y, distance + 1)
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
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 53; j++) {
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
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 53; j++) {
      let level = array[i][j]
      if (level > -1) {
        use += `<use href="#r" x="${j * 14}" y="${i * 14}" class="c`
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

const styleRootLight = `:root{
--c0:#ebedf0;
--c1:#9be9a8;
--c2:#40c463;
--c3:#30a14e;
--c4:#216e39;
}
`

const styleRootDark = `:root{
--c0:#161b22;
--c1:#0e4429;
--c2:#006d32;
--c3:#26a641;
--c4:#39d353;
}
`

const styleRootAll = styleRootLight + `@media(prefers-color-scheme:dark){\n` + styleRootDark + `}\n`

/**
 * 样式root
 */
function styleRoot(light) {
  if (typeof light === "undefined") {
    return styleRootAll
  } else if (light) {
    return styleRootLight
  } else {
    return styleRootDark
  }
}

/**
 * 获取GitHub用户贡献级别
 * @param userName 用户名
 * @param year 年
 * @return number[7][53]
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
  // 转置
  let newArray = []
  for (let j = 0; j < 7; j++) {
    newArray[j] = []
  }
  for (let i = 0; i < 53; i++) {
    for (let j = 0; j < 7; j++) {
      newArray[j][i] = array[i][j]
    }
  }
  return newArray
}
