import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tag, Button, Space, Select, DatePicker } from 'antd';
import { PlusOutlined, CheckCircleOutlined, ClockCircleOutlined, StopOutlined, TeamOutlined } from '@ant-design/icons';
import { areaAPI, seatAPI, reservationAPI } from '../services/api';
import dayjs from 'dayjs';

const { Option } = Select;

function Dashboard() {
  const [areas, setAreas] = useState([]);
  const [seats, setSeats] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [areasRes, seatsRes, reservationsRes] = await Promise.all([
        areaAPI.getAll(),
        seatAPI.getWithStatus(),
        reservationAPI.getAll({ limit: 10 }),
      ]);
      setAreas(areasRes.data);
      setSeats(seatsRes.data);
      setReservations(reservationsRes.data);
      if (areasRes.data.length > 0) {
        setSelectedArea(areasRes.data[0].id);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const availableSeats = seats.filter(s => s.is_available && s.is_active).length;
  const occupiedSeats = seats.filter(s => !s.is_available && s.is_active).length;
  const activeReservations = reservations.filter(r => !r.is_cancelled).length;

  const stats = [
    { title: '总座位数', value: seats.length, color: '#1890ff', icon: <TeamOutlined /> },
    { title: '可用座位', value: availableSeats, color: '#52c41a', icon: <CheckCircleOutlined /> },
    { title: '已占座位', value: occupiedSeats, color: '#ff4d4f', icon: <StopOutlined /> },
    { title: '今日预约', value: activeReservations, color: '#faad14', icon: <ClockCircleOutlined /> },
  ];

  const reservationColumns = [
    {
      title: '座位号',
      dataIndex: 'seat_id',
      key: 'seat_id',
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time',
      render: (t) => dayjs(t).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      key: 'end_time',
      render: (t) => dayjs(t).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '状态',
      dataIndex: 'is_cancelled',
      key: 'status',
      render: (cancelled) => (
        <Tag color={cancelled ? 'red' : 'green'}>
          {cancelled ? '已取消' : '有效'}
        </Tag>
      ),
    },
  ];

  const filteredSeats = selectedArea 
    ? seats.filter(s => s.area_id === selectedArea) 
    : seats;

  const maxRow = Math.max(...filteredSeats.map(s => s.row), 0) + 1;
  const maxCol = Math.max(...filteredSeats.map(s => s.col), 0) + 1;

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Row gutter={[16, 16]}>
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card className="stats-card">
                <div className="stat-value" style={{ color: stat.color }}>
                  {stat.icon} {stat.value}
                </div>
                <div className="stat-label">{stat.title}</div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={14}>
            <Card 
              title="座位状态" 
              loading={loading}
              extra={
                <Space>
                  <Select
                    value={selectedArea}
                    onChange={setSelectedArea}
                    style={{ width: 150 }}
                    placeholder="选择区域"
                  >
                    {areas.map(area => (
                      <Option key={area.id} value={area.id}>{area.name}</Option>
                    ))}
                  </Select>
                  <DatePicker 
                    value={selectedDate} 
                    onChange={setSelectedDate}
                  />
                </Space>
              }
            >
              <div 
                className="seat-grid" 
                style={{ 
                  gridTemplateColumns: `repeat(${Math.max(maxCol, 1)}, 1fr)`,
                }}
              >
                {Array.from({ length: maxRow }).map((_, rowIndex) =>
                  Array.from({ length: maxCol }).map((_, colIndex) => {
                    const seat = filteredSeats.find(
                      s => s.row === rowIndex && s.col === colIndex
                    );
                    if (!seat) {
                      return <div key={`${rowIndex}-${colIndex}`} style={{ visibility: 'hidden' }}></div>;
                    }
                    return (
                      <div
                        key={seat.id}
                        className={`seat-item ${seat.is_active ? (seat.is_available ? 'available' : 'occupied') : 'inactive'}`}
                        title={`${seat.seat_number} - ${seat.is_available ? '可用' : '已占用'}${seat.has_power ? ' | 有电源' : ''}${seat.has_window ? ' | 靠窗' : ''}`}
                      >
                        {seat.seat_number}
                      </div>
                    );
                  })
                )}
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 20, height: 20, background: '#d9f7be', border: '1px solid #95de64', borderRadius: 4 }}></div>
                  <span>可用</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 20, height: 20, background: '#ffccc7', border: '1px solid #ff7875', borderRadius: 4 }}></div>
                  <span>已占用</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 20, height: 20, background: '#e8e8e8', border: '1px solid #d9d9d9', borderRadius: 4 }}></div>
                  <span>未启用</span>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={10}>
            <Card 
              title="最近预约记录" 
              loading={loading}
              extra={
                <Button type="primary" size="small" icon={<PlusOutlined />}>
                  新建预约
                </Button>
              }
            >
              <Table
                columns={reservationColumns}
                dataSource={reservations}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
}

export default Dashboard;
