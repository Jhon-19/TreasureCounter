import { STORE_DIR } from '../../constants/store'
import __Store from 'electron-store'
import { getCurrentMonth, getDatesOfMonth } from './calendar'

type StoreType = {
  salary: number
  workdays: number
  storeMonth: number // 0-11
  fixTop: boolean // 控制弹窗是否置顶
}

// @ts-ignore
const Store = __Store.default || __Store
const store: any = new Store<StoreType>({ name: 'config', cwd: STORE_DIR })

let isConfigUpdated = false

export const getSalaryConfig = () => {
  const salary = store.get('salary') || 10000
  const workdays = store.get('workdays') || 20
  return {
    salary,
    workdays
  }
}

const getStoreMonth = () => {
  const storeMonth = store.get('storeMonth')
  return storeMonth
}

export const initSalaryConfig = async () => {
  if (checkIsNewMonth()) {
    store.set('storeMonth', getCurrentMonth())
    const workdays = (await getDatesOfMonth()).workdayDates.length
    store.set('workdays', workdays)
  }
}

const checkIsNewMonth = () => {
  const storeMonth = getStoreMonth()
  const currentMonth = getCurrentMonth()
  return storeMonth !== currentMonth
}

export const saveConfigToStore = (config) => {
  store.set(config)
  isConfigUpdated = true
  return true
}

export const checkConfigUpdated = () => {
  let isUpdated = isConfigUpdated
  if (isConfigUpdated) {
    isConfigUpdated = false
  }
  return isUpdated
}

export const getFixTop = () => {
  return store.get('fixTop')
}

export const getAppConfig = () => {
  const originValues =  store.store
  let values = {salary: 10000,
      workdays: 20,
      fixTop: false,}
  if (typeof originValues === 'object') {
    values = Object.assign({}, values, originValues)
  }
  return values
}
