'use client';

import React from 'react';
import { Card, Typography, Row, Col, Statistic, Progress, Tag, Space, List, Avatar } from 'antd';
import { HeartOutlined, SyncOutlined, WifiOutlined, VideoCameraOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function TelemedicineMonitoringPage() {
  const activeSessions = [
    {
      id: 1,
      patient: 'Ngozi Eze',
      doctor: 'Dr. Okonkwo',
      duration: '18:24',
      connectionQuality: 95,
      video: 'active',
      audio: 'active',
      vitals: {
        heartRate: 78,
        bloodPressure: '125/82',
        oxygen: 98,
      },
    },
    {
      id: 2,
      patient: 'Chukwuemeka Okonkwo',
      doctor: 'Dr. Eze',
      duration: '12:45',
      connectionQuality: 87,
      video: 'active',
      audio: 'active',
      vitals: {
        heartRate: 82,
        bloodPressure: '132/85',
        oxygen: 97,
      },
    },
  ];

  const systemMetrics = {
    totalSessions: 45,
    activeNow: 2,
    avgDuration: '18 min',
    uptime: '99.5%',
    avgQuality: 92,
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Telemedicine Monitoring Dashboard</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Sessions"
              value={activeSessions.length}
              prefix={<VideoCameraOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Today"
              value={systemMetrics.totalSessions}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Avg Duration"
              value={systemMetrics.avgDuration}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="System Uptime"
              value={systemMetrics.uptime}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={24} lg={16}>
          <Card title="Active Consultations">
            <List
              dataSource={activeSessions}
              renderItem={(session) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar size={48} icon={<VideoCameraOutlined />} style={{ background: '#1890ff' }} />}
                    title={
                      <Space>
                        <span style={{ fontWeight: 600 }}>{session.patient}</span>
                        <Tag color="blue">with {session.doctor}</Tag>
                        <Tag color="green" icon={<SyncOutlined />}>Live</Tag>
                      </Space>
                    }
                    description={
                      <Space size="large">
                        <span>Duration: {session.duration}</span>
                        <span>
                          Quality: <Progress
                            percent={session.connectionQuality}
                            size="small"
                            style={{ width: 80, display: 'inline-block' }}
                            showInfo={false}
                          />
                        </span>
                        <Space>
                          <Tag color="green">Video</Tag>
                          <Tag color="green">Audio</Tag>
                        </Space>
                      </Space>
                    }
                  />
                  <div style={{ minWidth: 200 }}>
                    <Space direction="vertical" size="small">
                      <Space>
                        <HeartOutlined style={{ color: '#ff4d4f' }} />
                        <span>HR: {session.vitals.heartRate} bpm</span>
                      </Space>
                      <Space>
                        <WifiOutlined style={{ color: '#1890ff' }} />
                        <span>SpO2: {session.vitals.oxygen}%</span>
                      </Space>
                      <Space>
                        <span>BP: {session.vitals.bloodPressure}</span>
                      </Space>
                    </Space>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={24} lg={8}>
          <Card title="Connection Quality" style={{ marginBottom: '24px' }}>
            <Progress
              type="circle"
              percent={systemMetrics.avgQuality}
              format={(percent) => `${percent}%`}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Space>
                <Tag color="green"><SyncOutlined spin /> Video Stable</Tag>
                <Tag color="green">Audio Clear</Tag>
              </Space>
            </div>
          </Card>

          <Card title="System Status">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text type="secondary">Server Status</Text>
                <br />
                <Tag color="green" icon={<SyncOutlined spin />}>Operational</Tag>
              </div>
              <div>
                <Text type="secondary">Bandwidth Usage</Text>
                <br />
                <Progress percent={65} status="active" />
              </div>
              <div>
                <Text type="secondary">Video Quality</Text>
                <br />
                <Progress percent={92} status="success" strokeColor="#52c41a" />
              </div>
              <div>
                <Text type="secondary">Audio Quality</Text>
                <br />
                <Progress percent={88} status="success" strokeColor="#52c41a" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
