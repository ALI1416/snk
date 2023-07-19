/**
 * 常量
 * @version 2023/07/19 11:11:11
 * @author ALI[ali-k&#64;foxmail.com]
 * @since 1.0.0
 */

/**
 * SVG头部
 */
const svgHeader: string = `<svg width="758" height="130" viewBox="-10 -10 758 130" xmlns="http://www.w3.org/2000/svg">
<defs>
<clipPath id="cp">
<rect x="-2" y="-2" width="742" height="98"/>
</clipPath>
<rect id="r" width="10" height="10" rx="2" ry="2"/>
</defs>`
/**
 * SVG尾部
 */
const svgFooter: string = `<g clip-path="url(#cp)">
<rect class="s s0" x="-2" y="-2" width="14" height="14" rx="5" ry="5"/>
<rect class="s s1" x="-1" y="-1" width="12" height="12" rx="4" ry="4"/>
<rect class="s s2" width="10" height="10" rx="3" ry="3"/>
<rect class="s s3" x="1" y="1" width="8" height="8" rx="3" ry="3"/>
</g>
</svg>`

/**
 * 根样式-亮
 */
const styleRootLight: string = `:root{--c0:#ebedf0;--c1:#9be9a8;--c2:#40c463;--c3:#30a14e;--c4:#216e39}`
/**
 * 根样式-黑
 */
const styleRootDark: string = `:root{--c0:#161b22;--c1:#0e4429;--c2:#006d32;--c3:#26a641;--c4:#39d353}`
/**
 * 根样式-混合
 */
const styleRoot: string = `${styleRootLight}@media(prefers-color-scheme:dark){${styleRootDark}}`

export {svgHeader, svgFooter, styleRoot, styleRootLight, styleRootDark}
