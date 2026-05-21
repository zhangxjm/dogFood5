import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, DatePicker, Button, message, Card, Row, Col, Space } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { employeeAPI } from '../services/api';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchEmployee();
    }
  }, [id]);

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await employeeAPI.getById(id);
      const employee = response.data;
      if (employee.birthDate) {
        employee.birthDate = dayjs(employee.birthDate);
      }
      if (employee.hireDate) {
        employee.hireDate = dayjs(employee.hireDate);
      }
      form.setFieldsValue(employee);
    } catch (error) {
      message.error('获取员工信息失败');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
        hireDate: values.hireDate ? values.hireDate.format('YYYY-MM-DD') : null,
      };

      if (isEdit) {
        await employeeAPI.update(id, data);
        message.success('更新成功');
      } else {
        await employeeAPI.create(data);
        message.success('创建成功');
      }
      navigate('/employees');
    } catch (error) {
      message.error(isEdit ? '更新失败' : '创建失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/employees')}>
          返回列表
        </Button>
        <h2 style={{ margin: 0 }}>{isEdit ? '编辑员工' : '新增员工'}</h2>
      </Space>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ status: '在职' }}
        >
          <div className="form-section">
            <h3 className="section-title">基本信息</h3>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="employeeNo"
                  label="员工编号"
                  rules={[{ required: true, message: '请输入员工编号' }]}
                >
                  <Input placeholder="请输入员工编号" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input placeholder="请输入姓名" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="gender" label="性别">
                  <Select placeholder="请选择性别">
                    <Option value="男">男</Option>
                    <Option value="女">女</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="birthDate" label="出生日期">
                  <DatePicker style={{ width: '100%' }} placeholder="请选择出生日期" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="idCard" label="身份证号">
                  <Input placeholder="请输入身份证号" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="phone" label="联系电话">
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="email" label="电子邮箱">
                  <Input placeholder="请输入电子邮箱" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="address" label="家庭住址">
                  <Input placeholder="请输入家庭住址" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="form-section">
            <h3 className="section-title">工作信息</h3>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="department" label="所属部门">
                  <Select placeholder="请选择部门">
                    <Option value="技术部">技术部</Option>
                    <Option value="市场部">市场部</Option>
                    <Option value="人事部">人事部</Option>
                    <Option value="财务部">财务部</Option>
                    <Option value="行政部">行政部</Option>
                    <Option value="销售部">销售部</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="position" label="职位">
                  <Input placeholder="请输入职位" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="hireDate" label="入职日期">
                  <DatePicker style={{ width: '100%' }} placeholder="请选择入职日期" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="status" label="员工状态">
                  <Select placeholder="请选择状态">
                    <Option value="在职">在职</Option>
                    <Option value="离职">离职</Option>
                    <Option value="休假">休假</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="education" label="学历">
                  <Select placeholder="请选择学历">
                    <Option value="高中">高中</Option>
                    <Option value="大专">大专</Option>
                    <Option value="本科">本科</Option>
                    <Option value="硕士">硕士</Option>
                    <Option value="博士">博士</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="major" label="专业">
                  <Input placeholder="请输入专业" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="form-section">
            <h3 className="section-title">备注</h3>
            <Form.Item name="remarks">
              <TextArea rows={4} placeholder="请输入备注信息" />
            </Form.Item>
          </div>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                保存
              </Button>
              <Button onClick={() => navigate('/employees')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EmployeeForm;
