'use client';

import React, { useState } from 'react';
import { Card, Typography, Table, Button, Space, Tag, Row, Col, Select, DatePicker, Statistic, Progress, Input } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  hoursWorked: number;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
}

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>();

  const [attendance] = useState<AttendanceRecord[]>([
    {
      id: '1',
      staffId: 'EMP-001',
      staffName: 'Dr. Emeka Adeleke',
      department: 'Cardiology',
      date: '2024-02-02',
      checkIn: '08:05',
      checkOut: '17:00',
      hoursWorked: 8.9,
      status: 'Present',
    },
    {
      id: '2',
      staffId: 'EMP-002',
      staffName: 'Dr. Ibrahim Musa',
      department: 'General Medicine',
      date: '2024-02-02',
      checkIn: '07:55',
      checkOut: '16:45',
      hoursWorked: 8.8,
      status: 'Present',
    },
    {
      id: '3',
      staffId: 'EMP-003',
      staffName: 'Nurse Amaka Okafor',
      department: 'Nursing',
      date: '2024-02-02',
      checkIn: '08:30',
      checkOut: undefined,
      hoursWorked: 0,
      status: 'Late',
    },
    {
      id: '4',
      staffId: 'EMP-004',
      staffName: 'Nurse Grace Adebayo',
      department: 'Nursing',
      date: '2024-02-02',
      checkIn: '00:00',
      checkOut: '00:00',
      hoursWorked: 0,
      status: 'Absent',
    },
  ]);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: any }> = {
      'Present': { color: 'success', icon: <CheckCircleOutlined /> },
      'Absent': { color: 'error', icon: <ClockCircleOutlined /> },
      'Late': { color: 'warning', icon: <ClockCircleOutlined /> },
      'Half Day': { color: 'processing', icon: <CalendarOutlined /> },
    };
    return configs[status] || configs.Absent;
  };

  const filteredAttendance = attendance.filter((record) => {
    const matchesDept = !departmentFilter || record.department === departmentFilter;
    const matchesDate = record.date === selectedDate;
    return matchesDept && matchesDate;
  });

  const columns = [
    {
      title: 'Staff',
      dataIndex: 'staffName',
      key: 'staffName',
      render: (name: string, record: AttendanceRecord) => (
        <Space>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserOutlined style={{ color: '#3B82F6' }} />
            <div>
              <div className="font-medium">{name}</div>
              <Text type="secondary" className="text-xs">{record.staffId}</Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => <Tag>{dept}</Tag>,
    },
    {
      title: 'Check In',
      dataIndex: 'checkIn',
      key: 'checkIn',
    },
    {
      title: 'Check Out',
      dataIndex: 'checkOut',
      key: 'checkOut',
      render: (time?: string) => time || <Text type="secondary">--</Text>,
    },
    {
      title: 'Hours Worked',
      dataIndex: 'hoursWorked',
      key: 'hoursWorked',
      render: (hours: number) => <span className="font-medium">{hours.toFixed(1)}h</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getStatusConfig(status);
        return <Tag icon={config.icon} color={config.color}>{status}</Tag>;
      },
    },
  ];

  const stats = {
    total: attendance.length,
    present: attendance.filter((a: any) => a.status === 'Present').length,
    absent: attendance.filter((a: any) => a.status === 'Absent').length,
    late: attendance.filter((a: any) => a.status === 'Late').length,
    attendanceRate: Math.round((attendance.filter((a: any) => a.status === 'Present').length / attendance.length) * 100),
    avgHours: attendance.reduce((sum, a) => sum + a.hoursWorked, 0) / attendance.length,
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Time & Attendance Management</Title>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Staff" value={stats.total} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Present Today" value={stats.present} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Absent" value={stats.absent} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Avg Hours" value={stats.avgHours.toFixed(1)} suffix="h" />
          </Card>
        </Col>
      </Row>

      <Card className="overflow-x-auto">
        <Space className="flex flex-col sm:flex-row gap-3" style={{ marginBottom: 16 }}>
          <DatePicker
            value={dayjs(selectedDate)}
            onChange={(date) => setSelectedDate(date ? date.format('YYYY-MM-DD') : '')}
            style={{ width: 200 }}
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
            <Select.Option value="Nursing">Nursing</Select.Option>
            <Select.Option value="Orthopedics">Orthopedics</Select.Option>
          </Select>
          <Button type="primary" className="w-full sm:w-auto">Mark Attendance</Button>
        </Space>

        <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredAttendance}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
        </div>
      </Card>
    </div>
  );
}
