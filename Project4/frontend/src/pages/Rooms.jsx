import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Popconfirm,
  message,
  Spin,
  Alert,
  Tag,
} from 'antd'
import { roomAPI, roomTypeAPI } from '../api'

const statusColors = {
  available: 'green',
  occupied: 'red',
  reserved: 'blue',
  maintenance: 'orange',
}

const statusLabels = {
  available: '空闲',
  occupied: '已入住',
  reserved: '已预订',
  maintenance: '维修中',
}

const Rooms = () => {
  const [rooms, setRooms] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [roomsRes, roomTypesRes] = await Promise.all([
        roomAPI.getAll(),
        roomTypeAPI.getAll(),
      ])
      setRooms(roomsRes.data)
      setRoomTypes(roomTypesRes.data)
    } catch (err) {
      setError('获取数据失败')
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
      await roomAPI.delete(id)
      message.success('删除成功')
      fetchData()
    } catch (err) {
      const errorMsg = err.response?.data?.detail || '删除失败'
      message.error(errorMsg)
      console.error(err)
    }
  }

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await roomAPI.update(editingId, values)
        message.success('更新成功')
      } else {
        await roomAPI.create(values)
        message.success('创建成功')
      }
      setModalVisible(false)
      fetchData()
    } catch (err) {
      message.error(editingId ? '更新失败' : '创建失败')
      console.error(err)
    }
  }

  const getRoomTypeName = (roomTypeId) => {
    const roomType = roomTypes.find((rt) => rt.id === roomTypeId)
    return roomType ? roomType.name : '-'
  }

  const columns = [
    {
      title: '房间号',
      dataIndex: 'room_number',
      key: 'room_number',
    },
    {
      title: '房型',
      dataIndex: 'room_type_id',
      key: 'room_type_id',
      render: (roomTypeId) => getRoomTypeName(roomTypeId),
    },
    {
      title: '楼层',
      dataIndex: 'floor',
      key: 'floor',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
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
            title="确定要删除这个房间吗？"
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
        <h1>房间管理</h1>
        <Button type="primary" onClick={handleAdd}>
          添加房间
        </Button>
      </div>
      <Table columns={columns} dataSource={rooms} rowKey="id" bordered />
      <Modal
        title={editingId ? '编辑房间' : '添加房间'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="room_number"
            label="房间号"
            rules={[{ required: true, message: '请输入房间号' }]}
          >
            <Input placeholder="请输入房间号" />
          </Form.Item>
          <Form.Item
            name="room_type_id"
            label="房型"
            rules={[{ required: true, message: '请选择房型' }]}
          >
            <Select placeholder="请选择房型">
              {roomTypes.map((rt) => (
                <Select.Option key={rt.id} value={rt.id}>
                  {rt.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="floor" label="楼层">
            <InputNumber style={{ width: '100%' }} placeholder="请输入楼层" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
            initialValue="available"
          >
            <Select placeholder="请选择状态">
              <Select.Option value="available">空闲</Select.Option>
              <Select.Option value="occupied">已入住</Select.Option>
              <Select.Option value="reserved">已预订</Select.Option>
              <Select.Option value="maintenance">维修中</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="备注">
            <Input.TextArea placeholder="请输入备注" rows={3} />
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

export default Rooms
