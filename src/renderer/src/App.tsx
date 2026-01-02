import { Button } from 'antd'
import './global.less'
import { useEffect, useRef, useState } from 'react'

function App() {
  const [selectedFilePath, setSelectedFilePath] = useState('')
  const versionRef = useRef(0)

  useEffect(() => {
    window.api.onUpdateCounter((value) => {
      versionRef.current = versionRef.current + value
      window.api.setTitle('version: ' + versionRef.current)
    })
  }, [])

  return (
    <div className="container">
      <Button
        onClick={() => {
          window.api.setTitle('Electron Template')
        }}
      >
        修改APP标题
      </Button>
      <div>
        <Button
          onClick={() => {
            const filePath = window.api.openFile()
            setSelectedFilePath(filePath)
          }}
        >
          选择文件
        </Button>
        <div>选择的文件路径为：{selectedFilePath || '未选择'}</div>
      </div>
    </div>
  )
}

export default App
