'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, Table, Input, Button, Tag, Select, Drawer, Avatar, Typography, Row, Col, Progress, Statistic, Descriptions, Divider } from 'antd';
import { PlusOutlined, EyeOutlined, SearchOutlined, RiseOutlined, FallOutlined, DollarOutlined, BarChartOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton, InfoCard } from '@/components/design-system';

const { Search } = Input;
const { Option } = Select;
const { Text, Title } = Typography;

interface RevenueMetrics {
  id: string;
  period: string;
  grossRevenue: number;
  netRevenue: number;
  collections: number;
  adjustments: number;
  badDebt: number;
  collectionRate: number;
  daysInAR: number;
}

interface RevenueBreakdown {
  id: string;
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export default function RevenueCycleAnalyticsPage() {
  const [searchText, setSearchText] = useState('');
  const [periodFilter, setPeriodFilter] = useState<string>('current');
  const [selectedMetric, setSelectedMetric] = useState<RevenueMetrics | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mock data
  const [revenueMetrics] = useState<RevenueMetrics[]>([
    {
      id: '1',
      period: 'Jan 2024',
      grossRevenue: 45000000,
      netRevenue: 38250000,
      collections: 35800000,
      adjustments: 4500000,
      badDebt: 2450000,
      collectionRate: 93.6,
      daysInAR: 42,
    },
    {
      id: '2',
      period: 'Dec 2023',
      grossRevenue: 48500000,
      netRevenue: 41225000,
      collections: 39500000,
      adjustments: 4100000,
      badDebt: 1725000,
      collectionRate: 95.8,
      daysInAR: 38,
    },
    {
      id: '3',
      period: 'Nov 2023',
      grossRevenue: 42300000,
      netRevenue: 35955000,
      collections: 33800000,
      adjustments: 3850000,
      badDebt: 2055000,
      collectionRate: 94.0,
      daysInAR: 45,
    },
    {
      id: '4',
      period: 'Oct 2023',
      grossRevenue: 46800000,
      netRevenue: 39780000,
      collections: 38100000,
      adjustments: 4250000,
      badDebt: 1680000,
      collectionRate: 95.8,
      daysInAR: 36,
    },
  ]);

  const [revenueBreakdown] = useState<RevenueBreakdown[]>([
    { id: '1', category: 'Outpatient Services', amount: 18500000, percentage: 48.4, trend: 'up', change: 8.2 },
    { id: '2', category: 'Inpatient Services', amount: 12300000, percentage: 32.2, trend: 'up', change: 5.1 },
    { id: '3', category: 'Laboratory', amount: 4250000, percentage: 11.1, trend: 'stable', change: 0.5 },
    { id: '4', category: 'Radiology', amount: 2150000, percentage: 5.6, trend: 'down', change: -2.3 },
    { id: '5', category: 'Pharmacy', amount: 1020000, percentage: 2.7, trend: 'stable', change: 1.1 },
  ]);

  // Animated stats
  const [animatedStats, setAnimatedStats] = useState({
    grossRevenue: 0,
    netRevenue: 0,
    collections: 0,
    collectionRate: 0,
    daysInAR: 0,
  });

  const stats = useMemo(() => {
    const current = revenueMetrics[0];
    return {
      grossRevenue: current.grossRevenue,
      netRevenue: current.netRevenue,
      collections: current.collections,
      collectionRate: current.collectionRate,
      daysInAR: current.daysInAR,
    };
  }, [revenueMetrics]);

  // Animate stats on mount
  useEffect(() => {
    setMounted(true);
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;

    const currentValues = { ...animatedStats };
    const targets = stats;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        grossRevenue: Math.round(currentValues.grossRevenue + (targets.grossRevenue - currentValues.grossRevenue) * easeProgress),
        netRevenue: Math.round(currentValues.netRevenue + (targets.netRevenue - currentValues.netRevenue) * easeProgress),
        collections: Math.round(currentValues.collections + (targets.collections - currentValues.collections) * easeProgress),
        collectionRate: parseFloat((currentValues.collectionRate + (targets.collectionRate - currentValues.collectionRate) * easeProgress).toFixed(1)),
        daysInAR: Math.round(currentValues.daysInAR + (targets.daysInAR - currentValues.daysInAR) * easeProgress),
      });

      if (step >= steps) {
        clearInterval(interval);
        setAnimatedStats(targets);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const filteredMetrics = useMemo(() => {
    return revenueMetrics.filter((metric) => {
      return metric.period.toLowerCase().includes(searchText.toLowerCase());
    });
  }, [searchText, revenueMetrics]);

  const columns = [
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
      render: (period: string) => <span className="font-medium">{period}</span>,
    },
    {
      title: 'Gross Revenue',
      dataIndex: 'grossRevenue',
      key: 'grossRevenue',
      render: (amount: number) => (
        <span className="font-semibold">₦{amount.toLocaleString()}</span>
      ),
      sorter: (a: RevenueMetrics, b: RevenueMetrics) => a.grossRevenue - b.grossRevenue,
    },
    {
      title: 'Net Revenue',
      dataIndex: 'netRevenue',
      key: 'netRevenue',
      render: (amount: number) => (
        <span className="font-semibold text-blue-600">₦{amount.toLocaleString()}</span>
      ),
    },
    {
      title: 'Collections',
      dataIndex: 'collections',
      key: 'collections',
      render: (amount: number) => (
        <span className="font-semibold text-green-600">₦{amount.toLocaleString()}</span>
      ),
    },
    {
      title: 'Collection Rate',
      dataIndex: 'collectionRate',
      key: 'collectionRate',
      render: (rate: number) => {
        const color = rate >= 95 ? '#10B981' : rate >= 90 ? '#F59E0B' : '#EF4444';
        const bg = rate >= 95 ? '#D1FAE5' : rate >= 90 ? '#FEF3C7' : '#FEE2E2';
        return (
          <Tag style={{ backgroundColor: bg, color: color, border: 'none', fontWeight: 500, padding: '4px 10px', borderRadius: '6px' }}>
            {rate}%
          </Tag>
        );
      },
      sorter: (a: RevenueMetrics, b: RevenueMetrics) => a.collectionRate - b.collectionRate,
    },
    {
      title: 'Days in A/R',
      dataIndex: 'daysInAR',
      key: 'daysInAR',
      render: (days: number) => {
        const color = days <= 40 ? '#10B981' : days <= 50 ? '#F59E0B' : '#EF4444';
        const bg = days <= 40 ? '#D1FAE5' : days <= 50 ? '#FEF3C7' : '#FEE2E2';
        return (
          <Tag style={{ backgroundColor: bg, color: color, border: 'none', fontWeight: 500, padding: '4px 10px', borderRadius: '6px' }}>
            {days} days
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: RevenueMetrics) => (
        <GradientButton
          variant="secondary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedMetric(record);
            setDrawerVisible(true);
          }}
        >
          View Details
        </GradientButton>
      ),
    },
  ];

