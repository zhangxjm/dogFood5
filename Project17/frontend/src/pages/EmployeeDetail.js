import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Descriptions, Button, Card, Tabs, Table, Modal, Form, Input, Select, DatePicker, message, Space, Tag, Row, Col } from 'antd';
import { ArrowLeftOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { employeeAPI } from '../services/api';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [employmentRecords, setEmploymentRecords] = useState([]);
  const [positionChanges, setPositionChanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [positionModalVisible, setPositionModalVisible] = useState(false);
  const [recordForm] = Form.useForm();
  const [positionForm] = Form.useForm();

  useEffect(() => {
    fetchEmployeeDetail();
    fetchEmploymentRecords();
    fetchPositionChanges();
  }, [id]);

  const fetchEmployeeDetail = async () => {
    setLoading(true);
    try {
      const response = await employeeAPI.getById(id);
      setEmployee(response.data);
    } catch (error) {
      message.error('获取员工信息失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmploymentRecords = async () => {
    try {
      const response = await employeeAPI.getEmploymentRecords(id);
      setEmploymentRecords(response.data);
    } catch (error) {
      message.error('获取入职离职记录失败');
    }
  };

  const fetchPositionChanges = async () => {
    try {
      const response = await employeeAPI.getPositionChanges(id);
      setPositionChanges(response.data);
    } catch (error) {
      message.error('获取岗位调配记录失败');
    }
  };

  const handleAddRecord = async (values) => {
    try {
      const data = {
        ...values,
        recordDate: values.recordDate.format('YYYY-MM-DD'),
      };
      await employeeAPI.addEmploymentRecord(id, data);
      message.success('添加记录成功');
      setRecordModalVisible(false);
      recordForm.resetFields();
      fetchEmploymentRecords();
      fetchEmployeeDetail();
    } catch (error) {
      message.error('添加记录失败');
    }
  };

  const handleAddPositionChange = async (values) => {
    try {
      const data = {
        ...values,
        changeDate: values.changeDate.format('YYYY-MM-DD'),
      };
      await employeeAPI.addPositionChange(id, data);
      message.success('添加岗位调配成功');
      setPositionModalVisible(false);
      positionForm.resetFields();
      fetchPositionChanges();
      fetchEmployeeDetail();
    } catch (error) {
      message.error('添加岗位调配失败');
    }
  };

  const recordColumns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => {
        let color = 'blue';
        if (type === '入职') color = 'green';
        if (type === '离职') color = 'red';
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: '日期',
      dataIndex: 'recordDate',
      key: 'recordDate',
      width: 150,
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
    },
  ];

  const positionColumns = [
    {
      title: '变更日期',
      dataIndex: 'changeDate',
      key: 'changeDate',
      width: 150,
    },
    {
      title: '原部门',
      dataIndex: 'oldDepartment',
      key: 'oldDepartment',
      width: 120,
    },
    {
      title: '原职位',
      dataIndex: 'oldPosition',
      key: 'oldPosition',
      width: 120,
    },
    {
      title: '新部门',
      dataIndex: 'newDepartment',
      key: 'newDepartment',
      width: 120,
    },
    {
      title: '新职位',
      dataIndex: 'newPosition',
      key: 'newPosition',
      width: 120,
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
    },
  ];

  if (!employee) {
    return <div>加载中...</div>;
  }

  return (
    <div className="page-container">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/employees')}>
              返回列表
            </Button>
            <h2 style={{ margin: 0 }}>员工详情 - {employee.name}</h2>
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/employees/edit/${id}`)}
          >
            编辑信息
          </Button>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Descriptions title="基本信息" bordered column={3}>
          <Descriptions.Item label="员工编号">{employee.employeeNo}</Descriptions.Item>
          <Descriptions.Item label="姓名">{employee.name}</Descriptions.Item>
          <Descriptions.Item label="性别">{employee.gender}</Descriptions.Item>
          <Descriptions.Item label="出生日期">{employee.birthDate}</Descriptions.Item>
          <Descriptions.Item label="身份证号">{employee.idCard}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{employee.phone}</Descriptions.Item>
          <Descriptions.Item label="电子邮箱">{employee.email}</Descriptions.Item>
          <Descriptions.Item label="家庭住址" span={2}>{employee.address}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Descriptions title="工作信息" bordered column={3}>
          <Descriptions.Item label="所属部门">{employee.department}</Descriptions.Item>
          <Descriptions.Item label="职位">{employee.position}</Descriptions.Item>
          <Descriptions.Item label="入职日期">{employee.hireDate}</Descriptions.Item>
          <Descriptions.Item label="员工状态">
            <Tag color={employee.status === '离职' ? 'red' : 'green'}>{employee.status || '在职'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="学历">{employee.education}</Descriptions.Item>
          <Descriptions.Item label="专业">{employee.major}</Descriptions.Item>
          <Descriptions.Item label="备注" span={3}>{employee.remarks}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="入职离职记录" key="1">
            <Row justify="end" style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setRecordModalVisible(true)}
              >
                添加记录
              </Button>
            </Row>
            <Table
              columns={recordColumns}
              dataSource={employmentRecords}
              rowKey="id"
              pagination={false}
            />
          </TabPane>
          <TabPane tab="岗位调配记录" key="2">
            <Row justify="end" style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  positionForm.setFieldsValue({
                    oldDepartment: employee.department,
                    oldPosition: employee.position,
                    changeDate: dayjs(),
                  });
                  setPositionModalVisible(true);
                }}
              >
                添加调配
              </Button>
            </Row>
            <Table
              columns={positionColumns}
              dataSource={positionChanges}
              rowKey="id"
              pagination={false}
            />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="添加入职离职记录"
        open={recordModalVisible}
        onCancel={() => setRecordModalVisible(false)}
        footer={null}
      >
        <Form form={recordForm} layout="vertical" onFinish={handleAddRecord}>
          <Form.Item
            name="type"
            label="记录类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="请选择类型">
              <Option value="入职">入职</Option>
              <Option value="离职">离职</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="recordDate"
            label="日期"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="reason" label="原因">
            <TextArea rows={3} placeholder="请输入原因" />
          </Form.Item>
          <Form.Item name="remarks" label="备注">
            <TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={() => setRecordModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="添加岗位调配记录"
        open={positionModalVisible}
        onCancel={() => setPositionModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={positionForm} layout="vertical" onFinish={handleAddPositionChange}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="oldDepartment" label="原部门">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="oldPosition" label="原职位">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="newDepartment"
                label="新部门"
                rules={[{ required: true, message: '请输入新部门' }]}
              >
                <Input placeholder="请输入新部门" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="newPosition"
                label="新职位"
                rules={[{ required: true, message: '请输入新职位' }]}
              >
                <Input placeholder="请输入新职位" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="changeDate"
            label="变更日期"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="reason" label="调配原因">
            <TextArea rows={3} placeholder="请输入调配原因" />
          </Form.Item>
          <Form.Item name="remarks" label="备注">
            <TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={() => setPositionModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeDetail;
