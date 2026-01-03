import {
  DIALOG_OPEN_FILE,
  LOAD_CONFIG,
  SAVE_CONFIG,
  SET_TITLE,
  UPDATE_SALARY,
  UPDATE_SALARY_PERSECOND
} from './../constants/api';
import { ipcRenderer } from 'electron';

// Custom APIs for renderer
export const api = {
  setTitle: (title) => ipcRenderer.send(SET_TITLE, title),
  openFile: () => ipcRenderer.invoke(DIALOG_OPEN_FILE),
  onUpdateSalary: (callback) => ipcRenderer.on(UPDATE_SALARY, (_event, value) => callback(value)),
  onUpdateSalaryPerSecond: (callback) =>
    ipcRenderer.on(UPDATE_SALARY_PERSECOND, (_event, value) => callback(value)),
  saveConfig: (config) => {
    return ipcRenderer.invoke(SAVE_CONFIG, config);
  },
  loadConifg: (callback) => ipcRenderer.on(LOAD_CONFIG, (_event, values) => callback(values))
}
