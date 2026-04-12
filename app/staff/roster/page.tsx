'use client';

import React, { useState } from 'react';
import { Table, Button, Tag, Badge, Card, Form, Input, Select, DatePicker, Progress, Statistic, Row, Col, Avatar } from 'antd';
import { UserOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { formatDate, formatCurrency } from '@/lib/utils';

interface ShiftScheduleItem {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: Date;
  shift: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'present' | 'absent' | 'late' | 'on_leave';
  checkIn?: string;
  checkOut?: string;
  workingHours?: number;
}

const mockSchedule: ShiftScheduleItem[] = [
  {
    id: 'shift1',
    employeeId: 'emp1',
    employeeName: 'Dr. Ngozi Adeleke',
    department: 'Cardiology',
    date: new Date('2024-02-05'),
    shift: 'Morning Shift',
    startTime: '08:00',
    endTime: '16:00',
    status: 'present',
    checkIn: '07:55',
    checkOut: '16:05',
    workingHours: 8.12,
  },
  {
    id: 'shift2',
    employeeId: 'emp2',
    employeeName: 'Dr. Emeka Okoro',
    department: 'General Medicine',
    date: new Date('2024-02-05'),
    shift: 'Morning Shift',
    startTime: '08:00',
    endTime: '16:00',
    status: 'present',
    checkIn: '07:58',
    checkOut: '16:02',
    workingHours: 8.08,
  },
  {
    id: 'shift3',
    employeeId: 'emp3',
    employeeName: 'Dr. Tunde Bakare',
    department: 'Orthopedics',
    date: new Date('2024-02-05'),
    shift: 'Morning Shift',
    startTime: '08:00',
    endTime: '16:00',
    status: 'late',
    checkIn: '08:15',
    checkOut: undefined,
    workingHours: 7.75,
  },
  {
    id: 'shift4',
    employeeId: 'emp4',
    employeeName: 'Dr. Aisha Yusuf',
    department: 'Pediatrics',
    date: new Date('2024-02-05'),
    shift: 'Afternoon Shift',
    startTime: '14:00',
    endTime: '22:00',
    status: 'on_leave',
  },
];

export default function RosterPage() {
  const [searchText, setSearchText] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>();
  const [shiftFilter, setShiftFilter] = useState<string | undefined>();

  const filteredSchedule = mockSchedule.filter((item) => {
    const matchesSearch =
      item.employeeName.toLowerCase().includes(searchText.toLowerCase());
    const matchesDept = !departmentFilter || item.department === departmentFilter;
    const matchesShift = !shiftFilter || item.shift === shiftFilter;
    return matchesSearch && matchesDept && matchesShift;
  });

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; text: string }> = {
      scheduled: { color: '#3B82F6', bg: '#DBEAFE', text: 'Scheduled' },
      present: { color: '#10B981', bg: '#D1FAE5', text: 'Present' },
      absent: { color: '#EF4444', bg: '#FEE2E2', text: 'Absent' },
      late: { color: '#F59E0B', bg: '#FEF3C7', text: 'Late' },
      on_leave: { color: '#6B7280', bg: '#F3F4F6', text: 'On Leave' },
    };
    return configs[status] || configs.scheduled;
  };

  const columns = [
    {
      title: 'Employee',
      key: 'employee',
      render: (_: any, record: ShiftScheduleItem) => (
        <div className="  ">
          <Avatar size={32} icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{record.employeeName}</div>
            <div className=" ">{record.department}</div>
          </div>
        </div>
      ),
    },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (d: Date) => formatDate(d) },
    { title: 'Shift', dataIndex: 'shift', key: 'shift' },
    { title: 'Time', key: 'time', render: (_: any, record: ShiftScheduleItem) => `${record.startTime} - ${record.endTime}` },
    {
      title: 'Check In/Out',
      key: 'check',
      render: (_: any, record: ShiftScheduleItem) => (
        <div>
          <div className="">In: {record.checkIn || '—'}</div>
          <div className=" ">Out: {record.checkOut || '—'}</div>
        </div>
      ),
    },
    {
      title: 'Hours',
      dataIndex: 'workingHours',
      key: 'hours',
      render: (hours?: number) => hours?.toFixed(2) || '—',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getStatusConfig(status);
        return (
          <div className="  ">
            {status === 'present' && <CheckCircleOutlined className="" />}
            <Tag style={{ backgroundColor: config.bg, color: config.color, border: 'none', fontWeight: 500 }}>{config.text}</Tag>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen  bg-gradient-to-b from-sky-50 to-slate-50">
      <div className="bg-white -xl  border border-slate-200">
        <div className=" -col sm:-row items-start sm:   ">
          <div>
            <h1 className="text-2xl font-semibold     ">
              <ClockCircleOutlined className="" />
              Staff Roster & Scheduling
            </h1>
            <p className=" ">Manage staff shifts and duty schedules</p>
          </div>
          <Button type="primary">Generate Roster</Button>
        </div>

        <Row gutter={[24, 24]} className="">
          <Col span={6}>
            <Card>
              <Statistic
                title="Present Today"
                value={mockSchedule.filter((s: any) => s.status === 'present').length}
                valueStyle={{ color: '#10B981' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Absent"
                value={mockSchedule.filter((s: any) => s.status === 'absent').length}
                valueStyle={{ color: '#EF4444' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Late"
                value={mockSchedule.filter((s: any) => s.status === 'late').length}
                valueStyle={{ color: '#F59E0B' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="On Leave"
                value={mockSchedule.filter((s: any) => s.status === 'on_leave').length}
                valueStyle={{ color: '#6B7280' }}
              />
            </Card>
          </Col>
        </Row>

        <div className="   ">
          <Input
            placeholder="Search employees..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Department"
            value={departmentFilter}
            onChange={setDepartmentFilter}
            allowClear
            style={{ width: 150 }}
          >
            <Select.Option value="Cardiology">Cardiology</Select.Option>
            <Select.Option value="General Medicine">General Medicine</Select.Option>
            <Select.Option value="Orthopedics">Orthopedics</Select.Option>
            <Select.Option value="Pediatrics">Pediatrics</Select.Option>
          </Select>
          <Select
            placeholder="Shift"
            value={shiftFilter}
            onChange={setShiftFilter}
            allowClear
            style={{ width: 150 }}
          >
            <Select.Option value="Morning Shift">Morning Shift</Select.Option>
            <Select.Option value="Afternoon Shift">Afternoon Shift</Select.Option>
            <Select.Option value="Night Shift">Night Shift</Select.Option>
          </Select>
        </div>

        <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredSchedule}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
          size="middle"
        />
        </div>
      </div>
    </div>
  );
}
