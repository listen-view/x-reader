import { getContentByPage, findAndPickBook } from './content.js'
import chalk from 'chalk'
import { setConfig, getConfig } from './config.js'
import inquirer from 'inquirer'

let pageIndex = getConfig().pageIndex || 0
let articleContent = await getContentByPage(pageIndex)
let oneScreenTotal = Math.floor(process.stdout.columns / 2)
let readIndex = getConfig().readIndex ? Math.floor(getConfig().readIndex as number / oneScreenTotal) : 0
let maxIndex = Math.ceil(articleContent.length / oneScreenTotal)

const displayContent = () => {
  console.clear();
  const textStream = chalk.hex('#68aef4')(articleContent.slice(readIndex * oneScreenTotal, (readIndex + 1) * oneScreenTotal));
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
  if (pageIndex === 0) {
    console.log('已到第一页');
    return
  }
  handlePageChange(pageIndex - 1)
}

export const goPageByInput = async () => {
  const p = await inquirer.prompt([{
    type: 'number',
    name: 'page',
    message:'where are you go'
  }])
  handlePageChange(p.page)
}

export const findBook = async () => {
  process.stdin.pause()
  const p = await inquirer.prompt([{
    type: 'input',
    name: 'key',
    message:'please input book\'s keyword'
  }])
  const result = await findAndPickBook(p.key)
  if (result.length) {
    const answer = await inquirer.prompt([{
      type: 'list',
      name: 'name',
      message: 'please choose a book',
      choices: result.map(item => item.title)
    }])
    const bookIdx = result.findIndex(item => item.title === answer.name)
    const selected = result[bookIdx]
  }
  // setConfig({
  //   catalogUrl: result[index].url,
  //   readIndex: 1,
  //   pageIndex: 1
  // }, () => { })
  process.stdin.resume()
  process.stdin.setRawMode(true)
}
displayContent()


