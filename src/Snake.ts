/**
 * 蛇
 * @version 2023/07/19 11:11:11
 * @author ALI[ali-k&#64;foxmail.com]
 * @since 1.0.0
 */

/**
 * 获取蛇路径
 * @param path 路径
 * @return number[][] x,y,帧数
 */
function getSnkPath(path): number[][] {
  let pathLength = path.length
  let snkPath: number[][] = []
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
 * 获取蛇样式
 * @param snkPath 蛇路径
 * @param frame 帧数
 * @return string 样式
 */
function getSnkStyle(snkPath, frame): string {
  let style: string = `.s{shape-rendering:geometricPrecision;fill:#800080;animation:none linear ${frame}00ms infinite}\n`
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

export {getSnkPath, getSnkStyle}
