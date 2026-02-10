'use client';

import React, { useState } from 'react';
import { Card, Table, Button, Space, Typography, Tag, Avatar, Progress, Row, Col, Select, DatePicker, Input, Statistic } from 'antd';
import { SearchOutlined, FilterOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Appointment {
  id: string;
  patientName: string;
  mrn: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  type: string;
  status: 'Scheduled' | 'Checked In' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
}

export default function DoctorMetricsPage() {
  const [searchText, setSearchText] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>();
  const [doctorFilter, setDoctorFilter] = useState<string | undefined>();

  const doctors = [
    { id: 'd1', name: 'Dr. Emeka Adeleke', department: 'Cardiology', patients: 45, consultations: 156, satisfaction: 92, revenue: '₦3.2M' },
    { id: 'd2', name: 'Dr. Ibrahim Musa', department: 'General Medicine', patients: 78, consultations: 234, satisfaction: 88, revenue: '₦4.1M' },
    { id: 'd3', name: 'Dr. Chinedu Okonkwo', department: 'Orthopedics', patients: 34, consultations: 98, satisfaction: 90, revenue: '₦2.8M' },
    { id: 'd4', name: 'Dr. Aisha Yusuf', department: 'Pediatrics', patients: 67, consultations: 189, satisfaction: 95, revenue: '₦3.5M' },
    { id: 'd5', name: 'Dr. Chioma Nnamani', department: 'Neurology', patients: 23, consultations: 67, satisfaction: 87, revenue: '₦1.6M' },
  ];

  const columns = [
    {
      title: 'Doctor',
      key: 'doctor',
      render: (_: unknown, record: any) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ background: '#3B82F6' }}>
            {record.name.charAt(0)}
          </Avatar>
          <div>
            <div className="font-medium">{record.name}</div>
            <Text type="secondary" className="text-xs">{record.department}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Active Patients',
      dataIndex: 'patients',
      key: 'patients',
      sorter: (a: any, b: any) => a.patients - b.patients,
      render: (patients: number) => <Tag color="blue">{patients}</Tag>,
    },
    {
      title: 'Consultations',
      dataIndex: 'consultations',
      key: 'consultations',
      sorter: (a: any, b: any) => a.consultations - b.consultations,
      render: (count: number) => <span className="font-semibold">{count}</span>,
    },
    {
      title: 'Patient Satisfaction',
      dataIndex: 'satisfaction',
      key: 'satisfaction',
      sorter: (a: any, b: any) => a.satisfaction - b.satisfaction,
      render: (satisfaction: number) => (
        <Progress percent={satisfaction} size="small" strokeColor="#10B981" />
      ),
    },
    {
      title: 'Revenue Generated',
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: (a: any, b: any) => parseFloat(a.revenue.replace(/[₦M]/g, '')) - parseFloat(b.revenue.replace(/[₦M]/g, '')),
      render: (revenue: string) => <span className="font-semibold text-green-600">{revenue}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">View Details</Button>
          <Button type="link" size="small">Full Report</Button>
        </Space>
      ),
    },
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesDept = !departmentFilter || doctor.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const totalStats = {
    patients: doctors.reduce((sum, d) => sum + d.patients, 0),
    consultations: doctors.reduce((sum, d) => sum + d.consultations, 0),
    avgSatisfaction: Math.round(doctors.reduce((sum, d) => sum + d.satisfaction, 0) / doctors.length),
    revenue: '₦15.2M',
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }} className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
      <Title level={3}>Doctor Performance Metrics</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card className="p-4 sm:p-6">
            <Statistic title="Total Active Patients" value={totalStats.patients} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="p-4 sm:p-6">
            <Statistic title="Total Consultations" value={totalStats.consultations} prefix={<CalendarOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="p-4 sm:p-6">
            <Statistic title="Avg Satisfaction" value={totalStats.avgSatisfaction} suffix="%" />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="p-4 sm:p-6">
            <Statistic title="Total Revenue" value={totalStats.revenue} prefix="₦" />
          </Card>
        </Col>
      </Row>

      <Card
        title="Doctor Performance List"
        className="p-4 sm:p-6"
        extra={
          <Space wrap>
            <Input.Search
              placeholder="Search doctors..."
              allowClear
              style={{ width: 200 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
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
              <Select.Option value="Neurology">Neurology</Select.Option>
            </Select>
            <DatePicker.RangePicker />
          </Space>
        }
      >
        <div className="overflow-x-auto">
          <Table
            dataSource={filteredDoctors}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 900 }}
          />
        </div>
      </Card>
    </div>
  );
}
