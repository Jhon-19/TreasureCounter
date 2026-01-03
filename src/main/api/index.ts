import { ipcMain } from 'electron'
import { setTitle } from './set-title'
import { handleFileOpen } from './handle-file-open'
import { DIALOG_OPEN_FILE, SAVE_CONFIG, SET_TITLE } from '../../constants/api'
import { saveConfig } from './save-config'

export const registerApis = () => {
  // 渲染进程到主进程（单向）
  ipcMain.on(SET_TITLE, setTitle)
  // 渲染进程到主进程（双向）
  ipcMain.handle(DIALOG_OPEN_FILE, handleFileOpen)
  ipcMain.handle(SAVE_CONFIG, saveConfig)
}
