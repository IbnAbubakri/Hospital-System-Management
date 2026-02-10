'use client';

import React, { useState } from 'react';
import { Table, Button, Tag, Input, Select, Avatar, Drawer, Descriptions, Badge, Progress } from 'antd';
import { UserOutlined, PlusOutlined, SearchOutlined, EyeOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { mockEmployees } from '@/lib/mockDataExtended';
import { Employee } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';

const { Option } = Select;

export default function StaffRecordsPage() {
  const [searchText, setSearchText] = useState('');
  const [deptFilter, setDeptFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const filteredEmployees = mockEmployees.filter((emp) => {
    const matchesSearch =
      emp.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.employeeNumber.toLowerCase().includes(searchText.toLowerCase());
    const matchesDept = !deptFilter || emp.department === deptFilter;
    const matchesStatus = !statusFilter || emp.employmentStatus === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const columns = [
    {
      title: 'Employee',
      key: 'employee',
      render: (_: any, record: Employee) => (
        <div className="flex items-center gap-3">
          <Avatar size={40} icon={<UserOutlined />} src={record.avatar} />
          <div>
            <div className="font-medium">{record.firstName} {record.lastName}</div>
            <div className="text-xs text-gray-500">{record.employeeNumber}</div>
          </div>
        </div>
      ),
    },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Designation', dataIndex: 'designation', key: 'designation' },
    {
      title: 'Type',
      dataIndex: 'employmentType',
      key: 'type',
      render: (type: string) => <Tag>{type.toUpperCase()}</Tag>,
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (d: Date) => formatDate(d),
    },
    {
      title: 'Basic Salary',
      dataIndex: 'basicSalary',
      key: 'salary',
      render: (salary: number) => formatCurrency(salary),
    },
    {
      title: 'Status',
      dataIndex: 'employmentStatus',
      key: 'status',
      render: (status: string) => {
        const config: Record<string, { color: string }> = {
          active: { color: 'success' },
          inactive: { color: 'default' },
          on_leave: { color: 'warning' },
          resigned: { color: 'error' },
          terminated: { color: 'error' },
        };
        return <Tag color={config[status]?.color}>{status.replace('_', ' ').toUpperCase()}</Tag>;
      },
    },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: Employee) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => viewEmployee(record)} />
      ),
    },
  ];

  const viewEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    setDrawerVisible(true);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Employee Records</h1>
            <p className="text-gray-500 text-sm">Manage all employee information</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />}>Add Employee</Button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Input placeholder="Search employees..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ flex: 1, maxWidth: '400px' }} />
          <Select placeholder="Department" value={deptFilter} onChange={setDeptFilter} allowClear style={{ width: '150px' }}>
            <Option value="Cardiology">Cardiology</Option>
            <Option value="General Medicine">General Medicine</Option>
            <Option value="Pediatrics">Pediatrics</Option>
            <Option value="Orthopedics">Orthopedics</Option>
            <Option value="Neurology">Neurology</Option>
            <Option value="General Triage">General Triage</Option>
          </Select>
          <Select placeholder="Status" value={statusFilter} onChange={setStatusFilter} allowClear style={{ width: '120px' }}>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="on_leave">On Leave</Option>
          </Select>
          <Badge count={filteredEmployees.length} style={{ background: '#6366F1' }} />
        </div>

        <Table dataSource={filteredEmployees} columns={columns} rowKey="id" pagination={{ defaultPageSize: 10 }} size="middle" />
      </div>

      <Drawer
        title="Employee Details"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={720}
      >
        {selectedEmployee && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Employee Number">{selectedEmployee.employeeNumber}</Descriptions.Item>
            <Descriptions.Item label="Name">{selectedEmployee.firstName} {selectedEmployee.lastName}</Descriptions.Item>
            <Descriptions.Item label="Department">{selectedEmployee.department}</Descriptions.Item>
            <Descriptions.Item label="Designation">{selectedEmployee.designation}</Descriptions.Item>
            <Descriptions.Item label="Employment Type">{selectedEmployee.employmentType}</Descriptions.Item>
            <Descriptions.Item label="Status">{selectedEmployee.employmentStatus.replace('_', ' ').toUpperCase()}</Descriptions.Item>
            <Descriptions.Item label="Join Date">{formatDate(selectedEmployee.joinDate)}</Descriptions.Item>
            <Descriptions.Item label="Basic Salary">{formatCurrency(selectedEmployee.basicSalary)}</Descriptions.Item>
            <Descriptions.Item label="Email" span={2}>{selectedEmployee.email}</Descriptions.Item>
            <Descriptions.Item label="Phone" span={2}>{selectedEmployee.phoneNumber}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}
