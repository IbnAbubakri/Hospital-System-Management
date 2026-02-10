'use client';

import React from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';
import { Table, Button, Avatar, Space, Modal, Form, Alert } from 'antd';
import { UserOutlined, PlusOutlined, SettingOutlined, TeamOutlined, BuildOutlined, FileTextOutlined, HistoryOutlined } from '@ant-design/icons';
import { formatDate } from '@/lib/utils';

interface UserAccount {
  key: string;
  username: string;
  email: string;
  name: string;
  role: string;
  status: 'active' | 'inactive';
}

interface AdminSection {
  key: string;
  title: string;
  icon: React.ReactNode;
  count: number;
  path: string;
  color: string;
  bg: string;
  border: string;
}

const mockUsers: UserAccount[] = [
  { key: '1', username: 'ebrown', email: 'e.brown@medicore.com', name: 'Emily Brown', role: 'Doctor', status: 'active' },
  { key: '2', username: 'mchen', email: 'm.chen@medicore.com', name: 'Michael Chen', role: 'Doctor', status: 'active' },
  { key: '3', username: 'sjohnson', email: 's.johnson@medicore.com', name: 'Sarah Johnson', role: 'Nurse', status: 'active' },
  { key: '4', username: 'jwilson', email: 'j.wilson@medicore.com', name: 'James Wilson', role: 'Admin', status: 'active' },
  { key: '5', username: 'ldavis', email: 'l.davis@medicore.com', name: 'Lisa Davis', role: 'Receptionist', status: 'inactive' },
  { key: '6', username: 'akumar', email: 'a.kumar@medicore.com', name: 'Amit Kumar', role: 'Doctor', status: 'active' },
  { key: '7', username: 'peme', email: 'p.eme@medicore.com', name: 'Patience Eme', role: 'Nurse', status: 'active' },
  { key: '8', username: 'oko', email: 'o.okoro@medicore.com', name: 'Obinna Okoro', role: 'Admin', status: 'active' },
];

const adminSections: AdminSection[] = [
  {
    key: 'users',
    title: 'User Accounts',
    icon: <TeamOutlined />,
    count: mockUsers.length,
    path: '/admin/users',
    color: '#3B82F6',
    bg: 'linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)',
    border: '#93C5FD'
  },
  {
    key: 'roles',
    title: 'Roles & Permissions',
    icon: <SettingOutlined />,
    count: 5,
    path: '/admin/roles',
    color: '#8B5CF6',
    bg: 'linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)',
    border: '#C4B5FD'
  },
  {
    key: 'departments',
    title: 'Departments',
    icon: <BuildOutlined />,
    count: 8,
    path: '/admin/departments',
    color: '#10B981',
    bg: 'linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)',
    border: '#6EE7B7'
  },
  {
    key: 'master',
    title: 'Master Data',
    icon: <FileTextOutlined />,
    count: 50,
    path: '/admin/master-data',
    color: '#F59E0B',
    bg: 'linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)',
    border: '#FCD34D'
  },
  {
    key: 'facilities',
    title: 'Facilities',
    icon: <BuildOutlined />,
    count: 3,
    path: '/admin/facilities',
    color: '#EF4444',
    bg: 'linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)',
    border: '#FCA5A5'
  },
  {
    key: 'audit',
    title: 'Audit Logs',
    icon: <HistoryOutlined />,
    count: 1250,
    path: '/admin/audit-logs',
    color: '#6366F1',
    bg: 'linear-gradient(135deg, #E0E7FF 0%, rgba(255,255,255,0.8) 100%)',
    border: '#A5B4FC'
  },
];

