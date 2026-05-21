import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Spin,
  Alert,
  Tag,
  Select,
} from 'antd'
import dayjs from 'dayjs'
import { bookingAPI, roomAPI, roomTypeAPI } from '../api'

const statusColors = {
  pending: 'orange',
  confirmed: 'blue',
  checked_in: 'green',
  checked_out: 'gray',
  cancelled: 'red',
}

const statusLabels = {
  pending: '待确认',
  confirmed: '已确认',
  checked_in: '已入住',
  checked_out: '已退房',
  cancelled: '已取消',
}

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [statusFilter])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const params = statusFilter ? { status: statusFilter } : {}
      const response = await bookingAPI.getAll(params)
      setBookings(response.data)
    } catch (err) {
      setError('获取预订列表失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async (id) => {
    try {
      await bookingAPI.confirm(id)
      message.success('确认成功')
      fetchBookings()
    } catch (err) {
      message.error('确认失败')
      console.error(err)
    }
  }

  const handleCheckIn = async (id) => {
    try {
      await bookingAPI.checkIn({ booking_id: id })
      message.success('入住成功')
      fetchBookings()
    } catch (err) {
      message.error('入住失败')
      console.error(err)
    }
  }

  const handleCheckOut = async (id) => {
    try {
      await bookingAPI.checkOut({ booking_id: id })
      message.success('退房成功')
      fetchBookings()
    } catch (err) {
      message.error('退房失败')
      console.error(err)
    }
  }

  const handleCancel = async (id) => {
    try {
      await bookingAPI.cancel(id)
      message.success('取消成功')
      fetchBookings()
    } catch (err) {
      message.error('取消失败')
      console.error(err)
    }
  }

  const columns = [
    {
      title: '预订号',
      dataIndex: 'booking_no',
      key: 'booking_no',
    },
    {
      title: '客户姓名',
      dataIndex: ['customer', 'name'],
      key: 'customer_name',
    },
    {
      title: '联系电话',
      dataIndex: ['customer', 'phone'],
      key: 'customer_phone',
    },
    {
      title: '房间',
      dataIndex: ['room', 'room_number'],
      key: 'room_number',
    },
    {
      title: '入住日期',
      dataIndex: 'check_in_date',
      key: 'check_in_date',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '退房日期',
      dataIndex: 'check_out_date',
      key: 'check_out_date',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '入住人数',
      dataIndex: 'num_guests',
      key: 'num_guests',
    },
    {
      title: '总价',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (price) => `¥${price}`,
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
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <Button
              type="link"
              onClick={() => handleConfirm(record.id)}
            >
              确认
            </Button>
          )}
          {record.status === 'confirmed' && (
            <Button
              type="link"
              onClick={() => handleCheckIn(record.id)}
            >
              入住
            </Button>
          )}
          {record.status === 'checked_in' && (
            <Button
              type="link"
              onClick={() => handleCheckOut(record.id)}
            >
              退房
            </Button>
          )}
          {['pending', 'confirmed'].includes(record.status) && (
            <Popconfirm
              title="确定要取消这个预订吗？"
              onConfirm={() => handleCancel(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger>
                取消
              </Button>
            </Popconfirm>
          )}
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>预订管理</h1>
        <Select
          style={{ width: 150 }}
          placeholder="筛选状态"
          allowClear
          onChange={setStatusFilter}
          value={statusFilter}
        >
          <Select.Option value="pending">待确认</Select.Option>
          <Select.Option value="confirmed">已确认</Select.Option>
          <Select.Option value="checked_in">已入住</Select.Option>
          <Select.Option value="checked_out">已退房</Select.Option>
          <Select.Option value="cancelled">已取消</Select.Option>
        </Select>
      </div>
      <Table columns={columns} dataSource={bookings} rowKey="id" bordered />
    </div>
  )
}

export default Bookings
