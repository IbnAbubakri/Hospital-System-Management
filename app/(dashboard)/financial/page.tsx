'use client';

import React from 'react';
import { Row, Col, Typography, Table, Tag, Space } from 'antd';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { formatCurrency } from '@/lib/utils';

const { Title } = Typography;

// Custom Naira symbol component
const NairaSymbol = () => (
  <span style={{ fontWeight: 600 }}>₦</span>
);

export default function FinancialDashboardPage() {
  const recentInvoices = [
    {
      key: '1',
      invoiceNumber: 'INV-2024-0156',
      patient: 'Chukwuemeka Okonkwo',
      amount: 75000,
      status: 'paid',
      date: '2024-02-01',
    },
    {
      key: '2',
      invoiceNumber: 'INV-2024-0157',
      patient: 'Adanna Okafor',
      amount: 25000,
      status: 'pending',
      date: '2024-02-01',
    },
    {
      key: '3',
      invoiceNumber: 'INV-2024-0158',
      patient: 'Olufemi Adebayo',
      amount: 96000,
      status: 'overdue',
      date: '2024-01-28',
    },
    {
      key: '4',
      invoiceNumber: 'INV-2024-0159',
      patient: 'Chioma Eze',
      amount: 36000,
      status: 'partial',
      date: '2024-02-01',
    },
  ];

  const revenueData = [
    { name: 'Jan', revenue: 85000000, expenses: 54000000, profit: 31000000 },
    { name: 'Feb', revenue: 92500000, expenses: 58500000, profit: 34000000 },
    { name: 'Mar', revenue: 88000000, expenses: 56400000, profit: 31600000 },
    { name: 'Apr', revenue: 102000000, expenses: 61500000, profit: 40500000 },
    { name: 'May', revenue: 97500000, expenses: 60000000, profit: 37500000 },
    { name: 'Jun', revenue: 108000000, expenses: 64500000, profit: 43500000 },
  ];

  const paymentMethods = [
    { name: 'Cash', value: 35, amount: 29400000 },
    { name: 'Insurance', value: 45, amount: 37800000 },
    { name: 'Bank Transfer', value: 15, amount: 12600000 },
    { name: 'Other', value: 5, amount: 4200000 },
  ];

  const columns = [
    { title: 'Invoice #', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    {
      title: 'Amount (₦)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount),
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          paid: 'success',
          pending: 'processing',
          overdue: 'error',
          partial: 'warning',
        };
        const labelMap: Record<string, string> = {
          paid: 'Paid',
          pending: 'Pending',
          overdue: 'Overdue',
          partial: 'Partially Paid',
        };
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
      },
    },
  ];

  return (
    <div>
      <Title level={2} className="mb-6">
        Financial Dashboard
      </Title>

      {/* Financial Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(85000000)}
            color="#10B981"
            trend={{ value: 15, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pending Payments"
            value={formatCurrency(13500000)}
            color="#F59E0B"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Overdue Amount"
            value={formatCurrency(3750000)}
            color="#EF4444"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Active Claims"
            value={23}
            color="#0077B6"
          />
        </Col>
      </Row>

      {/* Revenue Chart */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={16}>
          <ChartCard
            title="Revenue vs Expenses"
            type="bar"
            data={revenueData}
            color="#0077B6"
            height={300}
          />
        </Col>
        <Col xs={24} lg={8}>
          <ChartCard
            title="Payment Methods"
            type="pie"
            data={paymentMethods}
            height={300}
          />
        </Col>
      </Row>

      {/* Recent Invoices */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <div className="bg-white p-6 rounded-lg shadow">
            <Title level={4} className="mb-4">
              Recent Invoices
            </Title>
            <Table
              dataSource={recentInvoices}
              columns={columns}
              pagination={{ pageSize: 10 }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
