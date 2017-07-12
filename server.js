const cheerio = require('cheerio')
const fetch = require('node-fetch')
const http = require('http')
const https = require('https')
const moment = require('moment')
const tokenizer = require('sbd')

let server = http.createServer((req, res) => {
  let date = moment().subtract(1, 'month').format('YYYY/MM'),
      lastIssue = `https://harpers.org/archive/${date}`

  load(lastIssue)
    .then($ => load($('a[href*="findings"]').attr('href')))
    .then($ => {
      let text = $('.articlePost > p').text()
      let sentences = tokenizer.sentences(text)

      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end(sentences.join('\n') + '\n')
    })
})

let port = process.env.PORT || 8080
server.listen(port, () => {
  console.log(`Listening on 0.0.0.0:${port}`)
})

function load(url) {
  let agent = new https.Agent({ rejectUnauthorized: false })
  return fetch(url, { agent })
    .then(res => res.text())
    .then(text => cheerio.load(text))
}
