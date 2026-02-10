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
    employeeName: 'Dr. Emeka Adeleke',
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
    employeeName: 'Dr. Ibrahim Musa',
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
    employeeName: 'Dr. Chinedu Okonkwo',
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
        <div className="flex items-center gap-3">
          <Avatar size={32} icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{record.employeeName}</div>
            <div className="text-xs text-gray-500">{record.department}</div>
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
          <div className="text-sm">In: {record.checkIn || '—'}</div>
          <div className="text-xs text-gray-500">Out: {record.checkOut || '—'}</div>
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
          <div className="flex items-center gap-2">
            {status === 'present' && <CheckCircleOutlined style={{ color: '#10B981' }} />}
            <Tag style={{ backgroundColor: config.bg, color: config.color, border: 'none', fontWeight: 500 }}>{config.text}</Tag>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <ClockCircleOutlined style={{ color: '#8B5CF6' }} />
              Staff Roster & Scheduling
            </h1>
            <p className="text-gray-500 text-sm">Manage staff shifts and duty schedules</p>
          </div>
          <Button type="primary">Generate Roster</Button>
        </div>

        <Row gutter={[24, 24]} className="mb-6">
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

        <div className="flex items-center gap-3 mb-6">
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
