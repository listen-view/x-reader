import readlineSync from 'readline-sync'
import { scrollDown, scrollUp, goPageByInput, toNextPage, toPreviousPage } from './page.ts'

const openReadline = () => {
    const key = readlineSync.keyIn()
    return key
}
let directionKey = ''

export const runMainTask = () => {
  do {
    directionKey = openReadline()
    switch (directionKey) {
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
    }

  } while (directionKey !== 'q')
}

export const stopMainTask = () => {
  directionKey = 'q'
}
runMainTask()