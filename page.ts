import { getContentByPage } from './content.ts'
import chalk from 'chalk'

let articleContent = await getContentByPage()
let readIndex = 0
let oneScreenTotal = 50
let maxIndex = Math.ceil(articleContent.length / oneScreenTotal)
console.log(articleContent.slice(readIndex * oneScreenTotal, (readIndex + 1) * oneScreenTotal));


const displayContent = () => {
    console.clear();
    const textStream = chalk.cyan(articleContent.slice(readIndex * oneScreenTotal, (readIndex + 1) * oneScreenTotal));
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

