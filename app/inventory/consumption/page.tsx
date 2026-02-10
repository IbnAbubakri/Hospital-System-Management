'use client';

import React from 'react';
import { Card, Typography, Table, Space, Button, Tag } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function InventoryConsumptionPage() {
  const consumption = [
    { id: '1', item: 'Paracetamol 500mg', category: 'Medication', month: 'January 2024', consumed: 450, openingStock: 800, closingStock: 350 },
    { id: '2', item: 'Surgical Gloves', category: 'Supplies', month: 'January 2024', consumed: 300, openingStock: 500, closingStock: 200 },
    { id: '3', item: 'Syringes 5ml', category: 'Supplies', month: 'January 2024', consumed: 150, openingStock: 300, closingStock: 150 },
  ];

  const columns = [
    { title: 'Item', dataIndex: 'item', key: 'item' },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat: string) => <Tag>{cat}</Tag> },
    { title: 'Month', dataIndex: 'month', key: 'month' },
    { title: 'Opening Stock', dataIndex: 'openingStock', key: 'openingStock' },
    { title: 'Consumed', dataIndex: 'consumed', key: 'consumed', render: (val: number) => <span className="text-red-600">-{val}</span> },
    { title: 'Closing Stock', dataIndex: 'closingStock', key: 'closingStock', render: (val: number) => <span className="text-green-600">{val}</span> },
    {
      title: 'Actions',
      key: 'actions',
      render: () => <Button type="link" icon={<PrinterOutlined />}>Report</Button>,
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={3}>Inventory Consumption Analytics</Title>
      <Card className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <Table dataSource={consumption} columns={columns} rowKey="id" />
        </div>
      </Card>
    </div>
  );
}
