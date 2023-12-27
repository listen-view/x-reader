import puppetter from 'puppeteer';
import * as cheerio from 'cheerio';

let browser:puppetter.Browser

export const getContentByPage = async (pageNum: number = 1) => {
    console.log(`加载第${pageNum}页`);
    
    const domName = '.articlecontent'
    let result = ''

    try {
      if(!browser) browser = await puppetter.launch({ headless: 'new' });
      const page = await browser.newPage();

      await page.goto(`https://www.00ksw.com/html/96/96187/115424${pageNum}.html`)



      await page.waitForSelector(domName)

      const domFullContent = await page.content()

      if (domFullContent) {
          const $ = cheerio.load(domFullContent)
          $(domName).children().each(function () {
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