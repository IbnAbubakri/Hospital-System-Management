'use client';

import React from 'react';
import { Card, Typography, Table, Tag, Space, Progress, Row, Col } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function DiseaseTrendsPage() {
  const trends = [
    { disease: 'Malaria', cases: 234, trend: 'up', percentage: 15, department: 'General Medicine', severity: 'Moderate' },
    { disease: 'Hypertension', cases: 189, trend: 'up', percentage: 8, department: 'Cardiology', severity: 'High' },
    { disease: 'Diabetes Type 2', cases: 156, trend: 'stable', percentage: 0, department: 'General Medicine', severity: 'Moderate' },
    { disease: 'Asthma', cases: 98, trend: 'up', percentage: 22, department: 'Pediatrics', severity: 'Moderate' },
    { disease: 'Arthritis', cases: 87, trend: 'down', percentage: -5, department: 'Orthopedics', severity: 'Moderate' },
    { disease: 'Migraine', cases: 56, trend: 'up', percentage: 12, department: 'Neurology', severity: 'Low' },
  ];

  const columns = [
    { title: 'Disease/Condition', dataIndex: 'disease', key: 'disease' },
    { title: 'Cases (Monthly)', dataIndex: 'cases', key: 'cases', sorter: (a: any, b: any) => b.cases - a.cases },
    {
      title: 'Trend',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend: string) => (
        <Tag
          icon={trend === 'up' ? '▲' : '▼'}
          color={trend === 'up' ? 'error' : trend === 'stable' ? 'default' : 'success'}
        >
          {trend === 'up' ? 'Increasing' : trend === 'down' ? 'Decreasing' : 'Stable'}
        </Tag>
      ),
    },
    {
      title: 'Change',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (pct: number) => (
        <span className={pct > 0 ? 'text-red-600' : pct < 0 ? 'text-green-600' : ''}>
          {pct > 0 ? '+' : ''}{pct}%
        </span>
      ),
    },
    { title: 'Department', dataIndex: 'department', key: 'department', render: (dept: string) => <Tag>{dept}</Tag> },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => (
        <Tag color={severity === 'High' ? 'error' : severity === 'Moderate' ? 'warning' : 'success'}>
          {severity}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }} className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
      <Title level={3}>Disease Trends & Epidemiology</Title>

      <Card title="Health Alert" className="p-4 sm:p-6">
        <Space orientation="vertical" size="middle">
          <div className="flex items-center gap-3">
            <WarningOutlined style={{ color: '#F59E0B', fontSize: '20px' }} />
            <Text><strong>Malaria cases increasing by 15%</strong> - Additional resources allocated to General Medicine</Text>
          </div>
          <div className="flex items-center gap-3">
            <WarningOutlined style={{ color: '#EF4444', fontSize: '20px' }} />
            <Text><strong>Hypertension cases at 189</strong> - High risk condition requiring monitoring</Text>
          </div>
        </Space>
      </Card>

      <Card title="Monthly Disease Statistics" style={{ marginTop: '24px' }} className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <Table
            dataSource={trends}
            columns={columns}
            rowKey="disease"
            pagination={false}
          />
        </div>
      </Card>
    </div>
  );
}
