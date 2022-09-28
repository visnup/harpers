import { load } from "cheerio";
import fetch from "node-fetch";
import tokenizer from "sbd";

export default async function index(req, res) {
  const results = await Promise.all([
    request("https://harpers.org/sections/findings/")
      .then(($) => request($(".card a").attr("href")))
      .then(($) => tokenizer.sentences($(".wysiwyg-content > p").text())),
    request("https://harpers.org/harpers-index/").then(($) =>
      $(".index-statement")
        .map((_, s) => $("> p", s).text() + $("> span", s).text().trim())
        .get()
    ),
  ]);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(results.flat().join("\n") + "\n");
}

async function request(url) {
  console.log(url);
  const res = await fetch(url);
  return load(await res.text());
}
