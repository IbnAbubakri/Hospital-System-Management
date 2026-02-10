'use client';

import React from 'react';
import { Table, Button, Badge, Avatar, Modal, Form, Alert, Space } from 'antd';
import { UserOutlined, PlusOutlined, KeyOutlined, StopOutlined, UserSwitchOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';

interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  lastLogin: Date;
  createdAt: Date;
}

const mockUsers: UserAccount[] = [
  { id: 'u1', username: 'admin', fullName: 'System Administrator', email: 'admin@hosp.com', role: 'Administrator', department: 'Administration', status: 'active', lastLogin: new Date('2024-02-05T08:30'), createdAt: new Date('2023-01-01') },
  { id: 'u2', username: 'adeleke', fullName: 'Dr. Emeka Adeleke', email: 'emeka.adeleke@hosp.com', role: 'Doctor', department: 'Cardiology', status: 'active', lastLogin: new Date('2024-02-05T07:45'), createdAt: new Date('2023-06-01') },
  { id: 'u3', username: 'ibrahim', fullName: 'Dr. Ibrahim Musa', email: 'ibrahim.musa@hosp.com', role: 'Doctor', department: 'General Medicine', status: 'active', lastLogin: new Date('2024-02-04T16:20'), createdAt: new Date('2023-01-15') },
];

const mockRoles = [
  { id: 'role1', name: 'Administrator', permissions: ['full_access'], users: 1 },
  { id: 'role2', name: 'Doctor', permissions: ['patients', 'emr', 'prescriptions', 'lab_orders'], users: 5 },
  { id: 'role3', name: 'Nurse', permissions: ['patients', 'triage', 'medications'], users: 5 },
];

export default function UsersPage() {
  const { user, hasPermission } = useAuth();
  const [searchText, setSearchText] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string | undefined>();
  const [userModalVisible, setUserModalVisible] = React.useState(false);
  const [roleModalVisible, setRoleModalVisible] = React.useState(false);

  // CRITICAL SECURITY: Restrict access to administrators only
  if (!hasPermission('admin:users:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '16px' }}>
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access user management. This area is restricted to administrators only."
          type="error"
          showIcon
          icon={<StopOutlined />}
          style={{ marginTop: '24px', borderRadius: '12px' }}
        />
      </div>
    );
  }

  const filteredUsers = mockUsers.filter((userItem) => {
    return (
      userItem.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      userItem.username.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  // Filter by role if selected
  const finalFilteredUsers = roleFilter
    ? filteredUsers.filter((u: any) => u.role === roleFilter)
    : filteredUsers;

  const userColumns = [
    {
      title: 'User',
      key: 'user',
      render: (_: any, record: UserAccount) => (
        <div className="flex items-center gap-3">
          <Avatar size={40} icon={<UserOutlined />} style={{ backgroundColor: '#3B82F6' }} />
          <div>
            <div className="font-medium text-gray-900">{record.fullName}</div>
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
            background: role === 'Administrator' ? '#DBEAFE' : '#F1F5F9',
            color: role === 'Administrator' ? '#1E40AF' : '#475569',
          }}
        >
          {role.toUpperCase()}
        </span>
      ),
    },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (d: Date) => formatDate(d),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="patient" showIcon />,
    },
  ];

  const roleColumns = [
    { title: 'Role Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <Space size={4}>
          {permissions.map((p: any) => (
            <span
              key={p}
              style={{
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                background: '#F1F5F9',
                color: '#475569',
                fontWeight: 500,
              }}
            >
              {p}
            </span>
          ))}
        </Space>
      ),
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
      render: (count: number) => (
        <Badge
          count={count}
          style={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
            boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
          }}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <GradientButton variant="secondary" size="small">
          Edit Permissions
        </GradientButton>
      ),
    },
  ];

  return (
    <PageShell
      title="User Accounts"
      subtitle="Manage system users and access permissions"
      action={
        <GradientButton icon={<PlusOutlined />} onClick={() => setUserModalVisible(true)} className="w-full sm:w-auto">
          Add User
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Total Users"
          value={mockUsers.length}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Active Users"
          value={mockUsers.filter((u: any) => u.status === 'active').length}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="Roles"
          value={mockRoles.length}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={2}
        />
        <StatCard
          label="Departments"
          value={5}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={3}
        />
      </div>

      {/* User Accounts Section */}
      <div className="p-4 sm:p-6 overflow-x-auto" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <UserSwitchOutlined style={{ color: '#6366F1', fontSize: '20px' }} />
            <h2 className="text-lg font-semibold text-gray-900">User Accounts</h2>
          </div>
        </div>

        <SearchFilterBar
          searchPlaceholder="Search users by name or username..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'role',
              label: 'Role',
              value: roleFilter,
              options: [
                { label: 'All Roles', value: '' },
                { label: 'Administrator', value: 'Administrator' },
                { label: 'Doctor', value: 'Doctor' },
                { label: 'Nurse', value: 'Nurse' },
              ],
              onChange: (value) => setRoleFilter(value as string | undefined),
            },
          ]}
          resultCount={finalFilteredUsers.length}
          totalCount={mockUsers.length}
          filterLabel="users"
        />

        <ModernTable
          dataSource={finalFilteredUsers}
          columns={userColumns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </div>

      {/* Roles & Permissions Section */}
      <div className="p-4 sm:p-6 overflow-x-auto" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <SecurityScanOutlined style={{ color: '#8B5CF6', fontSize: '20px' }} />
            <h2 className="text-lg font-semibold text-gray-900">Roles & Permissions</h2>
          </div>
          <GradientButton
            variant="secondary"
            icon={<PlusOutlined />}
            onClick={() => setRoleModalVisible(true)}
          >
            New Role
          </GradientButton>
        </div>

        <ModernTable
          dataSource={mockRoles}
          columns={roleColumns}
          rowKey="id"
          pagination={false}
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
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
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
              <option value="Administrator">Administrator</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
            </select>
          </Form.Item>
          <Form.Item label="Department" rules={[{ required: true }]}>
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
