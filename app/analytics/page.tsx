'use client';

import React from 'react';
import { Card, Row, Col, Typography, Alert } from 'antd';
import { BarChartOutlined, LineChartOutlined, DashboardOutlined, FundOutlined, ClockCircleOutlined, RiseOutlined, StopOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/design-system';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { useAuth } from '@/lib/contexts/AuthContext';

const { Text } = Typography;

export default function AnalyticsPage() {
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission('analytics:view')) {
    return (
      <div className="bg-gray-50 min-h-full ">
        <Alert
          title="Access Denied"
          description="You don't have permission to access Analytics. Please contact your administrator."
          type="error"
          showIcon
          icon={<StopOutlined />}
          className="-xl"
        />
      </div>
    );
  }

  const analyticsMetrics = {
    totalReports: 156,
    kpiScore: 87,
    avgTime: '2.4s',
    activeDashboards: 5,
  };

  const ModuleCard = ({ title, description, icon, link, stats, color, bgColor }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    link: string;
    stats?: string;
    color: string;
    bgColor: string;
  }) => {

  return (
    <Card
      hoverable
      onClick={() => router.push(link)}
      className="-xl border-none shadow cursor-pointer h-full"
      styles={{ body: { padding: 20 } }}
    >
      <div className=" items-start ">
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            background: bgColor,
            display: '',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
          }}
        >
          {icon}
        </div>
        <div className="-1">
          <Text strong className="text-base block ">{title}</Text>
          <Text type="secondary" className="">{description}</Text>
          {stats && (
            <div className="">
              <Text className="" style={{ color }}>{stats}</Text>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <PageShell title="Analytics & Reports">
      <div className="bg-gray-50 min-h-full">
        <PageHeader
          title="Analytics & Reports"
          badge="Business Intelligence"
          stats={[
            { title: 'Reports', value: analyticsMetrics.totalReports.toString(), change: '+12 this week', icon: <BarChartOutlined />, color: '#3B82F6', bgColor: '#EFF6FF' },
            { title: 'KPI Score', value: `${analyticsMetrics.kpiScore}%`, change: '+3%', icon: <RiseOutlined />, color: '#10B981', bgColor: '#ECFDF5' },
            { title: 'Avg Load Time', value: analyticsMetrics.avgTime, change: '-0.5s', icon: <ClockCircleOutlined />, color: '#F59E0B', bgColor: '#FFFBEB' },
            { title: 'Dashboards', value: analyticsMetrics.activeDashboards.toString(), change: 'Active', icon: <DashboardOutlined />, color: '#8B5CF6', bgColor: '#F5F3FF' },
          ]}
        />

        <Row gutter={[16, 16]} className="">
          <Col xs={12} sm={6}>
            <StatCard title="Reports Generated" value={analyticsMetrics.totalReports.toString()} label="This month" color="#3B82F6" bgColor="#EFF6FF" />
          </Col>
          <Col xs={12} sm={6}>
            <StatCard title="KPI Score" value={`${analyticsMetrics.kpiScore}%`} label="Performance" color="#10B981" bgColor="#ECFDF5" />
          </Col>
          <Col xs={12} sm={6}>
            <StatCard title="Avg Load" value={analyticsMetrics.avgTime} label="Report generation" color="#F59E0B" bgColor="#FFFBEB" />
          </Col>
          <Col xs={12} sm={6}>
            <StatCard title="Active Dashboards" value={analyticsMetrics.activeDashboards.toString()} label="Custom views" color="#8B5CF6" bgColor="#F5F3FF" />
          </Col>
        </Row>

        <Text strong className="text-base block ">Analytics Modules</Text>
        <Row gutter={[16, 16]} className="">
          <Col xs={24} sm={12} md={8}>
            <ModuleCard
              title="Comparative Analytics"
              description="Compare metrics across departments and time periods"
              icon={<LineChartOutlined className="" />}
              link="/analytics/comparative"
              stats="Period Comparison"
              color="#3B82F6"
              bgColor="#EFF6FF"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <ModuleCard
              title="Custom Dashboard"
              description="Build personalized analytics dashboards"
              icon={<DashboardOutlined style={{ color: '#10B981' }} />}
              link="/analytics/custom-dashboard"
              stats="5 Active"
              color="#10B981"
              bgColor="#ECFDF5"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <ModuleCard
              title="KPI Tracker"
              description="Monitor key performance indicators"
              icon={<FundOutlined style={{ color: '#F59E0B' }} />}
              link="/analytics/kpi-tracker"
              stats="24 KPIs"
              color="#F59E0B"
              bgColor="#FFFBEB"
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <ModuleCard
              title="Realtime Analytics"
              description="Live data monitoring and alerts"
              icon={<ClockCircleOutlined style={{ color: '#EF4444' }} />}
              link="/analytics/realtime"
              stats="Live Data"
              color="#EF4444"
              bgColor="#FEF2F2"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <ModuleCard
              title="Departmental Reports"
              description="Performance reports by department"
              icon={<BarChartOutlined style={{ color: '#8B5CF6' }} />}
              link="/analytics/departmental"
              stats="12 Depts"
              color="#8B5CF6"
              bgColor="#F5F3FF"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <ModuleCard
              title="Report Builder"
              description="Create custom reports and exports"
              icon={<LineChartOutlined style={{ color: '#EC4899' }} />}
              link="/reports/builder"
              stats="156 Reports"
              color="#EC4899"
              bgColor="#FDF2F8"
            />
          </Col>
        </Row>
      </div>
    </PageShell>
  );
}
}