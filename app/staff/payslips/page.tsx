'use client';

import React from 'react';
import { Card, Typography, Table, Space, Button, Tag } from 'antd';
import { FileTextOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function StaffPayslipsPage() {
  const payslips = [
    { id: '1', employeeId: 'EMP-001', name: 'Dr. Ngozi Adeleke', month: 'January 2024', basic: '₦800,000', allowances: '₦200,000', bonuses: '₦100,000', deductions: '₦80,000', netPay: '₦1,020,000', status: 'Generated' },
    { id: '2', employeeId: 'EMP-002', name: 'Dr. Emeka Okoro', month: 'January 2024', basic: '₦750,000', allowances: '₦150,000', bonuses: '₦100,000', deductions: '₦75,000', netPay: '₦925,000', status: 'Generated' },
  ];

  const columns = [
    { title: 'Employee', dataIndex: 'name', key: 'name' },
    { title: 'Month', dataIndex: 'month', key: 'month' },
    { title: 'Basic Salary', dataIndex: 'basic', key: 'basic' },
    { title: 'Net Pay', dataIndex: 'netPay', key: 'netPay', render: (amt: string) => <span className="font-semibold ">{amt}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color="success">{status}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<DownloadOutlined />}>Download</Button>
          <Button type="link" size="small">Email</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="  sm: sm: lg: lg: max-w-5xl mx-auto">
      <Title level={3}>Employee Payslips</Title>
      <Card title="Payslip Generation">
        <Table dataSource={payslips} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}
