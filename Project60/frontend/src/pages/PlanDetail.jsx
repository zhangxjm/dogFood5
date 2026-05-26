import React, { useState, useEffect } from 'react'
import { Card, Tabs, Button, Table, Space, Modal, Form, Input, InputNumber, DatePicker, Select, message, Rate, Descriptions, Statistic, Row, Col } from 'antd'
import { ArrowLeftOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { planApi, participantApi, expenseApi, reviewApi } from '../services/api'
import dayjs from 'dayjs'

export default function PlanDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [plan, setPlan] = useState(null)
  const [statistics, setStatistics] = useState(null)
  const [participants, setParticipants] = useState([])
  const [expenses, setExpenses] = useState([])
  const [review, setReview] = useState(null)
  const [activeTab, setActiveTab] = useState('participants')
  
  const [participantModal, setParticipantModal] = useState(false)
  const [expenseModal, setExpenseModal] = useState(false)
  const [reviewModal, setReviewModal] = useState(false)
  const [editingParticipant, setEditingParticipant] = useState(null)
  const [editingExpense, setEditingExpense] = useState(null)
  
  const [participantForm] = Form.useForm()
  const [expenseForm] = Form.useForm()
  const [reviewForm] = Form.useForm()

  const fetchData = async () => {
    try {
      const [planData, statsData, participantsData, expensesData] = await Promise.all([
        planApi.getById(id),
        planApi.getStatistics(id),
        participantApi.getByPlanId(id),
        expenseApi.getByPlanId(id)
      ])
      setPlan(planData)
      setStatistics(statsData)
      setParticipants(participantsData)
      setExpenses(expensesData)
      
      try {
        const reviewData = await reviewApi.getByPlanId(id)
        setReview(reviewData)
      } catch (e) {
        setReview(null)
      }
    } catch (error) {
      message.error('获取数据失败')
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const handleAddParticipant = () => {
    setEditingParticipant(null)
    participantForm.resetFields()
    setParticipantModal(true)
  }

  const handleEditParticipant = (record) => {
    setEditingParticipant(record)
    participantForm.setFieldsValue(record)
    setParticipantModal(true)
  }

  const handleDeleteParticipant = async (participantId) => {
    try {
      await participantApi.delete(participantId)
      message.success('删除成功')
      fetchData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleSubmitParticipant = async () => {
    try {
      const values = await participantForm.validateFields()
      if (editingParticipant) {
        await participantApi.update(editingParticipant.id, values)
      } else {
        await participantApi.create({ ...values, planId: id })
      }
      message.success('操作成功')
      setParticipantModal(false)
      fetchData()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleAddExpense = () => {
    setEditingExpense(null)
    expenseForm.resetFields()
    setExpenseModal(true)
  }

  const handleEditExpense = (record) => {
    setEditingExpense(record)
    expenseForm.setFieldsValue({
      ...record,
      expenseDate: record.expenseDate ? dayjs(record.expenseDate) : null
    })
    setExpenseModal(true)
  }

  const handleDeleteExpense = async (expenseId) => {
    try {
      await expenseApi.delete(expenseId)
      message.success('删除成功')
      fetchData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleSubmitExpense = async () => {
    try {
      const values = await expenseForm.validateFields()
      const data = {
        ...values,
        expenseDate: values.expenseDate.format('YYYY-MM-DD')
      }
      if (editingExpense) {
        await expenseApi.update(editingExpense.id, data)
      } else {
        await expenseApi.create({ ...data, planId: id })
      }
      message.success('操作成功')
      setExpenseModal(false)
      fetchData()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleAddReview = () => {
    if (review) {
      reviewForm.setFieldsValue(review)
    } else {
      reviewForm.resetFields()
    }
    setReviewModal(true)
  }

  const handleSubmitReview = async () => {
    try {
      const values = await reviewForm.validateFields()
      if (review) {
        await reviewApi.update(review.id, values)
      } else {
        await reviewApi.create({ ...values, planId: id })
      }
      message.success('操作成功')
      setReviewModal(false)
      fetchData()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const participantColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '部门', dataIndex: 'department', key: 'department' },
    { title: '电话', dataIndex: 'phone', key: 'phone' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditParticipant(record)}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteParticipant(record.id)}>删除</Button>
        </Space>
      )
    }
  ]

  const expenseColumns = [
    { title: '项目名称', dataIndex: 'itemName', key: 'itemName' },
    { title: '类别', dataIndex: 'category', key: 'category' },
    { title: '金额', dataIndex: 'amount', key: 'amount', render: (v) => `¥${v?.toLocaleString() || 0}` },
    { title: '日期', dataIndex: 'expenseDate', key: 'expenseDate' },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditExpense(record)}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteExpense(record.id)}>删除</Button>
        </Space>
      )
    }
  ]

  if (!plan) return <div>加载中...</div>

  return (
    <div>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        返回列表
      </Button>

      <Card title={plan.title} style={{ marginBottom: 16 }}>
        <Descriptions column={3}>
          <Descriptions.Item label="活动地点">{plan.location}</Descriptions.Item>
          <Descriptions.Item label="活动时间">
            {plan.startDate} 至 {plan.endDate}
          </Descriptions.Item>
          <Descriptions.Item label="组织者">{plan.organizer}</Descriptions.Item>
        </Descriptions>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={8}>
            <Statistic title="预算金额" value={plan.budget} prefix="¥" />
          </Col>
          <Col span={8}>
            <Statistic title="实际支出" value={statistics?.totalExpense || 0} prefix="¥" />
          </Col>
          <Col span={8}>
            <Statistic title="参与人数" value={statistics?.participantCount || 0} suffix="人" />
          </Col>
        </Row>
        {plan.description && (
          <div style={{ marginTop: 16 }}>
            <strong>方案描述：</strong>
            <p style={{ marginTop: 8 }}>{plan.description}</p>
          </div>
        )}
      </Card>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane tab="参与人员" key="participants">
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddParticipant}>
                添加人员
              </Button>
            </div>
            <Table
              columns={participantColumns}
              dataSource={participants}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="经费统计" key="expenses">
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddExpense}>
                添加支出
              </Button>
            </div>
            <Table
              columns={expenseColumns}
              dataSource={expenses}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              footer={() => (
                <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  总计：¥{expenses.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString()}
                </div>
              )}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="活动复盘" key="review">
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button type="primary" onClick={handleAddReview}>
                {review ? '编辑复盘' : '添加复盘'}
              </Button>
            </div>
            {review ? (
              <div>
                <Descriptions column={1}>
                  <Descriptions.Item label="满意度评分">
                    <Rate disabled value={review.satisfactionScore / 20} />
                    <span style={{ marginLeft: 8 }}>{review.satisfactionScore}分</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="记录人">{review.recorder}</Descriptions.Item>
                  <Descriptions.Item label="活动亮点">{review.highlights}</Descriptions.Item>
                  <Descriptions.Item label="待改进点">{review.improvements}</Descriptions.Item>
                  <Descriptions.Item label="总结反馈">{review.feedback}</Descriptions.Item>
                </Descriptions>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                暂无复盘记录
              </div>
            )}
          </Tabs.TabPane>
        </Tabs>
      </Card>

      <Modal
        title={editingParticipant ? '编辑参与人员' : '添加参与人员'}
        open={participantModal}
        onOk={handleSubmitParticipant}
        onCancel={() => setParticipantModal(false)}
      >
        <Form form={participantForm} layout="vertical">
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="department" label="部门">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="电话">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="CONFIRMED">
            <Select>
              <Select.Option value="CONFIRMED">已确认</Select.Option>
              <Select.Option value="PENDING">待确认</Select.Option>
              <Select.Option value="CANCELLED">已取消</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingExpense ? '编辑支出' : '添加支出'}
        open={expenseModal}
        onOk={handleSubmitExpense}
        onCancel={() => setExpenseModal(false)}
      >
        <Form form={expenseForm} layout="vertical">
          <Form.Item name="itemName" label="项目名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="类别">
            <Select>
              <Select.Option value="场地">场地</Select.Option>
              <Select.Option value="餐饮">餐饮</Select.Option>
              <Select.Option value="交通">交通</Select.Option>
              <Select.Option value="礼品">礼品</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="金额" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} precision={2} />
          </Form.Item>
          <Form.Item name="expenseDate" label="日期" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={review ? '编辑复盘记录' : '添加复盘记录'}
        open={reviewModal}
        onOk={handleSubmitReview}
        onCancel={() => setReviewModal(false)}
        width={600}
      >
        <Form form={reviewForm} layout="vertical">
          <Form.Item name="recorder" label="记录人" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="satisfactionScore" label="满意度评分(0-100)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} max={100} />
          </Form.Item>
          <Form.Item name="highlights" label="活动亮点">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="improvements" label="待改进点">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="feedback" label="总结反馈">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
