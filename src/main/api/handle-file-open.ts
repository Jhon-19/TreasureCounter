import { dialog } from 'electron'

export const handleFileOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({})
  if (!canceled) {
    return filePaths[0]
  }
}
