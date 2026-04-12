'use client';

import React from 'react';
import { Card, Row, Col, Typography, Alert } from 'antd';
import { DollarOutlined, BankOutlined, RiseOutlined, FallOutlined, WalletOutlined, BarChartOutlined, StopOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/design-system';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { useAuth } from '@/lib/contexts/AuthContext';

const { Text } = Typography;

export default function FinancialPage() {
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission('financial:view')) {
    return (
      <PageShell title="Financial Management">
        <div className="bg-gray-50 min-h-full">
          <Alert
            title="Access Denied"
            description="You don't have permission to access Financial Management. Please contact your administrator."
            type="error"
            showIcon
            icon={<StopOutlined />}
            className="mb-4"
          />
        </div>
      </PageShell>
    );
  }

  const financialMetrics = {
    totalRevenue: '127.5M',
    expenses: '89.2M',
    netIncome: '38.3M',
    outstanding: '24.6M',
  };

  const ModuleCard = ({ title, description, icon, link, stats, color, bgColor }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    link: string;
    stats?: string;
    color: string;
    bgColor: string;
  }) => (
    <Card
      hoverable
      onClick={() => router.push(link)}
      className="mb-4"
      styles={{ body: { padding: 20 } }}
    >
      <div className=" items-start ">
        <div
          className="  -lg   justify-content text-xl"
          style={{ background: bgColor }}
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
    <div className="bg-gray-50 min-h-full">
      <PageHeader
        title="Financial Management"
        badge="Revenue & Accounting"
        stats={[
          { title: 'Total Revenue', value: `N${financialMetrics.totalRevenue}`, change: '+12.4%', icon: <RiseOutlined />, color: '#10B981', bgColor: '#ECFDF5' },
          { title: 'Expenses', value: `N${financialMetrics.expenses}`, change: '+5.2%', icon: <FallOutlined />, color: '#EF4444', bgColor: '#FEF2F2' },
          { title: 'Net Income', value: `N${financialMetrics.netIncome}`, change: '+18.7%', icon: <DollarOutlined />, color: '#3B82F6', bgColor: '#EFF6FF' },
          { title: 'Outstanding', value: `N${financialMetrics.outstanding}`, change: '-3.1%', icon: <WalletOutlined />, color: '#F59E0B', bgColor: '#FFFBEB' },
        ]}
      />

      <Row gutter={[16, 16]} className="">
        <Col xs={12} sm={6}>
          <StatCard title="Total Revenue" value={`N${financialMetrics.totalRevenue}`} label="This fiscal year" color="#10B981" bgColor="#ECFDF5" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Net Income" value={`N${financialMetrics.netIncome}`} label="After expenses" color="#3B82F6" bgColor="#EFF6FF" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Outstanding" value={`N${financialMetrics.outstanding}`} label="Pending collection" color="#F59E0B" bgColor="#FFFBEB" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Collection Rate" value="87.5%" label="+2.3% from last month" color="#8B5CF6" bgColor="#F5F3FF" />
        </Col>
      </Row>

      <Text strong className="text-base block ">Financial Modules</Text>
      <Row gutter={[16, 16]} className="">
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Collections"
            description="Track patient payments and payment plans"
            icon={<DollarOutlined className="" />}
            link="/financial/collections"
            stats="N12.4M Collected"
            color="#10B981"
            bgColor="#ECFDF5"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Receivables"
            description="Manage outstanding invoices and dues"
            icon={<WalletOutlined className="" />}
            link="/financial/receivables"
            stats="N24.6M Outstanding"
            color="#F59E0B"
            bgColor="#FFFBEB"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Revenue Cycle"
            description="Monitor billing and payment workflows"
            icon={<BarChartOutlined className="" />}
            link="/financial/revenue-cycle"
            stats="87.5% Collection Rate"
            color="#3B82F6"
            bgColor="#EFF6FF"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Cost Center"
            description="Track expenses by department and category"
            icon={<BankOutlined className="" />}
            link="/financial/cost-center"
            stats="15 Cost Centers"
            color="#EF4444"
            bgColor="#FEF2F2"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Profit & Loss"
            description="Financial statements and profitability analysis"
            icon={<RiseOutlined className="" />}
            link="/financial/profit-loss"
            stats="N38.3M Net Income"
            color="#8B5CF6"
            bgColor="#F5F3FF"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Insurance Billing"
            description="Process claims and settlements"
            icon={<DollarOutlined className="text-pink-500" />}
            link="/insurance"
            stats="142 Active Claims"
            color="#EC4899"
            bgColor="#FDF2F8"
          />
        </Col>
      </Row>
    </div>
  );
}
