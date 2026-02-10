'use client';

import React from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';
import { Alert, DatePicker, Button, Space } from 'antd';
import { EyeOutlined, HistoryOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined, SecurityScanOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
  ip: string;
  status: 'Success' | 'Failed';
}

const logs: AuditLog[] = [
  { id: 1, timestamp: '2024-02-05 14:32:15', user: 'admin@hospital.com', action: 'Login', module: 'Authentication', details: 'Successful login', ip: '192.168.1.100', status: 'Success' },
  { id: 2, timestamp: '2024-02-05 14:30:45', user: 'dr.okonkwo@hospital.com', action: 'View', module: 'Patients', details: 'Viewed patient MRN-2024-0001', ip: '192.168.1.105', status: 'Success' },
  { id: 3, timestamp: '2024-02-05 14:28:22', user: 'nurse.chioma@hospital.com', action: 'Update', module: 'Vitals', details: 'Updated vitals for MRN-2024-0005', ip: '192.168.1.110', status: 'Success' },
  { id: 4, timestamp: '2024-02-05 14:25:10', user: 'admin@hospital.com', action: 'Create', module: 'Users', details: 'Created new user account', ip: '192.168.1.100', status: 'Success' },
  { id: 5, timestamp: '2024-02-05 14:20:33', user: 'unknown', action: 'Login', module: 'Authentication', details: 'Failed login attempt', ip: '192.168.1.200', status: 'Failed' },
  { id: 6, timestamp: '2024-02-05 14:15:18', user: 'pharmacy@hospital.com', action: 'Update', module: 'Inventory', details: 'Updated stock for Paracetamol', ip: '192.168.1.115', status: 'Success' },
  { id: 7, timestamp: '2024-02-05 14:10:05', user: 'billing@hospital.com', action: 'Create', module: 'Invoices', details: 'Generated invoice INV-2024-0892', ip: '192.168.1.120', status: 'Success' },
  { id: 8, timestamp: '2024-02-05 14:05:42', user: 'dr.eze@hospital.com', action: 'Delete', module: 'Prescriptions', details: 'Deleted prescription', ip: '192.168.1.108', status: 'Success' },
  { id: 9, timestamp: '2024-02-05 14:00:15', user: 'admin@hospital.com', action: 'Update', module: 'Settings', details: 'Updated system settings', ip: '192.168.1.100', status: 'Success' },
  { id: 10, timestamp: '2024-02-05 13:55:30', user: 'nurse.amina@hospital.com', action: 'View', module: 'Patients', details: 'Viewed patient MRN-2024-0003', ip: '192.168.1.112', status: 'Success' },
  { id: 11, timestamp: '2024-02-05 13:50:12', user: 'dr.adeleke@hospital.com', action: 'Create', module: 'EMR', details: 'Created EMR for patient MRN-2024-0010', ip: '192.168.1.108', status: 'Success' },
  { id: 12, timestamp: '2024-02-05 13:45:08', user: 'admin@hospital.com', action: 'Delete', module: 'Users', details: 'Deactivated user account', ip: '192.168.1.100', status: 'Success' },
  { id: 13, timestamp: '2024-02-05 13:40:25', user: 'unknown', action: 'Login', module: 'Authentication', details: 'Failed login - invalid credentials', ip: '192.168.1.250', status: 'Failed' },
  { id: 14, timestamp: '2024-02-05 13:35:19', user: 'reception@hospital.com', action: 'Create', module: 'Appointments', details: 'Scheduled appointment for MRN-2024-0007', ip: '192.168.1.125', status: 'Success' },
  { id: 15, timestamp: '2024-02-05 13:30:45', user: 'lab@hospital.com', action: 'Update', module: 'Lab Results', details: 'Updated lab results for MRN-2024-0002', ip: '192.168.1.130', status: 'Success' },
];

