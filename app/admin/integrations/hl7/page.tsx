'use client';

import React, { useState } from 'react';
import { Card, Typography, Button, Space, Row, Col, Tag, Form, Input, Select, Switch, App, Modal } from 'antd';
import { ApiOutlined, LinkOutlined, SyncOutlined, PlusOutlined } from '@ant-design/icons';
import { PageShell } from '@/components/design-system/PageShell';
import { StatCard } from '@/components/design-system/StatCard';
import { ModernTable } from '@/components/design-system/ModernTable';
import { StatusTag } from '@/components/design-system/StatusTag';
import { GradientButton } from '@/components/design-system/GradientButton';
import { InfoCard } from '@/components/design-system/InfoCard';

const { Title, Text } = Typography;

interface HL7Endpoint {
  id: string;
  name: string;
  messageType: string;
  triggerEvent: string;
  destination: string;
  port: number;
  status: 'Connected' | 'Disconnected' | 'Error';
  lastMessage: string;
  messagesToday: number;
}

interface HL7Message {
  id: string;
  timestamp: string;
  messageType: string;
  event: string;
  status: 'Success' | 'Failed';
  processingTime: string;
}

export default function HL7IntegrationPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { message } = App.useApp();
  const [testingConnection, setTestingConnection] = useState(false);
  const [form] = Form.useForm();

  const [endpoints] = useState<HL7Endpoint[]>([
    {
      id: '1',
      name: 'ADT Admission',
      messageType: 'ADT^A01',
      triggerEvent: 'Admit Patient',
      destination: '10.0.1.50',
      port: 2575,
      status: 'Connected',
      lastMessage: '2 minutes ago',
      messagesToday: 245},
    {
      id: '2',
      name: 'ADT Discharge',
      messageType: 'ADT^A03',
      triggerEvent: 'Discharge Patient',
      destination: '10.0.1.50',
      port: 2575,
      status: 'Connected',
      lastMessage: '15 minutes ago',
      messagesToday: 128},
    {
      id: '3',
      name: 'Lab Orders',
      messageType: 'ORM^O01',
      triggerEvent: 'Send Lab Order',
      destination: '10.0.1.60',
      port: 2575,
      status: 'Connected',
      lastMessage: '5 minutes ago',
      messagesToday: 89},
    {
      id: '4',
      name: 'Lab Results',
      messageType: 'ORU^R01',
      triggerEvent: 'Receive Results',
      destination: '10.0.1.60',
      port: 2575,
      status: 'Connected',
      lastMessage: '1 minute ago',
      messagesToday: 312},
    {
      id: '5',
      name: 'Pharmacy Orders',
      messageType: 'ORM^O01',
      triggerEvent: 'Send Prescription',
      destination: '10.0.1.70',
      port: 2575,
      status: 'Error',
      lastMessage: '2 hours ago',
      messagesToday: 45},
  ]);

  const [messages] = useState<HL7Message[]>([
    { id: '1', timestamp: '2024-02-05 14:25:30', messageType: 'ADT^A01', event: 'Admit Patient', status: 'Success', processingTime: '45ms' },
    { id: '2', timestamp: '2024-02-05 14:24:15', messageType: 'ORU^R01', event: 'Lab Result', status: 'Success', processingTime: '38ms' },
    { id: '3', timestamp: '2024-02-05 14:23:00', messageType: 'ORM^O01', event: 'Lab Order', status: 'Success', processingTime: '52ms' },
    { id: '4', timestamp: '2024-02-05 14:22:45', messageType: 'ADT^A03', event: 'Discharge Patient', status: 'Success', processingTime: '41ms' },
    { id: '5', timestamp: '2024-02-05 14:20:30', messageType: 'ORM^O01', event: 'Prescription', status: 'Failed', processingTime: '5000ms' },
  ]);

  const endpointColumns = [
    { title: 'Endpoint Name', dataIndex: 'name', key: 'name' },
    { title: 'Message Type', dataIndex: 'messageType', key: 'messageType', render: (type: string) => <code>{type}</code> },
    { title: 'Trigger Event', dataIndex: 'triggerEvent', key: 'triggerEvent' },
    {
      title: 'Destination',
      key: 'destination',
      render: (_: any, record: HL7Endpoint) => (
        <span>{record.destination}:{record.port}</span>
      )},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status.toLowerCase()} type="patient" />},
    { title: 'Messages Today', dataIndex: 'messagesToday', key: 'messagesToday' },
    { title: 'Last Message', dataIndex: 'lastMessage', key: 'lastMessage' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">Test</Button>
          <Button type="link" size="small">Configure</Button>
        </Space>
      )},
  ];

  const messageColumns = [
    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
    {
      title: 'Message Type',
      dataIndex: 'messageType',
      key: 'messageType',
      render: (type: string) => <code>{type}</code>},
    { title: 'Event', dataIndex: 'event', key: 'event' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status.toLowerCase()} type="patient" />},
    { title: 'Processing Time', dataIndex: 'processingTime', key: 'processingTime' },
  ];

  const stats = {
    totalEndpoints: endpoints.length,
    connected: endpoints.filter((e: any) => e.status === 'Connected').length,
    totalMessages: endpoints.reduce((sum, e) => sum + e.messagesToday, 0),
    avgProcessingTime: 42};

  const handleTestConnection = () => {
    setTestingConnection(true);
    setTimeout(() => {
      setTestingConnection(false);
      message.success('Connection test successful!');
    }, 2000);
  };

  return (
    <PageShell
      title="HL7 Integration Configuration"
      subtitle="Manage Health Level Seven messaging endpoints"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Endpoints"
          value={stats.totalEndpoints}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Connected"
          value={stats.connected}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="Messages Today"
          value={stats.totalMessages}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={2}
        />
        <StatCard
          label="Avg Processing"
          value={stats.avgProcessingTime}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={3}
          suffix="ms"
        />
      </div>

      <InfoCard
        title="HL7 Endpoints"
      >
        <ModernTable
          dataSource={endpoints}
          columns={endpointColumns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </InfoCard>

      <div className="mt-6">
        <InfoCard title="Recent Message Log">
        <ModernTable
          dataSource={messages}
          columns={messageColumns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        </InfoCard>
      </div>

      <Modal
        title="Add HL7 Endpoint"
        open={isModalVisible}
        onOk={() => form.validateFields().then(() => {
          message.success('Endpoint added successfully');
          setIsModalVisible(false);
          form.resetFields();
        })}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Endpoint Name" rules={[{ required: true }]}>
                <Input placeholder="e.g., ADT Admission" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="messageType" label="Message Type" rules={[{ required: true }]}>
                <Select placeholder="Select type">
                  <Select.Option value="ADT^A01">ADT^A01 (Admit)</Select.Option>
                  <Select.Option value="ADT^A03">ADT^A03 (Discharge)</Select.Option>
                  <Select.Option value="ORM^O01">ORM^O01 (Order)</Select.Option>
                  <Select.Option value="ORU^R01">ORU^R01 (Result)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="destination" label="Destination IP" rules={[{ required: true }]}>
                <Input placeholder="e.g., 10.0.1.50" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="port" label="Port" rules={[{ required: true }]}>
                <Input type="number" placeholder="2575" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="enabled" label="Enabled" valuePropName="checked" initialValue={true}>
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Button
            icon={<SyncOutlined />}
            loading={testingConnection}
            onClick={handleTestConnection}
            block
          >
            Test Connection
          </Button>
        </Form>
      </Modal>
    </PageShell>
  );
}
