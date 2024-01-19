import fs from 'node:fs'
import type {NormalListType} from './content.js'

const CACHE_FOLDER = './cache/'
const CATALOG_FILENAME = 'catalog.json'
interface LocalSetting {
  bookUrl: string,
  containerSelector: string,
  childPage?: Array<string>,
  catalogUrl: string,
  catalogSelector: string,
  loadCatalogButton?: string,
  searchUrl?: string,
  searchSelector?: string,
  pageIndex?: number,
  readIndex?: number,
  interval?: number
}

let setting: LocalSetting


export const getConfig = () => {
  if (!fs.existsSync('./config.json')) throw new Error('配置不存在！')
  setting = JSON.parse(fs.readFileSync('./config.json').toString()) as LocalSetting
  return setting
}

export const setConfig = (params: Partial<LocalSetting>, cb: () => void) => {
  setting = Object.assign(setting, params)
  const writeStream = fs.createWriteStream('./config.json')
  writeStream.end(JSON.stringify(setting, null, 2))
  writeStream.on('finish', cb)
}

export const getCatalogCache = () =>{
  return fs.existsSync(CACHE_FOLDER + CATALOG_FILENAME) 
    ? (JSON.parse(fs.readFileSync(CACHE_FOLDER + CATALOG_FILENAME).toString()) as NormalListType) 
    : []
}

export const setCatalogCache = (data: string) => {
  if(!fs.existsSync(CACHE_FOLDER)){
    fs.mkdirSync(CACHE_FOLDER)
  }
  fs.writeFileSync(CACHE_FOLDER+CATALOG_FILENAME, data)
}