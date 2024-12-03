import {getGitHubContribution} from './Contribution'
import {getFrame, getPath} from './Path'
import {getSnkPath, getSnkStyle} from './Snake'
import {getProgressPath, getProgressStyle, getProgressTag} from './Progress'
import {getRectStyle, getRectTag} from './Rect'
import {styleRoot, styleRootDark, styleRootLight, svgFooter, svgHeader} from './Constant'
import {SnkException} from './SnkException'

/**
 * GitHub贡献图动画
 * @version 2023/07/19 11:11:11
 * @author ALI[ali-k&#64;foxmail.com]
 * @since 1.0.0
 */

/**
 * 构造动画
 * @param userName 用户名
 * @param type 主题模式(默认0)
 *   <0 混合>
 *   <1 亮>
 *   <2 暗>
 *   <3 [混合,亮,暗]>
 * @param year 年(默认一年前)
 * @return {Promise<string | string[]>} SVG
 */
async function snk(userName: string, type?: undefined | number, year?: undefined | string): Promise<string | string[]> {
  if (typeof type === 'undefined') {
    type = 0
  } else if (typeof type === 'number') {
    if (type < 0 || type > 3) {
      throw new SnkException('主题模式 ' + type + ' 不合法！应为 [0,3]')
    }
  } else {
    throw new SnkException('主题模式类型 ' + (typeof type) + ' 不合法！应为 number')
  }
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
  const svgMix = `${svgHeader}
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

  switch (type) {
    case 0: {
      return svgMix
    }
    case 1: {
      return svgLight
    }
    case 2: {
      return svgDark
    }
    case 3: {
      return [svgMix, svgLight, svgDark]
    }
  }
}

export {snk}
