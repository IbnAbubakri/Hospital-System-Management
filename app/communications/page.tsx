'use client';

import React from 'react';
import { Card, Row, Col, Typography, Alert } from 'antd';
import { MessageOutlined, BellOutlined, CustomerServiceOutlined, AlertOutlined, MailOutlined, TeamOutlined, StopOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/design-system';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { useAuth } from '@/lib/contexts/AuthContext';

const { Text } = Typography;

export default function CommunicationsPage() {
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission('communications:view')) {
    return (
      <div className="bg-gray-50 min-h-full ">
        <Alert
          title="Access Denied"
          description="You don't have permission to access Communications. Please contact your administrator."
          type="error"
          showIcon
          icon={<StopOutlined />}
          className="-xl"
        />
      </div>
    );
  }

  const commMetrics = {
    unreadMessages: 45, announcements: 8, alerts: 3, broadcasts: 12,
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
      className="-xl shadow h-full"
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
    <PageShell title="Communications">
      <div className="bg-gray-50 min-h-full">
      <PageHeader
        title="Communications"
        badge="Internal Messaging"
        stats={[
          { title: 'Messages', value: commMetrics.unreadMessages.toString(), change: 'Unread', icon: <MessageOutlined />, bgColor: '#EFF6FF' },
          { title: 'Announcements', value: commMetrics.announcements.toString(), change: 'Active', icon: <BellOutlined />, bgColor: '#ECFDF5' },
          { title: 'Alerts', value: commMetrics.alerts.toString(), change: 'Active', icon: <AlertOutlined />, bgColor: '#FEF2F2' },
          { title: 'Broadcasts', value: commMetrics.broadcasts.toString(), change: 'This month', icon: <TeamOutlined />, bgColor: '#F5F3FF' },
        ]}
      />

      <Row gutter={[16, 16]} className="">
        <Col xs={12} sm={6}>
          <StatCard title="Unread Messages" value={commMetrics.unreadMessages.toString()} label="In inbox" color="#3B82F6" bgColor="#EFF6FF" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Announcements" value={commMetrics.announcements.toString()} label="Active" color="#10B981" bgColor="#ECFDF5" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Active Alerts" value={commMetrics.alerts.toString()} label="Priority" color="#EF4444" bgColor="#FEF2F2" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Broadcasts" value={commMetrics.broadcasts.toString()} label="This month" color="#8B5CF6" bgColor="#F5F3FF" />
        </Col>
      </Row>

      <Text strong className="text-base block ">Communication Modules</Text>
      <Row gutter={[16, 16]} className="">
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Secure Messaging"
            description="Internal staff communication system"
            icon={<MessageOutlined className="" />}
            link="/communications/secure-messaging"
            stats="45 Unread"
            color="#3B82F6"
            bgColor="#EFF6FF"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Announcements"
            description="Hospital-wide announcements and updates"
            icon={<BellOutlined className="" />}
            link="/communications/announcements"
            stats="8 Active"
            color="#10B981"
            bgColor="#ECFDF5"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Alerts"
            description="Critical alerts and notifications"
            icon={<AlertOutlined className="" />}
            link="/communications/alerts"
            stats="3 Active"
            color="#EF4444"
            bgColor="#FEF2F2"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Broadcasts"
            description="Mass notifications to staff and patients"
            icon={<TeamOutlined className="" />}
            link="/communications/broadcasts"
            stats="12 Sent"
            color="#8B5CF6"
            bgColor="#F5F3FF"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Patient Notifications"
            description="Appointment reminders and updates"
            icon={<MailOutlined className="" />}
            link="/communications/alerts"
            stats="234 Sent Today"
            color="#F59E0B"
            bgColor="#FFFBEB"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Support"
            description="Help desk and support tickets"
            icon={<CustomerServiceOutlined className="text-pink-500" />}
            link="/operations/helpdesk"
            stats="23 Open"
            color="#EC4899"
            bgColor="#FDF2F8"
          />
        </Col>
      </Row>
    </div>
    
  </PageShell>
  );
}