export default function AuditLogsPage() {
  const { user, hasPermission } = useAuth();
  const [actionFilter, setActionFilter] = React.useState<string>('all');
  const [userFilter, setUserFilter] = React.useState<string>('');
  const [moduleFilter, setModuleFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [dateRange, setDateRange] = React.useState<any>(null);

  // CRITICAL SECURITY: Restrict access to administrators only
  if (!hasPermission('admin:audit_logs:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '16px' }}>
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access audit logs. This area is restricted to administrators only."
          type="error"
          showIcon
          style={{ marginTop: '24px', borderRadius: '12px' }}
        />
      </div>
    );
  }

  const filteredLogs = logs.filter(log => {
    const matchAction = actionFilter === 'all' || log.action === actionFilter;
    const matchUser = !userFilter || log.user.toLowerCase().includes(userFilter.toLowerCase());
    const matchModule = moduleFilter === 'all' || log.module === moduleFilter;
    const matchStatus = statusFilter === 'all' || log.status === statusFilter;

    return matchAction && matchUser && matchModule && matchStatus;
  });

  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));
  const uniqueModules = Array.from(new Set(logs.map(log => log.module)));

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      render: (timestamp: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{timestamp}</span>
      ),
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      width: 200,
      render: (email: string) => (
        <div className="flex items-center gap-2">
          <UserOutlined style={{ color: '#6B7280', fontSize: '14px' }} />
          <span style={{ fontSize: '13px' }}>{email}</span>
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (action: string) => {
        const colors = {
          Create: { bg: '#D1FAE5', color: '#065F46' },
          Update: { bg: '#DBEAFE', color: '#1E40AF' },
          Delete: { bg: '#FEE2E2', color: '#991B1B' },
          View: { bg: '#EDE9FE', color: '#5B21B6' },
          Login: { bg: '#FEF3C7', color: '#92400E' },
        };
        const style = colors[action as keyof typeof colors] || { bg: '#F3F4F6', color: '#374151' };
        return (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              background: style.bg,
              color: style.color,
            }}
          >
            {action}
          </span>
        );
      },
    },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
      width: 120,
      render: (module: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: '#F3F4F6',
            color: '#374151',
          }}
        >
          {module}
        </span>
      ),
    },
    { title: 'Details', dataIndex: 'details', key: 'details' },
    {
      title: 'IP Address',
      dataIndex: 'ip',
      key: 'ip',
      width: 130,
      render: (ip: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#6B7280' }}>{ip}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <div className="flex items-center gap-2">
          {status === 'Success' ? (
            <CheckCircleOutlined style={{ color: '#10B981', fontSize: '16px' }} />
          ) : (
            <CloseCircleOutlined style={{ color: '#EF4444', fontSize: '16px' }} />
          )}
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              background: status === 'Success' ? '#D1FAE5' : '#FEE2E2',
              color: status === 'Success' ? '#065F46' : '#991B1B',
            }}
          >
            {status}
          </span>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: () => (
        <GradientButton variant="secondary" size="small" icon={<EyeOutlined />}>
          View
        </GradientButton>
      ),
    },
  ];

  const successCount = logs.filter(log => log.status === 'Success').length;
  const failedCount = logs.filter(log => log.status === 'Failed').length;

  return (
    <PageShell
      title="Audit Logs"
      subtitle="Track and monitor all system activities and security events"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Total Events"
          value={logs.length}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Successful"
          value={successCount}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="Failed"
          value={failedCount}
          color="#EF4444"
          bg="linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCA5A5"
          index={2}
        />
        <StatCard
          label="Active Users"
          value={Array.from(new Set(logs.map(log => log.user))).length}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={3}
        />
      </div>

      {/* Filters Section */}
      <div className="p-4 sm:p-6 overflow-x-auto" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
        <div className="flex items-center gap-2 mb-4">
          <SecurityScanOutlined style={{ color: '#6366F1', fontSize: '20px' }} />
          <h2 className="text-lg font-semibold text-gray-900">Filter Logs</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={setDateRange}
              placeholder={['Start Date', 'End Date']}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
            <select
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="all">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Module</label>
            <select
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
            >
              <option value="all">All Modules</option>
              {uniqueModules.map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="p-4 sm:p-6 overflow-x-auto" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <SearchFilterBar
          searchPlaceholder="Search by user email..."
          searchValue={userFilter}
          onSearchChange={setUserFilter}
          resultCount={filteredLogs.length}
          totalCount={logs.length}
          filterLabel="logs"
        />

        <ModernTable
          dataSource={filteredLogs}
          columns={columns}
          rowKey="id"
          pagination={{ defaultPageSize: 20 }}
          scroll={{ x: 1400 }}
        />
      </div>
    </PageShell>
  );
}
