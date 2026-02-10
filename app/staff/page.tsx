'use client';

import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Table, Button, Input, Select, Avatar, Space } from 'antd';
import { UserOutlined, PlusOutlined, EditOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton, InfoCard } from '@/components/design-system';
import { mockDoctors } from '@/lib/mockData';

const { Option } = Select;

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'on-leave';
  email?: string;
  phone?: string;
  location?: string;
}

export default function StaffPage() {
  const [searchText, setSearchText] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>();
  const [roleFilter, setRoleFilter] = useState<string | undefined>();

  const staff: StaffMember[] = [
    ...mockDoctors.map(d => ({
      ...d,
      status: 'active' as const,
      email: `${d.firstName.toLowerCase()}.${d.lastName.toLowerCase()}@hospital.com`,
      phone: '+234 801 234 5678',
      location: d.department,
      department: d.department || 'General',
    })),
    { id: 'n1', firstName: 'Amaka', lastName: 'Okafor', role: 'Nurse', department: 'General Medicine', status: 'active', email: 'amaka.okafor@hospital.com', phone: '+234 802 345 6789', location: 'Ward 3' },
    { id: 'n2', firstName: 'Grace', lastName: 'Adebayo', role: 'Nurse', department: 'ICU', status: 'active', email: ' grace.adebayo@hospital.com', phone: '+234 803 456 7890', location: 'ICU Unit' },
    { id: 'n3', firstName: 'Chinedu', lastName: 'Okonkwo', role: 'Technician', department: 'Laboratory', status: 'active', email: 'chinedu.okonkwo@hospital.com', phone: '+234 804 567 8901', location: 'Lab 1' },
    { id: 'n4', firstName: 'Funmilayo', lastName: 'Adewale', role: 'Receptionist', department: 'Front Desk', status: 'active', email: 'funmilayo.adewale@hospital.com', phone: '+234 805 678 9012', location: 'Main Reception' },
    { id: 'n5', firstName: 'Emeka', lastName: 'Nnamdi', role: 'Doctor', department: 'Cardiology', status: 'on-leave', email: 'emeka.nnamdi@hospital.com', phone: '+234 806 789 0123', location: 'Clinic A' },
  ];

  // Status configuration for staff
  const staffStatusConfig = {
    'active': { color: '#10B981', bg: '#D1FAE5', icon: <UserOutlined /> },
    'inactive': { color: '#6B7280', bg: '#F3F4F6', icon: <UserOutlined /> },
    'on-leave': { color: '#F59E0B', bg: '#FEF3C7', icon: <UserOutlined /> },
  };

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const matchesSearch =
        member.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        member.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
        member.role.toLowerCase().includes(searchText.toLowerCase()) ||
        member.id.toLowerCase().includes(searchText.toLowerCase());
      const matchesDepartment = !departmentFilter || member.department === departmentFilter;
      const matchesRole = !roleFilter || member.role === roleFilter;
      return matchesSearch && matchesDepartment && matchesRole;
    });
  }, [searchText, departmentFilter, roleFilter, staff]);

  const stats = {
    total: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    onLeave: staff.filter(s => s.status === 'on-leave').length,
    doctors: staff.filter(s => s.role === 'Doctor').length,
    nurses: staff.filter(s => s.role === 'Nurse').length,
  };

  const departments = [
    { name: 'Cardiology', staff: 12, onDuty: 10 },
    { name: 'General Medicine', staff: 18, onDuty: 15 },
    { name: 'ICU', staff: 15, onDuty: 12 },
    { name: 'Emergency', staff: 10, onDuty: 10 },
    { name: 'Laboratory', staff: 8, onDuty: 7 },
    { name: 'Radiology', staff: 6, onDuty: 5 },
  ];

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: StaffMember) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} style={{ background: '#3B82F6' }} />
          <div>
            <div className="font-medium text-gray-900">{record.firstName} {record.lastName}</div>
            <div className="text-xs text-gray-500">{record.id}</div>
          </div>
        </Space>
      ),
    },
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
            background: '#DBEAFE',
            color: '#1E40AF',
          }}
        >
          {role}
        </span>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: '#F1F5F9',
            color: '#475569',
          }}
        >
          {dept}
        </span>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location: string) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <EnvironmentOutlined style={{ fontSize: '12px' }} />
          {location}
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_: any, record: StaffMember) => (
        <div className="text-sm">
          {record.email && (
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              <MailOutlined style={{ fontSize: '12px' }} />
              {record.email}
            </div>
          )}
          {record.phone && (
            <div className="flex items-center gap-1 text-gray-600">
              <PhoneOutlined style={{ fontSize: '12px' }} />
              {record.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <StatusTag
          status={status}
          customConfig={staffStatusConfig}
          showIcon
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <GradientButton variant="secondary" size="small" icon={<EditOutlined />}>
          Edit
        </GradientButton>
      ),
    },
  ];

  return (
    <PageShell
      title="Staff Directory"
      subtitle="Manage hospital staff and personnel information"
      action={
        <GradientButton icon={<PlusOutlined />} className="w-full sm:w-auto">
          Add Staff
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Total Staff"
          value={stats.total}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Active Staff"
          value={stats.active}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="On Leave"
          value={stats.onLeave}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={2}
        />
        <StatCard
          label="Doctors"
          value={stats.doctors}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#DDD6FE"
          index={3}
        />
      </div>

      {/* Department Overview */}
      <div className="p-4 sm:p-6 overflow-x-auto" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Overview</h3>
        <Row gutter={[16, 16]}>
          {departments.map((dept) => (
            <Col xs={12} sm={8} md={4} key={dept.name}>
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="font-medium text-gray-900 mb-2">{dept.name}</div>
                <div className="text-sm text-gray-500">
                  <span className="text-green-600 font-semibold">{dept.onDuty}</span> / {dept.staff} on duty
                </div>
                <div className="mt-2" style={{ height: '4px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                      width: `${(dept.onDuty / dept.staff) * 100}%`,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Staff Directory Section */}
      <div className="p-4 sm:p-6 overflow-x-auto" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <SearchFilterBar
          searchPlaceholder="Search staff by name, role, or ID..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'department',
              label: 'Department',
              value: departmentFilter,
              options: [
                { label: 'All Departments', value: '' },
                { label: 'Cardiology', value: 'Cardiology' },
                { label: 'General Medicine', value: 'General Medicine' },
                { label: 'ICU', value: 'ICU' },
                { label: 'Emergency', value: 'Emergency' },
                { label: 'Laboratory', value: 'Laboratory' },
                { label: 'Radiology', value: 'Radiology' },
                { label: 'Front Desk', value: 'Front Desk' },
              ],
              onChange: (value) => setDepartmentFilter(value as string | undefined),
            },
            {
              key: 'role',
              label: 'Role',
              value: roleFilter,
              options: [
                { label: 'All Roles', value: '' },
                { label: 'Doctor', value: 'Doctor' },
                { label: 'Nurse', value: 'Nurse' },
                { label: 'Technician', value: 'Technician' },
                { label: 'Receptionist', value: 'Receptionist' },
              ],
              onChange: (value) => setRoleFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredStaff.length}
          totalCount={staff.length}
          filterLabel="staff members"
        />

        <ModernTable
          dataSource={filteredStaff}
          columns={columns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </div>
    </PageShell>
  );
}
