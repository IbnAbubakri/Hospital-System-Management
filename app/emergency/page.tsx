'use client';

import React from 'react';
import { Card, Row, Col, Typography, Alert } from 'antd';
import { AimOutlined, BellOutlined, WarningOutlined, CarOutlined, ScheduleOutlined, DashboardOutlined, StopOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/design-system';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { useAuth } from '@/lib/contexts/AuthContext';

const { Text } = Typography;

export default function EmergencyPage() {
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission('emergency:view')) {
    return (
      <div className="bg-gray-50 min-h-full ">
        <Alert
          title="Access Denied"
          description="You don't have permission to access Emergency Services. Please contact your administrator."
          type="error"
          showIcon
          icon={<StopOutlined />}
          className="-xl"
        />
      </div>
    );
  }

  const emergencyMetrics = {
    waiting: 8, critical: 2, ambulanceActive: 3, avgWaitTime: '12 min',
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
      className="-xl border-none cursor-pointer h-full"
      styles={{ body: { padding: 20 } }}
    >
      <div className=" items-start ">
        <div
          className="  -lg    text-xl"
        >
          {icon}
        </div>
          <div className="-1">
          <Text strong className="text-base block ">{title}</Text>
          <Text type="secondary" className="">{description}</Text>
          {stats && (
            <div className="">
              <Text className="">{stats}</Text>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

  return (
    <PageShell title="Emergency Services">
      <div className="bg-gray-50 min-h-full">
      <PageHeader
        title="Emergency Services"
        badge="24/7 Response"
        stats={[
          { title: 'Waiting', value: emergencyMetrics.waiting.toString(), change: 'In queue', icon: <ScheduleOutlined />, bgColor: '#FFFBEB' },
          { title: 'Critical', value: emergencyMetrics.critical.toString(), change: 'Urgent', icon: <WarningOutlined />, bgColor: '#FEF2F2' },
          { title: 'Ambulance', value: emergencyMetrics.ambulanceActive.toString(), change: 'Active missions', icon: <CarOutlined />, bgColor: '#EFF6FF' },
          { title: 'Avg Wait', value: emergencyMetrics.avgWaitTime, change: '-3 min', icon: <DashboardOutlined />, bgColor: '#ECFDF5' },
        ]}
      />

      <Row gutter={[16, 16]} className="">
        <Col xs={12} sm={6}>
          <StatCard title="Patients Waiting" value={emergencyMetrics.waiting.toString()} label="In emergency" color="#F59E0B" bgColor="#FFFBEB" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Critical Cases" value={emergencyMetrics.critical.toString()} label="Require immediate" color="#EF4444" bgColor="#FEF2F2" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Active Ambulance" value={emergencyMetrics.ambulanceActive.toString()} label="On missions" color="#3B82F6" bgColor="#EFF6FF" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Avg Wait Time" value={emergencyMetrics.avgWaitTime} label="-3 min improvement" color="#10B981" bgColor="#ECFDF5" />
        </Col>
      </Row>

      <Text strong className="text-base block ">Emergency Modules</Text>
      <Row gutter={[16, 16]} className="">
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Emergency Dashboard"
            description="Real-time emergency department overview"
            icon={<DashboardOutlined className="" />}
            link="/emergency/dashboard"
            stats="8 Waiting"
            color="#EF4444"
            bgColor="#FEF2F2"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Triage"
            description="Patient triage and prioritization"
            icon={<AimOutlined className="" />}
            link="/triage"
            stats="2 Critical"
            color="#F59E0B"
            bgColor="#FFFBEB"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Tracking Board"
            description="Live tracking of emergency patients"
            icon={<BellOutlined className="" />}
            link="/emergency/tracking-board"
            stats="12 Beds"
            color="#3B82F6"
            bgColor="#EFF6FF"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Ambulance"
            description="Emergency transport and dispatch"
            icon={<CarOutlined className="" />}
            link="/emergency/ambulance"
            stats="3 Active"
            color="#8B5CF6"
            bgColor="#F5F3FF"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Patient Tracking"
            description="Track patient journey through emergency"
            icon={<ScheduleOutlined className="" />}
            link="/emergency/tracking"
            stats="5 In Process"
            color="#10B981"
            bgColor="#ECFDF5"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Quick Register"
            description="Rapid patient registration for emergencies"
            icon={<BellOutlined className="text-pink-500" />}
            link="/emergency/register"
            stats="Fast Track"
            color="#EC4899"
            bgColor="#FDF2F8"
          />
        </Col>
      </Row>
    </div>
    </PageShell>
  );
}
