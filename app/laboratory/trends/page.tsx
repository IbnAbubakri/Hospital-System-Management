'use client';

import React from 'react';
import { Card, Typography, Row, Col, Statistic, Table, Tag, Progress } from 'antd';
import { RiseOutlined, FallOutlined, MinusOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function LabTrendsPage() {
  const testTrends = [
    { test: 'Malaria Parasite', currentMonth: 234, lastMonth: 198, change: 18, trend: 'up', department: 'Parasitology' },
    { test: 'Complete Blood Count', currentMonth: 456, lastMonth: 445, change: 2, trend: 'up', department: 'Hematology' },
    { test: 'Fasting Blood Glucose', currentMonth: 289, lastMonth: 312, change: -7, trend: 'down', department: 'Chemistry' },
    { test: 'Widal Test', currentMonth: 145, lastMonth: 132, change: 10, trend: 'up', department: 'Serology' },
    { test: 'Urinalysis', currentMonth: 178, lastMonth: 180, change: -1, trend: 'stable', department: 'Chemistry' },
    { test: 'Hepatitis B Screen', currentMonth: 89, lastMonth: 95, change: -6, trend: 'down', department: 'Serology' },
    { test: 'Sickling Test', currentMonth: 112, lastMonth: 108, change: 4, trend: 'up', department: 'Hematology' },
    { test: 'HIV Screen', currentMonth: 234, lastMonth: 228, change: 3, trend: 'up', department: 'Serology' },
  ];

  const criticalFindings = [
    { id: 1, patient: 'Fatima Ahmed', test: 'Random Blood Glucose', value: '18.5 mmol/L', normalRange: '< 11.1 mmol/L', severity: 'Critical', date: '2024-02-05 14:20', doctor: 'Dr. Okonkwo' },
    { id: 2, patient: 'Emeka Okafor', test: 'Troponin I', value: '2.5 ng/mL', normalRange: '< 0.04 ng/mL', severity: 'Critical', date: '2024-02-05 12:30', doctor: 'Dr. Eze' },
    { id: 3, patient: 'Chukwuemeka Okonkwo', test: 'Potassium', value: '6.8 mmol/L', normalRange: '3.5-5.1 mmol/L', severity: 'High', date: '2024-02-05 10:15', doctor: 'Dr. Nnamdi' },
  ];

  const columns = [
    { title: 'Test Name', dataIndex: 'test', key: 'test' },
    { title: 'Department', dataIndex: 'department', key: 'department', render: (dept: string) => <Tag color="blue">{dept}</Tag> },
    { title: 'Current Month', dataIndex: 'currentMonth', key: 'currentMonth' },
    { title: 'Last Month', dataIndex: 'lastMonth', key: 'lastMonth' },
    {
      title: 'Change',
      dataIndex: 'change',
      key: 'change',
      render: (change: number, record: any) => (
        <div>
          <span className={change > 0 ? 'text-red-600' : change < 0 ? 'text-green-600' : 'text-gray-600'}>
            {record.trend === 'up' && <RiseOutlined />}
            {record.trend === 'down' && <FallOutlined />}
            {record.trend === 'stable' && <MinusOutlined />}
            {change > 0 ? '+' : ''}{change}%
          </span>
        </div>
      ),
      sorter: (a: any, b: any) => a.change - b.change,
    },
    {
      title: 'Trend',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend: string) => {
        const color = trend === 'up' ? 'error' : trend === 'down' ? 'success' : 'default';
        const label = trend === 'up' ? 'Increasing' : trend === 'down' ? 'Decreasing' : 'Stable';
        return <Tag color={color}>{label}</Tag>;
      },
    },
  ];

  const criticalColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'Test', dataIndex: 'test', key: 'test' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
    { title: 'Normal Range', dataIndex: 'normalRange', key: 'normalRange' },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => <Tag color={severity === 'Critical' ? 'error' : 'warning'}>{severity}</Tag>,
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Notified Doctor', dataIndex: 'doctor', key: 'doctor' },
  ];

  const totalTests = testTrends.reduce((sum, t) => sum + t.currentMonth, 0);
  const lastMonthTests = testTrends.reduce((sum, t) => sum + t.lastMonth, 0);
  const overallChange = Math.round(((totalTests - lastMonthTests) / lastMonthTests) * 100);

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Laboratory Test Trends</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Tests (Month)"
              value={totalTests}
              valueStyle={{ color: totalTests > lastMonthTests ? '#10B981' : '#EF4444' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Last Month Tests"
              value={lastMonthTests}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Change"
              value={overallChange}
              suffix="%"
              prefix={overallChange >= 0 ? <RiseOutlined /> : <FallOutlined />}
              valueStyle={{ color: overallChange >= 0 ? '#EF4444' : '#10B981' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Departments"
              value={Array.from(new Set(testTrends.map(t => t.department))).length}
              suffix=" depts"
            />
          </Card>
        </Col>
      </Row>

      <Card title="Test Trends Analysis" style={{ marginBottom: '24px' }}>
        <Table dataSource={testTrends} columns={columns} rowKey="test" pagination={false} />
      </Card>

      <Card title="Critical Findings Alert" style={{ background: '#FEE2E2', borderColor: '#FECACA' }}>
        <Table dataSource={criticalFindings} columns={criticalColumns} rowKey="id" pagination={false} size="small" />
      </Card>
    </div>
  );
}
