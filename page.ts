import { getContentByPage } from './content.ts'
import chalk from 'chalk'
import { runMainTask, stopMainTask } from './start.ts'
import readlineSync from 'readline-sync'
import { setConfig, getConfig } from './config.ts'

let pageIndex = getConfig().pageIndex || 1
let articleContent = await getContentByPage()
let readIndex = 0
let oneScreenTotal = Math.floor(process.stdout.columns / 2)
let maxIndex = Math.ceil(articleContent.length / oneScreenTotal)

const displayContent = () => {
    console.clear();
    const textStream = chalk.hex('#6272a4')(articleContent.slice(readIndex * oneScreenTotal, (readIndex + 1) * oneScreenTotal));
    console.log(textStream);
};

export const scrollUp = () => {
    if (!articleContent || readIndex <= 0) {
        console.log('本页已到顶');
        return
    }
    readIndex--
    displayContent()

}

export const scrollDown = () => {
    if (!articleContent || readIndex >= maxIndex) {
        console.log('本页已结束');
        return
    }
    readIndex++
    displayContent()
}

const handlePageChange = async (p: number) => {
    try {
        articleContent = await getContentByPage(p)
        maxIndex = Math.ceil(articleContent.length / oneScreenTotal)
        readIndex = 0
        pageIndex = p
        setConfig({ pageIndex })
        displayContent()
    } catch (e) {
        console.log(e)
    }
    runMainTask()
}

export const toNextPage = () => {
    stopMainTask()
    handlePageChange(pageIndex + 1)
}

export const toPreviousPage = () => {
    if (pageIndex === 1) return
    stopMainTask()
    handlePageChange(pageIndex - 1)
}

export const goPageByInput = async () => {
    stopMainTask()
    const p = readlineSync.questionInt('where are you go ?')
    handlePageChange(p)
}
displayContent()


