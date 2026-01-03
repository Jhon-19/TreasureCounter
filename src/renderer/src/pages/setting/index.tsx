import { Button, Card, Form, InputNumber, message, Switch } from 'antd'
import { useEffect } from 'react'
import styles from './index.module.less'

function Setting() {
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const result = await window.api.saveConfig(values)
    if (result) {
      message.success('保存成功')
    } else {
      message.error('保存失败')
    }
  }

  useEffect(() => {
    window.api.loadConifg((values) => {
      form.setFieldsValue(values)
    })
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.title}>财富时钟-输入基本信息</div>
      <Card className={styles.formContainer}>
        <Form form={form} name="config" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Form.Item
            label="月薪"
            name={'salary'}
            rules={[{ required: true, message: '月薪不能为空' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="工作天数"
            name={'workdays'}
            rules={[
              { required: true, message: '工作天数不能为空' },
              {
                validator: (_, value) =>
                  value > 0 ? Promise.resolve() : Promise.reject(new Error('工作天数必须为正数'))
              }
            ]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item label="弹窗置顶" name={'fixTop'}>
            <Switch />
          </Form.Item>
        </Form>
      </Card>
      <div className={styles.buttonGroups}>
        <Button type='primary' onClick={() => handleSubmit()}>保存设置</Button>
      </div>
    </div>
  )
}

export default Setting
