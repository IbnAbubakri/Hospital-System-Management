'use client';

import React from 'react';
import { Card, Typography, Table, Space, Tag, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ReorderAlertsPage() {
  const alerts = [
    { id: '1', item: 'Surgical Gloves', category: 'Supplies', currentStock: 50, minStock: 100, supplier: 'MedSupplies Ltd', urgency: 'High' },
    { id: '2', item: 'Paracetamol 500mg', category: 'Medication', currentStock: 120, minStock: 100, supplier: 'PharmaCorp', urgency: 'Low' },
    { id: '3', item: 'Blood Test Kits', category: 'Laboratory', currentStock: 15, minStock: 50, supplier: 'LabTech', urgency: 'High' },
  ];

  const columns = [
    { title: 'Item', dataIndex: 'item', key: 'item' },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat: string) => <Tag>{cat}</Tag> },
    {
      title: 'Stock Level',
      key: 'stock',
      render: (_: any, item: any) => (
        <span className={item.currentStock < item.minStock ? 'text-red-600 font-semibold' : ''}>
          {item.currentStock} / {item.minStock}
        </span>
      ),
    },
    { title: 'Supplier', dataIndex: 'supplier', key: 'supplier' },
    {
      title: 'Urgency',
      dataIndex: 'urgency',
      key: 'urgency',
      render: (urgency: string) => <Tag color={urgency === 'High' ? 'error' : 'warning'}>{urgency}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="primary" size="small">Create PO</Button>
          <Button size="small">Snooze</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={3}>Reorder Alerts</Title>
      <Card title="Items Requiring Restock" className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <Table dataSource={alerts} columns={columns} rowKey="id" />
        </div>
      </Card>
    </div>
  );
}
