'use client';

import React from 'react';
import { Card, Typography, Row, Col, Statistic, Progress, Tag, Space, List, Badge } from 'antd';
import { HeartOutlined, UserOutlined, RestOutlined, SyncOutlined, EnvironmentOutlined, TeamOutlined, MedicineBoxOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function RealtimeAnalyticsPage() {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const realtimeStats = {
    totalPatients: 247,
    activeAdmissions: 45,
    availableBeds: 32,
    totalBeds: 180,
    emergencyCases: 8,
    surgeriesInProgress: 6,
    staffOnDuty: 89,
  };

  const departmentStatus = [
    { department: 'Emergency', status: 'Very Busy', patients: 67, capacity: 75, beds: 15, occupancy: 93 },
    { department: 'ICU', status: 'Busy', patients: 9, capacity: 10, beds: 10, occupancy: 90 },
    { department: 'Ward 3', status: 'Moderate', patients: 22, capacity: 30, beds: 30, occupancy: 73 },
    { department: 'Ward 2', status: 'Quiet', patients: 12, capacity: 25, beds: 25, occupancy: 48 },
    { department: 'Pediatrics', status: 'Busy', patients: 24, capacity: 25, beds: 25, occupancy: 96 },
  ];

  const recentActivities = [
    { id: 1, time: '14:28', activity: 'New admission', details: 'Patient admitted to Ward 3', department: 'General Medicine', priority: 'Routine' },
    { id: 2, time: '14:25', activity: 'Discharge processed', details: 'Patient discharged from Ward 2', department: 'General Medicine', priority: 'Routine' },
    { id: 3, time: '14:22', activity: 'Emergency case', details: 'Patient admitted to Emergency', department: 'Emergency', priority: 'Urgent' },
    { id: 4, time: '14:18', activity: 'Surgery started', details: 'C-Section in progress', department: 'Obstetrics', priority: 'Scheduled' },
    { id: 5, time: '14:15', activity: 'Lab critical', details: 'Critical value reported', department: 'Laboratory', priority: 'Urgent' },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1600px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Title level={3}>Real-Time Analytics</Title>
        <Space>
          <Badge status="processing" text="Live" />
          <span style={{ color: '#6B7280' }}>Updated: {currentTime.toLocaleTimeString()}</span>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Current Patients"
              value={realtimeStats.totalPatients}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#6366F1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Admissions"
              value={realtimeStats.activeAdmissions}
              prefix={<MedicineBoxOutlined />}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Available Beds"
              value={realtimeStats.availableBeds}
              suffix={`/ ${realtimeStats.totalBeds}`}
              prefix={<RestOutlined />}
              valueStyle={{ color: '#8B5CF6' }}
            />
            <Progress
              percent={Math.round(((realtimeStats.totalBeds - realtimeStats.availableBeds) / realtimeStats.totalBeds) * 100)}
              strokeColor="#8B5CF6"
              size="small"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Emergency Cases"
              value={realtimeStats.emergencyCases}
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#EF4444' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Surgeries in Progress"
              value={realtimeStats.surgeriesInProgress}
              prefix={<SyncOutlined spin />}
              valueStyle={{ color: '#F59E0B' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Staff on Duty"
              value={realtimeStats.staffOnDuty}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#059669' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Bed Occupancy Rate">
            <Progress
              type="circle"
              percent={Math.round(((realtimeStats.totalBeds - realtimeStats.availableBeds) / realtimeStats.totalBeds) * 100)}
              strokeColor={{
                '0%': '#6366F1',
                '100%': '#8B5CF6',
              }}
              format={(percent) => `${percent}%`}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Department Status">
            <List
              dataSource={departmentStatus}
              renderItem={(dept) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <EnvironmentOutlined
                        style={{
                          fontSize: '24px',
                          color: dept.occupancy > 90 ? '#EF4444' : dept.occupancy > 75 ? '#F59E0B' : '#10B981'
                        }}
                      />
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>{dept.department}</span>
                        <Tag
                          color={dept.occupancy > 90 ? 'error' : dept.occupancy > 75 ? 'warning' : 'success'}
                        >
                          {dept.status}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', color: '#6B7280' }}>
                          <span>{dept.patients} / {dept.capacity} patients</span>
                          <span>{dept.beds} beds</span>
                        </div>
                        <Progress
                          percent={dept.occupancy}
                          size="small"
                          strokeColor={dept.occupancy > 90 ? '#EF4444' : dept.occupancy > 75 ? '#F59E0B' : '#10B981'}
                          showInfo={false}
                        />
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Recent Activity">
            <List
              dataSource={recentActivities}
              renderItem={(activity) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>{activity.activity}</span>
                        <Tag
                          color={activity.priority === 'Urgent' ? 'error' : activity.priority === 'Scheduled' ? 'blue' : 'default'}
                        >
                          {activity.priority}
                        </Tag>
                      </div>
                    }
                    description={
                      <div style={{ fontSize: '12px', color: '#6B7280' }}>
                        <div>{activity.details}</div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                          <span>{activity.time}</span>
                          <span>{activity.department}</span>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
