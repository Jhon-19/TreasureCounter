import { saveConfigToStore } from '../utils/config'

export const saveConfig = (event, config) => {
  return saveConfigToStore(config)
}
