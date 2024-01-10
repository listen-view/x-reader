import fs from 'node:fs'

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