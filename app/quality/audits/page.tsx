'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Select, DatePicker } from 'antd';
import { AuditOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function QualityAuditsPage() {
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const audits = [
    {
      id: 'AUD-2024-001',
      title: 'Clinical Documentation Audit',
      type: 'Clinical',
      department: 'All Clinical Departments',
      auditor: 'Quality Assurance Team',
      date: '2024-02-05',
      status: 'Completed',
      findings: 12,
      compliant: 85,
      recommendations: 5,
    },
    {
      id: 'AUD-2024-002',
      title: 'Infection Control Audit',
      type: 'Safety',
      department: 'All Departments',
      auditor: 'Infection Control Team',
      date: '2024-02-01',
      status: 'Completed',
      findings: 8,
      compliant: 92,
      recommendations: 3,
    },
    {
      id: 'AUD-2024-003',
      title: 'Medication Management Audit',
      type: 'Pharmacy',
      department: 'Pharmacy',
      auditor: 'External Auditor',
      date: '2024-01-28',
      status: 'Completed',
      findings: 15,
      compliant: 78,
      recommendations: 8,
    },
    {
      id: 'AUD-2024-004',
      title: 'Emergency Preparedness Drill',
      type: 'Safety',
      department: 'Emergency',
      auditor: 'Safety Officer',
      date: '2024-01-25',
      status: 'Completed',
      findings: 6,
      compliant: 88,
      recommendations: 2,
    },
    {
      id: 'AUD-2024-005',
      title: 'Patient Safety Culture Survey',
      type: 'Organizational',
      department: 'All Departments',
      auditor: 'HR Department',
      date: '2024-01-20',
      status: 'Completed',
      findings: 0,
      compliant: 100,
      recommendations: 0,
    },
    {
      id: 'AUD-2024-006',
      title: 'Q1 Internal Quality Audit',
      type: 'Comprehensive',
      department: 'All Departments',
      auditor: 'Quality Director',
      date: '2024-03-15',
      status: 'Scheduled',
      findings: 0,
      compliant: 0,
      recommendations: 0,
    },
  ];

  const columns = [
    { title: 'Audit ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color="blue">{type}</Tag> },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Auditor', dataIndex: 'auditor', key: 'auditor' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Completed' ? 'success' : status === 'In Progress' ? 'processing' : 'default'}>{status}</Tag>,
    },
    {
      title: 'Compliance Rate',
      dataIndex: 'compliant',
      key: 'compliant',
      render: (rate: number) => (
        <span className={rate >= 90 ? 'text-green-600 font-semibold' : rate >= 80 ? 'text-orange-600 font-semibold' : 'text-red-600 font-semibold'}>
          {rate}%
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">View Details</Button>
          <Button type="link" size="small" icon={<DownloadOutlined />}>Download Report</Button>
        </Space>
      ),
    },
  ];

  const filteredAudits = audits.filter(audit => {
    if (statusFilter === 'all') return true;
    return audit.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const avgCompliance = Math.round(
    audits.filter(a => a.status === 'Completed').reduce((sum, a) => sum + a.compliant, 0) /
    audits.filter(a => a.status === 'Completed').length
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Quality Audits</Title>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{audits.length}</div>
            <div className="text-gray-500">Total Audits</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{audits.filter(a => a.status === 'Completed').length}</div>
            <div className="text-gray-500">Completed</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{avgCompliance}%</div>
            <div className="text-gray-500">Avg Compliance</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{audits.reduce((sum, a) => sum + a.recommendations, 0)}</div>
            <div className="text-gray-500">Total Recommendations</div>
          </div>
        </Card>
      </div>

      <Card title="Audit Schedule & Results">
        <div className="mb-4 flex gap-3">
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
          >
            <Select.Option value="all">All Status</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
            <Select.Option value="in progress">In Progress</Select.Option>
            <Select.Option value="scheduled">Scheduled</Select.Option>
          </Select>
          <DatePicker.RangePicker style={{ width: 280 }} />
          <Button type="primary" icon={<AuditOutlined />}>Schedule Audit</Button>
        </div>
        <Table
          dataSource={filteredAudits}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
