'use client';

import React from 'react';
import { Card, Typography, Row, Col, Statistic, Progress, Tag, Space, List } from 'antd';
import { CloudServerOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function HealthPage() {
  const services = [
    { name: 'Application Server', status: 'Healthy', uptime: '99.9%', responseTime: '45ms', lastCheck: '2024-02-05 14:30:00' },
    { name: 'Database Server', status: 'Healthy', uptime: '99.8%', responseTime: '12ms', lastCheck: '2024-02-05 14:30:00' },
    { name: 'API Gateway', status: 'Healthy', uptime: '99.9%', responseTime: '28ms', lastCheck: '2024-02-05 14:30:00' },
    { name: 'Redis Cache', status: 'Healthy', uptime: '99.9%', responseTime: '3ms', lastCheck: '2024-02-05 14:30:00' },
    { name: 'File Storage', status: 'Warning', uptime: '98.5%', responseTime: '145ms', lastCheck: '2024-02-05 14:29:45' },
    { name: 'Email Service', status: 'Healthy', uptime: '99.7%', responseTime: '520ms', lastCheck: '2024-02-05 14:29:50' },
    { name: 'SMS Service', status: 'Healthy', uptime: '99.5%', responseTime: '890ms', lastCheck: '2024-02-05 14:29:55' },
    { name: 'Payment Gateway', status: 'Healthy', uptime: '99.9%', responseTime: '230ms', lastCheck: '2024-02-05 14:30:00' },
  ];

  const systemMetrics = {
    cpu: 45,
    memory: 72,
    disk: 58,
    network: 34,
  };

  const recentIncidents = [
    { id: 1, time: '2024-02-05 12:15', service: 'File Storage', issue: 'High response time', status: 'Resolved', duration: '15min' },
    { id: 2, time: '2024-02-04 18:30', service: 'Database Server', issue: 'Connection timeout', status: 'Resolved', duration: '8min' },
    { id: 3, time: '2024-02-04 09:45', service: 'API Gateway', issue: 'Rate limit exceeded', status: 'Resolved', duration: '5min' },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>System Health</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Overall Status"
              value="Healthy"
              prefix={<CheckCircleOutlined style={{ color: '#10B981' }} />}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="CPU Usage"
              value={systemMetrics.cpu}
              suffix="%"
              valueStyle={{ color: systemMetrics.cpu > 80 ? '#EF4444' : '#6366F1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Memory Usage"
              value={systemMetrics.memory}
              suffix="%"
              valueStyle={{ color: systemMetrics.memory > 80 ? '#EF4444' : '#6366F1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Services Running"
              value={services.filter(s => s.status === 'Healthy').length}
              suffix={`/ ${services.length}`}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={24} md={12}>
          <Card title="System Resources">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>CPU Usage</span>
                  <span>{systemMetrics.cpu}%</span>
                </div>
                <Progress percent={systemMetrics.cpu} strokeColor={systemMetrics.cpu > 80 ? '#EF4444' : '#6366F1'} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Memory Usage</span>
                  <span>{systemMetrics.memory}%</span>
                </div>
                <Progress percent={systemMetrics.memory} strokeColor={systemMetrics.memory > 80 ? '#EF4444' : '#6366F1'} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Disk Usage</span>
                  <span>{systemMetrics.disk}%</span>
                </div>
                <Progress percent={systemMetrics.disk} strokeColor={systemMetrics.disk > 80 ? '#EF4444' : '#6366F1'} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Network Usage</span>
                  <span>{systemMetrics.network}%</span>
                </div>
                <Progress percent={systemMetrics.network} strokeColor={systemMetrics.network > 80 ? '#EF4444' : '#6366F1'} />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Card title="Service Status">
            <List
              dataSource={services}
              renderItem={(service) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      service.status === 'Healthy' ? (
                        <CheckCircleOutlined style={{ color: '#10B981', fontSize: '20px' }} />
                      ) : service.status === 'Warning' ? (
                        <WarningOutlined style={{ color: '#F59E0B', fontSize: '20px' }} />
                      ) : (
                        <CloseCircleOutlined style={{ color: '#EF4444', fontSize: '20px' }} />
                      )
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{service.name}</span>
                        <Tag color={service.status === 'Healthy' ? 'success' : service.status === 'Warning' ? 'warning' : 'error'}>
                          {service.status}
                        </Tag>
                      </div>
                    }
                    description={
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6B7280' }}>
                        <span>Uptime: {service.uptime}</span>
                        <span>Response: {service.responseTime}</span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Recent Incidents">
            <List
              dataSource={recentIncidents}
              renderItem={(incident) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{incident.issue}</span>
                        <Tag color="success">{incident.status}</Tag>
                      </div>
                    }
                    description={
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6B7280' }}>
                        <span>{incident.time}</span>
                        <span>{incident.service}</span>
                        <span>Duration: {incident.duration}</span>
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
