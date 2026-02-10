'use client';

import React from 'react';
import { Card, Table, Tag, Button, Row, Col, Statistic } from 'antd';

const NairaSymbol = () => <span style={{ fontSize: '16px', fontWeight: 600 }}>₦</span>;

export default function PortalBillsPage() {
  const invoices = [
    {
      key: '1',
      invoiceNumber: 'INV-2024-0157',
      date: '2024-02-01',
      description: 'Consultation - Cardiology',
      amount: 250000,
      status: 'pending',
      dueDate: '2024-02-15',
    },
    {
      key: '2',
      invoiceNumber: 'INV-2024-0156',
      date: '2024-01-25',
      description: 'Follow-up + Lab Tests',
      amount: 850000,
      status: 'paid',
      dueDate: '2024-02-08',
      paidDate: '2024-02-01',
    },
    {
      key: '3',
      invoiceNumber: 'INV-2024-0145',
      date: '2024-01-15',
      description: 'Emergency Visit',
      amount: 1200000,
      status: 'paid',
      dueDate: '2024-01-29',
      paidDate: '2024-01-20',
    },
  ];

  const columns = [
    { title: 'Invoice #', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Amount (₦)', dataIndex: 'amount', key: 'amount', render: (amt: number) => `₦${amt.toLocaleString()}` },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'paid' ? 'success' : 'warning'}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: any) => (
        record.status === 'pending' ? (
          <Button type="primary" size="small">Pay Now</Button>
        ) : (
          <Button size="small">Receipt</Button>
        )
      ),
    },
  ];

  const totalPending = invoices.filter((i: any) => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = invoices.filter((i: any) => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 className="text-2xl font-bold mb-4">Bills & Payments</h2>

      <Row gutter={16} className="mb-4">
        <Col span={12}>
          <Card>
            <Statistic
              title="Pending Amount"
              value={totalPending}
              prefix={<NairaSymbol />}
              formatter={(value) => `${value}`}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Total Paid"
              value={totalPaid}
              prefix={<NairaSymbol />}
              formatter={(value) => `${value}`}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={invoices}
          pagination={false}
        />
        </div>
      </Card>
    </div>
  );
}
