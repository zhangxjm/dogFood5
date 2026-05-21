import React, { useEffect, useState } from 'react'
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Button,
  message,
  Card,
  Spin,
  Alert,
  Row,
  Col,
} from 'antd'
import dayjs from 'dayjs'
import { bookingAPI, roomAPI, roomTypeAPI } from '../api'

const CreateBooking = () => {
  const [rooms, setRooms] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [availableRooms, setAvailableRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()

  const checkInDate = Form.useWatch('check_in_date', form)
  const checkOutDate = Form.useWatch('check_out_date', form)
  const selectedRoomTypeId = Form.useWatch('room_type_id', form)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      checkAvailableRooms()
    }
  }, [checkInDate, checkOutDate, selectedRoomTypeId])

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
      message.error('获取数据失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const checkAvailableRooms = async () => {
    try {
      const params = {
        check_in_date: checkInDate.toISOString(),
        check_out_date: checkOutDate.toISOString(),
      }
      if (selectedRoomTypeId) {
        params.room_type_id = selectedRoomTypeId
      }
      const response = await roomAPI.getAvailable(params)
      setAvailableRooms(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true)
      const bookingData = {
        ...values,
        check_in_date: values.check_in_date.toISOString(),
        check_out_date: values.check_out_date.toISOString(),
      }
      await bookingAPI.create(bookingData)
      message.success('预订创建成功')
      form.resetFields()
      setAvailableRooms([])
    } catch (err) {
      message.error(err.response?.data?.detail || '预订创建失败')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day')
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>创建预订</h1>
      <Row gutter={24}>
        <Col span={12}>
          <Card title="预订信息">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                name="customer_name"
                label="客户姓名"
                rules={[{ required: true, message: '请输入客户姓名' }]}
              >
                <Input placeholder="请输入客户姓名" />
              </Form.Item>
              <Form.Item
                name="customer_phone"
                label="联系电话"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
              <Form.Item
                name="customer_email"
                label="电子邮箱"
                rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
              >
                <Input placeholder="请输入电子邮箱（可选）" />
              </Form.Item>
              <Form.Item name="customer_id_card" label="身份证号">
                <Input placeholder="请输入身份证号（可选）" />
              </Form.Item>
              <Form.Item
                name="room_type_id"
                label="房型筛选"
              >
                <Select placeholder="请选择房型（可选）" allowClear>
                  {roomTypes.map((rt) => (
                    <Select.Option key={rt.id} value={rt.id}>
                      {rt.name} - ¥{rt.price_per_night}/晚
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="check_in_date"
                label="入住日期"
                rules={[{ required: true, message: '请选择入住日期' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={disabledDate}
                  placeholder="请选择入住日期"
                />
              </Form.Item>
              <Form.Item
                name="check_out_date"
                label="退房日期"
                rules={[{ required: true, message: '请选择退房日期' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={(current) => {
                    if (!checkInDate) return disabledDate(current)
                    return current && current <= checkInDate
                  }}
                  placeholder="请选择退房日期"
                />
              </Form.Item>
              <Form.Item
                name="room_id"
                label="选择房间"
                rules={[{ required: true, message: '请选择房间' }]}
              >
                <Select placeholder="请先选择日期，然后选择房间">
                  {availableRooms.map((room) => {
                    const roomType = roomTypes.find((rt) => rt.id === room.room_type_id)
                    return (
                      <Select.Option key={room.id} value={room.id}>
                        {room.room_number} - {roomType?.name || '未知房型'}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name="num_guests"
                label="入住人数"
                rules={[{ required: true, message: '请输入入住人数' }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="请输入入住人数"
                />
              </Form.Item>
              <Form.Item name="notes" label="备注">
                <Input.TextArea placeholder="请输入备注" rows={3} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: '100%' }}
                  loading={submitting}
                >
                  创建预订
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="可用房间">
            {checkInDate && checkOutDate ? (
              availableRooms.length > 0 ? (
                <div>
                  <p style={{ marginBottom: 16 }}>
                    找到 {availableRooms.length} 个可用房间
                  </p>
                  {availableRooms.map((room) => {
                    const roomType = roomTypes.find((rt) => rt.id === room.room_type_id)
                    return (
                      <Card
                        key={room.id}
                        size="small"
                        style={{ marginBottom: 8 }}
                        title={`房间 ${room.room_number}`}
                      >
                        <p>房型: {roomType?.name || '-'}</p>
                        <p>楼层: {room.floor || '-'}</p>
                        <p>价格: ¥{roomType?.price_per_night || 0}/晚</p>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Alert
                  message="没有可用房间"
                  description="在所选日期范围内没有可用的房间，请选择其他日期。"
                  type="warning"
                />
              )
            ) : (
              <Alert
                message="请选择日期"
                description="请先选择入住和退房日期，系统将显示可用的房间。"
                type="info"
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CreateBooking
