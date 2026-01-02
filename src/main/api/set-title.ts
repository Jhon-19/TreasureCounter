import { BrowserWindow } from 'electron';

export const setTitle = (event, title) => {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
}