  const breakdownColumns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <span className="font-medium">{category}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span className="font-semibold">₦{amount.toLocaleString()}</span>
      ),
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => (
        <div>
          <div className="flex items-center gap-2">
            <Progress percent={percentage} size="small" showInfo={false} />
            <span className="text-sm">{percentage}%</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Trend',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend: string, record: RevenueBreakdown) => {
        const icon = trend === 'up' ? <RiseOutlined /> : trend === 'down' ? <FallOutlined /> : <BarChartOutlined />;
        const color = trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : '#6B7280';
        const bg = trend === 'up' ? '#D1FAE5' : trend === 'down' ? '#FEE2E2' : '#F3F4F6';
        const sign = record.change > 0 ? '+' : '';
        return (
          <Tag icon={icon} style={{ backgroundColor: bg, color: color, border: 'none', fontWeight: 500, padding: '4px 10px', borderRadius: '6px' }}>
            {sign}{record.change}%
          </Tag>
        );
      },
    },
  ];

  return (
    <PageShell
      title="Revenue Cycle Analytics"
      subtitle="Comprehensive analysis of revenue performance and collection metrics"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Gross Revenue"
          value={Math.round(animatedStats.grossRevenue / 1000000)}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
          prefix="₦"
          suffix="M"
        />
        <StatCard
          label="Net Revenue"
          value={Math.round(animatedStats.netRevenue / 1000000)}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
          prefix="₦"
          suffix="M"
        />
        <StatCard
          label="Collections"
          value={Math.round(animatedStats.collections / 1000000)}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={2}
          prefix="₦"
          suffix="M"
        />
        <StatCard
          label="Collection Rate"
          value={animatedStats.collectionRate}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#DDD6FE"
          index={3}
          suffix="%"
        />
      </div>

      {/* Revenue Breakdown Section */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown by Service Category</h3>
        <ModernTable
          dataSource={revenueBreakdown}
          columns={breakdownColumns}
          rowKey="id"
          pagination={false}
        />
      </div>

      {/* Monthly Metrics Section */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
        <SearchFilterBar
          searchPlaceholder="Search periods..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          resultCount={filteredMetrics.length}
          totalCount={revenueMetrics.length}
          filterLabel="periods"
        />

        <ModernTable
          dataSource={filteredMetrics}
          columns={columns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </div>

      {/* Detail Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <BarChartOutlined style={{ color: '#3B82F6' }} />
            <span>Revenue Period Details</span>
          </div>
        }
        placement="right"
        size="large"
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedMetric(null);
        }}
      >
        {selectedMetric && (
          <div>
            <InfoCard
              title="Period Overview"
              icon={<DollarOutlined />}
              color="#3B82F6"
            >
              <Descriptions column={1}>
                <Descriptions.Item label="Period">{selectedMetric.period}</Descriptions.Item>
                <Descriptions.Item label="Gross Revenue">
                  <span className="font-semibold text-blue-600">₦{selectedMetric.grossRevenue.toLocaleString()}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Net Revenue">
                  <span className="font-semibold text-green-600">₦{selectedMetric.netRevenue.toLocaleString()}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Collections">
                  <span className="font-semibold">₦{selectedMetric.collections.toLocaleString()}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Adjustments">
                  <span className="text-red-600">-₦{selectedMetric.adjustments.toLocaleString()}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Bad Debt">
                  <span className="text-red-600">-₦{selectedMetric.badDebt.toLocaleString()}</span>
                </Descriptions.Item>
              </Descriptions>
            </InfoCard>

            <InfoCard
              title="Collection Metrics"
              icon={<BarChartOutlined />}
              color="#10B981"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <div className="mb-4">
                    <Text type="secondary">Collection Rate</Text>
                    <div className="text-2xl font-bold" style={{ color: selectedMetric.collectionRate >= 95 ? '#10B981' : '#F59E0B' }}>
                      {selectedMetric.collectionRate}%
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="mb-4">
                    <Text type="secondary">Days in A/R</Text>
                    <div className="text-2xl font-bold" style={{ color: selectedMetric.daysInAR <= 40 ? '#10B981' : '#EF4444' }}>
                      {selectedMetric.daysInAR} days
                    </div>
                  </div>
                </Col>
              </Row>
            </InfoCard>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}
