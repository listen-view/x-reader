import * as cheerio from 'cheerio';
import { getConfig } from './config.js';
import fs from 'node:fs'
import * as pdfjs from 'pdfjs-dist'
import puppetter from 'puppeteer';


let browser: puppetter.Browser

let pdfProxy: pdfjs.PDFDocumentProxy


const { bookUrl, containerSelector } = getConfig()

export const getContentByPage = async (pageNum: number = 1) => {
  console.log(`加载第${pageNum}页`);
  if (/^http/.test(bookUrl)) {
    return await getUrlTypeContent(pageNum)
  } else if (/\.pdf$/.test(bookUrl)) {
    return await getPdfTypeContent(pageNum)
  } else {
    console.log('阅读url配置错误');
    return ''
  }

}

const getPdfTypeContent = async (pageNum: number) => {
  if (!fs.existsSync(bookUrl)) {
    throw new Error('文件不存在')
  }
  if (!pdfProxy) {
    const pdf = pdfjs.getDocument({
      data: fs.readFileSync(bookUrl).toJSON().data
    })
    pdfProxy = await pdf.promise
  }
  const page = await pdfProxy.getPage(pageNum)
  const data = await page.getTextContent()
  let result = ''
  data.items.forEach(item => {
    if ('str' in item) {
      result += item.str || ''
    }
  })
  return result
}


const getUrlTypeContent = async (pageNum: number) => {
  let result = ''
  try {
    if (!browser) browser = await puppetter.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto(bookUrl.replace('${pageNum}', pageNum + '') + '.html')



    await page.waitForSelector(containerSelector)

    const domFullContent = await page.content()

    if (domFullContent) {
      const $ = cheerio.load(domFullContent)
      $(containerSelector).children().each(function () {
        result += $(this).text()
      })
    }

    await page.close()
  } catch (e) {
    console.log(e);
  }

  return result
}