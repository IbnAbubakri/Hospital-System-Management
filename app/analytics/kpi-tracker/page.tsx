'use client';

import React from 'react';
import { Card, Typography, Row, Col, Statistic, Progress, Space, Select, DatePicker, Tag, List } from 'antd';
import { RiseOutlined, FallOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function KPITrackerPage() {
  const [timeRange, setTimeRange] = React.useState('month');

  const kpis = [
    {
      name: 'Patient Satisfaction Score',
      current: 92,
      target: 95,
      previous: 89,
      unit: '%',
      trend: 'up',
      icon: '👍',
      category: 'Quality',
      status: 'on-track',
    },
    {
      name: 'Bed Occupancy Rate',
      current: 78,
      target: 85,
      previous: 82,
      unit: '%',
      trend: 'down',
      icon: '🛏️',
      category: 'Operations',
      status: 'below-target',
    },
    {
      name: 'Average Length of Stay',
      current: 4.2,
      target: 4.0,
      previous: 4.5,
      unit: 'days',
      trend: 'up',
      icon: '📅',
      category: 'Operations',
      status: 'above-target',
    },
    {
      name: 'Readmission Rate',
      current: 8.5,
      target: 7.0,
      previous: 9.2,
      unit: '%',
      trend: 'up',
      icon: '🔄',
      category: 'Quality',
      status: 'below-target',
    },
    {
      name: 'Revenue per Patient',
      current: 125000,
      target: 150000,
      previous: 115000,
      unit: '₦',
      trend: 'up',
      icon: '💰',
      category: 'Financial',
      status: 'below-target',
    },
    {
      name: 'Staff Productivity',
      current: 87,
      target: 90,
      previous: 85,
      unit: '%',
      trend: 'up',
      icon: '⚡',
      category: 'HR',
      status: 'on-track',
    },
    {
      name: 'Emergency Wait Time',
      current: 18,
      target: 15,
      previous: 22,
      unit: 'min',
      trend: 'up',
      icon: '⏱️',
      category: 'Operations',
      status: 'above-target',
    },
    {
      name: 'Medication Error Rate',
      current: 1.2,
      target: 1.0,
      previous: 1.8,
      unit: '%',
      trend: 'up',
      icon: '💊',
      category: 'Safety',
      status: 'below-target',
    },
  ];

  const onTrackCount = kpis.filter(k => k.status === 'on-track').length;
  const belowTargetCount = kpis.filter(k => k.status === 'below-target').length;
  const aboveTargetCount = kpis.filter(k => k.status === 'above-target').length;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Title level={3}>KPI Tracker</Title>
        <Space>
          <Select value={timeRange} onChange={setTimeRange} style={{ width: 120 }}>
            <Select.Option value="week">This Week</Select.Option>
            <Select.Option value="month">This Month</Select.Option>
            <Select.Option value="quarter">This Quarter</Select.Option>
            <Select.Option value="year">This Year</Select.Option>
          </Select>
          <DatePicker.RangePicker style={{ width: 250 }} />
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="On Track"
              value={onTrackCount}
              suffix={`/ ${kpis.length}`}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#10B981' }}
            />
            <Progress percent={Math.round((onTrackCount / kpis.length) * 100)} strokeColor="#10B981" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Below Target"
              value={belowTargetCount}
              suffix={`/ ${kpis.length}`}
              prefix={<FallOutlined />}
              valueStyle={{ color: '#F59E0B' }}
            />
            <Progress percent={Math.round((belowTargetCount / kpis.length) * 100)} strokeColor="#F59E0B" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Above Target"
              value={aboveTargetCount}
              suffix={`/ ${kpis.length}`}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#EF4444' }}
            />
            <Progress percent={Math.round((aboveTargetCount / kpis.length) * 100)} strokeColor="#EF4444" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {kpis.map((kpi, index) => (
          <Col span={12} key={index}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{kpi.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>{kpi.name}</div>
                  <Tag color="blue" style={{ marginTop: '4px' }}>{kpi.category}</Tag>
                </div>
                <Tag color={
                  kpi.status === 'on-track' ? 'success' :
                  kpi.status === 'below-target' ? 'warning' : 'error'
                }>
                  {kpi.status === 'on-track' ? 'On Track' :
                   kpi.status === 'below-target' ? 'Below Target' : 'Above Target'}
                </Tag>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: '#1F2937' }}>
                    {kpi.unit === '₦' ? `₦${kpi.current.toLocaleString()}` : `${kpi.current}${kpi.unit}`}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                    Target: {kpi.unit === '₦' ? `₦${kpi.target.toLocaleString()}` : `${kpi.target}${kpi.unit}`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 600,
                    background: kpi.trend === 'up' ? '#D1FAE5' : '#FEE2E2',
                    color: kpi.trend === 'up' ? '#065F46' : '#991B1B'
                  }}>
                    {kpi.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {kpi.previous !== undefined && `${kpi.unit === '₦' ? '' : kpi.unit} ${kpi.previous}`}
                  </div>
                </div>
              </div>

              <Progress
                percent={Math.min(100, Math.round((kpi.current / kpi.target) * 100))}
                strokeColor={
                  kpi.status === 'on-track' ? '#10B981' :
                  kpi.status === 'below-target' ? '#F59E0B' : '#EF4444'
                }
                showInfo={false}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
