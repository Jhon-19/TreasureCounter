import { app, Menu, nativeImage, Tray } from 'electron'
import icon from '../../../resources/icon.png?asset'
import { createSettingWindow } from './setting-window'
import { showTrayWindow } from './tray-window'
import { LOAD_CONFIG } from '../../constants/api'
import { getAppConfig } from '../utils/config'

// 声明全局变量，防止窗口/托盘被GC回收
let tray: Tray = null

export const createTray = () => {
  const trayIcon = nativeImage.createFromPath(icon)
  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }))

  const menu = Menu.buildFromTemplate([
    {
      label: '设置',
      click: () => {
        const settingWindow = createSettingWindow()
        const appConfig = getAppConfig()
        setTimeout(() => {
          settingWindow.webContents.send(LOAD_CONFIG, appConfig)
        }, 1000)
      }
    },
    { type: 'separator' },
    {
      label: '退出应用',
      click: () => app.quit()
    }
  ])

  tray.on('click', (event, bounds) => {
    showTrayWindow(bounds)
  })

  tray.on('right-click', () => {
    tray.popUpContextMenu(menu)
  })
}

export const setTrayTooltip = (tip) => {
  if (!tray) return
  tray.setToolTip(tip)
}
