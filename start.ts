import readlineSync from 'readline-sync'
import { scrollDown, scrollUp, goPageByInput, toNextPage, toPreviousPage } from './page.js'
import { getConfig } from './config.js'
import readline from 'node:readline'

const config = getConfig()
let timer: NodeJS.Timeout

export const stopMainTask = () => {
  console.log('end')
  process.exit()
}

const setTimer = ()=>{
  if(timer){
    clearInterval(timer)
  } else {
    if (config.interval) {
      timer = setInterval(() => {
        const isEnd = scrollDown()
        if (!isEnd) toNextPage()
      }, config.interval)
    }
  }
}

readline.emitKeypressEvents(process.stdin)
process.stdin.on('keypress', (key) => {
  if(timer) clearInterval(timer)
  switch (key) {
    case 'w':
      scrollUp()
      break;
    case 's':
      scrollDown()
      break;
    case 'a':
      toPreviousPage()
      break;
    case 'd':
      toNextPage()
      break;
    case 'g':
      goPageByInput()
      break;
    case 't':
      setTimer()
      break;
    case 'q':
      stopMainTask()
      break;
  }
})

process.stdin.setRawMode(true)
