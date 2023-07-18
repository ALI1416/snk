/**
 * 获取方块标签
 * @param array 用户贡献级别数组
 * @return string 标签
 */
function getRectTag(array): string {
  let tag: string = ''
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
 * 获取方块样式
 * @param path 路径
 * @param frame 帧数
 * @return string 样式
 */
function getRectStyle(path, frame): string {
  let style: string = `.c{shape-rendering:geometricPrecision;fill:var(--c0);stroke-width:1px;stroke:rgba(27,31,35,0.06);animation:none linear ${frame}00ms infinite}\n`
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

export {getRectTag, getRectStyle}
