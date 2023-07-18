import {getGitHubContribution} from './Contribution'
import {getFrame, getPath} from './Path'
import {getSnkPath, getSnkStyle} from './Snake'
import {getProgressPath, getProgressStyle, getProgressTag} from './Progress'
import {getRectStyle, getRectTag} from './Rect'
import {styleRoot, styleRootDark, styleRootLight, svgFooter, svgHeader} from './Constant'

/**
 * 构造动画
 * @param userName 用户名
 * @param year 年
 * @return string[] 混合,亮,暗
 */
async function snk(userName: string, year?: number): Promise<string[]> {
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
  return [svgMix, svgLight, svgDark]
}

export {snk}
