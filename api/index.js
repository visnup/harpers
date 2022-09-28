const cheerio = require("cheerio");
const fetch = require("node-fetch");
const https = require("https");
const tokenizer = require("sbd");

export default async function index(req, res) {
  return Promise.all([
    request("https://harpers.org/sections/findings/")
      .then(($) => request($(".card a").attr("href")))
      .then(($) => tokenizer.sentences($(".wysiwyg-content > p").text())),
    request("https://harpers.org/harpers-index/").then(($) =>
      $(".index-statement")
        .map((_, s) => $("> p", s).text() + $("> span", s).text().trim())
        .get()
    ),
  ])
    .then((results) => Array.prototype.concat(...results))
    .then((results) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(results.join("\n") + "\n");
    });
}

async function request(url) {
  console.log(url);
  const agent = new https.Agent({ rejectUnauthorized: false });
  const res = await fetch(url, { agent });
  const text = await res.text();
  return cheerio.load(text);
}
