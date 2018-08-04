const cheerio = require('cheerio')
const fetch = require('node-fetch')
const http = require('http')
const https = require('https')
const moment = require('moment')
const tokenizer = require('sbd')

let server = http.createServer((req, res) => {
  let date = moment().subtract(1, 'month').format('YYYY/MM'),
      lastIssue = `https://harpers.org/archive/${date}/`

  request(lastIssue)
    .then($ => {
      return Promise.all([
        request($('a[href*="/findings-"]').attr('href'))
          .then($ => tokenizer.sentences($('.articlePost > p').text()))
        ,
        request($('a[href*="/harpers-index-"]').attr('href'))
          .then($ => $('.articlePost > p[style]').map((i, p) => $(p).text()).get())
      ])
    })
    .then(results => Array.prototype.concat(...results))
    .then(results => {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end(results.join('\n') + '\n')
    })
})

let port = process.env.PORT || 8080
server.listen(port, () => {
  console.log(`Listening on 0.0.0.0:${port}`)
})

async function request(url) {
  console.log(url)
  const agent = new https.Agent({ rejectUnauthorized: false })
  const res = await fetch(url, { agent })
  const text = await res.text()
  return cheerio.load(text)
}
