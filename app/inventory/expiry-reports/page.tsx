'use client';

import React, { useState } from 'react';
import { Table, Button, Input, Badge, Tag, Progress, Card, List, Statistic, Row, Col, Select } from 'antd';
import { DollarOutlined, ShoppingOutlined, ExclamationCircleOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { formatDate, formatCurrency } from '@/lib/utils';

interface ExpiryAlert {
  id: string;
  itemName: string;
  category: string;
  batchNumber: string;
  quantity: number;
  expiryDate: Date;
  daysToExpiry: number;
  value: number;
}

const mockExpiryAlerts: ExpiryAlert[] = [
  { id: 'exp1', itemName: 'Amoxicillin 500mg', category: 'Antibiotics', batchNumber: 'AMX-2023-056', quantity: 500, expiryDate: new Date('2024-03-15'), daysToExpiry: 38, value: 75000 },
  { id: 'exp2', itemName: 'Insulin Glargine', category: 'Antidiabetic', batchNumber: 'INS-2023-089', quantity: 50, expiryDate: new Date('2024-02-20'), daysToExpiry: 15, value: 475000 },
  { id: 'exp3', itemName: 'Ceftriaxone 1g', category: 'Antibiotics', batchNumber: 'CEF-2023-102', quantity: 100, expiryDate: new Date('2024-02-10'), daysToExpiry: 5, value: 350000 },
];

const getUrgency = (days: number) => {
  if (days <= 7) return { level: 'critical', color: '#DC2626', bg: '#FEE2E2' };
  if (days <= 30) return { level: 'urgent', color: '#F59E0B', bg: '#FEF3C7' };
  return { level: 'warning', color: '#F59E0B', bg: '#FEF3C7' };
};

export default function ExpiryReportsPage() {
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();

  const filteredAlerts = mockExpiryAlerts.filter((alert) => {
    return (
      alert.itemName.toLowerCase().includes(searchText.toLowerCase()) ||
      alert.batchNumber.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const totalValue = filteredAlerts.reduce((sum, alert) => sum + alert.value, 0);

  const columns = [
    { title: 'Item Name', dataIndex: 'itemName', key: 'item', sorter: (a: ExpiryAlert, b: ExpiryAlert) => a.itemName.localeCompare(b.itemName) },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat: string) => <Tag>{cat}</Tag> },
    { title: 'Batch Number', dataIndex: 'batchNumber', key: 'batch' },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      sorter: (a: ExpiryAlert, b: ExpiryAlert) => a.expiryDate.getTime() - b.expiryDate.getTime(),
      render: (d: Date) => formatDate(d),
    },
    {
      title: 'Days to Expiry',
      dataIndex: 'daysToExpiry',
      key: 'days',
      sorter: (a: ExpiryAlert, b: ExpiryAlert) => a.daysToExpiry - b.daysToExpiry,
      render: (days: number) => {
        const urgency = getUrgency(days);
        return (
          <Tag className="border-none font-bold" style={{ backgroundColor: urgency.bg, color: urgency.color }}>
            {days} days
          </Tag>
        );
      },
    },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => formatCurrency(value),
      sorter: (a: ExpiryAlert, b: ExpiryAlert) => a.value - b.value,
    },
    {
      title: 'Action',
      key: 'action',
      render: () => <Button size="small">Take Action</Button>,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-slate-50 ">
      <div className="bg-white -xl  border border-pink-200">
        <div className="   ">
          <div>
            <h1 className="text-2xl font-semibold     ">
              <ExclamationCircleOutlined className="" />
              Expiry Reports
            </h1>
            <p className=" ">Track expiring items and manage alerts</p>
          </div>
        </div>

        <Row gutter={[16, 16]} className="">
          <Col xs={24} sm={8}>
            <Card className=" sm: bg-red-100 border-2 border-red-200">
              <Statistic
                title="Critical (≤7 days)"
                value={filteredAlerts.filter((a: any) => a.daysToExpiry <= 7).length}
                valueStyle={{ color: '#DC2626' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className=" sm: bg-amber-100 border-2 border-amber-200">
              <Statistic
                title="Warning (8-30 days)"
                value={filteredAlerts.filter((a: any) => a.daysToExpiry > 7 && a.daysToExpiry <= 30).length}
                valueStyle={{ color: '#D97706' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className=" sm: bg-blue-100 border-2 border-blue-200">
              <Statistic
                title="Total Value at Risk"
                value={totalValue}
                prefix="₦"
                formatter={(value) => `₦${Number(value).toLocaleString()}`}
                valueStyle={{ color: '#3B82F6' }}
              />
            </Card>
          </Col>
        </Row>

        <div className="overflow-x-auto">
          <Table dataSource={filteredAlerts} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
        </div>
      </div>
    </div>
  );
}
