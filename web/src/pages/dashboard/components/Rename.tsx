import { Modal, Form, Input, notification } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React, { useState, useEffect } from 'react'
import { req } from '../../../utils/Fetcher'

interface Props {
  dataSource?: [any[], (data: any[]) => void],
  onFinish?: () => void,
  dataSelect: [any, (data: any) => void]
}

const Rename: React.FC<Props> = ({
  dataSource,
  onFinish,
  dataSelect: [fileRename, setFileRename] }) => {

  const [loadingRename, setLoadingRename] = useState<boolean>()
  const [formRename] = useForm()

  useEffect(() => {
    if (fileRename) {
      formRename.setFieldsValue({ name: fileRename.name })
    }
  }, [fileRename])

  const renameFile = async () => {
    setLoadingRename(true)
    const { name } = formRename.getFieldsValue()
    try {
      const { data: result } = await req.patch(`/files/${fileRename?.id}`, {
        file: { name }
      })
      notification.success({
        message: 'Success',
        description: `${name} renamed successfully!`
      })
      dataSource?.[1](dataSource?.[0].map((datum: any) => datum.id === result.file.id ? { ...datum, name } : datum))
      setFileRename(undefined)
      setLoadingRename(false)
      formRename.resetFields()
      onFinish?.()
    } catch (error) {
      setLoadingRename(false)
      return notification.error({
        message: 'Error',
        description: 'Failed to rename a file. Please try again!'
      })
    }
  }

  return <Modal visible={fileRename}
    onCancel={() => setFileRename(undefined)}
    okText="Add"
    title={`Rename ${fileRename?.name}`}
    onOk={() => formRename.submit()}
    okButtonProps={{ loading: loadingRename }}>
    <Form form={formRename} layout="vertical" onFinish={renameFile}>
      <Form.Item name="name" label="Name">
        <Input />
      </Form.Item>
    </Form>
  </Modal>
}

export default Rename