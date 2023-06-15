const https = require('https')

getGitHubContribution('ali1416').then((res) => {
  console.log(JSON.parse(res))
})

/**
 * 获取GitHub用户贡献
 * @param userName 用户名
 */
function getGitHubContribution(userName) {
  return getHtml(`https://github-api.404z.cn/api/contribution/${userName}`)
}

/**
 * 获取HTML
 * @param url URL
 * @return Promise<string>
 */
function getHtml(url) {
  return new Promise((resolve) => {
    let data = ''
    https.get(url, (res) => {
      res.setEncoding('utf8')
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        resolve(data)
      })
    })
  })
}
