import * as cheerio from 'cheerio';
import { getConfig, getCatalogCache, setCatalogCache } from './config.js';
import fs from 'node:fs'
import * as pdfjs from 'pdfjs-dist'
import puppetter from 'puppeteer';

export type NormalListType = Array<{
  url: string,
  title: string
}>

let browser: puppetter.Browser
let catalogData:NormalListType = getCatalogCache()

let pdfProxy: pdfjs.PDFDocumentProxy


const {
  bookUrl,
  containerSelector,
  childPage,
  catalogUrl,
  catalogSelector,
  loadCatalogButton,
  searchUrl,
  searchSelector
} = getConfig()

export const getContentByPage = async (pageNum: number) => {
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
    if (!catalogData.length) await loadCatalogs()
    if(pageNum >= catalogData.length){
      return Promise.reject('页码已超出范围！')
    }
    const currentPageMsg = catalogData[pageNum]
    console.log(`${currentPageMsg.title}`);
    const pageUrlList = [currentPageMsg.url]
    if (childPage?.length) {
      childPage.forEach(url => {
        pageUrlList.push(currentPageMsg.url.replace(/\.htm(l)?$/, url))
      })
    }// 加载子页面
    const page = await browser.newPage();
    for (const url of pageUrlList) {
      await page.goto(url)
      await page.waitForSelector(containerSelector)
      const domFullContent = await page.content()
      if (domFullContent) {
        const $ = cheerio.load(domFullContent)
        result += $(containerSelector).text()
      }
    }
    await page.close()
  } catch (e) {
    console.log(e);
  }

  return result
}

const loadCatalogs = async () => {
  const page = await browser.newPage();
  await page.goto(catalogUrl)
  await page.waitForSelector(catalogSelector)
  if (loadCatalogButton) {
    await page.waitForSelector(loadCatalogButton)
    let button = await page.$(loadCatalogButton)
    await button?.click()
    await page.waitForFunction(`!document.querySelector('${loadCatalogButton}')`)
  }

  const domFullContent = await page.content()

  if (domFullContent) {
    const $ = cheerio.load(domFullContent)
    $(catalogSelector).each(function () {
      let url = $(this).attr('href') || ''
      if (url && !/^http/.test(url)) {
        let origin = catalogUrl.match(/^http(s?):\/\/[^\/]+\/?/)
        if (origin) url = origin[0] + url
      }
      catalogData.push({
        url: url,
        title: $(this).text().trim()
      })
    })
  }
  setCatalogCache(JSON.stringify(catalogData))
  await page.close()
}

export const findAndPickBook = async (keyword: string) => {
  if (!searchUrl || !searchSelector) return []
  let searchResult: Array<{
    url: string,
    title: string
  }> = []
  const page = await browser.newPage()

  console.clear();
  console.log(`开始搜索${keyword}`);

  await page.goto(searchUrl.replace('${keyword}', keyword))

  await page.waitForSelector(searchSelector)

  const domFullContent = await page.content()

  if (domFullContent) {
    const $ = cheerio.load(domFullContent)
    $(searchSelector).each(function () {
      let url = $(this).attr('href') || ''
      searchResult.push({
        url: catalogUrl + url,
        title: $(this).text().trim()
      })
    })
  }
  await page.close()
  return searchResult
}