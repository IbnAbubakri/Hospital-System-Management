'use client';

import React from 'react';
import { Card, Row, Col, Typography, Alert } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, TeamOutlined, ExclamationCircleOutlined, ScheduleOutlined, UserOutlined, StopOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/design-system';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAuth } from '@/lib/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';

const { Text } = Typography;

export default function SchedulingPage() {
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission('scheduling:view')) {
    return (
      <div className="bg-gray-50 ">
        <Alert
          title="Access Denied"
          description="You don't have permission to access Scheduling. Please contact your administrator."
          type="error"
          showIcon
          icon={<StopOutlined />}
          className="-xl"
        />
      </div>
    );
  }

  const schedulingMetrics = {
    todayAppointments: 45, availableSlots: 23, waitlistCount: 12, noShows: 3,
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
      className="-xl shadow cursor-pointer h-full"
      styles={{ body: { padding: 20 } }}
    >
      <div className=" items-start ">
        <div
          className={`  -xl ${bgColor}    text-xl`}
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
    <PageShell title="Scheduling">
      <div className="bg-gray-50">
      <PageHeader
        title="Scheduling"
        badge="Appointments"
        stats={[
          { title: 'Today', value: schedulingMetrics.todayAppointments.toString(), change: '+8 from yesterday', icon: <CalendarOutlined />, bgColor: '#EFF6FF' },
          { title: 'Available', value: schedulingMetrics.availableSlots.toString(), change: 'Open slots', icon: <ClockCircleOutlined />, bgColor: '#ECFDF5' },
          { title: 'Waitlist', value: schedulingMetrics.waitlistCount.toString(), change: 'Patients waiting', icon: <TeamOutlined />, bgColor: '#FFFBEB' },
          { title: 'No-Shows', value: schedulingMetrics.noShows.toString(), change: 'Today', icon: <ExclamationCircleOutlined />, bgColor: '#FEF2F2' },
        ]}
      />

      <Row gutter={[16, 16]} className="">
        <Col xs={12} sm={6}>
          <StatCard title="Today Appointments" value={schedulingMetrics.todayAppointments.toString()} subtitle="Scheduled" color="#3B82F6" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Available Slots" value={schedulingMetrics.availableSlots.toString()} subtitle="Open today" color="#10B981" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Waitlist" value={schedulingMetrics.waitlistCount.toString()} subtitle="Patients waiting" color="#F59E0B" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="No-Shows" value={schedulingMetrics.noShows.toString()} subtitle="Today" color="#EF4444" />
        </Col>
      </Row>

      <Text strong className="text-base block ">Scheduling Modules</Text>
      <Row gutter={[16, 16]} className="">
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Appointments"
            description="Manage patient appointments"
            icon={<CalendarOutlined className="" />}
            link="/scheduling/appointments"
            stats="45 Today"
            color="#3B82F6"
            bgColor="#EFF6FF"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Calendar"
            description="View appointments in calendar format"
            icon={<ClockCircleOutlined className="" />}
            link="/scheduling/calendar"
            stats="Daily View"
            color="#10B981"
            bgColor="#ECFDF5"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Availability"
            description="Manage doctor and resource availability"
            icon={<ScheduleOutlined className="" />}
            link="/scheduling/availability"
            stats="24 Doctors"
            color="#F59E0B"
            bgColor="#FFFBEB"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Waitlist"
            description="Manage patient waitlist"
            icon={<TeamOutlined className="" />}
            link="/scheduling/waitlist"
            stats="12 Waiting"
            color="#8B5CF6"
            bgColor="#F5F3FF"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Conflicts"
            description="Detect and resolve scheduling conflicts"
            icon={<ExclamationCircleOutlined className="" />}
            link="/scheduling/conflicts"
            stats="0 Conflicts"
            color="#EF4444"
            bgColor="#FEF2F2"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Quick Book"
            description="Rapid appointment booking"
            icon={<UserOutlined className="text-pink-500" />}
            link="/patients/appointments/new"
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
