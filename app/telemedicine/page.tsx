'use client';

import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { VideoCameraOutlined, MonitorOutlined, ClockCircleOutlined, TeamOutlined, CalendarOutlined, HeartOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/design-system';
import { PageHeader } from '@/components/layout/PageHeader';

const { Text } = Typography;

const telemedicineMetrics = {
  activeSessions: 5, waitingPatients: 12, todayAppointments: 34, completedCalls: 28,
};

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  stats?: string;
  color: string;
  bgColor: string;
}

function ModuleCard({ title, description, icon, link, stats, color, bgColor }: ModuleCardProps) {
  const router = useRouter();

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
            width: 48, height: 48, borderRadius: 10, background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}
        >
          {icon}
        </div>
        <div className="-1">
          <Text strong className="text-base block ">{title}</Text>
          <Text type="secondary" className="">{description}</Text>
          {stats && (
            <div className="">
              <Text className="" style={{ }}undefined>{stats}</Text>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function StatCard({ title, value, subtitle, color }: { title: string; value: string; subtitle: string; color: string }) {
  return (
    <Card className="-xl text-center">
      <Text type="secondary" className=" block">{title}</Text>
      <Text className="text-3xl font-semibold" style={{ }}>{value}</Text>
      <Text type="secondary" className=" block ">{subtitle}</Text>
    </Card>
  );
}

export default function TelemedicinePage() {
  return (
    <PageShell title="Telemedicine">
      <div className="bg-gray-50">
      <PageHeader
        title="Telemedicine"
        badge="Virtual Care"
        stats={[
          { title: 'Active', value: telemedicineMetrics.activeSessions.toString(), change: 'In progress', icon: <VideoCameraOutlined />, bgColor: '#ECFDF5' },
          { title: 'Waiting', value: telemedicineMetrics.waitingPatients.toString(), change: 'Patients', icon: <TeamOutlined />, bgColor: '#FFFBEB' },
          { title: 'Today', value: telemedicineMetrics.todayAppointments.toString(), change: 'Appointments', icon: <CalendarOutlined />, bgColor: '#EFF6FF' },
          { title: 'Completed', value: telemedicineMetrics.completedCalls.toString(), change: 'Today', icon: <ClockCircleOutlined />, bgColor: '#F5F3FF' },
        ]}
      />

      <Row gutter={[16, 16]} className="">
        <Col xs={12} sm={6}>
          <StatCard title="Active Sessions" value={telemedicineMetrics.activeSessions.toString()} subtitle="In progress" color="#10B981" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Waiting Patients" value={telemedicineMetrics.waitingPatients.toString()} subtitle="In queue" color="#F59E0B" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Today Appointments" value={telemedicineMetrics.todayAppointments.toString()} subtitle="Scheduled" color="#3B82F6" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Completed Calls" value={telemedicineMetrics.completedCalls.toString()} subtitle="Today" color="#8B5CF6" />
        </Col>
      </Row>

      <Text strong className="text-base block ">Telemedicine Modules</Text>
      <Row gutter={[16, 16]} className="">
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Video Consultation"
            description="Start or join video calls with patients"
            icon={<VideoCameraOutlined className="" />}
            link="/telemedicine/video"
            stats="5 Active"
            color="#10B981"
            bgColor="#ECFDF5"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Waiting Room"
            description="Virtual waiting room for patients"
            icon={<TeamOutlined className="" />}
            link="/telemedicine/waiting"
            stats="12 Waiting"
            color="#F59E0B"
            bgColor="#FFFBEB"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Remote Monitoring"
            description="Monitor patient vitals remotely"
            icon={<MonitorOutlined className="" />}
            link="/telemedicine/monitoring"
            stats="45 Connected"
            color="#3B82F6"
            bgColor="#EFF6FF"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Book Appointment"
            description="Schedule telemedicine appointments"
            icon={<CalendarOutlined className="" />}
            link="/telemedicine/book"
            stats="34 Today"
            color="#8B5CF6"
            bgColor="#F5F3FF"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Appointment Queue"
            description="View and manage appointment queue"
            icon={<ClockCircleOutlined className="text-pink-500" />}
            link="/telemedicine/appointment"
            stats="Queue View"
            color="#EC4899"
            bgColor="#FDF2F8"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Health Monitoring"
            description="Track patient health metrics"
            icon={<HeartOutlined className="" />}
            link="/telemedicine/monitoring"
            stats="Vital Signs"
            color="#EF4444"
            bgColor="#FEF2F2"
          />
        </Col>
      </Row>
    </div>
    </PageShell>
  );
}
