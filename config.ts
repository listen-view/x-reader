import fs from 'node:fs'

interface LocalSetting {
  bookUrl: string,
  pageIndex?: number,
  containerSelector: string
}

let setting: LocalSetting


export const getConfig = () => {
  if (!fs.existsSync('./config.json')) throw new Error('配置不存在！')
  setting = JSON.parse(fs.readFileSync('./config.json').toString()) as LocalSetting
  return setting
}

export const setConfig = (params: Partial<LocalSetting>) => {
  setting = Object.assign(setting, params)
  fs.createWriteStream('./config.json').end(JSON.stringify(setting))
}