import React, { useEffect, useState } from 'react';
import { Table, Tag, message, Button, Space, Select, Row, Col, Modal, Form, Input } from 'antd';
import { GiftOutlined, HistoryOutlined, UndoOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { giftApi } from '../services/api';

const { Option } = Select;

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ category: '', recipient: '' });
  const [recipients, setRecipients] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentGift, setCurrentGift] = useState(null);
  const [form] = Form.useForm();

  const categories = ['电子产品', '服饰', '食品', '书籍', '化妆品', '家居', '运动', '其他'];

  useEffect(() => {
    loadHistory();
    loadRecipients();
  }, [filters]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const params = { ...filters, isHistory: true };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      const response = await giftApi.getAll(params);
      setHistory(response.data);
    } catch (error) {
      message.error('加载历史记录失败');
    } finally {
      setLoading(false);
    }
  };

  const loadRecipients = async () => {
    try {
      const response = await giftApi.getRecipients();
      setRecipients(response.data);
    } catch (error) {
      console.error('加载收礼人列表失败');
    }
  };

  const handleMoveToHistory = (record) => {
    setCurrentGift(record);
    form.setFieldsValue({
      recipientNote: record.recipientNote,
    });
    setModalVisible(true);
  };

  const handleConfirmHistory = async (values) => {
    try {
      await giftApi.update(currentGift._id, {
        isHistory: true,
        status: '已送出',
        recipientNote: values.recipientNote,
      });
      message.success('已移至历史记录');
      setModalVisible(false);
      loadHistory();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleRestore = async (id) => {
    try {
      await giftApi.update(id, { isHistory: false });
      message.success('已恢复到礼品清单');
      loadHistory();
    } catch (error) {
      message.error('恢复失败');
    }
  };

  const columns = [
    {
      title: '礼品名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <HistoryOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (text) => <Tag color="blue">{text}</Tag>,
      filters: categories.map(cat => ({ text: cat, value: cat })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (text) => text ? `¥${text}` : '-',
    },
    {
      title: '收礼人',
      dataIndex: 'recipient',
      key: 'recipient',
    },
    {
      title: '备注',
      dataIndex: 'recipientNote',
      key: 'recipientNote',
      ellipsis: true,
    },
    {
      title: '节日/场合',
      dataIndex: 'occasion',
      key: 'occasion',
    },
    {
      title: '送礼日期',
      dataIndex: 'giftDate',
      key: 'giftDate',
      render: (text) => dayjs(text).format('YYYY-MM-DD'),
      sorter: (a, b) => dayjs(a.giftDate).unix() - dayjs(b.giftDate).unix(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<UndoOutlined />}
          onClick={() => handleRestore(record._id)}
        >
          恢复
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>历史记录</h2>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8} md={6}>
          <Select
            placeholder="按分类筛选"
            style={{ width: '100%' }}
            allowClear
            value={filters.category || undefined}
            onChange={(value) => setFilters({ ...filters, category: value || '' })}
          >
            {categories.map(cat => (
              <Option key={cat} value={cat}>{cat}</Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Select
            placeholder="按收礼人筛选"
            style={{ width: '100%' }}
            allowClear
            value={filters.recipient || undefined}
            onChange={(value) => setFilters({ ...filters, recipient: value || '' })}
          >
            {recipients.map(rec => (
              <Option key={rec} value={rec}>{rec}</Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={history}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="移至历史记录"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleConfirmHistory}
        >
          <p>确认将 "{currentGift?.name}" 标记为已送出并移至历史记录？</p>
          
          <Form.Item
            name="recipientNote"
            label="添加备注（可选）"
          >
            <Input.TextArea rows={3} placeholder="记录送礼后的感想或备注" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              确认
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default History;
