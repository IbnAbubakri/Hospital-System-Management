'use client';

import React, { useState } from 'react';
import { Card, Table, Button, Space, Typography, Input, Tag, Avatar, Progress } from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Vendor {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  category: string;
  rating: number;
  status: 'Active' | 'Inactive';
  totalOrders: number;
  totalAmount: string;
}

export default function VendorsPage() {
  const [searchText, setSearchText] = useState('');

  const [vendors] = useState<Vendor[]>([
    {
      id: '1',
      name: 'PharmaCorp Nigeria Ltd',
      contact: 'Chinedu Okafor',
      email: 'chinedu@pharmacorp.com',
      phone: '+234 801 234 5678',
      category: 'Medications',
      rating: 4.8,
      status: 'Active',
      totalOrders: 156,
      totalAmount: '₦15.2M',
    },
    {
      id: '2',
      name: 'MedSupplies Limited',
      contact: 'Ngozi Adeleke',
      email: 'ngozi@medsupplies.com',
      phone: '+234 802 345 6789',
      category: 'Medical Supplies',
      rating: 4.5,
      status: 'Active',
      totalOrders: 89,
      totalAmount: '₦8.7M',
    },
    {
      id: '3',
      name: 'LabTech Distributors',
      contact: 'Mike Johnson',
      email: 'mike@labtech.com',
      phone: '+234 803 456 7890',
      category: 'Laboratory Equipment',
      rating: 4.2,
      status: 'Active',
      totalOrders: 45,
      totalAmount: '₦12.3M',
    },
  ]);

  const columns = [
    {
      title: 'Vendor',
      key: 'vendor',
      render: (_: any, record: Vendor) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ background: '#3B82F6' }}>
            {record.name.charAt(0)}
          </Avatar>
          <div>
            <div className="font-medium">{record.name}</div>
            <Text type="secondary" className="text-xs">{record.category}</Text>
          </div>
        </Space>
      ),
    },
    { title: 'Contact Person', dataIndex: 'contact', key: 'contact' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <Space>
          <span>{rating}</span>
          <span style={{ color: '#F59E0B' }}>★</span>
        </Space>
      ),
    },
    {
      title: 'Total Orders',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      render: (count: number) => <Tag color="blue">{count}</Tag>,
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: string) => <span className="font-semibold text-green-600">{amount}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'success' : 'default'}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">View</Button>
          <Button type="link" size="small">Edit</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Vendor Management</Title>

      <Card
        title="Vendor Directory"
        className="p-4 sm:p-6"
        extra={
          <Input.Search
            placeholder="Search vendors..."
            allowClear
            className="w-full sm:w-[250px]"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
          />
        }
      >
        <div className="overflow-x-auto">
          <Table
            dataSource={vendors.filter((v: any) =>
              v.name.toLowerCase().includes(searchText.toLowerCase())
            )}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
          />
        </div>
      </Card>
    </div>
  );
}
