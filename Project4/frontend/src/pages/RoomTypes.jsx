import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Popconfirm,
  message,
  Spin,
  Alert,
} from 'antd'
import { roomTypeAPI } from '../api'

const RoomTypes = () => {
  const [roomTypes, setRoomTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchRoomTypes()
  }, [])

  const fetchRoomTypes = async () => {
    try {
      setLoading(true)
      const response = await roomTypeAPI.getAll()
      setRoomTypes(response.data)
    } catch (err) {
      setError('获取房型列表失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingId(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record) => {
    setEditingId(record.id)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await roomTypeAPI.delete(id)
      message.success('删除成功')
      fetchRoomTypes()
    } catch (err) {
      const errorMsg = err.response?.data?.detail || '删除失败'
      message.error(errorMsg)
      console.error(err)
    }
  }

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await roomTypeAPI.update(editingId, values)
        message.success('更新成功')
      } else {
        await roomTypeAPI.create(values)
        message.success('创建成功')
      }
      setModalVisible(false)
      fetchRoomTypes()
    } catch (err) {
      message.error(editingId ? '更新失败' : '创建失败')
      console.error(err)
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '房型名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '价格/晚',
      dataIndex: 'price_per_night',
      key: 'price_per_night',
      render: (price) => `¥${price}`,
    },
    {
      title: '最多入住人数',
      dataIndex: 'max_guests',
      key: 'max_guests',
    },
    {
      title: '设施',
      dataIndex: 'amenities',
      key: 'amenities',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个房型吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return <Alert message={error} type="error" />
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>房型管理</h1>
        <Button type="primary" onClick={handleAdd}>
          添加房型
        </Button>
      </div>
      <Table columns={columns} dataSource={roomTypes} rowKey="id" bordered />
      <Modal
        title={editingId ? '编辑房型' : '添加房型'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="房型名称"
            rules={[{ required: true, message: '请输入房型名称' }]}
          >
            <Input placeholder="请输入房型名称" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea placeholder="请输入描述" rows={4} />
          </Form.Item>
          <Form.Item
            name="price_per_night"
            label="价格/晚"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              placeholder="请输入价格"
              prefix="¥"
            />
          </Form.Item>
          <Form.Item
            name="max_guests"
            label="最多入住人数"
            rules={[{ required: true, message: '请输入人数' }]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              placeholder="请输入人数"
            />
          </Form.Item>
          <Form.Item name="amenities" label="设施">
            <Input.TextArea placeholder="请输入设施描述" rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              {editingId ? '更新' : '创建'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RoomTypes
