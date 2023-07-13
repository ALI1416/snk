/**
 * 获取首位空白个数
 * @param array 用户贡献级别数组
 * @return number[] 头部空白个数,尾部空白个数
 */
function getBlankCount(array: number[][]): number[] {
  let count: number[] = []
  for (let i = 0; i < 7; i++) {
    let level = array[i][0]
    if (level > -1) {
      count[0] = i
      break
    }
  }
  count[1] = 0
  for (let i = 0; i < 7; i++) {
    let level = array[i][52]
    if (level === -1) {
      count[1] = 7 - i
      break
    }
  }
  return count
}

/**
 * 获取总帧数
 * @param path 路径
 * @param startBlankCount 头部空白个数
 * @param endBlankCount 尾部空白个数
 * @return number 总帧数
 */
function getFrame(path: number[][], startBlankCount: number, endBlankCount: number): number {
  let pathLength = path.length
  // 开始前暂停5帧+蛇头从左上角到起始点帧数+方块内运动帧数+蛇尾从结束点到右下角帧数+蛇长4帧+结束后暂停5帧
  return 14 + startBlankCount + endBlankCount + pathLength
}

export {getBlankCount, getFrame}
