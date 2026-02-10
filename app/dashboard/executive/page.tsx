'use client';

import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Progress, Typography, Select, DatePicker, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ExecutiveDashboardPage() {
  const [period, setPeriod] = useState('month');
  const [dateRange, setDateRange] = useState<any>(null);

  const kpis = [
    { title: 'Total Patients', value: 1247, change: 12.5, icon: <UserOutlined />, color: '#3B82F6' },
    { title: 'Today\'s Appointments', value: 89, change: 8.2, icon: <CalendarOutlined />, color: '#10B981' },
    { title: 'Revenue (Month)', value: '₦15.2M', change: 15.3, icon: <DollarOutlined />, color: '#F59E0B' },
    { title: 'Bed Occupancy', value: '78%', change: -5.1, icon: <CalendarOutlined />, color: '#8B5CF6' },
  ];

  const departmentPerformance = [
    { department: 'Cardiology', patients: 245, revenue: '₦3.2M', satisfaction: 92 },
    { department: 'General Medicine', patients: 456, revenue: '₦4.1M', satisfaction: 88 },
    { department: 'Orthopedics', patients: 178, revenue: '₦2.8M', satisfaction: 90 },
    { department: 'Pediatrics', patients: 312, revenue: '₦3.5M', satisfaction: 95 },
    { department: 'Neurology', patients: 56, revenue: '₦1.6M', satisfaction: 87 },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={2}>Executive Dashboard</Title>
          <Text type="secondary">Hospital-wide performance overview</Text>
        </div>
        <Space>
          <Select value={period} onChange={setPeriod} style={{ width: 120 }}>
            <Select.Option value="today">Today</Select.Option>
            <Select.Option value="week">This Week</Select.Option>
            <Select.Option value="month">This Month</Select.Option>
            <Select.Option value="year">This Year</Select.Option>
          </Select>
          <DatePicker.RangePicker onChange={setDateRange} />
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {kpis.map((kpi, index) => (
          <Col key={index} xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={kpi.title}
                value={kpi.value}
                prefix={kpi.icon}
                valueStyle={{ color: kpi.color }}
                suffix={
                  <span style={{ fontSize: '14px', color: kpi.change >= 0 ? '#10B981' : '#EF4444' }}>
                    {kpi.change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {Math.abs(kpi.change)}%
                  </span>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Department Performance" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          {departmentPerformance.map((dept, index) => (
            <Col key={index} xs={24} sm={12} lg={24} xl={12}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text strong>{dept.department}</Text>
                  <Text type="secondary">{dept.patients} patients</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Revenue: {dept.revenue}</Text>
                  <Text>Satisfaction: {dept.satisfaction}%</Text>
                </div>
                <Progress percent={dept.satisfaction} strokeColor={dept.satisfaction >= 90 ? '#10B981' : dept.satisfaction >= 85 ? '#F59E0B' : '#EF4444'} />
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}
