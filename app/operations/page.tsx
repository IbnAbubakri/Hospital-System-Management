'use client';

import React from 'react';
import { Card, Row, Col, Typography, Alert } from 'antd';
import { ToolOutlined, CarOutlined, HomeOutlined, LockOutlined, CustomerServiceOutlined, BuildOutlined, StopOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/design-system';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAuth } from '@/lib/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';

const { Text } = Typography;

export default function OperationsPage() {
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission('operations:view')) {
    return (
      <div className="bg-gray-50 min-h-full ">
        <Alert
          title="Access Denied"
          description="You don't have permission to access Operations. Please contact your administrator."
          type="error"
          showIcon
          icon={<StopOutlined />}
          className="-xl"
        />
      </div>
    );
  }

  const operationsMetrics = {
    openTickets: 23,
    avgResponseTime: '2.4h',
    facilitiesScore: 92,
    securityAlerts: 4,
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
      style={{ borderRadius: '12px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', cursor: 'pointer', height: '100%' }}
      styles={{ body: { padding: 20 } }}
    >
      <div style={{  alignItems: '-start',  }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            background: bgColor,
                                                fontSize: 22,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <Text strong style={{ fontSize: 15, block, marginBottom: 4 }}>{title}</Text>
          <Text type="secondary" style={{ fontSize: 13 }}>{description}</Text>
          {stats && (
            <div style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 12, color }}>{stats}</Text>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <PageShell title="Operations">
      <div className="bg-gray-50 min-h-full">
      <PageHeader
        title="Operations"
        badge="Facility Management"
        stats={[
          { title: 'Open Tickets', value: operationsMetrics.openTickets.toString(), change: '-3 today', icon: <CustomerServiceOutlined />, color: '#F59E0B', bgColor: '#FFFBEB' },
          { title: 'Avg Response', value: operationsMetrics.avgResponseTime, change: '-0.5h', icon: <ToolOutlined />, color: '#10B981', bgColor: '#ECFDF5' },
          { title: 'Facilities', value: `${operationsMetrics.facilitiesScore}%`, change: '+2%', icon: <BuildOutlined />, color: '#3B82F6', bgColor: '#EFF6FF' },
          { title: 'Security Alerts', value: operationsMetrics.securityAlerts.toString(), change: 'Active', icon: <LockOutlined />, color: '#EF4444', bgColor: '#FEF2F2' },
        ]}
      />

      <Row gutter={[16, 16]} className="">
        <Col xs={12} sm={6}>
          <StatCard title="Open Tickets" value={operationsMetrics.openTickets.toString()} subtitle="IT & Maintenance" color="#F59E0B" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Avg Response Time" value={operationsMetrics.avgResponseTime} subtitle="Across all departments" color="#10B981" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Facilities Score" value={`${operationsMetrics.facilitiesScore}%`} subtitle="Equipment & Cleanliness" color="#3B82F6" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Security Alerts" value={operationsMetrics.securityAlerts.toString()} subtitle="Require attention" color="#EF4444" />
        </Col>
      </Row>

      <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '16px' }}>Operations Modules</Text>
      <Row gutter={[16, 16]} className="">
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Helpdesk"
            description="IT support tickets and technical assistance requests"
            icon={<CustomerServiceOutlined className="" />}
            link="/operations/helpdesk"
            stats="23 Open Tickets"
            color="#3B82F6"
            bgColor="#EFF6FF"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Housekeeping"
            description="Room cleaning schedules and sanitation tracking"
            icon={<HomeOutlined style={{ color: '#10B981' }} />}
            link="/operations/housekeeping"
            stats="156 Rooms Managed"
            color="#10B981"
            bgColor="#ECFDF5"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Security"
            description="Access control, surveillance, and incident response"
            icon={<LockOutlined style={{ color: '#6B7280' }} />}
            link="/operations/security"
            stats="12 Cameras Online"
            color="#6B7280"
            bgColor="#F3F4F6"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Parking"
            description="Parking space management and visitor tracking"
            icon={<CarOutlined style={{ color: '#8B5CF6' }} />}
            link="/operations/parking"
            stats="85 Spaces Available"
            color="#8B5CF6"
            bgColor="#F5F3FF"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Facilities Maintenance"
            description="Equipment maintenance schedules and work orders"
            icon={<BuildOutlined style={{ color: '#F59E0B' }} />}
            link="/operations/facilities-maintenance"
            stats="18 Work Orders"
            color="#F59E0B"
            bgColor="#FFFBEB"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Asset Management"
            description="Track and manage hospital equipment and inventory"
            icon={<ToolOutlined style={{ color: '#EC4899' }} />}
            link="/inventory"
            stats="1,234 Assets"
            color="#EC4899"
            bgColor="#FDF2F8"
          />
        </Col>
      </Row>
    </div>
    </PageShell>
  );
}
