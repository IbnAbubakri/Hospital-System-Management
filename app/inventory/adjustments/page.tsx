'use client';

import React from 'react';
import { Card, Typography, Table, Space, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function StockAdjustmentsPage() {
  const adjustments = [
    { id: '1', date: '2024-02-02', item: 'Paracetamol 500mg', type: 'Damage', quantity: -50, reason: 'Water damage', adjustedBy: 'Admin' },
    { id: '2', date: '2024-02-01', item: 'Surgical Gloves', type: 'Addition', quantity: 200, reason: 'Stock received', adjustedBy: 'Nurse Amaka' },
    { id: '3', date: '2024-01-31', item: 'Syringes 5ml', type: 'Usage', quantity: -30, reason: 'Monthly consumption', adjustedBy: 'Dr. Emeka' },
  ];

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Item', dataIndex: 'item', key: 'item' },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Addition' ? 'success' : type === 'Damage' ? 'error' : 'warning'}>{type}</Tag>
      ),
    },
    {
      title: 'Quantity Change',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number) => (
        <span className={qty > 0 ? 'text-green-600' : 'text-red-600'}>{qty > 0 ? '+' : ''}{qty}</span>
      ),
    },
    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
    { title: 'Adjusted By', dataIndex: 'adjustedBy', key: 'adjustedBy' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => <Button type="link" size="small">View Details</Button>,
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Title level={3}>Stock Adjustments</Title>
        <Button type="primary" icon={<PlusOutlined />} className="w-full sm:w-auto">New Adjustment</Button>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <Table dataSource={adjustments} columns={columns} rowKey="id" />
        </div>
      </Card>
    </div>
  );
}
