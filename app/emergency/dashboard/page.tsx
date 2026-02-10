'use client';

import React, { useState } from 'react';
import { Card, Row, Col, Typography, Tag, Button, Space, Badge, Timeline, Progress, Alert, Statistic } from 'antd';
import { ExclamationCircleOutlined, UserOutlined, ClockCircleOutlined, SyncOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface EmergencyPatient {
  id: string;
  name: string;
  triageLevel: 1 | 2 | 3 | 4 | 5;
  chiefComplaint: string;
  arrivalTime: string;
  vitals: {
    bp: string;
    hr: number;
    temp: number;
    spo2: number;
  };
  status: 'Waiting' | 'Being Treated' | 'Admitted' | 'Discharged';
}

export default function EmergencyDashboardPage() {
  const [patients] = useState<EmergencyPatient[]>([
    {
      id: '1',
      name: 'Chukwuemeka Okonkwo',
      triageLevel: 2,
      chiefComplaint: 'Chest pain, difficulty breathing',
      arrivalTime: '10:30',
      vitals: { bp: '150/95', hr: 110, temp: 37.5, spo2: 92 },
      status: 'Being Treated',
    },
    {
      id: '2',
      name: 'Adanna Okafor',
      triageLevel: 3,
      chiefComplaint: 'Severe migraine, nausea',
      arrivalTime: '11:15',
      vitals: { bp: '135/85', hr: 88, temp: 37.0, spo2: 98 },
      status: 'Waiting',
    },
    {
      id: '3',
      name: 'Baby Johnson',
      triageLevel: 2,
      chiefComplaint: 'High fever (39.5°C), difficulty feeding',
      arrivalTime: '11:45',
      vitals: { bp: '90/60', hr: 140, temp: 39.5, spo2: 95 },
      status: 'Waiting',
    },
  ]);

  const getTriageConfig = (level: number) => {
    const configs: Record<number, { color: string; label: string; priority: string }> = {
      1: { color: 'error', label: 'Resuscitation', priority: 'Immediate' },
      2: { color: 'error', label: 'Emergent', priority: 'Very Urgent' },
      3: { color: 'warning', label: 'Urgent', priority: 'Urgent' },
      4: { color: 'processing', label: 'Less Urgent', priority: 'Normal' },
      5: { color: 'default', label: 'Non-Urgent', priority: 'Low' },
    };
    return configs[level];
  };

  const stats = {
    total: patients.length,
    critical: patients.filter((p: any) => p.triageLevel <= 2).length,
    beingTreated: patients.filter((p: any) => p.status === 'Being Treated').length,
    waiting: patients.filter((p: any) => p.status === 'Waiting').length,
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <Title level={2}>Emergency Department Dashboard</Title>
          <Text type="secondary">Real-time emergency patient tracking and management</Text>
        </div>
        <Button type="primary">Register New Patient</Button>
      </div>

      {stats.critical > 0 && (
        <Alert
          title={`${stats.critical} critical patient${stats.critical > 1 ? 's' : ''} requiring immediate attention`}
          description="Triage Level 1-2 patients need urgent care"
          type="error"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{stats.critical}</div>
              <div className="text-sm text-gray-500">Critical</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.waiting}</div>
              <div className="text-sm text-gray-500">Waiting</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.beingTreated}</div>
              <div className="text-sm text-gray-500">Being Treated</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Patients</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title="Emergency Patient Tracking"
            extra={<Badge count={stats.total} showZero />}
          >
            <Space orientation="vertical" style={{ width: '100%' }} size="middle">
              {patients.map((patient) => {
                const config = getTriageConfig(patient.triageLevel);
                return (
                  <Card
                    key={patient.id}
                    size="small"
                    style={{
                      borderLeft: `4px solid ${config.color === 'error' ? '#DC2626' : config.color === 'warning' ? '#F59E0B' : '#3B82F6'}`,
                    }}
                  >
                    <Row gutter={16}>
                      <Col span={16}>
                        <div className="flex items-center gap-3 mb-2">
                          <UserOutlined style={{ fontSize: '20px' }} />
                          <span className="font-medium text-lg">{patient.name}</span>
                          <Tag color={config.color}>{config.label} (Level {patient.triageLevel})</Tag>
                          <Tag color={patient.status === 'Being Treated' ? 'blue' : patient.status === 'Waiting' ? 'orange' : 'green'}>
                            {patient.status}
                          </Tag>
                        </div>
                        <div className="text-gray-600">{patient.chiefComplaint}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          <ClockCircleOutlined /> Arrival: {patient.arrivalTime}
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className="text-sm">
                          <div><strong>BP:</strong> {patient.vitals.bp}</div>
                          <div><strong>HR:</strong> {patient.vitals.hr} bpm</div>
                          <div><strong>Temp:</strong> {patient.vitals.temp}°C</div>
                          <div><strong>SpO2:</strong> {patient.vitals.spo2}%</div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                );
              })}
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Department Status">
            <Space orientation="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text strong>Bed Occupancy</Text>
                <Progress percent={85} strokeColor="#EF4444" />
                <Text type="secondary" className="text-sm">17/20 beds occupied</Text>
              </div>
              <div>
                <Text strong>Available Doctors</Text>
                <div className="text-2xl font-bold text-blue-600 mt-1">4</div>
              </div>
              <div>
                <Text strong>Available Nurses</Text>
                <div className="text-2xl font-bold text-green-600 mt-1">8</div>
              </div>
              <div>
                <Text strong>Average Wait Time</Text>
                <div className="text-2xl font-bold text-orange-600 mt-1">23 mins</div>
              </div>
            </Space>
          </Card>

          <Card title="Recent Activity" style={{ marginTop: '16px' }}>
            <Timeline
              items={[
                { children: 'Patient #1 admitted to ICU' },
                { children: 'Patient #3 discharged' },
                { children: 'New critical patient arrived' },
                { children: 'Doctor available - Bed 5' },
                { children: 'Lab results ready for Patient #2' },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
