import HolidayCalendar from 'holiday-calendar'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { CN_TIME_ZONE, TIME_FORMAT } from '../../constants/calendar'
import __Store from 'electron-store'
import { STORE_DIR } from '../../constants/store'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrBefore)
dayjs.tz.setDefault(CN_TIME_ZONE)

const calendar = new HolidayCalendar()

type StoreType = {
  currentYear: string | number
  holidayArray: string[]
}

// @ts-ignore
const Store = __Store.default || __Store
const store: any = new Store<StoreType>({ name: 'calendar', cwd: STORE_DIR })

const getSpanDates = (start, end) => {
  const dates = []
  let temp = start
  while (temp.isSameOrBefore(end, 'day')) {
    dates.push(temp.format(TIME_FORMAT))
    temp = temp.add(1, 'day')
  }

  return dates
}

const getYearDates = () => {
  const start = dayjs().startOf('year')
  const end = dayjs().endOf('year')
  return getSpanDates(start, end)
}

const getMonthDates = (endDay?: any) => {
  const start = dayjs().startOf('month')
  const end = endDay || dayjs().endOf('month')

  return getSpanDates(start, end)
}

const checkIsHolidayCache = async (date) => {
  let isHoliday = false

  const holidayArray = await getHolidayArray()
  if (Array.isArray(holidayArray)) {
    isHoliday = holidayArray.includes(date)
  }
  return isHoliday
}

const checkIsHoliday = async (date) => {
  const isHoliday = await calendar.isHoliday('CN', date)
  return isHoliday
}

const getHolidayArray = async (year = dayjs().year()) => {
  const currentYear = store.get('currentYear')
  if (!currentYear || currentYear.toString() !== year.toString()) {
    const totalDates = getYearDates()

    const holidayArray = []
    for (const date of totalDates) {
      const isHoliday = await checkIsHoliday(date)
      if (isHoliday) {
        holidayArray.push(date)
      }
    }
    store.set({
      currentYear: year,
      holidayArray
    })
    return holidayArray
  } else {
    return store.get('holidayArray')
  }
}

export const getDatesOfMonth = async (endToday = false) => {
  let endDay = endToday ? dayjs() : null

  const totalDates = getMonthDates(endDay)
  const holidayDates = []
  const workdayDates = []

  for (const date of totalDates) {
    const isHoliday = await checkIsHolidayCache(date)
    if (isHoliday) {
      holidayDates.push(date)
    } else {
      workdayDates.push(date)
    }
  }
  return {
    holidayDates,
    workdayDates,
    totalDates
  }
}

export const getCurrentMonth = () => {
  return dayjs().month()
}

export const daysToSeconds = (days: number) => {
  if (typeof days !== 'number') return 0
  return days * 24 * 60 * 60
}

export const getSecondsFromMonthStart = () => {
  return dayjs().diff(dayjs().startOf('month'), 'second')
}

export const checkTodayIsHoliday = () => {
  return checkIsHolidayCache(dayjs().format(TIME_FORMAT))
}

export const checkIsNewDay = () => {
  const threshold = 2000
  const secondsDiff = dayjs().diff(dayjs().startOf('day'))
  return Math.abs(secondsDiff) < threshold
}
