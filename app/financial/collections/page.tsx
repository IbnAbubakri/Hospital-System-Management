'use client';

import React from 'react';
import { Card, Typography, Table, Space, Button, Tag, Progress } from 'antd';
import { PhoneOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function CollectionsPage() {
  const collections = [
    { id: '1', patient: 'Chukwuemeka Okonkwo', amount: 134200, overdue: 5, attempts: 2, lastContact: '2024-02-03', status: 'In Progress' },
    { id: '2', patient: 'Amaka Okafor', amount: 14700, overdue: 8, attempts: 4, lastContact: '2024-02-05', status: 'Follow-up Required' },
  ];

  const columns = [
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amt: number) => <span className="font-semibold">₦{amt.toLocaleString()}</span> },
    { title: 'Days Overdue', dataIndex: 'overdue', key: 'overdue', render: (days: number) => <Tag color={days > 7 ? 'error' : 'warning'}>{days} days</Tag> },
    { title: 'Collection Attempts', dataIndex: 'attempts', key: 'attempts' },
    {
      title: 'Progress',
      key: 'progress',
      render: (_: any, item: any) => (
        <Progress
          percent={(item.attempts / 5) * 100}
          size="small"
          strokeColor={item.attempts >= 4 ? '#10B981' : '#F59E0B'}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="primary" size="small" icon={<PhoneOutlined />}>Call</Button>
          <Button size="small" icon={<MailOutlined />}>Email</Button>
          <Button type="link" size="small">Note</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={3}>Collections Management</Title>
      <Card>
        <Table dataSource={collections} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}
