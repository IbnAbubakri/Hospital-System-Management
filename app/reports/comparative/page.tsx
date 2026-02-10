'use client';

import React, { useState } from 'react';
import { Card, Typography, Table, Button, Space, Row, Col, Select, DatePicker, Statistic, Progress } from 'antd';
import { RiseOutlined, FallOutlined, BarChartOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface ComparisonData {
  id: string;
  metric: string;
  currentPeriod: number;
  previousPeriod: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
}

export default function ComparativeReportPage() {
  const [periodType, setPeriodType] = useState<string>('month-over-month');
  const [dateRange, setDateRange] = useState<any>([dayjs().subtract(30, 'days'), dayjs()]);

  const [comparisonData] = useState<ComparisonData[]>([
    { id: '1', metric: 'Total Patients', currentPeriod: 1250, previousPeriod: 1120, change: 130, changePercent: 11.6, trend: 'up' },
    { id: '2', metric: 'Revenue (₦ Millions)', currentPeriod: 45.5, previousPeriod: 38.2, change: 7.3, changePercent: 19.1, trend: 'up' },
    { id: '3', metric: 'Average Length of Stay', currentPeriod: 3.8, previousPeriod: 4.2, change: -0.4, changePercent: -9.5, trend: 'up' },
    { id: '4', metric: 'Bed Occupancy Rate (%)', currentPeriod: 85, previousPeriod: 82, change: 3, changePercent: 3.7, trend: 'up' },
    { id: '5', metric: 'Patient Satisfaction (%)', currentPeriod: 92, previousPeriod: 89, change: 3, changePercent: 3.4, trend: 'up' },
    { id: '6', metric: 'Readmission Rate (%)', currentPeriod: 4.2, previousPeriod: 5.8, change: -1.6, changePercent: -27.6, trend: 'up' },
    { id: '7', metric: 'Lab Turnaround (Hours)', currentPeriod: 4.2, previousPeriod: 5.1, change: -0.9, changePercent: -17.6, trend: 'up' },
    { id: '8', metric: 'Emergency Wait Time (Min)', currentPeriod: 25, previousPeriod: 32, change: -7, changePercent: -21.9, trend: 'up' },
    { id: '9', metric: 'Staff Overtime (Hours)', currentPeriod: 145, previousPeriod: 168, change: -23, changePercent: -13.7, trend: 'up' },
    { id: '10', metric: 'Medication Errors', currentPeriod: 2, previousPeriod: 5, change: -3, changePercent: -60, trend: 'up' },
  ]);

  const columns = [
    { title: 'Metric', dataIndex: 'metric', key: 'metric', width: 250 },
    {
      title: 'Current Period',
      dataIndex: 'currentPeriod',
      key: 'currentPeriod',
      align: 'right' as const,
      render: (value: number) => <span className="font-medium">{value.toLocaleString()}</span>,
    },
    {
      title: 'Previous Period',
      dataIndex: 'previousPeriod',
      key: 'previousPeriod',
      align: 'right' as const,
      render: (value: number) => <span>{value.toLocaleString()}</span>,
    },
    {
      title: 'Change',
      dataIndex: 'change',
      key: 'change',
      align: 'right' as const,
      render: (value: number) => (
        <span style={{ color: value > 0 ? '#cf1322' : value < 0 ? '#3f8600' : '#8c8c8c' }}>
          {value > 0 ? '+' : ''}{value.toLocaleString()}
        </span>
      ),
    },
    {
      title: '% Change',
      dataIndex: 'changePercent',
      key: 'changePercent',
      align: 'right' as const,
      render: (value: number, record: ComparisonData) => (
        <Space>
          {record.trend === 'up' ? <RiseOutlined style={{ color: '#3f8600' }} /> : record.trend === 'down' ? <FallOutlined style={{ color: '#cf1322' }} /> : null}
          <span style={{ color: value > 0 ? '#3f8600' : value < 0 ? '#cf1322' : '#8c8c8c' }}>
            {value > 0 ? '+' : ''}{value}%
          </span>
        </Space>
      ),
    },
  ];

  const summaryStats = {
    totalMetrics: comparisonData.length,
    improved: comparisonData.filter((d: any) => d.trend === 'up').length,
    avgImprovement: (comparisonData.reduce((sum, d) => sum + Math.abs(d.changePercent), 0) / comparisonData.length).toFixed(1),
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }} className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
      <Title level={3}>Comparative Analysis Reports</Title>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={8}>
          <Card className="p-4 sm:p-6">
            <Statistic title="Total Metrics" value={summaryStats.totalMetrics} prefix={<BarChartOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card className="p-4 sm:p-6">
            <Statistic title="Improved" value={summaryStats.improved} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card className="p-4 sm:p-6">
            <Statistic title="Avg Improvement" value={summaryStats.avgImprovement} suffix="%" />
          </Card>
        </Col>
      </Row>

      <Card
        title="Comparison Data"
        className="p-4 sm:p-6"
        extra={
          <Space wrap>
            <Select value={periodType} onChange={setPeriodType} style={{ width: 150 }}>
              <Select.Option value="month-over-month">Month over Month</Select.Option>
              <Select.Option value="quarter-over-quarter">Quarter over Quarter</Select.Option>
              <Select.Option value="year-over-year">Year over Year</Select.Option>
            </Select>
            <DatePicker.RangePicker
              value={dateRange}
              onChange={setDateRange}
              style={{ width: 250 }}
            />
            <Button icon={<DownloadOutlined />} className="w-full sm:w-auto">Export</Button>
          </Space>
        }
      >
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={comparisonData}
            rowKey="id"
            pagination={false}
          />
        </div>
      </Card>
    </div>
  );
}
