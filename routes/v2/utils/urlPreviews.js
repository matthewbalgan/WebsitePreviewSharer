import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import DOMParser from 'dom-parser'


async function getURLPreview(url){
  // TODO: Copy from your code for making url previews in A2 to make this
  // a function that takes a url and returns an html string with a preview of that html
  try {

    let queryURL = ""
    queryURL = url

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

    const escapeHTML = str => str.replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag]));

    let htmlStuff =
    `
    <div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center; font-size:2em">
    <a href=${ogUrl}>
        <p><strong>
          ${ogTitle}
        </strong></p>
        ${imgHtml(ogImage)}
    </a>
    ${escapeHTML(descHtml(ogDesc))}
    ${descHtml(ogKeys)}
  </div>
  `
    return(htmlStuff)

  }catch(error) {
    console.log("error", error);
  }
}

export default getURLPreview;