export default function AdminPage() {
  const { user, hasPermission } = useAuth();
  const [searchText, setSearchText] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string | undefined>();
  const [modalVisible, setModalVisible] = React.useState(false);

  // CRITICAL SECURITY: Restrict access to administrators only
  if (!hasPermission('admin:dashboard:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '16px' }}>
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access the admin dashboard. This area is restricted to administrators only."
          type="error"
          showIcon
          style={{ marginTop: '24px', borderRadius: '12px' }}
        />
      </div>
    );
  }

  const filteredUsers = mockUsers.filter((userItem) => {
    const matchesSearch =
      userItem.name.toLowerCase().includes(searchText.toLowerCase()) ||
      userItem.username.toLowerCase().includes(searchText.toLowerCase()) ||
      userItem.email.toLowerCase().includes(searchText.toLowerCase());

    const matchesRole = !roleFilter || userItem.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const userColumns = [
    {
      title: 'User',
      key: 'user',
      render: (_: any, record: UserAccount) => (
        <div className="flex items-center gap-3">
          <Avatar size={40} icon={<UserOutlined />} style={{ backgroundColor: '#3B82F6' }} />
          <div>
            <div className="font-medium text-gray-900">{record.name}</div>
            <div className="text-xs text-gray-500">@{record.username}</div>
          </div>
        </div>
      ),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: role === 'Admin' ? '#DBEAFE' : '#F1F5F9',
            color: role === 'Admin' ? '#1E40AF' : '#475569',
          }}
        >
          {role.toUpperCase()}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="patient" showIcon />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <GradientButton variant="secondary" size="small">
            Edit
          </GradientButton>
        </Space>
      ),
    },
  ];

  return (
    <PageShell
      title="System Administration"
      subtitle="Manage users, roles, permissions, and system configuration"
    >
      {/* Admin Quick Access Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        {adminSections.map((section, index) => (
          <StatCard
            key={section.key}
            label={section.title}
            value={section.count}
            color={section.color}
            bg={section.bg}
            border={section.border}
            index={index}
          />
        ))}
      </div>

      {/* User Management Section */}
      <div className="p-4 sm:p-6 overflow-x-auto" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <TeamOutlined style={{ color: '#3B82F6', fontSize: '20px' }} />
            <h2 className="text-lg font-semibold text-gray-900">User Accounts</h2>
          </div>
          <GradientButton icon={<PlusOutlined />} onClick={() => setModalVisible(true)} className="w-full sm:w-auto">
            Add User
          </GradientButton>
        </div>

        <SearchFilterBar
          searchPlaceholder="Search users by name, username, or email..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'role',
              label: 'Role',
              value: roleFilter,
              options: [
                { label: 'All Roles', value: '' },
                { label: 'Doctor', value: 'Doctor' },
                { label: 'Nurse', value: 'Nurse' },
                { label: 'Admin', value: 'Admin' },
                { label: 'Receptionist', value: 'Receptionist' },
              ],
              onChange: (value) => setRoleFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredUsers.length}
          totalCount={mockUsers.length}
          filterLabel="users"
        />

        <ModernTable
          dataSource={filteredUsers}
          columns={userColumns}
          rowKey="key"
          pagination={{ defaultPageSize: 10 }}
        />
      </div>

      {/* Add User Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <UserOutlined style={{ color: '#3B82F6' }} />
            <span>Add New User</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        okText="Create User"
      >
        <Form layout="vertical" style={{ marginTop: '24px' }}>
          <Form.Item label="Full Name" rules={[{ required: true }]}>
            <input
              type="text"
              placeholder="Enter full name"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            />
          </Form.Item>
          <Form.Item label="Username" rules={[{ required: true }]}>
            <input
              type="text"
              placeholder="Enter username"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            />
          </Form.Item>
          <Form.Item label="Email" rules={[{ required: true, type: 'email' }]}>
            <input
              type="email"
              placeholder="Enter email"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            />
          </Form.Item>
          <Form.Item label="Role" rules={[{ required: true }]}>
            <select
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            >
              <option value="">Select role</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Admin">Admin</option>
              <option value="Receptionist">Receptionist</option>
            </select>
          </Form.Item>
          <Form.Item label="Department">
            <select
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            >
              <option value="">Select department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
            </select>
          </Form.Item>
          <Form.Item label="Password" rules={[{ required: true }]}>
            <input
              type="password"
              placeholder="Enter password"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageShell>
  );
}
