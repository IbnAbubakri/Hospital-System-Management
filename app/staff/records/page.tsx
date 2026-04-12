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
        <div className="  ">
          <Avatar size={40} icon={<UserOutlined />} src={record.avatar} />
          <div>
            <div className="font-medium">{record.firstName} {record.lastName}</div>
            <div className=" ">{record.employeeNumber}</div>
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
<div className="min-h-screen  bg-gradient-to-b from-sky-50 to-slate-50">
    <div className="bg-white -xl  border border-slate-200">
        <div className=" -col sm:-row items-start sm:   ">
          <div>
            <h1 className="text-2xl font-semibold  ">Employee Records</h1>
            <p className=" ">Manage all employee information</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />}>Add Employee</Button>
        </div>

        <div className="   ">
          <Input placeholder="Search employees..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} className="-1 max-w" />
<Select placeholder="Department" value={deptFilter} onChange={setDeptFilter} allowClear className="" />
          <Select placeholder="Status" value={statusFilter} onChange={setStatusFilter} allowClear className="" />
          <Badge count={filteredEmployees.length} className="bg-indigo-500" />
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
