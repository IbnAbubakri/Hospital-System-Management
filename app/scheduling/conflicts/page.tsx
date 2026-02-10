'use client';

import React from 'react';
import { Card, Typography, Table, Tag, Space, Button } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function SchedulingConflictsPage() {
  const conflicts = [
    {
      id: 1,
      type: 'Double Booking',
      doctor: 'Dr. Okonkwo',
      date: '2024-02-06',
      time: '10:00',
      patients: 'Ngozi Eze, Chukwuemeka Okonkwo',
      severity: 'High',
      status: 'Unresolved',
    },
    {
      id: 2,
      type: 'Resource Conflict',
      resource: 'OT Room 1',
      date: '2024-02-06',
      time: '09:00',
      procedures: 'Appendectomy, Cholecystectomy',
      severity: 'High',
      status: 'Unresolved',
    },
    {
      id: 3,
      type: 'Staff Unavailable',
      doctor: 'Dr. Okafor',
      date: '2024-02-05',
      reason: 'On Leave',
      appointments: 5,
      severity: 'Medium',
      status: 'Unresolved',
    },
    {
      id: 4,
      type: 'Equipment Conflict',
      equipment: 'CT Scanner',
      date: '2024-02-05',
      time: '14:00',
      requests: 3,
      capacity: 1,
      severity: 'Medium',
      status: 'Resolved',
    },
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Conflict Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="orange">{type}</Tag>,
    },
    { title: 'Resource/Person', key: 'resource', render: (_: unknown, record: any) => record.doctor || record.resource || record.equipment },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Time', dataIndex: 'time', key: 'time' },
    {
      title: 'Details',
      key: 'details',
      render: (_: unknown, record: any) => (
        <span className="text-sm">{record.patients || record.procedures || `${record.appointments} appointments affected`}</span>
      ),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => <Tag color={severity === 'High' ? 'error' : 'warning'}>{severity}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Resolved' ? 'success' : 'error'}>{status}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: any) => (
        <Space>
          {record.status === 'Unresolved' && (
            <>
              <Button type="link" size="small">Resolve</Button>
              <Button type="link" size="small">View Details</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const highSeverityCount = conflicts.filter(c => c.severity === 'High' && c.status === 'Unresolved').length;
  const totalCount = conflicts.filter(c => c.status === 'Unresolved').length;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Scheduling Conflicts</Title>

      <Card style={{ marginBottom: '24px', backgroundColor: highSeverityCount > 0 ? '#FFF7E6' : undefined }}>
        <div className="flex items-center gap-3">
          <WarningOutlined style={{ fontSize: '24px', color: highSeverityCount > 0 ? '#FF4D4F' : '#52C41A' }} />
          <div>
            <div className="text-lg font-semibold">
              {highSeverityCount > 0 ? `${highSeverityCount} High Priority Conflicts` : 'No Critical Conflicts'}
            </div>
            <div className="text-sm text-gray-600">{totalCount} unresolved conflicts detected</div>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{highSeverityCount}</div>
            <div className="text-gray-500">High Severity</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{conflicts.filter(c => c.severity === 'Medium' && c.status === 'Unresolved').length}</div>
            <div className="text-gray-500">Medium Severity</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{conflicts.filter(c => c.status === 'Resolved').length}</div>
            <div className="text-gray-500">Resolved Today</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{conflicts.length}</div>
            <div className="text-gray-500">Total Conflicts</div>
          </div>
        </Card>
      </div>

      <Card title="All Conflicts">
        <Table dataSource={conflicts} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}
