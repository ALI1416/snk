const fs = require('fs')

generateAnimation()

/**
 * 生成动画
 */
async function generateAnimation() {
  const userName = process.argv[2]
  const year = process.argv[3]
  const array = await getGitHubContribution(userName, year)
  const path = getPath(array)
  const frame = getFrame(path)
  const snkPath = getSnkPath(path)
  const progressPath = getProgressPath(path)
  const rectStyle = getRectStyle(path, frame)
  const snkStyle = getSnkStyle(snkPath, frame)
  const progressStyle = getProgressStyle(progressPath, frame, path.length)
  const rectTag = getRectTag(array)
  const progressTag = getProgressTag(progressPath, path.length)
  const svg = `${svgHeader}
<style>
${styleRoot}
${rectStyle}${snkStyle}${progressStyle}</style>
${rectTag}${progressTag}${svgFooter}`
  const svgLight = `${svgHeader}
<style>
${styleRootLight}
${rectStyle}${snkStyle}${progressStyle}</style>
${rectTag}${progressTag}${svgFooter}`
  const svgDark = `${svgHeader}
<style>
${styleRootDark}
${rectStyle}${snkStyle}${progressStyle}</style>
${rectTag}${progressTag}${svgFooter}`
  fs.mkdirSync('./dist/images/', {recursive: true})
  fs.writeFileSync('./dist/images/snk.svg', svg)
  fs.writeFileSync('./dist/images/snk.light.svg', svgLight)
  fs.writeFileSync('./dist/images/snk.dark.svg', svgDark)
}

/**
 * SVG头部
 */
const svgHeader = `<svg width="758" height="130" viewBox="-10 -10 758 130" xmlns="http://www.w3.org/2000/svg">
<defs>
<clipPath id="cp">
<rect x="-2" y="-2" width="742" height="98"/>
</clipPath>
<rect id="r" width="10" height="10" rx="2" ry="2"/>
</defs>`
/**
 * SVG尾部
 */
const svgFooter = `<g clip-path="url(#cp)">
<rect class="s s0" x="-2" y="-2" width="14" height="14" rx="5" ry="5"/>
<rect class="s s1" x="-1" y="-1" width="12" height="12" rx="4" ry="4"/>
<rect class="s s2" width="10" height="10" rx="3" ry="3"/>
<rect class="s s3" x="1" y="1" width="8" height="8" rx="3" ry="3"/>
</g>
</svg>`

/**
 * 根样式-亮
 */
const styleRootLight = `:root{--c0:#ebedf0;--c1:#9be9a8;--c2:#40c463;--c3:#30a14e;--c4:#216e39}`
/**
 * 根样式-黑
 */
const styleRootDark = `:root{--c0:#161b22;--c1:#0e4429;--c2:#006d32;--c3:#26a641;--c4:#39d353}`
/**
 * 根样式
 */
const styleRoot = `${styleRootLight}@media(prefers-color-scheme:dark){${styleRootDark}}`

/**
 * 获取进度条标签
 */
function getProgressTag(progressPath, pathLength) {
  let tag = ''
  let progressPathLength = progressPath.length
  for (let i = 0; i < progressPathLength; i++) {
    tag += `<rect class="p p${i}" y="100" height="10" x="${(738 * progressPath[i][1] / pathLength).toFixed(2)}" width="${(738 * progressPath[i][2] / pathLength).toFixed(2)}"/>\n`
  }
  return tag
}

/**
 * 获取进度条样式
 */
function getProgressStyle(progressPath, frame, pathLength) {
  let style = `.p{animation: none linear ${frame}00ms infinite}\n`
  let progressPathLength = progressPath.length
  for (let i = 0; i < progressPathLength; i++) {
    style += `@keyframes p${i}{0%,${(100 * (5 + progressPath[i][1]) / frame).toFixed(2)}%{transform:scale(0,1)}${(100 * (5 + progressPath[i][1] + progressPath[i][2]) / frame).toFixed(2)}%,100%{transform:scale(1,1)}}.p${i}{fill:var(--c${progressPath[i][0]});animation-name:p${i};transform-origin: ${(738 * progressPath[i][1] / pathLength).toFixed(2)}px 0}\n`
  }
  return style
}

/**
 * 获取进度条路径
 * @return [][] 贡献级别,起始帧,帧数
 */
function getProgressPath(path) {
  let pathLength = path.length
  let progressPath = []
  // 0级
  progressPath.push([0, 0, pathLength])
  let level = path[0][2]
  if (level > 0) {
    progressPath.push([level, 0, 1])
  }
  for (let i = 1; i < pathLength; i++) {
    level = path[i][2]
    if (level > 0) {
      if (path[i - 1][2] === level) {
        progressPath[progressPath.length - 1][2] += 1
      } else {
        progressPath.push([level, i, 1])
      }
    }
  }
  return progressPath
}

/**
 * 获取蛇样式
 */
