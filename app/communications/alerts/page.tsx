'use client';

import React from 'react';
import { Card, Typography, Table, Tag, Button, Space, Alert } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function CommunicationsAlertsPage() {
  const [filterType, setFilterType] = React.useState<string>('all');

  const alerts = [
    {
      id: 1,
      type: 'Clinical',
      severity: 'Critical',
      title: 'Critical Lab Result - MRN-2024-0005',
      patient: 'Ngozi Eze',
      description: 'Troponin levels elevated. Immediate physician attention required.',
      department: 'Cardiology',
      timestamp: '2024-02-05 14:25',
      status: 'Active',
      acknowledgedBy: null,
    },
    {
      id: 2,
      type: 'Safety',
      severity: 'High',
      title: 'Equipment Failure - CT Scanner',
      patient: 'N/A',
      description: 'CT Scanner in Diagnostic Center is malfunctioning. Engineering team notified.',
      department: 'Radiology',
      timestamp: '2024-02-05 13:45',
      status: 'Active',
      acknowledgedBy: null,
    },
    {
      id: 3,
      type: 'Operational',
      severity: 'Medium',
      title: 'Low Stock - Insulin Pens',
      patient: 'N/A',
      description: 'Insulin Pens stock below reorder threshold. Only 15 units remaining.',
      department: 'Pharmacy',
      timestamp: '2024-02-05 12:30',
      status: 'Acknowledged',
      acknowledgedBy: 'Pharmacy Manager',
    },
    {
      id: 4,
      type: 'Clinical',
      severity: 'High',
      title: 'Patient Deterioration - Ward 3',
      patient: 'Chukwuemeka Okonkwo',
      description: 'Patient showing signs of respiratory distress. Rapid response activated.',
      department: 'Nursing',
      timestamp: '2024-02-05 11:15',
      status: 'Resolved',
      acknowledgedBy: 'Dr. Okonkwo',
    },
  ];

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => {
        const color = severity === 'Critical' ? 'error' : severity === 'High' ? 'warning' : 'default';
        return <Tag color={color}>{severity}</Tag>;
      },
    },
    { title: 'Alert', dataIndex: 'title', key: 'title' },
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Department', dataIndex: 'department', key: 'department', render: (dept: string) => <Tag color="purple">{dept}</Tag> },
    { title: 'Time', dataIndex: 'timestamp', key: 'timestamp' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Active' ? 'error' : status === 'Acknowledged' ? 'warning' : 'success';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: 'Acknowledged By', dataIndex: 'acknowledgedBy', key: 'acknowledgedBy', render: (by: string | null) => by || '-' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: any) => (
        <Space>
          {record.status === 'Active' && (
            <Button type="link" size="small">Acknowledge</Button>
          )}
          <Button type="link" size="small">View Details</Button>
        </Space>
      ),
    },
  ];

  const filteredAlerts = alerts.filter(alert => {
    if (filterType === 'all') return alert.status === 'Active';
    return alert.type.toLowerCase() === filterType.toLowerCase() && alert.status === 'Active';
  });

  const criticalCount = alerts.filter(a => a.severity === 'Critical' && a.status === 'Active').length;
  const highCount = alerts.filter(a => a.severity === 'High' && a.status === 'Active').length;
  const totalActive = alerts.filter(a => a.status === 'Active').length;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>System Alerts</Title>

      {criticalCount > 0 && (
        <Alert
          title={`${criticalCount} Critical Alert${criticalCount > 1 ? 's' : ''} Require Immediate Attention`}
          type="error"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: '24px' }}
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{criticalCount}</div>
            <div className="text-gray-500">Critical</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{highCount}</div>
            <div className="text-gray-500">High Priority</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{totalActive}</div>
            <div className="text-gray-500">Active Alerts</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{alerts.filter(a => a.status === 'Resolved').length}</div>
            <div className="text-gray-500">Resolved Today</div>
          </div>
        </Card>
      </div>

      <Card title="Active Alerts">
        <div className="mb-4">
          <Space>
            <Tag color={filterType === 'all' ? 'blue' : 'default'} onClick={() => setFilterType('all')} style={{ cursor: 'pointer' }}>
              All ({totalActive})
            </Tag>
            <Tag color={filterType === 'clinical' ? 'blue' : 'default'} onClick={() => setFilterType('clinical')} style={{ cursor: 'pointer' }}>
              Clinical ({alerts.filter(a => a.type === 'Clinical' && a.status === 'Active').length})
            </Tag>
            <Tag color={filterType === 'safety' ? 'blue' : 'default'} onClick={() => setFilterType('safety')} style={{ cursor: 'pointer' }}>
              Safety ({alerts.filter(a => a.type === 'Safety' && a.status === 'Active').length})
            </Tag>
            <Tag color={filterType === 'operational' ? 'blue' : 'default'} onClick={() => setFilterType('operational')} style={{ cursor: 'pointer' }}>
              Operational ({alerts.filter(a => a.type === 'Operational' && a.status === 'Active').length})
            </Tag>
          </Space>
        </div>
        <Table dataSource={filteredAlerts} columns={columns} rowKey="id" pagination={false} />
      </Card>

      <Card title="All Alerts History" style={{ marginTop: '24px' }}>
        <Table dataSource={alerts} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}
