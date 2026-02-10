'use client';

import React from 'react';
import { Card, Typography, Row, Col, Table, DatePicker, Select, Space } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function ComparativeAnalyticsPage() {
  const [comparePeriod, setComparePeriod] = React.useState('month');
  const [baselinePeriod, setBaselinePeriod] = React.useState('lastMonth');

  const comparisonData = [
    { metric: 'Patient Admissions', current: 156, baseline: 142, change: 14, changePercent: 9.9, trend: 'up' },
    { metric: 'Bed Occupancy Rate', current: 78, baseline: 82, change: -4, changePercent: -4.9, trend: 'down' },
    { metric: 'Average Length of Stay', current: 4.2, baseline: 4.5, change: -0.3, changePercent: -6.7, trend: 'up' },
    { metric: 'Patient Satisfaction', current: 92, baseline: 88, change: 4, changePercent: 4.5, trend: 'up' },
    { metric: 'Total Revenue (₦M)', current: 15.2, baseline: 13.8, change: 1.4, changePercent: 10.1, trend: 'up' },
    { metric: 'Operating Costs (₦M)', current: 12.8, baseline: 11.5, change: 1.3, changePercent: 11.3, trend: 'up' },
    { metric: 'Staff Productivity (%)', current: 87, baseline: 84, change: 3, changePercent: 3.6, trend: 'up' },
    { metric: 'Readmission Rate (%)', current: 8.5, baseline: 9.2, change: -0.7, changePercent: -7.6, trend: 'up' },
  ];

  const departmentComparison = [
    { department: 'Cardiology', currentRevenue: 4.5, baselineRevenue: 4.2, growth: 7.1, admissions: 28, baselineAdmissions: 25 },
    { department: 'General Medicine', currentRevenue: 6.2, baselineRevenue: 5.5, growth: 12.7, admissions: 67, baselineAdmissions: 58 },
    { department: 'Orthopedics', currentRevenue: 5.1, baselineRevenue: 4.8, growth: 6.3, admissions: 22, baselineAdmissions: 20 },
    { department: 'Pediatrics', currentRevenue: 3.8, baselineRevenue: 3.5, growth: 8.6, admissions: 34, baselineAdmissions: 30 },
  ];

  const metricColumns = [
    { title: 'Metric', dataIndex: 'metric', key: 'metric' },
    { title: 'Current', dataIndex: 'current', key: 'current' },
    { title: 'Baseline', dataIndex: 'baseline', key: 'baseline' },
    {
      title: 'Change',
      dataIndex: 'change',
      key: 'change',
      render: (_: unknown, record: any) => (
        <span className={record.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}>
          {record.change >= 0 ? '+' : ''}{record.change} ({record.changePercent >= 0 ? '+' : ''}{record.changePercent}%)
        </span>
      ),
    },
  ];

  const departmentColumns = [
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Current Revenue (₦M)', dataIndex: 'currentRevenue', key: 'currentRevenue' },
    { title: 'Baseline Revenue (₦M)', dataIndex: 'baselineRevenue', key: 'baselineRevenue' },
    { title: 'Growth %', dataIndex: 'growth', key: 'growth', render: (val: number) => <span className={val >= 0 ? 'text-green-600' : 'text-red-600'}>{val >= 0 ? '+' : ''}{val}%</span> },
    { title: 'Current Admissions', dataIndex: 'admissions', key: 'admissions' },
    { title: 'Baseline Admissions', dataIndex: 'baselineAdmissions', key: 'baselineAdmissions' },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Comparative Analytics</Title>

      <Card style={{ marginBottom: '24px' }}>
        <Space orientation="vertical" style={{ width: '100%' }} size="large">
          <div className="flex gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-2">Comparison Period</div>
              <Select value={comparePeriod} onChange={setComparePeriod} style={{ width: 200 }}>
                <Select.Option value="week">This Week vs Last Week</Select.Option>
                <Select.Option value="month">This Month vs Last Month</Select.Option>
                <Select.Option value="quarter">This Quarter vs Last Quarter</Select.Option>
                <Select.Option value="year">This Year vs Last Year</Select.Option>
              </Select>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">Baseline Period</div>
              <Select value={baselinePeriod} onChange={setBaselinePeriod} style={{ width: 200 }}>
                <Select.Option value="lastWeek">Last Week</Select.Option>
                <Select.Option value="lastMonth">Last Month</Select.Option>
                <Select.Option value="lastQuarter">Last Quarter</Select.Option>
                <Select.Option value="lastYear">Last Year</Select.Option>
              </Select>
            </div>
            <DatePicker.RangePicker style={{ width: 280 }} />
          </div>
        </Space>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card title="Metric Comparison">
            <div className="overflow-x-auto">
        <Table
              dataSource={comparisonData}
              columns={metricColumns}
              rowKey="metric"
              pagination={false}
              size="small"
            />
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Department Revenue Comparison">
            <div className="overflow-x-auto">
        <Table
              dataSource={departmentComparison}
              columns={departmentColumns}
              rowKey="department"
              pagination={false}
              size="small"
            />
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Key Insights">
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card size="small" title="Best Performing">
              <div className="text-sm mb-2"><strong>General Medicine</strong></div>
              <div className="text-xs text-gray-600">12.7% revenue growth</div>
              <div className="text-xs text-gray-500">+9 admissions</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" title="Improved Metrics">
              <div className="text-sm mb-2"><strong>Readmission Rate</strong></div>
              <div className="text-xs text-green-600">↓ 7.6%</div>
              <div className="text-xs text-gray-500">Target achieved</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" title="Focus Area">
              <div className="text-sm mb-2"><strong>Bed Occupancy</strong></div>
              <div className="text-xs text-orange-600">↓ 4.9%</div>
              <div className="text-xs text-gray-500">Monitor needed</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" title="Growth Opportunity">
              <div className="text-sm mb-2"><strong>Pediatrics</strong></div>
              <div className="text-xs text-blue-600">↑ 8.6%</div>
              <div className="text-xs text-gray-500">Good momentum</div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
