'use client';

import React from 'react';
import { Card, Typography, Table, Space, Tag, Alert, Button, Row, Col, Statistic } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function StaffCredentialsPage() {
  const credentials = [
    { id: '1', name: 'Dr. Emeka Adeleke', license: 'MDCN/12345/2020', expiry: '2025-12-31', status: 'Active', type: 'Medical License' },
    { id: '2', name: 'Dr. Emeka Adeleke', license: 'ACL/98765/2022', expiry: '2024-06-30', status: 'Expiring Soon', type: 'ACL Certification' },
    { id: '3', name: 'Nurse Amaka Okafor', license: 'NMC/789012/2021', expiry: '2025-03-15', status: 'Active', type: 'Nursing License' },
    { id: '4', name: 'Dr. Ibrahim Musa', license: 'MDCN/12346/2019', expiry: '2024-11-30', status: 'Expiring Soon', type: 'Medical License' },
  ];

  const expiringCount = credentials.filter((c: any) => c.status === 'Expiring Soon').length;

  const columns = [
    { title: 'Staff Name', dataIndex: 'name', key: 'name' },
    { title: 'Credential Type', dataIndex: 'type', key: 'type', render: (type: string) => <Tag>{type}</Tag> },
    { title: 'License Number', dataIndex: 'license', key: 'license' },
    { title: 'Expiry Date', dataIndex: 'expiry', key: 'expiry' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'success' : status === 'Expiring Soon' ? 'warning' : 'error'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">View Document</Button>
          <Button type="link" size="small">Update</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={3}>Staff Credentials Management</Title>

      {expiringCount > 0 && (
        <Alert
          message={`${expiringCount} credentials expiring soon`}
          description="Please review and renew credentials before expiration"
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: '24px' }}
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Credentials" value={credentials.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Active" value={credentials.filter((c: any) => c.status === 'Active').length} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Expiring Soon" value={expiringCount} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={credentials}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
        </div>
      </Card>
    </div>
  );
}
