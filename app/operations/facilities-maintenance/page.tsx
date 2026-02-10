'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space } from 'antd';
import { ToolOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function FacilitiesMaintenancePage() {
  const requests = [
    { id: 'FM-001', type: 'Repair', asset: 'X-Ray Machine', location: 'Radiology', issue: 'Not powering on', priority: 'High', status: 'In Progress', requestedDate: '2024-02-05', assignedTo: 'Biomedical Engineer', estimatedCompletion: '2024-02-06' },
    { id: 'FM-002', type: 'Maintenance', asset: 'HVAC System', location: 'Ward 3', issue: 'Scheduled maintenance', priority: 'Low', status: 'Scheduled', requestedDate: '2024-02-10', assignedTo: 'Facilities Team', estimatedCompletion: '2024-02-10' },
    { id: 'FM-003', type: 'Repair', asset: 'Elevator B', location: 'Main Building', issue: 'Door not closing properly', priority: 'Medium', status: 'Open', requestedDate: '2024-02-04', assignedTo: null, estimatedCompletion: null },
    { id: 'FM-004', type: 'Replacement', asset: 'Water Heater', location: 'Nursing Station', issue: 'Not heating water', priority: 'High', status: 'Resolved', requestedDate: '2024-02-03', assignedTo: 'Plumbing', estimatedCompletion: '2024-02-04' },
  ];

  const columns = [
    { title: 'Request ID', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color="blue">{type}</Tag> },
    { title: 'Asset/Equipment', dataIndex: 'asset', key: 'asset' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Issue', dataIndex: 'issue', key: 'issue' },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => <Tag color={priority === 'High' ? 'error' : priority === 'Medium' ? 'warning' : 'default'}>{priority}</Tag>,
    },
    { title: 'Requested', dataIndex: 'requestedDate', key: 'requestedDate' },
    { title: 'Assigned To', dataIndex: 'assignedTo', key: 'assignedTo', render: (to: string | null) => to || <Tag color="warning">Unassigned</Tag> },
    { title: 'Est. Completion', dataIndex: 'estimatedCompletion', key: 'estimatedCompletion', render: (date: string | null) => date || '-' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Resolved' ? 'success' : status === 'In Progress' ? 'processing' : status === 'Scheduled' ? 'blue' : 'warning'}>{status}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: any) => (
        <Space>
          <Button type="link" size="small">View Details</Button>
          {record.status === 'Open' && <Button type="link" size="small">Assign</Button>}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-6">
        <Title level={3}>Facilities Maintenance</Title>
        <Button type="primary" icon={<ToolOutlined />}>New Request</Button>
      </div>

      <Card title="Maintenance Requests">
        <Table dataSource={requests} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}
