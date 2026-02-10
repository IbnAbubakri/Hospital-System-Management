'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Progress } from 'antd';
import { FileTextOutlined, DollarOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function InventoryContractsPage() {
  const contracts = [
    { id: 'CON-2024-001', vendor: 'MedSupply Nigeria Ltd', item: 'Pharmaceuticals', value: 4500000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Active', deliverables: 75 },
    { id: 'CON-2024-002', vendor: 'Surgical Equip Co.', item: 'Surgical Instruments', value: 8200000, startDate: '2024-02-01', endDate: '2024-08-31', status: 'Active', deliverables: 45 },
    { id: 'CON-2024-003', vendor: 'LabTech Solutions', item: 'Lab Consumables', value: 2100000, startDate: '2023-06-01', endDate: '2024-06-30', status: 'Expiring Soon', deliverables: 90 },
    { id: 'CON-2024-004', vendor: 'Medical Supplies Ltd', item: 'General Consumables', value: 3200000, startDate: '2024-01-15', endDate: '2024-12-15', status: 'Active', deliverables: 60 },
    { id: 'CON-2023-015', vendor: 'Pharma Distributors', item: 'Vaccines', value: 1800000, startDate: '2023-01-01', endDate: '2023-12-31', status: 'Expired', deliverables: 100 },
  ];

  const columns = [
    { title: 'Contract ID', dataIndex: 'id', key: 'id' },
    { title: 'Vendor', dataIndex: 'vendor', key: 'vendor' },
    { title: 'Item Category', dataIndex: 'item', key: 'item' },
    {
      title: 'Contract Value',
      dataIndex: 'value',
      key: 'value',
      render: (val: number) => <span>₦{(val / 1000000).toFixed(1)}M</span>,
    },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Active' ? 'success' : status === 'Expiring Soon' ? 'warning' : 'error';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Progress',
      dataIndex: 'deliverables',
      key: 'deliverables',
      render: (pct: number) => <Progress percent={pct} size="small" />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<FileTextOutlined />}>View</Button>
          <Button type="link" size="small">Renew</Button>
        </Space>
      ),
    },
  ];

  const totalValue = contracts.reduce((sum, c) => sum + c.value, 0);
  const activeContracts = contracts.filter(c => c.status === 'Active').length;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Vendor Contracts</Title>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 sm:p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{contracts.length}</div>
            <div className="text-gray-500">Total Contracts</div>
          </div>
        </Card>
        <Card className="p-4 sm:p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{activeContracts}</div>
            <div className="text-gray-500">Active Contracts</div>
          </div>
        </Card>
        <Card className="p-4 sm:p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">₦{(totalValue / 1000000).toFixed(1)}M</div>
            <div className="text-gray-500">Total Contract Value</div>
          </div>
        </Card>
      </div>

      <Card title="Active Contracts" className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <Table
            dataSource={contracts}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Card>
    </div>
  );
}
