'use client';

import React from 'react';
import { Card, Typography, Table, Tag, Space, Button, Input, Select, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function PoliciesPage() {
  const policies = [
    { id: 'POL-001', name: 'Patient Privacy Policy', category: 'Privacy', version: '2.1', lastUpdated: '2024-01-15', status: 'Active', owner: 'Compliance Officer', requiredReview: '2024-07-15' },
    { id: 'POL-002', name: 'Data Protection Policy', category: 'IT Security', version: '3.0', lastUpdated: '2024-01-10', status: 'Active', owner: 'IT Director', requiredReview: '2024-04-10' },
    { id: 'POL-003', name: 'Infection Control Policy', category: 'Clinical', version: '4.5', lastUpdated: '2024-01-20', status: 'Active', owner: 'Infection Control', requiredReview: '2024-07-20' },
    { id: 'POL-004', name: 'Medication Safety Policy', category: 'Clinical', version: '2.3', lastUpdated: '2023-12-01', status: 'Active', owner: 'Pharmacy Manager', requiredReview: '2024-06-01' },
    { id: 'POL-005', name: 'Emergency Response Protocol', category: 'Safety', version: '1.8', lastUpdated: '2024-02-01', status: 'Active', owner: 'Safety Officer', requiredReview: '2024-05-01' },
    { id: 'POL-006', name: 'Visitor Policy', category: 'Administrative', version: '1.5', lastUpdated: '2024-01-05', status: 'Active', owner: 'Administration', requiredReview: '2024-04-05' },
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Policy Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat: string) => <Tag color="blue">{cat}</Tag> },
    { title: 'Version', dataIndex: 'version', key: 'version' },
    { title: 'Last Updated', dataIndex: 'lastUpdated', key: 'lastUpdated' },
    { title: 'Owner', dataIndex: 'owner', key: 'owner' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color="success">{status}</Tag> },
    { title: 'Next Review', dataIndex: 'requiredReview', key: 'requiredReview' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">View</Button>
          <Button type="link" size="small">Download</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <Title level={3}>Hospital Policies</Title>
        <Button type="primary" className="w-full sm:w-auto">Create Policy</Button>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <Input.Search placeholder="Search policies..." allowClear className="w-full sm:w-auto" prefix={<SearchOutlined />} />
        <Select placeholder="Filter by category" className="w-full sm:w-auto" allowClear>
          <Select.Option value="privacy">Privacy</Select.Option>
          <Select.Option value="clinical">Clinical</Select.Option>
          <Select.Option value="it-security">IT Security</Select.Option>
          <Select.Option value="safety">Safety</Select.Option>
          <Select.Option value="administrative">Administrative</Select.Option>
        </Select>
        <Select placeholder="Filter by status" className="w-full sm:w-auto">
          <Select.Option value="active">Active</Select.Option>
          <Select.Option value="archived">Archived</Select.Option>
          <Select.Option value="draft">Draft</Select.Option>
        </Select>
      </div>

      <Card title="Policy Repository" className="overflow-x-auto">
        <Table dataSource={policies} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}
