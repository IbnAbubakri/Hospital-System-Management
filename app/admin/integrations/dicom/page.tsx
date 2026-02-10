'use client';

import React, { useState } from 'react';
import { Card, Typography, Button, Space, Row, Col, Tag, Form, Input, Select, Switch, App, Modal, Progress } from 'antd';
import { FileImageOutlined, LinkOutlined, SyncOutlined, PlusOutlined } from '@ant-design/icons';
import { PageShell } from '@/components/design-system/PageShell';
import { StatCard } from '@/components/design-system/StatCard';
import { ModernTable } from '@/components/design-system/ModernTable';
import { StatusTag } from '@/components/design-system/StatusTag';
import { GradientButton } from '@/components/design-system/GradientButton';
import { InfoCard } from '@/components/design-system/InfoCard';

const { Title, Text } = Typography;

interface DICOMNode {
  id: string;
  name: string;
  aeTitle: string;
  host: string;
  port: number;
  nodeType: 'Storage' | 'Query' | 'Retrieve';
  status: 'Connected' | 'Disconnected' | 'Error';
  studiesCount: number;
  storageUsed: number;
  storageTotal: number;
  lastAssociation: string;
}

export default function DICOMIntegrationPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { message } = App.useApp();
  const [testingConnection, setTestingConnection] = useState(false);
  const [form] = Form.useForm();

  const [dicomNodes] = useState<DICOMNode[]>([
    {
      id: '1',
      name: 'Primary PACS Server',
      aeTitle: 'HOSPITAL_PACS',
      host: '10.0.2.100',
      port: 104,
      nodeType: 'Storage',
      status: 'Connected',
      studiesCount: 15420,
      storageUsed: 450,
      storageTotal: 1000,
      lastAssociation: '2 minutes ago'},
    {
      id: '2',
      name: 'CT Scanner 1',
      aeTitle: 'CT_SIEMENS_01',
      host: '10.0.3.10',
      port: 104,
      nodeType: 'Storage',
      status: 'Connected',
      studiesCount: 3240,
      storageUsed: 120,
      storageTotal: 200,
      lastAssociation: '15 minutes ago'},
    {
      id: '3',
      name: 'MRI Scanner 1',
      aeTitle: 'MRI_GE_01',
      host: '10.0.3.20',
      port: 104,
      nodeType: 'Storage',
      status: 'Connected',
      studiesCount: 2180,
      storageUsed: 180,
      storageTotal: 300,
      lastAssociation: '1 hour ago'},
    {
      id: '4',
      name: 'X-Ray Room 1',
      aeTitle: 'CR_KODAK_01',
      host: '10.0.3.30',
      port: 104,
      nodeType: 'Storage',
      status: 'Connected',
      studiesCount: 4580,
      storageUsed: 85,
      storageTotal: 150,
      lastAssociation: '30 minutes ago'},
    {
      id: '5',
      name: 'Ultrasound 1',
      aeTitle: 'US_PHILIPS_01',
      host: '10.0.3.40',
      port: 104,
      nodeType: 'Storage',
      status: 'Error',
      studiesCount: 1890,
      storageUsed: 45,
      storageTotal: 100,
      lastAssociation: '5 hours ago'},
    {
      id: '6',
      name: 'Workstation 1',
      aeTitle: 'WS_RAD_01',
      host: '10.0.4.50',
      port: 11112,
      nodeType: 'Query',
      status: 'Connected',
      studiesCount: 0,
      storageUsed: 0,
      storageTotal: 0,
      lastAssociation: '5 minutes ago'},
  ]);

  const nodeColumns = [
    { title: 'Node Name', dataIndex: 'name', key: 'name' },
    {
      title: 'AE Title',
      dataIndex: 'aeTitle',
      key: 'aeTitle',
      render: (title: string) => <code>{title}</code>},
    {
      title: 'Connection',
      key: 'connection',
      render: (_: any, record: DICOMNode) => (
        <span>
          {record.host}:{record.port}
        </span>
      )},
    {
      title: 'Type',
      dataIndex: 'nodeType',
      key: 'nodeType',
      render: (type: string) => <Tag color="blue">{type}</Tag>},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status.toLowerCase()} type="patient" />},
    {
      title: 'Studies',
      dataIndex: 'studiesCount',
      key: 'studiesCount',
      align: 'right' as const,
      render: (count: number) => count.toLocaleString()},
    {
      title: 'Storage',
      key: 'storage',
      render: (_: any, record: DICOMNode) => {
        if (record.nodeType === 'Query') return <Text type="secondary">N/A</Text>;
        const percent = Math.round((record.storageUsed / record.storageTotal) * 100);
        return (
          <div style={{ width: 120 }}>
            <Progress percent={percent} size="small" />
            <Text type="secondary" className="text-xs">{record.storageUsed}GB / {record.storageTotal}GB</Text>
          </div>
        );
      }},
    { title: 'Last Association', dataIndex: 'lastAssociation', key: 'lastAssociation' },
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

  const stats = {
    totalNodes: dicomNodes.length,
    connected: dicomNodes.filter((n: any) => n.status === 'Connected').length,
    totalStudies: dicomNodes.reduce((sum, n) => sum + n.studiesCount, 0),
    totalStorage: dicomNodes.reduce((sum, n) => sum + n.storageUsed, 0)};

  const handleTestConnection = () => {
    setTestingConnection(true);
    setTimeout(() => {
      setTestingConnection(false);
      message.success('DICOM association successful!');
    }, 2000);
  };

  return (
    <PageShell
      title="DICOM Configuration"
      subtitle="Manage medical imaging network connections"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Nodes"
          value={stats.totalNodes}
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
          label="Total Studies"
          value={stats.totalStudies}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={2}
        />
        <StatCard
          label="Storage Used"
          value={stats.totalStorage}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={3}
          suffix="GB"
        />
      </div>

      <InfoCard
        title="DICOM Nodes"
      >
        <ModernTable
          dataSource={dicomNodes}
          columns={nodeColumns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </InfoCard>

      <Modal
        title="Add DICOM Node"
        open={isModalVisible}
        onOk={() => form.validateFields().then(() => {
          message.success('DICOM node added successfully');
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
              <Form.Item name="name" label="Node Name" rules={[{ required: true }]}>
                <Input placeholder="e.g., CT Scanner 1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="aeTitle" label="AE Title" rules={[{ required: true }]}>
                <Input placeholder="e.g., CT_SIEMENS_01" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="host" label="Host/IP Address" rules={[{ required: true }]}>
                <Input placeholder="e.g., 10.0.3.10" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="port" label="Port" rules={[{ required: true }]}>
                <Input type="number" placeholder="104" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="nodeType" label="Node Type" rules={[{ required: true }]}>
                <Select placeholder="Select type">
                  <Select.Option value="Storage">Storage SCP</Select.Option>
                  <Select.Option value="Query">Query/Retrieve SCP</Select.Option>
                  <Select.Option value="Retrieve">Retrieve SCP</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="enabled" label="Enabled" valuePropName="checked" initialValue={true}>
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Button
            loading={testingConnection}
            onClick={handleTestConnection}
            block
          >
            Test DICOM Association
          </Button>
        </Form>
      </Modal>
    </PageShell>
  );
}
