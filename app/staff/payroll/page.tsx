'use client';

import React from 'react';
import { Card, Typography, Table, Space, Tag, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function StaffPayrollPage() {
  const payroll = [
    { id: '1', name: 'Dr. Emeka Adeleke', department: 'Cardiology', role: 'Doctor', basic: '₦800,000', allowance: '₦200,000', bonus: '₦100,000', deductions: '₦80,000', net: '₦1,020,000' },
    { id: '2', name: 'Dr. Ibrahim Musa', department: 'General Medicine', role: 'Doctor', basic: '₦750,000', allowance: '₦150,000', bonus: '₦100,000', deductions: '₦75,000', net: '₦925,000' },
    { id: '3', name: 'Nurse Amaka Okafor', department: 'Nursing', role: 'Nurse', basic: '₦250,000', allowance: '₦50,000', bonus: '₦30,000', deductions: '₦25,000', net: '₦305,000' },
  ];

  const columns = [
    { title: 'Employee', dataIndex: 'name', key: 'name' },
    { title: 'Department', dataIndex: 'department', key: 'department', render: (dept: string) => <Tag>{dept}</Tag> },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Basic Salary', dataIndex: 'basic', key: 'basic' },
    { title: 'Allowances', dataIndex: 'allowance', key: 'allowance' },
    { title: 'Bonus', dataIndex: 'bonus', key: 'bonus' },
    { title: 'Deductions', dataIndex: 'deductions', key: 'deductions', render: (amt: string) => <span className="text-red-600">{amt}</span> },
    { title: 'Net Pay', dataIndex: 'net', key: 'net', render: (amt: string) => <span className="font-semibold text-green-600">{amt}</span> },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>View Details</Button>
          <Button type="link" size="small">Process</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Payroll Management</Title>
      <Card title="Payroll - February 2024">
        <Table dataSource={payroll} columns={columns} rowKey="id" scroll={{ x: 1000 }} />
      </Card>
    </div>
  );
}
