import puppetter from 'puppeteer';
import * as cheerio from 'cheerio';
import { getConfig } from './config.ts';
let browser: puppetter.Browser

export const getContentByPage = async (pageNum: number = 1) => {
  console.log(`加载第${pageNum}页`);

  const { bookUrl, containerSelector } = getConfig()
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

getContentByPage()