const fs = require('fs')

// generateAnimation()

/**
 * 生成动画
 */
async function generateAnimation() {
  let userName = process.argv[2]
  let year = process.argv[3]
  let array = await getGitHubContribution(userName, year)
  let path = getPath(array)
  console.log(path)
  // fs.mkdirSync('./dist/images/', {recursive: true})
  // fs.writeFileSync('./dist/images/snk.svg', draw(array))
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
  let direction
  // 起始点
  for (let j = 0; j < 7; j++) {
    let level = array[j][0]
    if (level > -1) {
      x = 0
      y = j
      direction = 'down'
      path.push([y, x, level])
      if (level > 0) {
        array[y][0] = -2
      }
      break
    }
  }
  // 剩余点
  while (true) {
    let pathLength = path.length
    if (pathLength > 1) {
      let x1 = path[pathLength - 2][0]
      let y1 = path[pathLength - 2][1]
      let x2 = path[pathLength - 1][0]
      let y2 = path[pathLength - 1][1]
      direction = getDirection(x1, y1, x2, y2)
    }
    let nextPoint = getNextPoint(array, x, y, 1, direction)
    y = nextPoint[0]
    if (y === -1) {
      return path
    } else {
      x = nextPoint[1]
      let pathLength = path.length
      let x1 = path[pathLength - 1][0]
      let y1 = path[pathLength - 1][1]
      path.push(...getIntermediatePath(x1, y1, x, y, direction))
      path.push(nextPoint)
    }
  }
  // 结束点
}

console.log(getIntermediatePath(0, 0, -2, 0, 'down'))

/**
 * 获取中间路径(不包含起始点和结束点)
 */
function getIntermediatePath(x1, y1, x2, y2, direction) {
  let path = []
  let x = x2 - x1
  let y = y2 - y1
  if (x === 0 && y === 0) {
    return path;
  }
  // down
  // 432101234
  // xxxExFxxx -3
  // xxCxGxDxx -2
  // xAxxxxxBx -1
  // 8xxx↓xxx9 0
  // x6xxxxx7x 1
  // xx4xxx5xx 2
  // xxx2x3xxx 3
  // xxxx1xxxx 4
  // 正前后方
  if (y === 0) {
    // 正前方 1(4,0)
    if (x > 0) {
      // 前进 (1,0) (2,0) (3,0)
      for (let i = 1; i < x; i++) {
        path.push([x1 + i, y1, 0])
      }
    }
    // 正后方 G(-2,0)
    else {
      // 右转 (0,-1)
      path.push([x1, y1 - 1, 0])
      // 倒退 (-1,-1) (-2,-1)
      for (let i = 1; i < -x + 1; i++) {
        path.push([x1 - i, y1 - 1, 0])
      }
    }
  }
  // 左右侧
  else if (x === 0) {
    // 左侧 9(0,4)
    if (y > 0) {
      // 左转并前进 (0,1) (0,2) (0,3)
      for (let i = 1; i < y; i++) {
        path.push([x1, y1 + i, 0])
      }
    }
    // 右侧 8(0,-4)
    else {
      // 右转并前进 (0,-1) (0,-2) (0,-3)
      for (let i = 1; i < -y; i++) {
        path.push([x1, y1 - i, 0])
      }
    }
  }
  // 前左右侧 3(3,1) 2(3,-1) / 5(2,2) 4(2,-2) / 7(1,3) 6(1,-3)
  else if (x > 0) {
    // 前进 32(1,0) (2,0) (3,0) / 54(1,0) (2,0) / 76(1,0)
    for (let i = 1; i < x + 1; i++) {
      path.push([x1 + i, y1, 0])
    }
    // 前左侧
    if (y > 0) {
      // 左转并前进 3null / 5(2,1) / 7(1,1) (1,2)
      for (let i = 1; i < y; i++) {
        path.push([x1 + x, y1 + i, 0])
      }
    }
    // 前右侧
    else {
      // 右转并前进 2null / 4(2,-1) / 6(1,-1) (1,-2)
      for (let i = 1; i < -y; i++) {
        path.push([x1 + x, y1 - i, 0])
      }
    }
  }
  // 后左右侧 B(-1,3) A(-1,-3) / D(-2,2) C(-2,-2) / F(-3,1) E(-3,-1)
  else {
    // 后左侧
    if (y > 0) {
      // 左转并前进 B(0,1) (0,2) (0,3) / D(0,1) (0,2) / F(0,1)
      for (let i = 1; i < y + 1; i++) {
        path.push([x1, y1 + i, 0])
      }
    }
    // 后右侧
    else {
      // 右转并前进 A(0,-1) (0,-2) (0,-3) / C(0,-1) (0,-2) / E(0,-1)
      for (let i = 1; i < -y + 1; i++) {
        path.push([x1, y1 - i, 0])
      }
    }
    // 倒退 Bnull / D(-1,2) / F(-1,1) (-2,1) / Anull / C(-1,-2) / E(-1,-1) (-2,-1)
    for (let i = 1; i < -x; i++) {
      path.push([x1 - i, y1 + y, 0])
    }
  }
  switch (direction) {
    // 432101234
    // xxxExFxxx -3
    // xxCxGxDxx -2
    // xAxxxxxBx -1
    // 8xxx↓xxx9 0
    // x6xxxxx7x 1
    // xx4xxx5xx 2
    // xxx2x3xxx 3
    // xxxx1xxxx 4
    case 'down': {
      for (let p of path) {
        p[0] = x1 + p[0]
        p[1] = y1 + p[1]
      }
      break
    }
    // 432101234
    // xxxx1xxxx -4
    // xxx3x2xxx -3
    // xx5xxx4xx -2
    // x7xxxxx6x -1
    // 9xxx↑xxx8 0
    // xBxxxxxAx 1
    // xxDxGxCxx 2
    // xxxFxExxx 3
    case 'up': {
      break
    }
    // 32101234
    // xxx9xxxx -4
    // xxBx7xxx -3
    // xDxxx5xx -2
    // Fxxxxx3x -1
    // xGx→xxx1 0
    // Exxxxx2x 1
    // xCxxx4xx 2
    // xxAx6xxx 3
    // xxx8xxxx 4
    case 'right': {
      break
    }
    // 43210123
    // xxxx8xxx -4
    // xxx6xAxx -3
    // xx4xxxCx -2
    // x2xxxxxE -1
    // 1xxx←xGx 0
    // x3xxxxxF 1
    // xx5xxxDx 2
    // xxx7xBxx 3
    // xxxx9xxx 4
    case 'left': {
      break
    }
  }
  return path
}

