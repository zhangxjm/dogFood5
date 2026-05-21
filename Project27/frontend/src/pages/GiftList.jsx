import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Space,
  Tag,
  message,
  Popconfirm,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { giftApi } from '../services/api';

const { Option } = Select;
const { TextArea } = Input;

const categories = ['电子产品', '服饰', '食品', '书籍', '化妆品', '家居', '运动', '其他'];
const statuses = ['待购买', '已购买', '已送出'];

const GiftList = () => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ category: '', status: '', recipient: '' });
  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    loadGifts();
    loadRecipients();
  }, [filters]);

  const loadGifts = async () => {
    setLoading(true);
    try {
      const params = { ...filters, isHistory: false };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      const response = await giftApi.getAll(params);
      setGifts(response.data);
    } catch (error) {
      message.error('加载礼品列表失败');
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

  const handleAdd = () => {
    setEditingGift(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingGift(record);
    form.setFieldsValue({
      ...record,
      giftDate: dayjs(record.giftDate),
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await giftApi.delete(id);
      message.success('删除成功');
      loadGifts();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const data = {
        ...values,
        giftDate: values.giftDate.toISOString(),
      };
      if (editingGift) {
        await giftApi.update(editingGift._id, data);
        message.success('更新成功');
      } else {
        await giftApi.create(data);
        message.success('添加成功');
      }
      setModalVisible(false);
      loadGifts();
      loadRecipients();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: '礼品名称',
      dataIndex: 'name',
      key: 'name',
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap = {
          '待购买': 'orange',
          '已购买': 'green',
          '已送出': 'purple',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
      filters: statuses.map(s => ({ text: s, value: s })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个礼品吗？"
            onConfirm={() => handleDelete(record._id)}
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>礼品清单</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加礼品
        </Button>
      </div>

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
        dataSource={gifts}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingGift ? '编辑礼品' : '添加礼品'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="礼品名称"
            rules={[{ required: true, message: '请输入礼品名称' }]}
          >
            <Input placeholder="请输入礼品名称" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="分类"
                rules={[{ required: true, message: '请选择分类' }]}
              >
                <Select placeholder="请选择分类">
                  {categories.map(cat => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="价格"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="请输入价格"
                  prefix="¥"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="recipient"
                label="收礼人"
                rules={[{ required: true, message: '请输入收礼人' }]}
              >
                <Input placeholder="请输入收礼人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="occasion"
                label="节日/场合"
                rules={[{ required: true, message: '请输入节日或场合' }]}
              >
                <Input placeholder="如：生日、春节、圣诞节" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="recipientNote"
            label="收礼人备注"
          >
            <TextArea rows={2} placeholder="对收礼人的备注信息" />
          </Form.Item>

          <Form.Item
            name="description"
            label="礼品描述"
          >
            <TextArea rows={2} placeholder="礼品的详细描述" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="giftDate"
                label="送礼日期"
                rules={[{ required: true, message: '请选择送礼日期' }]}
              >
                <DatePicker style={{ width: '100%' }} placeholder="请选择日期" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                initialValue="待购买"
              >
                <Select placeholder="请选择状态">
                  {statuses.map(s => (
                    <Option key={s} value={s}>{s}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              {editingGift ? '更新' : '添加'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GiftList;
