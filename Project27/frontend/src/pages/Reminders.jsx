import React, { useEffect, useState } from 'react';
import { List, Card, Tag, Space, message, Select, Typography, Alert } from 'antd';
import { ClockCircleOutlined, GiftOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { giftApi } from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(7);

  useEffect(() => {
    loadReminders();
  }, [days]);

  const loadReminders = async () => {
    setLoading(true);
    try {
      const response = await giftApi.getReminders(days);
      setReminders(response.data);
    } catch (error) {
      message.error('加载提醒失败');
    } finally {
      setLoading(false);
    }
  };

  const getDaysDiff = (date) => {
    const diff = dayjs(date).diff(dayjs(), 'day');
    return diff;
  };

  const getUrgencyColor = (date) => {
    const diff = getDaysDiff(date);
    if (diff <= 1) return 'red';
    if (diff <= 3) return 'orange';
    return 'blue';
  };

  const getUrgencyText = (date) => {
    const diff = getDaysDiff(date);
    if (diff === 0) return '今天';
    if (diff === 1) return '明天';
    return `${diff}天后`;
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>送礼提醒</Title>
        <Select
          value={days}
          onChange={setDays}
          style={{ width: 150 }}
        >
          <Option value={3}>未来3天</Option>
          <Option value={7}>未来7天</Option>
          <Option value={14}>未来14天</Option>
          <Option value={30}>未来30天</Option>
        </Select>
      </div>

      {reminders.length === 0 && !loading && (
        <Alert
          message="暂无提醒"
          description={`未来${days}天内没有需要送出的礼品`}
          type="info"
          showIcon
        />
      )}

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
        dataSource={reminders}
        loading={loading}
        renderItem={(item) => (
          <List.Item>
            <Card>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Title level={4} style={{ margin: 0 }}>{item.name}</Title>
                  <Tag color={getUrgencyColor(item.giftDate)} icon={<ClockCircleOutlined />}>
                    {getUrgencyText(item.giftDate)}
                  </Tag>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <UserOutlined />
                  <Text strong>{item.recipient}</Text>
                </div>

                {item.recipientNote && (
                  <Text type="secondary" italic>"{item.recipientNote}"</Text>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <GiftOutlined />
                  <Text>{item.occasion}</Text>
                </div>

                <div>
                  <Text type="secondary">
                    送礼日期：{dayjs(item.giftDate).format('YYYY-MM-DD')}
                  </Text>
                </div>

                <Tag color={
                  item.status === '待购买' ? 'orange' :
                  item.status === '已购买' ? 'green' : 'purple'
                }>
                  {item.status}
                </Tag>
              </Space>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Reminders;
