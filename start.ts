import { findBook, scrollDown, scrollUp, goPageByInput, toNextPage, toPreviousPage, getReadMsg } from './page.js'
import { getConfig, setConfig } from './config.js'
import readline from 'node:readline'

const config = getConfig()
let timer: NodeJS.Timeout | null

export const stopMainTask = () => {
  console.log('end')
  setConfig(getReadMsg(), () => {
    process.exit()
  })
}

const setTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
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
process.stdin.on('keypress', (key, { name }) => {
  if (name !== 't' && timer) setTimer()
  switch (name) {
    case 'up':
      scrollUp()
      break;
    case 'down':
      scrollDown()
      break;
    case 'left':
      toPreviousPage()
      break;
    case 'right':
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
    case 'f':
      findBook()
      break;
  }
})

process.stdin.setRawMode(true)
