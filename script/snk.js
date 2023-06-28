const fs = require('fs')

generateAnimation()

/**
 * 生成动画
 */
async function generateAnimation() {
  let userName = process.argv[2]
  let year = process.argv[3]
  let array = await getGitHubContribution(userName, year)
  // let pathLength = 0
  // let path = calculatePath(array)
  // for (let i = 0; i < path.length; i++) {
  //   pathLength += path[i][2]
  // }
  // console.log(pathLength)
  fs.mkdirSync('./dist/images/', {recursive: true})
  fs.writeFileSync('./dist/images/snk.svg', draw(array))
  // fs.writeFileSync('./dist/images/snk.light.svg', draw(array, true))
  // fs.writeFileSync('./dist/images/snk.dark.svg', draw(array, false))
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
  svg += `<rect class="s s0" x="-2" y="-2" width="14" height="14" rx="5" ry="5"/>
<rect class="s s1" x="-1" y="-1" width="12" height="12" rx="4" ry="4"/>
<rect class="s s2" width="10" height="10" rx="3" ry="3"/>
<rect class="s s3" x="1" y="1" width="8" height="8" rx="3" ry="3"/>
`
  svg += `</svg>`
  return svg
}

/**
 * 获取路径
 * @return [][] x,y,贡献级别
 */
function getPath(array) {
  let path = []
  let x
  let y
  // 起始点
  for (let j = 0; j < 7; j++) {
    let level = array[j][0]
    if (level > -1) {
      x = 0
      y = j
      path.push([y, x, level])
      if (level > 0) {
        array[y][0] = -2
      }
      break
    }
  }
  // 剩余点
  while (true) {
    let nextPoint = getNextPath(array, x, y, 1, 'down')
    y = nextPoint[0]
    if (y === -1) {
      return path
    } else {
      x = nextPoint[1]
      path.push(nextPoint)
    }
  }
  // 结束点
}

/**
 * 获取下一个路径
 * @return [] x,y,贡献级别
 */
function getNextPath(array, x, y, distance, direction) {
  // 规则0：不能直接后退，必须绕道
  // 规则1：距离相等时优先级：1.正前方、2.前右侧、3.前左侧、4.右侧、5.左侧、6.后右侧、7.后左侧、8.正后方(绕道优先级：1.右侧、2.左侧)[参考系：前进方向]
  // 规则2：需要转弯时，先向前方走(如果需要)，再转弯
  // 示例：
  // distance=1
  // 2↓3 1 x↓x 2 ←↓ 3 ↓→
  // x1x   x↓x   xx   xx
  // distance=2
  // x6x7x   xx↓xx   xxxxx   xxxxx   xxxxx   xxxxx   x↑xxx   xxx↑x
  // 4x↓x5 1 xx↓xx 2 xx↓xx 3 xx↓xx 4 ←←↓xx 5 xx↓→→ 6 x←↓xx 7 xx↓→x
  // x2x3x   xx↓xx   x←↓xx   xx↓→x   xxxxx   xxxxx   xxxxx   xxxxx
  // xx1xx   xx↓xx   xxxxx   xxxxx   xxxxx   xxxxx   xxxxx   xxxxx
  // distance=3
  // x8xAx9x 8 x↑xxxxx 9 xxxxx↑x A xx↑→xxx
  // 6xx↓xx7   x←←↓xxx   xxx↓→→x   xx←↓xxx
  // x4xxx5x   xxxxxxx   xxxxxxx   xxxxxxx
  // xx2x3xx   xxxxxxx   xxxxxxx   xxxxxxx
  // xxx1xxx   xxxxxxx   xxxxxxx   xxxxxxx
  // distance=4
  // xxxExFxxx
  // xxCxGxDxx
  // xAxxxxxBx
  // 8xxx↓xxx9
  // x6xxxxx7x
  // xx4xxx5xx
  // xxx2x3xxx
  // xxxx1xxxx
  // distance=5
  // xxxxIxJxxxx
  // xxxGxKxHxxx
  // xxExxxxxFxx
  // xCxxxxxxxDx
  // Axxxx↓xxxxB
  // x8xxxxxxx9x
  // xx6xxxxx7xx
  // xxx4xxx5xxx
  // xxxx2x3xxxx
  // xxxxx1xxxxx
  if (distance > 53) {
    return [-1, -1, -1]
  }
  for (let i = -distance; i <= distance; i++) {
    for (let j = -distance; j <= distance; j++) {
      let xx = i + x
      let yy = j + y
      if ((xx > -1 && yy > -1) && (xx < 53 && yy < 7) && (Math.abs(i) + Math.abs(j) === distance)) {
        let level = array[yy][xx]
        if (level > 0) {
          array[yy][xx] = -2
          return [yy, xx, distance, level]
        }
      }
    }
  }
  return getNextPath(array, x, y, distance + 1)
}

/**
 * 获取点
 * @return [][] x,y
 */
function getPoint(x, y, distance, direction) {
  switch (direction) {
    default:
    case 'down': {
      return []
    }
    case 'up': {
      return []
    }
    case 'right': {
      return []
    }
    case 'left': {
      return []
    }
  }
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
