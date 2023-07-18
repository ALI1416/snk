/**
 * 获取进度条路径
 * @param path 路径
 * @return number[][] 贡献级别,起始帧,帧数
 */
function getProgressPath(path): number[][] {
  let pathLength = path.length
  let progressPath: number[][] = []
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
 * 获取进度条标签
 * @param progressPath 进度条路径
 * @param pathLength 路径长度
 * @return string 标签
 */
function getProgressTag(progressPath, pathLength): string {
  let tag: string = ''
  let progressPathLength = progressPath.length
  for (let i = 0; i < progressPathLength; i++) {
    tag += `<rect class="p p${i}" y="100" height="10" x="${(738 * progressPath[i][1] / pathLength).toFixed(2)}" width="${(738 * progressPath[i][2] / pathLength).toFixed(2)}"/>\n`
  }
  return tag
}

/**
 * 获取进度条样式
 * @param progressPath 进度条路径
 * @param frame 帧数
 * @param pathLength 路径长度
 * @return string 样式
 */
function getProgressStyle(progressPath, frame, pathLength): string {
  let style: string = `.p{animation: none linear ${frame}00ms infinite}\n`
  let progressPathLength = progressPath.length
  for (let i = 0; i < progressPathLength; i++) {
    style += `@keyframes p${i}{0%,${(100 * (5 + progressPath[i][1]) / frame).toFixed(2)}%{transform:scale(0,1)}${(100 * (5 + progressPath[i][1] + progressPath[i][2]) / frame).toFixed(2)}%,100%{transform:scale(1,1)}}.p${i}{fill:var(--c${progressPath[i][0]});animation-name:p${i};transform-origin: ${(738 * progressPath[i][1] / pathLength).toFixed(2)}px 0}\n`
  }
  return style
}

export {getProgressPath, getProgressTag, getProgressStyle}
