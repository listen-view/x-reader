import readlineSync from 'readline-sync'
import { scrollDown, scrollUp, goPageByInput, toNextPage, toPreviousPage } from './page.ts'

const openReadline = () => {
  const key = readlineSync.keyIn()
  return key
}

export const runMainTask = () => {
  let key = openReadline()
  switch (key) {
    case 'w':
      scrollUp()
      runMainTask()
      break;
    case 's':
      scrollDown()
      runMainTask()
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
    case 'q':
      stopMainTask()
      break;
    default:
      runMainTask()
  }
}

export const stopMainTask = () => {
  console.log('end')
  process.exit()
}
runMainTask()