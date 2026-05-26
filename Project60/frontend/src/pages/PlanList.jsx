import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, DatePicker, Select, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { planApi } from '../services/api'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const { Option } = Select

const statusMap = {
  DRAFT: { text: '草稿', color: 'default' },
  IN_PROGRESS: { text: '进行中', color: 'processing' },
  COMPLETED: { text: '已完成', color: 'success' },
  CANCELLED: { text: '已取消', color: 'error' }
}

export default function PlanList() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [form] = Form.useForm()

  const fetchPlans = async () => {
    setLoading(true)
    try {
      const data = await planApi.getAll()
      setPlans(data)
    } catch (error) {
      message.error('获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const handleAdd = () => {
    setEditingPlan(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record) => {
    setEditingPlan(record)
    form.setFieldsValue({
      ...record,
      dateRange: record.startDate && record.endDate ? 
        [dayjs(record.startDate), dayjs(record.endDate)] : null
    })
    setModalVisible(true)
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除此团建方案吗？相关数据也会被删除。',
      onOk: async () => {
        try {
          await planApi.delete(id)
          message.success('删除成功')
          fetchPlans()
        } catch (error) {
          message.error('删除失败')
        }
      }
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const data = {
        ...values,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD')
      }
      delete data.dateRange

      if (editingPlan) {
        await planApi.update(editingPlan.id, data)
        message.success('更新成功')
      } else {
        await planApi.create(data)
        message.success('创建成功')
      }
      setModalVisible(false)
      fetchPlans()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const columns = [
    {
      title: '方案名称',
      dataIndex: 'title',
      key: 'title',
      width: 200
    },
    {
      title: '活动地点',
      dataIndex: 'location',
      key: 'location',
      width: 150
    },
    {
      title: '活动时间',
      key: 'time',
      width: 220,
      render: (_, record) => (
        <span>
          {record.startDate} 至 {record.endDate}
        </span>
      )
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
      width: 120,
      render: (budget) => `¥${budget?.toLocaleString() || 0}`
    },
    {
      title: '组织者',
      dataIndex: 'organizer',
      key: 'organizer',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const cfg = statusMap[status] || statusMap.DRAFT
        return <Tag color={cfg.color}>{cfg.text}</Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/plans/${record.id}`)}>
            详情
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>团建方案列表</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建方案
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={plans}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingPlan ? '编辑团建方案' : '新建团建方案'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="方案名称" rules={[{ required: true, message: '请输入方案名称' }]}>
            <Input placeholder="请输入方案名称" />
          </Form.Item>
          <Form.Item name="description" label="方案描述">
            <Input.TextArea rows={3} placeholder="请输入方案描述" />
          </Form.Item>
          <Form.Item name="location" label="活动地点" rules={[{ required: true, message: '请输入活动地点' }]}>
            <Input placeholder="请输入活动地点" />
          </Form.Item>
          <Form.Item name="dateRange" label="活动时间" rules={[{ required: true, message: '请选择活动时间' }]}>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="budget" label="预算" rules={[{ required: true, message: '请输入预算' }]}>
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={2}
              formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\¥\s?|(,*)/g, '')}
              placeholder="请输入预算金额"
            />
          </Form.Item>
          <Form.Item name="organizer" label="组织者" rules={[{ required: true, message: '请输入组织者' }]}>
            <Input placeholder="请输入组织者" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="DRAFT">
            <Select>
              <Option value="DRAFT">草稿</Option>
              <Option value="IN_PROGRESS">进行中</Option>
              <Option value="COMPLETED">已完成</Option>
              <Option value="CANCELLED">已取消</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
