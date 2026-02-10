'use client';

import React, { useState } from 'react';
import { Card, Typography, Button, Space, Row, Col, Tag, Form, Input, Select, Switch, App, Modal, Tabs } from 'antd';
import { ApiOutlined, LinkOutlined, SyncOutlined, PlusOutlined, CodeOutlined } from '@ant-design/icons';
import { PageShell } from '@/components/design-system/PageShell';
import { StatCard } from '@/components/design-system/StatCard';
import { ModernTable } from '@/components/design-system/ModernTable';
import { StatusTag } from '@/components/design-system/StatusTag';
import { GradientButton } from '@/components/design-system/GradientButton';
import { InfoCard } from '@/components/design-system/InfoCard';

const { Title, Text } = Typography;

interface FHIRResource {
  id: string;
  resourceType: string;
  endpoint: string;
  version: string;
  status: 'Active' | 'Inactive';
  lastSync: string;
  recordsCount: number;
}

interface FHIRLogEntry {
  id: string;
  timestamp: string;
  operation: 'Read' | 'Create' | 'Update' | 'Delete' | 'Search';
  resourceType: string;
  resourceId: string;
  status: number;
  duration: string;
}

export default function FHIRIntegrationPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { message } = App.useApp();
  const [testingConnection, setTestingConnection] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [form] = Form.useForm();

  const [resources] = useState<FHIRResource[]>([
    {
      id: '1',
      resourceType: 'Patient',
      endpoint: '/Patient',
      version: 'R4',
      status: 'Active',
      lastSync: '2 minutes ago',
      recordsCount: 1250},
    {
      id: '2',
      resourceType: 'Observation',
      endpoint: '/Observation',
      version: 'R4',
      status: 'Active',
      lastSync: '5 minutes ago',
      recordsCount: 8450},
    {
      id: '3',
      resourceType: 'Condition',
      endpoint: '/Condition',
      version: 'R4',
      status: 'Active',
      lastSync: '10 minutes ago',
      recordsCount: 3200},
    {
      id: '4',
      resourceType: 'MedicationRequest',
      endpoint: '/MedicationRequest',
      version: 'R4',
      status: 'Active',
      lastSync: '15 minutes ago',
      recordsCount: 5600},
    {
      id: '5',
      resourceType: 'Encounter',
      endpoint: '/Encounter',
      version: 'R4',
      status: 'Active',
      lastSync: '20 minutes ago',
      recordsCount: 4500},
  ]);

  const [apiLogs] = useState<FHIRLogEntry[]>([
    { id: '1', timestamp: '2024-02-05 14:25:30', operation: 'Read', resourceType: 'Patient', resourceId: '12345', status: 200, duration: '45ms' },
    { id: '2', timestamp: '2024-02-05 14:24:15', operation: 'Create', resourceType: 'Observation', resourceId: 'obs-001', status: 201, duration: '82ms' },
    { id: '3', timestamp: '2024-02-05 14:23:00', operation: 'Search', resourceType: 'Condition', resourceId: 'N/A', status: 200, duration: '120ms' },
    { id: '4', timestamp: '2024-02-05 14:22:45', operation: 'Update', resourceType: 'MedicationRequest', resourceId: 'rx-789', status: 200, duration: '95ms' },
    { id: '5', timestamp: '2024-02-05 14:20:30', operation: 'Read', resourceType: 'Encounter', resourceId: 'enc-456', status: 404, duration: '38ms' },
  ]);

  const resourceColumns = [
    { title: 'Resource Type', dataIndex: 'resourceType', key: 'resourceType', render: (type: string) => <code>{type}</code> },
    { title: 'Endpoint', dataIndex: 'endpoint', key: 'endpoint' },
    {
      title: 'FHIR Version',
      dataIndex: 'version',
      key: 'version',
      render: (version: string) => <Tag color="blue">{version}</Tag>},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status.toLowerCase()} type="patient" />},
    {
      title: 'Records',
      dataIndex: 'recordsCount',
      key: 'recordsCount',
      align: 'right' as const,
      render: (count: number) => count.toLocaleString()},
    { title: 'Last Sync', dataIndex: 'lastSync', key: 'lastSync' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">Sync</Button>
          <Button type="link" size="small">Configure</Button>
        </Space>
      )},
  ];

  const logColumns = [
    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
    {
      title: 'Operation',
      dataIndex: 'operation',
      key: 'operation',
      render: (op: string) => <Tag color={op === 'Read' ? 'blue' : op === 'Create' ? 'green' : op === 'Update' ? 'orange' : 'red'}>{op}</Tag>},
    {
      title: 'Resource',
      dataIndex: 'resourceType',
      key: 'resourceType',
      render: (type: string) => <code>{type}</code>},
    { title: 'Resource ID', dataIndex: 'resourceId', key: 'resourceId' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => <Tag color={status >= 200 && status < 300 ? 'success' : 'error'}>{status}</Tag>},
    { title: 'Duration', dataIndex: 'duration', key: 'duration' },
  ];

  const stats = {
    totalResources: resources.length,
    totalRecords: resources.reduce((sum, r) => sum + r.recordsCount, 0),
    apiCalls: apiLogs.length,
    avgResponseTime: 72};

  const handleTestConnection = () => {
    setTestingConnection(true);
    setTimeout(() => {
      setTestingConnection(false);
      message.success('FHIR API connection successful!');
    }, 2000);
  };

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <InfoCard
          title="FHIR Resources"
        >
          <ModernTable
            dataSource={resources}
            columns={resourceColumns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </InfoCard>
      )
    },
    {
      key: 'logs',
      label: 'API Logs',
      children: (
        <InfoCard title="Recent API Activity">
          <ModernTable
            dataSource={apiLogs}
            columns={logColumns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </InfoCard>
      )
    },
    {
      key: 'tester',
      label: 'API Tester',
      children: (
        <InfoCard title="FHIR API Tester">
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Operation">
                  <Select>
                    <Select.Option value="GET">GET (Read)</Select.Option>
                    <Select.Option value="POST">POST (Create)</Select.Option>
                    <Select.Option value="PUT">PUT (Update)</Select.Option>
                    <Select.Option value="DELETE">DELETE</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Resource Type">
                  <Select>
                    <Select.Option value="Patient">Patient</Select.Option>
                    <Select.Option value="Observation">Observation</Select.Option>
                    <Select.Option value="Condition">Condition</Select.Option>
                    <Select.Option value="MedicationRequest">MedicationRequest</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Resource ID">
                  <Input placeholder="12345 or leave empty for search" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Request Parameters (JSON)">
                  <Input.TextArea rows={4} placeholder='{"name": "Chukwuemeka Okonkwo"}' />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Button
                  type="primary"
                  icon={<CodeOutlined />}
                  loading={testingConnection}
                  onClick={handleTestConnection}
                  block
                >
                  Execute Request
                </Button>
              </Col>
            </Row>
          </Form>
        </InfoCard>
      )
    },
    {
      key: 'settings',
      label: 'Settings',
      children: (
        <InfoCard title="FHIR Server Configuration">
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="FHIR Server Base URL">
                  <Input placeholder="https://api.hospital.com/fhir" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="FHIR Version">
                  <Select>
                    <Select.Option value="R4">R4 (Release 4)</Select.Option>
                    <Select.Option value="STU3">STU3</Select.Option>
                    <Select.Option value="R5">R5 (Release 5)</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Authentication Token">
                  <Input.Password placeholder="Bearer token" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Enable Smart on FHIR" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Enable Bulk Export" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </InfoCard>
      )
    },
  ];

  return (
    <PageShell
      title="FHIR API Configuration"
      subtitle="Manage Fast Healthcare Interoperability Resources"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Active Resources"
          value={stats.totalResources}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Total Records"
          value={stats.totalRecords}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="API Calls Today"
          value={stats.apiCalls}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={2}
        />
        <StatCard
          label="Avg Response"
          value={stats.avgResponseTime}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={3}
          suffix="ms"
        />
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      <Modal
        title="Add FHIR Resource"
        open={isModalVisible}
        onOk={() => form.validateFields().then(() => {
          message.success('Resource added successfully');
          setIsModalVisible(false);
          form.resetFields();
        })}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="resourceType" label="Resource Type" rules={[{ required: true }]}>
            <Select placeholder="Select resource type">
              <Select.Option value="Patient">Patient</Select.Option>
              <Select.Option value="Observation">Observation</Select.Option>
              <Select.Option value="Condition">Condition</Select.Option>
              <Select.Option value="MedicationRequest">MedicationRequest</Select.Option>
              <Select.Option value="Encounter">Encounter</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="endpoint" label="Endpoint Path" rules={[{ required: true }]}>
            <Input placeholder="/Patient" />
          </Form.Item>
          <Form.Item name="version" label="FHIR Version" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="R4">R4</Select.Option>
              <Select.Option value="STU3">STU3</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="enabled" label="Enabled" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </PageShell>
  );
}
