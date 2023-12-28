import { getContentByPage } from './content.js'
import chalk from 'chalk'
import readlineSync from 'readline-sync'
import { setConfig, getConfig } from './config.js'

let pageIndex = getConfig().pageIndex || 1
let articleContent = await getContentByPage(pageIndex)
let oneScreenTotal = Math.floor(process.stdout.columns / 2)
let readIndex = getConfig().readIndex ? Math.floor(getConfig().readIndex as number / oneScreenTotal) : 0
let maxIndex = Math.ceil(articleContent.length / oneScreenTotal)

const displayContent = () => {
  console.clear();
  const textStream = chalk.hex('#6272a4')(articleContent.slice(readIndex * oneScreenTotal, (readIndex + 1) * oneScreenTotal));
  console.log(textStream);
};

export const getReadMsg = () => {
  return { pageIndex, readIndex: readIndex * oneScreenTotal }
}

export const scrollUp = () => {
  if (!articleContent || readIndex <= 0) {
    console.log('本页已到顶');
    return false
  }
  readIndex--
  displayContent()
  return true
}

export const scrollDown = () => {
  if (!articleContent || readIndex >= maxIndex) {
    console.log('本页已结束');
    return false
  }
  readIndex++
  displayContent()
  return true
}

const handlePageChange = async (p: number) => {
  try {
    process.stdin.pause()
    articleContent = await getContentByPage(p)
    maxIndex = Math.ceil(articleContent.length / oneScreenTotal)
    readIndex = 0
    pageIndex = p
    displayContent()
  } catch (e) {
    console.log(e)
  } finally {
    process.stdin.resume()
  }
}

export const toNextPage = () => {
  handlePageChange(pageIndex + 1)
}

export const toPreviousPage = () => {
  if (pageIndex === 1) return
  handlePageChange(pageIndex - 1)
}

export const goPageByInput = async () => {
  const p = readlineSync.questionInt('where are you go ?')
  handlePageChange(p)
}
displayContent()