/**
 * 获取方向
 * @return string 方向
 */
function getDirection(x1, y1, x2, y2) {
  if (x1 === x2) {
    if (y1 < y2) {
      return 'right'
    } else {
      return 'left'
    }
  }
  if (y1 === y2) {
    if (x1 < x2) {
      return 'down'
    } else {
      return 'up'
    }
  }
}

/**
 * 获取下一个点
 * @return [] x,y,贡献级别
 */
function getNextPoint(array, x, y, distance, direction) {
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
  if (distance > 54) {
    return [-1, -1, -1]
  }
  let point = getPoint(x, y, distance, direction)
  for (let p of point) {
    let px = p[0]
    let py = p[1]
    if ((px > -1 && py > -1) && (px < 53 && py < 7)) {
      let level = array[py][px]
      if (level > 0) {
        array[py][px] = -2
        return [py, px, level]
      }
    }
  }
  return getNextPoint(array, x, y, distance + 1, direction)
}

/**
 * 获取点
 * @return [][] x,y
 */
function getPoint(x, y, distance, direction) {
  let array = []
  // down
  // 432101234
  // xxxExFxxx -3
  // xxCxGxDxx -2
  // xAxxxxxBx -1
  // 8xxx↓xxx9 0
  // x6xxxxx7x 1
  // xx4xxx5xx 2
  // xxx2x3xxx 3
  // xxxx1xxxx 4
  // 正前方 1(4,0)
  array.push([distance, 0])
  // 左右侧 2-9
  for (let i = 0; i < distance; i++) {
    // 右侧 2(3,-1) 4(2,-2) 6(1,-3) 8(0,-4)
    array.push([distance - i - 1, -i - 1])
    // 左侧 3(3,1) 5(2,2) 7(1,3) 9(0,4)
    array.push([distance - i - 1, i + 1])
  }
  // 后方左右侧 A-F
  for (let i = 0; i < distance - 1; i++) {
    // 右侧 A(-1,-3) C(-2,-2) E(-3,-1)
    array.push([-i - 1, -(distance - i - 1)])
    // 左侧 B(-1,3) D(-2,2) F(-3,1)
    array.push([-(i + 1), +(distance - i - 1)])
  }
  // 正后方 G(-2,0)
  if (distance > 2) {
    array.push([-(distance - 2), 0])
  }
  switch (direction) {
    // 432101234
    // xxxExFxxx -3
    // xxCxGxDxx -2
    // xAxxxxxBx -1
    // 8xxx↓xxx9 0
    // x6xxxxx7x 1
    // xx4xxx5xx 2
    // xxx2x3xxx 3
    // xxxx1xxxx 4
    case 'down': {
      for (let a of array) {
        a[0] = x + a[0]
        a[1] = y + a[1]
      }
      break
    }
    // 432101234
    // xxxx1xxxx -4
    // xxx3x2xxx -3
    // xx5xxx4xx -2
    // x7xxxxx6x -1
    // 9xxx↑xxx8 0
    // xBxxxxxAx 1
    // xxDxGxCxx 2
    // xxxFxExxx 3
    case 'up': {
      for (let a of array) {
        a[0] = x - a[0]
        a[1] = y - a[1]
      }
      break
    }
    // 32101234
    // xxx9xxxx -4
    // xxBx7xxx -3
    // xDxxx5xx -2
    // Fxxxxx3x -1
    // xGx→xxx1 0
    // Exxxxx2x 1
    // xCxxx4xx 2
    // xxAx6xxx 3
    // xxx8xxxx 4
    case 'right': {
      for (let a of array) {
        let temp = a[0]
        a[0] = x - a[1]
        a[1] = y + temp
      }
      break
    }
    // 43210123
    // xxxx8xxx -4
    // xxx6xAxx -3
    // xx4xxxCx -2
    // x2xxxxxE -1
    // 1xxx←xGx 0
    // x3xxxxxF 1
    // xx5xxxDx 2
    // xxx7xBxx 3
    // xxxx9xxx 4
    case 'left': {
      for (let a of array) {
        let temp = a[0]
        a[0] = x + a[1]
        a[1] = y - temp
      }
      break
    }
  }
  return array
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
