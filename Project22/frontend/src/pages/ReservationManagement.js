import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Space, message, Popconfirm, Select, Card, Tag, Row, Col } from 'antd';
import { PlusOutlined, CloseOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { reservationAPI, seatAPI, areaAPI, userAPI } from '../services/api';
import dayjs from 'dayjs';

const { Option } = Select;

function ReservationManagement({ currentUser }) {
  const [reservations, setReservations] = useState([]);
  const [seats, setSeats] = useState([]);
  const [areas, setAreas] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [reservationsRes, seatsRes, areasRes, usersRes] = await Promise.all([
        reservationAPI.getAll(),
        seatAPI.getWithStatus(),
        areaAPI.getAll(),
        userAPI.getAll(),
      ]);
      setReservations(reservationsRes.data);
      setSeats(seatsRes.data);
      setAreas(areasRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const loadTimeSlots = async (seatId) => {
    if (!seatId) return;
    try {
      const today = dayjs().format('YYYY-MM-DD');
      const response = await seatAPI.getTimeSlots(seatId, today);
      setTimeSlots(response.data);
    } catch (error) {
      message.error('加载时间段失败');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedSeat) {
      loadTimeSlots(selectedSeat);
    } else {
      setTimeSlots([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeat]);

  const handleAdd = () => {
    setSelectedArea(null);
    setSelectedSeat(null);
    setSelectedSlots([]);
    form.resetFields();
    setModalVisible(true);
  };

  const handleCancel = async (id) => {
    try {
      await reservationAPI.cancel(id);
      message.success('取消成功');
      loadData();
    } catch (error) {
      message.error('取消失败');
    }
  };

  const handleCheckIn = async (id) => {
    try {
      await reservationAPI.checkIn(id);
      message.success('签到成功');
      loadData();
    } catch (error) {
      message.error('签到失败');
    }
  };

  const handleSlotClick = (slot) => {
    if (!slot.is_available) return;
    
    const isSelected = selectedSlots.some(s => 
      s.start_time === slot.start_time && s.end_time === slot.end_time
    );
    
    if (isSelected) {
      setSelectedSlots(selectedSlots.filter(s => 
        !(s.start_time === slot.start_time && s.end_time === slot.end_time)
      ));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleSubmit = async () => {
    if (selectedSlots.length === 0) {
      message.error('请选择预约时间段');
      return;
    }
    
    try {
      const sortedSlots = [...selectedSlots].sort((a, b) => 
        dayjs(a.start_time).unix() - dayjs(b.start_time).unix()
      );
      
      const reservationData = {
        seat_id: selectedSeat,
        user_id: currentUser?.id || 1,
        start_time: sortedSlots[0].start_time,
        end_time: sortedSlots[sortedSlots.length - 1].end_time,
      };
      
      await reservationAPI.create(reservationData);
      message.success('预约成功');
      setModalVisible(false);
      setSelectedSlots([]);
      loadData();
    } catch (error) {
      message.error(error.response?.data?.detail || '预约失败，该时间段可能已被占用');
    }
  };

  const getStatusTag = (record) => {
    if (record.is_cancelled) {
      return <Tag color="red">已取消</Tag>;
    }
    if (record.check_in_time) {
      return <Tag color="green">已签到</Tag>;
    }
    if (dayjs().isAfter(dayjs(record.start_time).add(15, 'minute'))) {
      return <Tag color="orange">已超时</Tag>;
    }
    return <Tag color="blue">已预约</Tag>;
  };

  const filteredSeats = selectedArea 
    ? seats.filter(s => s.area_id === selectedArea && s.is_active && s.is_available) 
    : seats.filter(s => s.is_active && s.is_available);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '座位号',
      dataIndex: 'seat_id',
      key: 'seat_id',
      render: (seatId) => {
        const seat = seats.find(s => s.id === seatId);
        return seat?.seat_number || '-';
      },
    },
    {
      title: '用户',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (userId) => {
        const user = users.find(u => u.id === userId);
        return user?.full_name || user?.username || '-';
      },
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
      title: '签到时间',
      dataIndex: 'check_in_time',
      key: 'check_in_time',
      render: (t) => t ? dayjs(t).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => getStatusTag(record),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {!record.is_cancelled && !record.check_in_time && (
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={() => handleCheckIn(record.id)}
            >
              签到
            </Button>
          )}
          {!record.is_cancelled && (
            <Popconfirm
              title="确定要取消这个预约吗？"
              onConfirm={() => handleCancel(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger icon={<CloseOutlined />}>
                取消
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>预约管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建预约
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={reservations}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title="新建预约"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
        okText="确认预约"
      >
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="area_id"
                label="选择区域"
                rules={[{ required: true, message: '请选择区域' }]}
              >
                <Select
                  placeholder="请选择区域"
                  value={selectedArea}
                  onChange={(value) => {
                    setSelectedArea(value);
                    setSelectedSeat(null);
                    setSelectedSlots([]);
                  }}
                >
                  {areas.map(area => (
                    <Option key={area.id} value={area.id}>{area.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="seat_id"
                label="选择座位"
                rules={[{ required: true, message: '请选择座位' }]}
              >
                <Select
                  placeholder="请先选择区域"
                  value={selectedSeat}
                  onChange={(value) => {
                    setSelectedSeat(value);
                    setSelectedSlots([]);
                  }}
                  disabled={!selectedArea}
                >
                  {filteredSeats.map(seat => (
                    <Option key={seat.id} value={seat.id}>
                      {seat.seat_number}
                      {seat.has_power ? ' | 有电源' : ''}
                      {seat.has_window ? ' | 靠窗' : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {selectedSeat && (
            <Card title="选择时间段（8:00-22:00，点击选择连续时段）" size="small">
              <div className="time-slots">
                {timeSlots.map((slot, index) => {
                  const isSelected = selectedSlots.some(s => 
                    s.start_time === slot.start_time && s.end_time === slot.end_time
                  );
                  return (
                    <div
                      key={index}
                      className={`time-slot ${slot.is_available ? 'available' : 'occupied'} ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSlotClick(slot)}
                    >
                      {dayjs(slot.start_time).format('HH:mm')}
                    </div>
                  );
                })}
              </div>
              {selectedSlots.length > 0 && (
                <div style={{ marginTop: 16, padding: 8, background: '#e6f7ff', borderRadius: 4 }}>
                  已选择：{selectedSlots.sort((a, b) => 
                    dayjs(a.start_time).unix() - dayjs(b.start_time).unix()
                  ).map(s => dayjs(s.start_time).format('HH:mm')).join(' ~ ')}
                </div>
              )}
            </Card>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default ReservationManagement;
