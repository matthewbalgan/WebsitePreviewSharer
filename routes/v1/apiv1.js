import express from 'express';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
var router = express.Router();

router.get('/urls/preview', async function(req, res, next) {
  try {

    let queryURL = ""
    queryURL = req.query.url

    const response = await fetch(queryURL);
    const body = await response.text();


    const root = parse(body);

    const metas = root.querySelectorAll('meta');
    let ogImage
    let ogUrl
    let ogTitle
    let ogDesc
    let ogKeys
    for(let i = 0; i < metas.length; i++) {
      console.log(metas[i].attributes)
      if(metas[i].attributes.property == 'og:image') {
        ogImage = metas[i].attributes.content
        ogImage += `"style="max-height: 200px; max-width: 270px;`
      }
      if(metas[i].attributes.property == 'og:url') {
        ogUrl = metas[i].attributes.content
      }
      if(ogUrl == undefined) {
        ogUrl = queryURL
      }
      if(metas[i].attributes.property == 'og:title') {
        ogTitle = metas[i].attributes.content
      }
      if(ogTitle == undefined) {
        ogTitle = root.querySelector('title').text
      }
      if(ogTitle == undefined) {
        ogTitle = queryURL
      }
      if(metas[i].attributes.property == 'og:description') {
        ogDesc = metas[i].attributes.content
      }
      if(metas[i].attributes.name == 'keywords') {
        ogKeys = metas[i].attributes.content
      }
    }

    function descHtml(value) {
      if(value){
        return `<p>${value}</p>`
      } else {
        return ""
      }
    }
    function imgHtml(value) {
      if(value){
        return `<img src="${value}">`
      } else {
        return ""
      }
    }

    let htmlStuff =
    `
    <div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center; font-size:2em">
    <a href=${ogUrl}>
        <p><strong>
          ${ogTitle}
        </strong></p>
        ${imgHtml(ogImage)}
    </a>
    ${descHtml(ogDesc)}
    ${descHtml(ogKeys)}
  </div>
  `
    res.send(htmlStuff);

  }catch(error) {
    console.log("error", error);
  }
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

export default router;