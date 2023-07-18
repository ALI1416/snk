/**
 * 获取路径
 * @param array 用户贡献级别数组
 * @return number[][] x,y,贡献级别
 */
function getPath(array: number[][]): number[][] {
  let arrayCopy: number[][] = []
  for (let a of array) {
    arrayCopy.push([...a])
  }
  let path: number[][] = []
  let x: number, y: number, direction: Direction
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
 * 方向
 */
type Direction = 'up' | 'down' | 'left' | 'right'

/**
 * 获取中间路径(不包含起始点和结束点)
 * @param x1 x1
 * @param y1 y1
 * @param x2 x2
 * @param y2 y2
 * @param direction 方向
 * @return number[][] x,y
 */
function getIntermediatePath(x1: number, y1: number, x2: number, y2: number, direction: Direction): number[][] {
  let path: number[][] = []
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
 * @param x1 x1
 * @param y1 y1
 * @param x2 x2
 * @param y2 y2
 * @return Direction 方向
 */
function getDirection(x1: number, y1: number, x2: number, y2: number): Direction {
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
 * @param array 用户贡献级别数组
 * @param x x
 * @param y y
 * @param distance 距离
 * @param direction 方向
 * @return number[] [] x,y,贡献级别
 */
function getNextPoint(array: number[][], x: number, y: number, distance: number, direction: Direction): number[] {
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
 * @param x x
 * @param y y
 * @param distance 距离
 * @param direction 方向
 * @return number[][] x,y
 */
function getPoint(x: number, y: number, distance: number, direction: Direction): number[][] {
  let array: number[][] = []
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
 * 获取总帧数
 * @param path 路径
 * @return number 总帧数
 */
function getFrame(path: number[][]): number {
  // 开始前暂停5帧+方块内运动帧数+蛇长4帧+结束后暂停5帧
  return 14 + path.length
}

export {getPath, getFrame, Direction}
