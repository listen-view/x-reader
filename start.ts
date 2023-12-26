import readlineSync from 'readline-sync'
import { scrollDown, scrollUp } from './page.ts'

const openReadline = () => {
    const key = readlineSync.keyIn()
    return key
}

let directionKey = ''
do {
    directionKey = openReadline()
    switch (directionKey) {
        case 'w':
            scrollUp()
            break;
        case 's':
            scrollDown()
            break;
    }

} while (directionKey !== 'q')