function getSnkStyle(snkPath, frame) {
  let style = `.s{shape-rendering:geometricPrecision;fill:#800080;animation:none linear ${frame}00ms infinite}\n`
  let snkPathLength = snkPath.length
  for (let j = 0; j < 4; j++) {
    let countFrame = j
    style += `@keyframes s${j}{\n0%,`
    for (let i = 0; i < snkPathLength - 1; i++) {
      countFrame += snkPath[i][2]
      style += `${((100 * countFrame / frame).toFixed(2))}%{transform:translate(${snkPath[i][1] * 14}px,${snkPath[i][0] * 14}px)}\n`
    }
    countFrame += snkPath[snkPathLength - 1][2]
    style += `${((100 * countFrame / frame).toFixed(2))}%,100%{transform:translate(${snkPath[snkPathLength - 1][1] * 14}px,${snkPath[snkPathLength - 1][0] * 14}px)}\n`
    style += `}\n.s${j}{animation-name:s${j}}\n`
  }
  return style
}

/**
 * 获取蛇路径
 * @return [][] x,y,帧数
 */
function getSnkPath(path) {
  let pathLength = path.length
  let snkPath = []
  // 开始前暂停5帧
  snkPath.push([-1, 0, 5])
  // 1垂直方向 0水平方向
  let vertical = 1
  // 坐标(垂直方向y 水平方向x)
  let coordinateA = 0
  for (let i = 0; i < pathLength; i++) {
    let currentCoordinateA = path[i][vertical]
    if (currentCoordinateA !== coordinateA) {
      let previousCoordinate = path[i - 1]
      if (vertical === 1) {
        let coordinateB = snkPath[snkPath.length - 1][0]
        snkPath.push([previousCoordinate[0], previousCoordinate[1], Math.abs(previousCoordinate[0] - coordinateB)])
        vertical = 0
        coordinateA = previousCoordinate[0]
      } else {
        let coordinateB = snkPath[snkPath.length - 1][1]
        snkPath.push([previousCoordinate[0], previousCoordinate[1], Math.abs(previousCoordinate[1] - coordinateB)])
        vertical = 1
        coordinateA = previousCoordinate[1]
      }
    }
  }
  // 结束点
  let endPath = path[pathLength - 1]
  let endSnkPath = snkPath[snkPath.length - 1]
  if (!((endPath[0] === endSnkPath[0]) && (endPath[1] === endSnkPath[1]))) {
    let distance = endSnkPath[0] - endPath[0]
    if (distance === 0) {
      distance = endSnkPath[1] - endPath[1]
    }
    snkPath.push([endPath[0], endPath[1], Math.abs(distance)])
  }
  // 出场
  snkPath.push([7, 52, 7 - endPath[0]])
  return snkPath
}

/**
 * 获取方块样式
 */
function getRectStyle(path, frame) {
  let style = `.c{shape-rendering:geometricPrecision;fill:var(--c0);stroke-width:1px;stroke:rgba(27,31,35,0.06);animation:none linear ${frame}00ms infinite}\n`
  let pathLength = path.length
  for (let i = 0; i < pathLength; i++) {
    let x = path[i][0]
    let y = path[i][1]
    let level = path[i][2]
    if (level > 0) {
      let name = `c${x}-${y}`
      // 开始前暂停5帧+1
      let percent = (100 * (6 + i) / frame).toFixed(2)
      style += `@keyframes ${name}{0%,${percent}%,100%{fill:var(--c${level})}${percent}1%,99.999%{fill:var(--c0)}}.${name}{animation-name:${name}}\n`
    }
  }
  return style
}

/**
 * 获取方块标签
 */
function getRectTag(array) {
  let tag = ''
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 53; j++) {
      let level = array[i][j]
      if (level > -1) {
        tag += `<use href="#r" x="${j * 14}" y="${i * 14}" class="c`
        if (level === 0) {
          tag += `"/>\n`
        } else {
          tag += ` c${i}-${j}"/>\n`
        }
      }
    }
  }
  return tag
}

/**
 * 获取总帧数
 */
function getFrame(path) {
  // 开始前暂停5帧+方块内运动帧数+蛇长4帧+结束后暂停5帧
  return 14 + path.length
}

/**
 * 获取路径
 * @return [][] x,y,贡献级别
 */
function getPath(array) {
  let arrayCopy = []
  for (let a of array) {
    arrayCopy.push([...a])
  }
  let path = []
  let x, y, direction
  // 起始点
  x = 0
  y = 0
  direction = 'down'
  let level = arrayCopy[x][0]
  path.push([x, y, level])
  if (level > 0) {
    arrayCopy[x][0] = -2
  }
  // 中间点
  while (true) {
    let pathLength = path.length
    if (pathLength > 1) {
      let x1 = path[pathLength - 2][0]
      let y1 = path[pathLength - 2][1]
      let x2 = path[pathLength - 1][0]
      let y2 = path[pathLength - 1][1]
      direction = getDirection(x1, y1, x2, y2)
    }
    let nextPoint = getNextPoint(arrayCopy, x, y, 1, direction)
    x = nextPoint[0]
    if (x === -1) {
      break
    } else {
      y = nextPoint[1]
      let pathLength = path.length
      let x1 = path[pathLength - 1][0]
      let y1 = path[pathLength - 1][1]
      path.push(...getIntermediatePath(x1, y1, x, y, direction))
      path.push(nextPoint)
    }
  }
  // 结束点
  x = 6
  y = 52
  let pathLength = path.length
  let x1 = path[pathLength - 1][0]
  let y1 = path[pathLength - 1][1]
  if (!(x === x1 && y === y1)) {
    path.push(...getIntermediatePath(x1, y1, x, y, direction))
    path.push([x, y, 0])
  }
  return path
}

