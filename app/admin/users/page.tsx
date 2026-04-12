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
  { id: 'u2', username: 'adeleke', fullName: 'Dr. Ngozi Adeleke', email: 'emeka.adeleke@hosp.com', role: 'Doctor', department: 'Cardiology', status: 'active', lastLogin: new Date('2024-02-05T07:45'), createdAt: new Date('2023-06-01') },
  { id: 'u3', username: 'ibrahim', fullName: 'Dr. Emeka Okoro', email: 'ibrahim.musa@hosp.com', role: 'Doctor', department: 'General Medicine', status: 'active', lastLogin: new Date('2024-02-04T16:20'), createdAt: new Date('2023-01-15') },
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 ">
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access user management. This area is restricted to administrators only."
          type="error"
          showIcon
          icon={<StopOutlined />}
          className=" -xl"
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
        <div className="  ">
          <Avatar size={40} icon={<UserOutlined />} className="bg-blue-500" />
          <div>
            <div className="font-medium ">{record.fullName}</div>
            <div className=" ">@{record.username}</div>
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
          className={`.5  -md  font-medium ${role === 'Administrator' ? 'bg-blue-100 ' : 'bg-gray-100 '}`}
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
              className=" .5 -md  bg-gray-100  font-medium"
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
          className="bg-gradient-to-br from-violet-500 to-violet-700 shadow"
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
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4  sm: ">
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
      <div className=" sm: overflow-x-auto bg-white -xl border border-gray-200 ">
        <div className=" -col sm:-row items-start sm:   ">
          <div className="  ">
            <UserSwitchOutlined className="text-indigo-500 text-xl" />
            <h2 className=" font-semibold ">User Accounts</h2>
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
      <div className=" sm: overflow-x-auto bg-white -xl border border-gray-200">
        <div className=" -col sm:-row items-start sm:   ">
          <div className="  ">
            <SecurityScanOutlined className="color: '#8B5CF6' text-xl" />
            <h2 className=" font-semibold ">Roles & Permissions</h2>
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
          <div className="  ">
            <UserOutlined style={{ color: '#3B82F6' }} />
            <span>Add New User</span>
          </div>
        }
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        okText="Create User"
      >
        <Form layout="vertical" className="">
          <Form.Item label="Full Name" rules={[{ required: true }]}>
            <input
              type="text"
              placeholder="Enter full name"
              className="w-full   -lg border border-gray-200"
            />
          </Form.Item>
          <Form.Item label="Username" rules={[{ required: true }]}>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full   -lg border border-gray-200"
            />
          </Form.Item>
          <Form.Item label="Email" rules={[{ required: true, type: 'email' }]}>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full   -lg border border-gray-200"
            />
          </Form.Item>
          <Form.Item label="Role" rules={[{ required: true }]}>
            <select className="w-full   -lg border border-gray-200">
              <option value="">Select role</option>
              <option value="Administrator">Administrator</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
            </select>
          </Form.Item>
          <Form.Item label="Department" rules={[{ required: true }]}>
            <select className="w-full   -lg border border-gray-200">
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
              className="w-full   -lg border border-gray-200"
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageShell>
  );
}
