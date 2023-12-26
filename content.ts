import puppetter from 'puppeteer';
import * as cheerio from 'cheerio';


export const getContentByPage = async (pageNum: number = 1) => {
    const domName = '.articlecontent'
    let result = ''

    const browser = await puppetter.launch({ headless: 'new' });
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

    await browser.close()
    return result
}

getContentByPage()