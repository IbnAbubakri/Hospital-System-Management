'use client';

import React from 'react';
import { Card, Row, Col, Typography, Button, Space, Avatar, Tag, Progress, List, Timeline, Statistic } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  ArrowRightOutlined,
  BellOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function PortalDashboardPage() {
  const router = useRouter();

  const upcomingAppointments = [
    { id: '1', doctor: 'Dr. Emeka Adeleke', date: 'Feb 10, 2024', time: '10:00 AM', type: 'Follow-up', department: 'Cardiology' },
    { id: '2', doctor: 'Dr. Aisha Yusuf', date: 'Feb 15, 2024', time: '02:00 PM', type: 'Consultation', department: 'Pediatrics' },
  ];

  const recentActivity = [
    { id: '1', action: 'Lab results available', date: 'Feb 2, 2024', icon: <FileTextOutlined style={{ color: '#10B981' }} /> },
    { id: '2', action: 'Prescription renewed', date: 'Jan 28, 2024', icon: <MedicineBoxOutlined style={{ color: '#3B82F6' }} /> },
    { id: '3', action: 'Appointment completed', date: 'Jan 25, 2024', icon: <CalendarOutlined style={{ color: '#F59E0B' }} /> },
  ];

  const healthStats = [
    { label: 'Last Checkup', value: 'Jan 25, 2024', color: '#10B981' },
    { label: 'Upcoming Appts', value: '2', color: '#3B82F6' },
    { label: 'Prescriptions', value: '3', color: '#F59E0B' },
    { label: 'Lab Results', value: '5', color: '#8B5CF6' },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Welcome Header */}
      <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Row align="middle" gutter={24}>
          <Col>
            <Avatar size={80} icon={<UserOutlined />} style={{ background: 'white', color: '#667eea' }} />
          </Col>
          <Col style={{ color: 'white' }}>
            <Title level={2} style={{ color: 'white', marginBottom: '8px' }}>
              Welcome back, Chukwuemeka!
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
              MRN: MRN-2024-0001 | Age: 45 years
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {healthStats.map((stat, index) => (
          <Col key={index} xs={12} sm={6}>
            <Card>
              <Statistic
                title={<Text type="secondary">{stat.label}</Text>}
                value={stat.value}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Upcoming Appointments */}
        <Col xs={24} md={12}>
          <Card
            title={<Space><CalendarOutlined />Upcoming Appointments</Space>}
            extra={<Button type="link">View All</Button>}
          >
            <Timeline
              items={upcomingAppointments.map((apt) => ({
                children: (
                  <div>
                    <Text strong>{apt.doctor}</Text>
                    <br />
                    <Text type="secondary">{apt.date} at {apt.time}</Text>
                    <br />
                    <Tag color="blue">{apt.type}</Tag>
                    <Tag>{apt.department}</Tag>
                  </div>
                ),
              }))}
            />
            <Button
              type="primary"
              block
              style={{ marginTop: 16 }}
              icon={<CalendarOutlined />}
            >
              Book New Appointment
            </Button>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col xs={24} md={12}>
          <Card
            title={<Space><BellOutlined />Recent Activity</Space>}
            extra={<Button type="link">View All</Button>}
          >
            <List
              dataSource={recentActivity}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.icon}
                    title={item.action}
                    description={item.date}
                  />
                  <Button type="link" icon={<ArrowRightOutlined />} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card style={{ marginTop: '24px' }}>
        <Title level={4}>Quick Actions</Title>
        <Space wrap>
          <Button type="primary" icon={<CalendarOutlined />}>Book Appointment</Button>
          <Button icon={<FileTextOutlined />}>View Lab Results</Button>
          <Button icon={<MedicineBoxOutlined />}>Request Prescription</Button>
          <Button icon={<HeartOutlined />}>Health Records</Button>
        </Space>
      </Card>
    </div>
  );
}
