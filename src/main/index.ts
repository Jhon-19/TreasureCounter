import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { registerApis } from './api'
import { createTrayWindow } from './frames/tray-window'
import { createTray } from './frames/tray'
import { computeSalaryInTime } from './utils/salary'

// 确保应用单实例运行
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}

// 隐藏默认的应用程序坞图标（macOS特有）
if (process.platform === 'darwin') {
  app.dock.hide()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.codestraveler')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createTray()
  const trayWindow = createTrayWindow()

  registerApis()
  computeSalaryInTime(trayWindow)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
