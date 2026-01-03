import path = require("path")

export const getHtmlFileUrl = () => { 
  const htmlAbsolutePath = path.resolve(__dirname, '../renderer/index.html')
  const loadFileUrl = 'file://' + htmlAbsolutePath
  return loadFileUrl
 }