/**
 * 获取中间路径(不包含起始点和结束点)
 */
function getIntermediatePath(x1, y1, x2, y2, direction) {
  let path = []
  let x = x2 - x1
  let y = y2 - y1
  // 正后方
  let b = true
  // 左右侧、前左右侧、后左右侧
  let lr = true
  if (x === 0 && y === 0) {
    return path
  }
  switch (direction) {
    case 'down': {
      if (y1 === 0) {
        b = false
      }
      break
    }
    case 'up': {
      x = -x
      if (y1 === 52) {
        b = false
      }
      lr = false
      break
    }
    case 'right': {
      let temp = x
      x = y
      y = -temp
      if (x1 === 6) {
        b = false
      }
      break
    }
    case 'left': {
      let temp = x
      x = -y
      y = -temp
      if (x1 === 0) {
        b = false
      }
      lr = false
      break
    }
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
        path.push([i, 0, 0])
      }
    }
    // 正后方 G(-2,0)
    else {
      let one = -1
      if (!b) {
        one = 1
      }
      // 右转 (0,-1)
      path.push([0, one, 0])
      // 倒退 (-1,-1) (-2,-1)
      for (let i = 1; i < -x + 1; i++) {
        path.push([-i, one, 0])
      }
    }
  }
  // 左右侧
  else if (x === 0) {
    if (!lr) {
      y = -y
    }
    // 左侧 9(0,4)
    if (y > 0) {
      // 左转并前进 (0,1) (0,2) (0,3)
      for (let i = 1; i < y; i++) {
        path.push([0, i, 0])
      }
    }
    // 右侧 8(0,-4)
    else {
      // 右转并前进 (0,-1) (0,-2) (0,-3)
      for (let i = 1; i < -y; i++) {
        path.push([0, -i, 0])
      }
    }
  }
  // 前左右侧 3(3,1) 2(3,-1) / 5(2,2) 4(2,-2) / 7(1,3) 6(1,-3)
  else if (x > 0) {
    // 前进 32(1,0) (2,0) (3,0) / 54(1,0) (2,0) / 76(1,0)
    for (let i = 1; i < x + 1; i++) {
      path.push([i, 0, 0])
    }
    if (!lr) {
      y = -y
    }
    // 前左侧
    if (y > 0) {
      // 左转并前进 3null / 5(2,1) / 7(1,1) (1,2)
      for (let i = 1; i < y; i++) {
        path.push([x, i, 0])
      }
    }
    // 前右侧
    else {
      // 右转并前进 2null / 4(2,-1) / 6(1,-1) (1,-2)
      for (let i = 1; i < -y; i++) {
        path.push([x, -i, 0])
      }
    }
  }
  // 后左右侧 B(-1,3) A(-1,-3) / D(-2,2) C(-2,-2) / F(-3,1) E(-3,-1)
  else {
    if (!lr) {
      y = -y
    }
    // 后左侧
    if (y > 0) {
      // 左转并前进 B(0,1) (0,2) (0,3) / D(0,1) (0,2) / F(0,1)
      for (let i = 1; i < y + 1; i++) {
        path.push([0, i, 0])
      }
    }
    // 后右侧
    else {
      // 右转并前进 A(0,-1) (0,-2) (0,-3) / C(0,-1) (0,-2) / E(0,-1)
      for (let i = 1; i < -y + 1; i++) {
        path.push([0, -i, 0])
      }
    }
    // 倒退 Bnull / D(-1,2) / F(-1,1) (-2,1) / Anull / C(-1,-2) / E(-1,-1) (-2,-1)
    for (let i = 1; i < -x; i++) {
      path.push([-i, y, 0])
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
      for (let p of path) {
        p[0] = x1 - p[0]
        p[1] = y1 - p[1]
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
      for (let p of path) {
        let temp = p[0]
        p[0] = x1 - p[1]
        p[1] = y1 + temp
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
      for (let p of path) {
        let temp = p[0]
        p[0] = x1 + p[1]
        p[1] = y1 - temp
      }
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
    if ((px > -1 && py > -1) && (px < 7 && py < 53)) {
      let level = array[px][py]
      if (level > 0) {
        array[px][py] = -2
        return [px, py, level]
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
 * 获取GitHub用户贡献级别
 * @param userName 用户名
 * @param year 年
 * @return number[7][53]
 */
async function getGitHubContribution(userName, year) {
  let url = `https://api.404z.cn/api/github/contribution/${userName}`
  if (typeof year !== 'undefined') {
    url += `?year=${year}`
  }
  let res = await (await fetch(url)).text()
  // let res = fs.readFileSync('./reference/contribution.json').toString()
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
