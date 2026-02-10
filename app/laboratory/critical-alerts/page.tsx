'use client';

import React from 'react';
import { Card, Typography, List, Tag, Alert, Space, Button, Row, Col, Badge, Timeline } from 'antd';
import { BellOutlined, ExclamationCircleOutlined, CheckCircleOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface CriticalAlert {
  id: string;
  patientName: string;
  mrn: string;
  test: string;
  value: string;
  referenceRange: string;
  criticalLevel: 'Critical' | 'Alert' | 'Panic';
  timestamp: string;
  notified: boolean;
  action: string;
}

export default function CriticalAlertsPage() {
  const [alerts] = React.useState<CriticalAlert[]>([
    {
      id: '1',
      patientName: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-2024-0001',
      test: 'Troponin I',
      value: '2.5 ng/mL',
      referenceRange: '<0.04 ng/mL',
      criticalLevel: 'Critical',
      timestamp: '2024-02-02 10:30',
      notified: true,
      action: 'Physician notified, patient under observation',
    },
    {
      id: '2',
      patientName: 'Ngozi Eze',
      mrn: 'MRN-2024-0005',
      test: 'Blood Glucose (Fasting)',
      value: '380 mg/dL',
      referenceRange: '70-100 mg/dL',
      criticalLevel: 'Alert',
      timestamp: '2024-02-02 09:45',
      notified: true,
      action: 'Insulin administered, retesting in 2 hours',
    },
    {
      id: '3',
      patientName: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-2024-0001',
      test: 'Potassium',
      value: '6.8 mmol/L',
      referenceRange: '3.5-5.0 mmol/L',
      criticalLevel: 'Alert',
      timestamp: '2024-02-02 08:15',
      notified: true,
      action: 'Electrolyte management initiated',
    },
    {
      id: '4',
      patientName: 'Chioma Nnamani',
      mrn: 'MRN-2024-0013',
      test: 'INR',
      value: '5.2',
      referenceRange: '0.9-1.2',
      criticalLevel: 'Critical',
      timestamp: '2024-02-02 07:30',
      notified: false,
      action: 'Pending physician review',
    },
  ]);

  const getCriticalColor = (level: string) => {
    const colors: Record<string, string> = {
      'Critical': 'red',
      'Alert': 'orange',
      'Panic': 'purple',
    };
    return colors[level] || 'default';
  };

  const stats = {
    total: alerts.length,
    critical: alerts.filter((a: any) => a.criticalLevel === 'Critical').length,
    alert: alerts.filter((a: any) => a.criticalLevel === 'Alert').length,
    notified: alerts.filter((a: any) => a.notified).length,
    pending: alerts.filter((a: any) => !a.notified).length,
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Critical Value Alerts</Title>

      {stats.pending > 0 && (
        <Alert
          title={`${stats.pending} unaddressed critical value${stats.pending > 1 ? 's' : ''} require immediate attention!`}
          type="error"
          showIcon
          closable
          style={{ marginBottom: '24px' }}
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card>
            <div className="text-center">
              <Badge count={stats.total} showZero style={{ backgroundColor: '#3B82F6' }}>
                <BellOutlined style={{ fontSize: '32px', color: '#9CA3AF' }} />
              </Badge>
              <div className="mt-2 text-sm text-gray-500">Total Alerts</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <div className="text-center">
              <Badge count={stats.critical} showZero style={{ backgroundColor: '#DC2626' }}>
                <ExclamationCircleOutlined style={{ fontSize: '32px', color: '#9CA3AF' }} />
              </Badge>
              <div className="mt-2 text-sm text-gray-500">Critical</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <div className="text-center">
              <Badge count={stats.alert} showZero style={{ backgroundColor: '#F59E0B' }}>
                <ExclamationCircleOutlined style={{ fontSize: '32px', color: '#9CA3AF' }} />
              </Badge>
              <div className="mt-2 text-sm text-gray-500">Alerts</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <div className="text-center">
              <Badge count={stats.pending} showZero style={{ backgroundColor: '#DC2626' }}>
                <BellOutlined style={{ fontSize: '32px', color: '#9CA3AF' }} />
              </Badge>
              <div className="mt-2 text-sm text-gray-500">Pending Action</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card
            title="Active Critical Alerts"
            extra={<Tag color="red">{alerts.length} Active</Tag>}
          >
            <List
              dataSource={alerts}
              renderItem={(alert) => (
                <List.Item
                  style={{
                    borderLeft: `4px solid ${alert.criticalLevel === 'Critical' ? '#DC2626' : alert.criticalLevel === 'Alert' ? '#F59E0B' : '#7C3AED'}`,
                    background: alert.criticalLevel === 'Critical' ? '#FEF2F2' : 'transparent',
                    padding: '16px',
                    marginBottom: '8px',
                    borderRadius: '4px',
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: alert.criticalLevel === 'Critical' ? '#DC2626' : '#F59E0B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      >
                        {alert.patientName.charAt(0)}
                      </div>
                    }
                    title={
                      <Space>
                        <span className="font-medium">{alert.patientName}</span>
                        <Tag>{alert.mrn}</Tag>
                        <Tag color={getCriticalColor(alert.criticalLevel)}>{alert.criticalLevel}</Tag>
                        {!alert.notified && <Tag color="red">Action Required</Tag>}
                      </Space>
                    }
                    description={
                      <div>
                        <div className="mb-2">
                          <Text strong>{alert.test}</Text>
                          <br />
                          <Text type="danger" className="text-lg font-semibold">{alert.value}</Text>
                          <Text type="secondary"> (Reference: {alert.referenceRange})</Text>
                        </div>
                        <div className="text-sm">
                          <Text type="secondary">{alert.timestamp}</Text>
                          <span className="mx-2">•</span>
                          <Text>Action: {alert.action}</Text>
                        </div>
                      </div>
                    }
                  />
                  <Button type="primary" icon={<EyeOutlined />} size="small">
                    View Details
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Alert Timeline">
            <Timeline
              items={alerts.slice(0, 5).map((alert) => ({
                color: alert.criticalLevel === 'Critical' ? 'red' : 'orange',
                children: (
                  <div>
                    <div className="font-medium">{alert.test}</div>
                    <div className="text-xs text-gray-500">{alert.timestamp}</div>
                    <div className="text-sm">{alert.patientName}</div>
                  </div>
                ),
              }))}
            />
          </Card>

          <Card title="Quick Actions" style={{ marginTop: '16px' }}>
            <Space orientation="vertical" style={{ width: '100%' }}>
              <Button type="primary" block>
                Send All Notifications
              </Button>
              <Button block>Export Alert Report</Button>
              <Button block>Configure Alert Rules</Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
