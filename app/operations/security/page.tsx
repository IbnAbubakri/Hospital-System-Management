'use client';

import React from 'react';
import { Card, Typography, Table, Tag, Space, Button, List } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function SecurityPage() {
  const incidents = [
    { id: 'SEC-001', type: 'Unauthorized Access', location: 'Pharmacy', description: 'Unknown person attempting to access medication storage', date: '2024-02-05 14:30', reportedBy: 'Pharmacy Manager', status: 'Under Investigation', action: 'Security team deployed' },
    { id: 'SEC-002', type: 'Lost Item', location: 'Waiting Area', description: 'Patient reported missing phone', date: '2024-02-05 11:00', reportedBy: 'Front Desk', status: 'Resolved', action: 'Item found and returned' },
    { id: 'SEC-003', type: 'Parking Dispute', location: 'Parking Lot', description: 'Two visitors disputing over parking space', date: '2024-02-05 09:45', reportedBy: 'Security Guard', status: 'Resolved', action: 'Conflict resolved' },
    { id: 'SEC-004', type: 'Visitor Protocol', location: 'ICU', description: 'Visitor attempting to visit after hours', date: '2024-02-04 20:30', reportedBy: 'Nursing Staff', status: 'Resolved', action: 'Visitor turned away' },
  ];

  const patrolSchedule = [
    { time: '06:00 - 14:00', zone: 'Main Building & Wards', guard: 'Security Team A', status: 'Active' },
    { time: '14:00 - 22:00', zone: 'Main Building & Wards', guard: 'Security Team B', status: 'Scheduled' },
    { time: '22:00 - 06:00', zone: 'Main Building & Wards', guard: 'Night Team', status: 'Scheduled' },
    { time: '08:00 - 20:00', zone: 'Parking & Perimeter', guard: 'Patrol Team', status: 'Active' },
  ];

  const columns = [
    { title: 'Incident ID', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color="blue">{type}</Tag> },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Date & Time', dataIndex: 'date', key: 'date' },
    { title: 'Reported By', dataIndex: 'reportedBy', key: 'reportedBy' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Resolved' ? 'success' : status === 'Under Investigation' ? 'warning' : 'error'}>{status}</Tag>,
    },
    { title: 'Action Taken', dataIndex: 'action', key: 'action' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-6">
        <Title level={3}>Security Management</Title>
        <Button type="primary" icon={<SafetyOutlined />}>Report Incident</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{incidents.filter(i => i.status === 'Under Investigation').length}</div>
            <div className="text-gray-500">Active Investigations</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{incidents.filter(i => i.status === 'Resolved').length}</div>
            <div className="text-gray-500">Resolved Today</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{incidents.length}</div>
            <div className="text-gray-500">Total Incidents</div>
          </div>
        </Card>
      </div>

      <Card title="Security Incidents Log" style={{ marginBottom: '24px' }}>
        <Table dataSource={incidents} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Card title="Patrol Schedule">
        <List
          dataSource={patrolSchedule}
          renderItem={(schedule) => (
            <List.Item key={schedule.time}>
              <List.Item.Meta
                avatar={<SafetyOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
                title={
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{schedule.time}</span>
                    <Tag color={schedule.status === 'Active' ? 'success' : 'default'}>{schedule.status}</Tag>
                  </div>
                }
                description={
                  <div>
                    <div><strong>Zone:</strong> {schedule.zone}</div>
                    <div><strong>Guard:</strong> {schedule.guard}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
