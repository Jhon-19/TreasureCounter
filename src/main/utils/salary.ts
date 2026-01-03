import { BrowserWindow } from 'electron'
import {
  checkIsNewDay,
  checkTodayIsHoliday,
  daysToSeconds,
  getDatesOfMonth,
  getSecondsFromMonthStart
} from './calendar'
import { checkConfigUpdated, getSalaryConfig, initSalaryConfig } from './config'
import { UPDATE_SALARY, UPDATE_SALARY_PERSECOND } from '../../constants/api'
import { setTrayTooltip } from '../frames/tray'

let salaryInterval = null
let currentSalary = 0
let salaryPerSecond = 0

const getInitSalary = async (salaryPerSecond) => {
  const isHolidayToday = await checkTodayIsHoliday()
  const datesOfMonth = await getDatesOfMonth(true)
  let workdaySeconds = 0

  if (isHolidayToday) {
    const workdays = datesOfMonth.workdayDates.length
    workdaySeconds = daysToSeconds(workdays)
  } else {
    const holidays = datesOfMonth.holidayDates.length
    const holidaySeconds = daysToSeconds(holidays)
    const totalSeconds = getSecondsFromMonthStart()
    workdaySeconds = totalSeconds - holidaySeconds
  }
  const initSalary = workdaySeconds * salaryPerSecond

  return initSalary
}

const initCurrentSalary = async (trayWindow: BrowserWindow) => {
  initSalaryConfig()

  const salaryConfig = getSalaryConfig()
  const { salary, workdays } = salaryConfig

  salaryPerSecond = salary / daysToSeconds(workdays)
  currentSalary = await getInitSalary(salaryPerSecond)

  setTimeout(() => {
    trayWindow.webContents.send(UPDATE_SALARY_PERSECOND, salaryPerSecond)
  }, 1000)
}

const updateSalary = async (trayWindow: BrowserWindow) => {
  const isHolidayToday = await checkTodayIsHoliday()
  if (isHolidayToday) {
    currentSalary += salaryPerSecond
    trayWindow.webContents.send(UPDATE_SALARY, currentSalary)
    setTrayTooltip(`本月收入¥：${currentSalary.toFixed(6)}`)
  }

  if (checkConfigUpdated()) {
    await initCurrentSalary(trayWindow)
  }

  if (checkIsNewDay()) {
    await initCurrentSalary(trayWindow)
  }
}

export const computeSalaryInTime = (trayWindow) => {
  if (salaryInterval) clearInterval(salaryInterval)
  initCurrentSalary(trayWindow)

  salaryInterval = setInterval(() => updateSalary(trayWindow), 1000)
}
