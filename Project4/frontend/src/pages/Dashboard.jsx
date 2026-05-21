import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Spin, Alert } from 'antd'
import { statsAPI } from '../api'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await statsAPI.getDashboard()
      setStats(response.data)
    } catch (err) {
      setError('获取统计数据失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

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
      <h1 style={{ marginBottom: 24 }}>仪表盘</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总房间数"
              value={stats?.total_rooms || 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="空闲房间"
              value={stats?.available_rooms || 0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已入住"
              value={stats?.occupied_rooms || 0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已预订"
              value={stats?.reserved_rooms || 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="今日有效预订"
              value={stats?.today_bookings || 0}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="总预订数"
              value={stats?.total_bookings || 0}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
