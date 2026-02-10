'use client';

import React from 'react';
import { Card, Typography, Table, Space, Button, Tag, DatePicker } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ReceivablesPage() {
  const receivables = [
    { id: '1', patient: 'Chukwuemeka Okonkwo', invoice: 'INV-2024-0042', amount: 134200, dueDate: '2024-02-15', age: 5, status: 'Current' },
    { id: '2', patient: 'Amaka Okafor', invoice: 'INV-2024-0041', amount: 14700, dueDate: '2024-02-10', age: 8, status: 'Overdue' },
    { id: '3', patient: 'Tobi Okafor', invoice: 'INV-2024-0040', amount: 13080, dueDate: '2024-02-11', age: 7, status: 'Current' },
  ];

  const columns = [
    { title: 'Invoice #', dataIndex: 'invoice', key: 'invoice', render: (inv: string) => <Tag color="blue">{inv}</Tag> },
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amt: number) => <span className="font-semibold">₦{amt.toLocaleString()}</span> },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
    { title: 'Days Overdue', dataIndex: 'age', key: 'age' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Current' ? 'success' : 'error'}>{status}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="primary" size="small" icon={<DollarOutlined />}>Record Payment</Button>
          <Button type="link" size="small">Send Reminder</Button>
        </Space>
      ),
    },
  ];

  const totalOutstanding = receivables.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={3}>Accounts Receivable</Title>
      <Card>
        <Table dataSource={receivables} columns={columns} rowKey="id" />
        <div className="mt-4 text-right">
          <Text strong className="text-lg">Total Outstanding: </Text>
          <Text className="text-lg text-red-600 ml-2">₦{totalOutstanding.toLocaleString()}</Text>
        </div>
      </Card>
    </div>
  );
}
