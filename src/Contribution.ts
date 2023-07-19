/**
 * 贡献
 * @version 2023/07/19 11:11:11
 * @author ALI[ali-k&#64;foxmail.com]
 * @since 1.0.0
 */

/**
 * 获取GitHub用户贡献级别
 * @param userName 用户名
 * @param year 年
 * @return number[7][53] 贡献级别数组
 */
async function getGitHubContribution(userName: string, year?: undefined | string): Promise<number[][]> {
  let url = `https://api.404z.cn/api/github/contribution/${userName}`
  if (typeof year !== 'undefined') {
    url += `?year=${year}`
  }
  let res = await (await fetch(url)).text()
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

export {getGitHubContribution}
