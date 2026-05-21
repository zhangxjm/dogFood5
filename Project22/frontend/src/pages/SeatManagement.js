import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Space, message, Popconfirm, Select, Card, Row, Col, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { seatAPI, areaAPI } from '../services/api';
import dayjs from 'dayjs';

const { Option } = Select;

function SeatManagement() {
  const [seats, setSeats] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSeat, setEditingSeat] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [seatsRes, areasRes] = await Promise.all([
        seatAPI.getAll(),
        areaAPI.getAll(),
      ]);
      setSeats(seatsRes.data);
      setAreas(areasRes.data);
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSeat(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingSeat(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await seatAPI.delete(id);
      message.success('删除成功');
      loadData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingSeat) {
        await seatAPI.update(editingSeat.id, values);
        message.success('更新成功');
      } else {
        await seatAPI.create(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadData();
    } catch (error) {
      if (error.errorFields) {
        message.error('请填写完整信息');
      } else {
        message.error(editingSeat ? '更新失败' : '创建失败');
      }
    }
  };

  const activeSeats = seats.filter(s => s.is_active).length;
  const inactiveSeats = seats.filter(s => !s.is_active).length;

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '座位号',
      dataIndex: 'seat_number',
      key: 'seat_number',
    },
    {
      title: '所属区域',
      dataIndex: 'area_id',
      key: 'area_id',
      render: (areaId) => {
        const area = areas.find(a => a.id === areaId);
        return area?.name || '-';
      },
    },
    {
      title: '位置',
      key: 'position',
      render: (_, record) => `行 ${record.row + 1}, 列 ${record.col + 1}`,
    },
    {
      title: '电源',
      dataIndex: 'has_power',
      key: 'has_power',
      render: (has) => has ? '是' : '否',
    },
    {
      title: '靠窗',
      dataIndex: 'has_window',
      key: 'has_window',
      render: (has) => has ? '是' : '否',
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active) => (
        <Switch checked={active} disabled />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (t) => dayjs(t).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个座位吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总座位数"
              value={seats.length}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已启用"
              value={activeSeats}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="未启用"
              value={inactiveSeats}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增座位
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={seats}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingSeat ? '编辑座位' : '新增座位'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="seat_number"
            label="座位号"
            rules={[{ required: true, message: '请输入座位号' }]}
          >
            <Input placeholder="例如：A01" />
          </Form.Item>
          <Form.Item
            name="area_id"
            label="所属区域"
            rules={[{ required: true, message: '请选择区域' }]}
          >
            <Select placeholder="请选择区域">
              {areas.map(area => (
                <Option key={area.id} value={area.id}>{area.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="row"
                label="行号"
                rules={[{ required: true, message: '请输入行号' }]}
              >
                <Input type="number" placeholder="从0开始" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="col"
                label="列号"
                rules={[{ required: true, message: '请输入列号' }]}
              >
                <Input type="number" placeholder="从0开始" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name="has_power" label="是否有电源" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="has_window" label="是否靠窗" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="is_active" label="是否启用" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default SeatManagement;
