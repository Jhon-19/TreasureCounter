import { BrowserWindow, shell } from 'electron'
import icon from '../../../resources/icon.png?asset'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { getHtmlFileUrl } from '../utils'
import { getFixTop } from '../utils/config'

let trayWindow: BrowserWindow = null

export function createTrayWindow() {
  // Create the browser window.
  trayWindow = new BrowserWindow({
    width: 180,
    height: 120,
    show: false,
    frame: false,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true
    }
  })

  trayWindow.on('blur', () => {
    if (!trayWindow.isMinimized() && !getFixTop()) {
      hideTrayWindow()
    }
  })

  trayWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    trayWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    trayWindow.loadURL(getHtmlFileUrl())
  }

  return trayWindow
}

export const showTrayWindow = (bounds?: any) => {
  if (bounds) {
    const windowBounds = trayWindow.getBounds()
    const x = bounds.x - windowBounds.width / 2 + bounds.width / 2
    const y = bounds.y + bounds.height
    trayWindow.setPosition(x, y, false)
  }
  trayWindow.show()
  trayWindow.focus()
}

export const hideTrayWindow = () => {
  if (!trayWindow) return
  trayWindow.hide()
}

export const isTrayWindowVisible = () => {
  if (!trayWindow) return
  return trayWindow.isVisible()
}
