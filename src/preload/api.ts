import { DIALOG_OPEN_FILE, SET_TITLE, UPDATE_COUNTER } from './../constants/api'
import { ipcRenderer } from 'electron'

// Custom APIs for renderer
export const api = {
  setTitle: (title) => ipcRenderer.send(SET_TITLE, title),
  openFile: () => ipcRenderer.invoke(DIALOG_OPEN_FILE),
  onUpdateCounter: (callback) => ipcRenderer.on(UPDATE_COUNTER, (_event, value) => callback(value))
}
