import { BrowserWindow, shell } from 'electron'
import icon from '../../../resources/icon.png?asset'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { getHtmlFileUrl } from '../utils'

let settingWindow: BrowserWindow = null

export const createSettingWindow = () => {
  // Create the browser window.
  settingWindow = new BrowserWindow({
    width: 720,
    height: 430,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true
    }
  })

  settingWindow.on('ready-to-show', () => {
    settingWindow.show()
  })

  settingWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    settingWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/setting')
  } else {
    settingWindow.loadURL(getHtmlFileUrl() + '#/setting')
  }

  return settingWindow
}
