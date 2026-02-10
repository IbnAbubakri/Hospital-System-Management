'use client';

import React from 'react';
import { Card, Typography, Button, Tag, Space, Modal, Form, Input, Select, App } from 'antd';
import { ApiOutlined, LinkOutlined, DisconnectOutlined } from '@ant-design/icons';
import { PageShell } from '@/components/design-system/PageShell';
import { StatCard } from '@/components/design-system/StatCard';
import { ModernTable } from '@/components/design-system/ModernTable';
import { SearchFilterBar } from '@/components/design-system/SearchFilterBar';
import { StatusTag } from '@/components/design-system/StatusTag';
import { GradientButton } from '@/components/design-system/GradientButton';
import { InfoCard } from '@/components/design-system/InfoCard';

const { Title } = Typography;

export default function IntegrationsPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const integrations = [
    {
      id: 1,
      name: 'NHIA Integration',
      category: 'Insurance',
      status: 'Connected',
      description: 'National Health Insurance Authority integration for claims processing',
      lastSync: '2024-02-05 14:25:00',
      apiKey: 'nhia_live_***xyz123'},
    {
      id: 2,
      name: 'Payment Gateway',
      category: 'Payments',
      status: 'Connected',
      description: 'Paystack/Flutterwave payment processing',
      lastSync: '2024-02-05 14:20:00',
      apiKey: 'pk_live_***abc456'},
    {
      id: 3,
      name: 'SMS Provider',
      category: 'Communications',
      status: 'Connected',
      description: 'Bulk SMS service for notifications',
      lastSync: '2024-02-05 14:15:00',
      apiKey: 'sms_key_***def789'},
    {
      id: 4,
      name: 'LIS Integration',
      category: 'Laboratory',
      status: 'Connected',
      description: 'Laboratory Information System connection',
      lastSync: '2024-02-05 14:10:00',
      apiKey: 'lis_api_***ghi012'},
    {
      id: 5,
      name: 'PACS Integration',
      category: 'Radiology',
      status: 'Disconnected',
      description: 'Picture Archiving and Communication System',
      lastSync: '2024-02-04 18:30:00',
      apiKey: 'pacs_key_***jkl345'},
    {
      id: 6,
      name: 'Email Service',
      category: 'Communications',
      status: 'Connected',
      description: 'Transactional email service',
      lastSync: '2024-02-05 14:05:00',
      apiKey: 'smtp_key_***mno678'},
    {
      id: 7,
      name: 'HMO Portal',
      category: 'Insurance',
      status: 'Connected',
      description: 'HMO verification and authorization portal',
      lastSync: '2024-02-05 14:00:00',
      apiKey: 'hmo_api_***pqr901'},
  ];

  const apiLogs = [
    { id: 1, integration: 'NHIA Integration', endpoint: '/verify/enrollee', method: 'POST', status: 'Success', responseTime: '245ms', timestamp: '2024-02-05 14:25:30' },
    { id: 2, integration: 'Payment Gateway', endpoint: '/transactions/initialize', method: 'POST', status: 'Success', responseTime: '380ms', timestamp: '2024-02-05 14:20:15' },
    { id: 3, integration: 'SMS Provider', endpoint: '/sms/send', method: 'POST', status: 'Success', responseTime: '890ms', timestamp: '2024-02-05 14:15:45' },
    { id: 4, integration: 'PACS Integration', endpoint: '/images/retrieve', method: 'GET', status: 'Failed', responseTime: '5000ms', timestamp: '2024-02-05 14:10:22' },
    { id: 5, integration: 'LIS Integration', endpoint: '/results/sync', method: 'POST', status: 'Success', responseTime: '156ms', timestamp: '2024-02-05 14:05:10' },
  ];

  const connectedCount = integrations.filter(i => i.status === 'Connected').length;
  const successRate = Math.round((apiLogs.filter(l => l.status === 'Success').length / apiLogs.length) * 100);

  const integrationColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Integration Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat: string) => <Tag color="blue">{cat}</Tag> },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <StatusTag status={status.toLowerCase()} type="patient" />
      )},
    { title: 'Last Sync', dataIndex: 'lastSync', key: 'lastSync' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">Configure</Button>
          <Button type="link" size="small">Test</Button>
          <Button type="link" size="small" danger>Disconnect</Button>
        </Space>
      )},
  ];

  const logColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Integration', dataIndex: 'integration', key: 'integration' },
    { title: 'Endpoint', dataIndex: 'endpoint', key: 'endpoint', render: (endpoint: string) => <code>{endpoint}</code> },
    { title: 'Method', dataIndex: 'method', key: 'method', render: (method: string) => <Tag color={method === 'POST' ? 'blue' : 'green'}>{method}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <StatusTag status={status.toLowerCase()} type="patient" /> },
    { title: 'Response Time', dataIndex: 'responseTime', key: 'responseTime' },
    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
  ];

  const handleAddIntegration = () => {
    form.validateFields().then((values) => {
      message.success('Integration added successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <PageShell
      title="Third-Party Integrations"
      subtitle="Manage external system connections and APIs"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Integrations"
          value={integrations.length}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Connected"
          value={connectedCount}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="API Calls Today"
          value={1.2}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={2}
          suffix="K"
        />
        <StatCard
          label="Success Rate"
          value={successRate}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={3}
          suffix="%"
        />
      </div>

      <div className="mb-6">
        <InfoCard title="Active Integrations">
        <ModernTable
          dataSource={integrations}
          columns={integrationColumns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        </InfoCard>
      </div>

      <InfoCard title="API Activity Logs">
        <ModernTable
          dataSource={apiLogs}
          columns={logColumns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </InfoCard>

      <Modal
        title="Add New Integration"
        open={isModalVisible}
        onOk={handleAddIntegration}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Integration Name" rules={[{ required: true }]}>
            <Input placeholder="Enter integration name" />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select category">
              <Select.Option value="Insurance">Insurance</Select.Option>
              <Select.Option value="Payments">Payments</Select.Option>
              <Select.Option value="Communications">Communications</Select.Option>
              <Select.Option value="Laboratory">Laboratory</Select.Option>
              <Select.Option value="Radiology">Radiology</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
          <Form.Item name="apiKey" label="API Key" rules={[{ required: true }]}>
            <Input placeholder="Enter API key" type="password" />
          </Form.Item>
          <Form.Item name="endpoint" label="API Endpoint">
            <Input placeholder="https://api.example.com" />
          </Form.Item>
        </Form>
      </Modal>

      <div className="fixed bottom-6 right-6">
        <GradientButton
          icon={<ApiOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Integration
        </GradientButton>
      </div>
    </PageShell>
  );
}
