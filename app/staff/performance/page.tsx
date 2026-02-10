'use client';

import React from 'react';
import { Card, Typography, Table, Tag, Space, Progress } from 'antd';

const { Title, Text } = Typography;

export default function StaffPerformancePage() {
  const performance = [
    { id: '1', name: 'Dr. Emeka Adeleke', department: 'Cardiology', patients: 45, satisfaction: 92, punctuality: 95, productivity: 88 },
    { id: '2', name: 'Dr. Ibrahim Musa', department: 'General Medicine', patients: 78, satisfaction: 88, punctuality: 90, productivity: 92 },
    { id: '3', name: 'Nurse Amaka Okafor', department: 'Nursing', patients: 112, satisfaction: 95, punctuality: 98, productivity: 90 },
  ];

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Department', dataIndex: 'department', key: 'department', render: (dept: string) => <Tag>{dept}</Tag> },
    { title: 'Patients Seen', dataIndex: 'patients', key: 'patients', sorter: (a: any, b: any) => a.patients - b.patients },
    {
      title: 'Patient Satisfaction',
      dataIndex: 'satisfaction',
      key: 'satisfaction',
      sorter: (a: any, b: any) => a.satisfaction - b.satisfaction,
      render: (score: number) => <Progress percent={score} size="small" strokeColor="#10B981" />,
    },
    {
      title: 'Punctuality',
      dataIndex: 'punctuality',
      key: 'punctuality',
      render: (score: number) => <Progress percent={score} size="small" strokeColor="#3B82F6" />,
    },
    {
      title: 'Productivity',
      dataIndex: 'productivity',
      key: 'productivity',
      render: (score: number) => <Progress percent={score} size="small" strokeColor="#F59E0B" />,
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={3}>Staff Performance Reviews</Title>
      <Card>
        <Table dataSource={performance} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}
