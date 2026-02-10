'use client';

import React from 'react';
import { Card, Typography, Row, Col, Table, Button, Tag, Space, Modal, Form, Input, Select, App } from 'antd';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function CustomDashboardPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const savedDashboards = [
    { id: 1, name: 'Executive Overview', widgets: ['patientStats', 'revenue', 'occupancy', 'quality'], createdBy: 'Admin', createdDate: '2024-01-15', views: 245 },
    { id: 2, name: 'Clinical Operations', widgets: ['admissions', 'discharges', 'mortality', 'readmissions'], createdBy: 'Medical Director', createdDate: '2024-01-20', views: 189 },
    { id: 3, name: 'Financial Summary', widgets: ['revenue', 'expenses', 'profitability', 'receivables'], createdBy: 'CFO', createdDate: '2024-01-18', views: 156 },
    { id: 4, name: 'Nursing Management', widgets: ['staffing', 'patientAcuity', 'falls', 'pressureInjuries'], createdBy: 'Nursing Director', createdDate: '2024-01-22', views: 98 },
  ];

  const availableWidgets = [
    { id: 'patientStats', name: 'Patient Statistics', category: 'Clinical', icon: '👥' },
    { id: 'revenue', name: 'Revenue Tracker', category: 'Financial', icon: '💰' },
    { id: 'occupancy', name: 'Bed Occupancy', category: 'Operations', icon: '🛏️' },
    { id: 'admissions', name: 'Admissions Rate', category: 'Clinical', icon: '📥' },
    { id: 'quality', name: 'Quality Metrics', category: 'Quality', icon: '⭐' },
    { id: 'expenses', name: 'Operating Expenses', category: 'Financial', icon: '💸' },
    { id: 'mortality', name: 'Mortality Rate', category: 'Clinical', icon: '📊' },
    { id: 'readmissions', name: 'Readmission Rate', category: 'Quality', icon: '🔄' },
    { id: 'profitability', name: 'Profitability Analysis', category: 'Financial', icon: '📈' },
    { id: 'receivables', name: 'Accounts Receivable', category: 'Financial', icon: '💳' },
    { id: 'staffing', name: 'Staffing Levels', category: 'HR', icon: '👥' },
    { id: 'patientAcuity', name: 'Patient Acuity', category: 'Clinical', icon: '🏥' },
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Dashboard Name', dataIndex: 'name', key: 'name' },
    { title: 'Widgets', dataIndex: 'widgets', key: 'widgets', render: (widgets: string[]) => <Space wrap>{widgets.map(w => <Tag key={w}>{w}</Tag>)}</Space> },
    { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy' },
    { title: 'Created Date', dataIndex: 'createdDate', key: 'createdDate' },
    { title: 'Views', dataIndex: 'views', key: 'views' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">View</Button>
          <Button type="link" size="small" icon={<SettingOutlined />}>Edit</Button>
        </Space>
      )},
  ];

  const handleCreate = () => {
    form.validateFields().then((values) => {
      message.success('Custom dashboard created successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Title level={3}>Custom Dashboards</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Create Dashboard
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{savedDashboards.length}</div>
              <div className="text-gray-500">Saved Dashboards</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{savedDashboards.reduce((sum, d) => sum + d.views, 0)}</div>
              <div className="text-gray-500">Total Views</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{availableWidgets.length}</div>
              <div className="text-gray-500">Available Widgets</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">3</div>
              <div className="text-gray-500">Widget Categories</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="My Dashboards" style={{ marginBottom: '24px' }}>
        <Table dataSource={savedDashboards} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Card title="Available Widgets">
        <Row gutter={[16, 16]}>
          {availableWidgets.map((widget) => (
            <Col span={6} key={widget.id}>
              <Card size="small" hoverable style={{ cursor: 'pointer' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{widget.icon}</span>
                  <span className="font-medium">{widget.name}</span>
                </div>
                <Tag color="blue">{widget.category}</Tag>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Modal
        title="Create Custom Dashboard"
        open={isModalVisible}
        onOk={handleCreate}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Dashboard Name" rules={[{ required: true }]}>
            <Input placeholder="Enter dashboard name" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Brief description of this dashboard" />
          </Form.Item>
          <Form.Item name="widgets" label="Select Widgets" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="Choose widgets for your dashboard">
              {availableWidgets.map(widget => (
                <Select.Option key={widget.id} value={widget.id}>{widget.icon} {widget.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="layout" label="Layout">
            <Select placeholder="Choose layout style">
              <Select.Option value="grid">Grid Layout</Select.Option>
              <Select.Option value="list">List Layout</Select.Option>
              <Select.Option value="tabs">Tabbed Layout</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="refresh" label="Auto-Refresh">
            <Select placeholder="Select refresh interval">
              <Select.Option value="manual">Manual</Select.Option>
              <Select.Option value="5min">Every 5 minutes</Select.Option>
              <Select.Option value="15min">Every 15 minutes</Select.Option>
              <Select.Option value="1hour">Every hour</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
