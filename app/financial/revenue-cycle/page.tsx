'use client';

import React from 'react';
import { Card, Typography, Table, Button, Space, Tag, DatePicker, Select, Row, Col, Statistic } from 'antd';
import { DollarOutlined, DownloadOutlined, PrinterOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Transaction {
  id: string;
  date: string;
  type: 'Revenue' | 'Expense';
  category: string;
  description: string;
  amount: number;
  status: 'Completed' | 'Pending';
}

export default function RevenueCyclePage() {
  const transactions = [
    { id: '1', date: '2024-02-02', type: 'Revenue', category: 'Outpatient', description: 'Consultation Fees', amount: 2500000, status: 'Completed' },
    { id: '2', date: '2024-02-02', type: 'Revenue', category: 'Inpatient', description: 'Room Charges', amount: 7500000, status: 'Completed' },
    { id: '3', date: '2024-02-02', type: 'Revenue', category: 'Laboratory', description: 'Lab Tests', amount: 1800000, status: 'Completed' },
    { id: '4', date: '2024-02-01', type: 'Expense', category: 'Salaries', description: 'Staff Salaries', amount: 15000000, status: 'Completed' },
    { id: '5', date: '2024-02-01', type: 'Expense', category: 'Supplies', description: 'Medical Supplies', amount: 2500000, status: 'Pending' },
  ];

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Revenue' ? 'success' : 'error'}>{type}</Tag>
      ),
    },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span className={amount > 0 ? 'text-green-600' : 'text-red-600'} font-semibold>
          ₦{amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Completed' ? 'success' : 'warning'}>{status}</Tag>
      ),
    },
  ];

  const stats = {
    totalRevenue: '₦45.2M',
    totalExpenses: '₦28.5M',
    netProfit: '₦16.7M',
    profitMargin: 37,
    pendingAmount: '₦8.2M',
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={3}>Revenue Cycle Management</Title>
          <Text type="secondary">Track hospital revenue and financial performance</Text>
        </div>
        <Space>
          <Select defaultValue="month" style={{ width: 120 }}>
            <Select.Option value="today">Today</Select.Option>
            <Select.Option value="week">This Week</Select.Option>
            <Select.Option value="month">This Month</Select.Option>
            <Select.Option value="quarter">This Quarter</Select.Option>
          </Select>
          <DatePicker.RangePicker />
          <Button icon={<DownloadOutlined />}>Export</Button>
          <Button icon={<PrinterOutlined />}>Print</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Expenses"
              value={stats.totalExpenses}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#EF4444' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Net Profit"
              value={stats.netProfit}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3B82F6' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Profit Margin"
              value={stats.profitMargin}
              suffix="%"
              valueStyle={{ color: stats.profitMargin >= 30 ? '#10B981' : '#F59E0B' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Transaction History">
        <Table dataSource={transactions} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}
