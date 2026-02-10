'use client';

import React from 'react';
import { Card, Typography, Tabs, Badge, Space, Tag, Progress } from 'antd';
import { UserOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TabPane } = Tabs;

export default function TrackingBoardPage() {
  const patients = [
    { id: 'ER-001', name: 'Fatima Ahmed', age: 55, complaint: 'Difficulty breathing', priority: 'critical', status: 'doctor', doctor: 'Dr. Okonkwo', waitTime: 5, duration: 25 },
    { id: 'ER-002', name: 'Chukwuemeka Okonkwo', age: 45, complaint: 'Chest pain', priority: 'high', status: 'nursing', doctor: 'Dr. Eze', waitTime: 15, duration: 18 },
    { id: 'ER-003', name: 'Baby Ibrahim', age: 3, complaint: 'High fever', priority: 'high', status: 'tests', doctor: 'Dr. Okafor', waitTime: 22, duration: 45 },
    { id: 'ER-004', name: 'Adanna Okafor', age: 32, complaint: 'Severe headache', priority: 'medium', status: 'waiting', doctor: null, waitTime: 35, duration: 0 },
    { id: 'ER-005', name: 'Emeka Okafor', age: 28, complaint: 'Minor laceration', priority: 'low', status: 'discharge', doctor: 'Dr. Nnamdi', waitTime: 50, duration: 60 },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      waiting: 'default',
      nursing: 'processing',
      tests: 'warning',
      doctor: 'blue',
      discharge: 'success',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      waiting: 'Waiting',
      nursing: 'Nursing',
      tests: 'Tests/Labs',
      doctor: 'With Doctor',
      discharge: 'Discharge',
    };
    return labels[status] || status;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: 'error',
      high: 'warning',
      medium: 'processing',
      low: 'default',
    };
    return colors[priority] || 'default';
  };

  const byStatus = (status: string) => patients.filter(p => p.status === status);
  const byPriority = (priority: string) => patients.filter(p => p.priority === priority);

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1600px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Title level={3}>Emergency Department Tracking Board</Title>
        <Space size="large">
          <Badge count={patients.length} showZero><UserOutlined /> Patients</Badge>
          <Badge count={patients.filter(p => p.status === 'waiting').length} showZero style={{ backgroundColor: '#52c41a' }}><ClockCircleOutlined /> Waiting</Badge>
          <Badge count={patients.filter(p => p.priority === 'critical').length} showZero style={{ backgroundColor: '#f5222d' }}>Critical</Badge>
        </Space>
      </div>

      <Card>
        <Tabs defaultActiveKey="status">
          <TabPane tab="By Status" key="status">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <Card title={<Badge count={byStatus('waiting').length} showZero><span style={{ fontWeight: 'normal' }}>Waiting</span></Badge>} size="small" type="inner">
                <Space orientation="vertical" style={{ width: '100%' }}>
                  {byStatus('waiting').map((patient) => (
                    <Card key={patient.id} size="small" className="shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{patient.name}</div>
                          <div className="text-xs text-gray-500">{patient.age} yrs • {patient.complaint}</div>
                        </div>
                        <Tag color={getPriorityColor(patient.priority)}>{patient.priority}</Tag>
                      </div>
                      <div className="text-xs text-gray-500">
                        <ClockCircleOutlined /> Wait: {patient.waitTime} min
                      </div>
                    </Card>
                  ))}
                  {byStatus('waiting').length === 0 && <div className="text-center text-gray-400 py-4">No patients</div>}
                </Space>
              </Card>

              <Card title={<Badge count={byStatus('nursing').length} showZero><span style={{ fontWeight: 'normal' }}>Nursing</span></Badge>} size="small" type="inner">
                <Space orientation="vertical" style={{ width: '100%' }}>
                  {byStatus('nursing').map((patient) => (
                    <Card key={patient.id} size="small" className="shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{patient.name}</div>
                          <div className="text-xs text-gray-500">{patient.age} yrs • {patient.complaint}</div>
                        </div>
                        <Tag color={getPriorityColor(patient.priority)}>{patient.priority}</Tag>
                      </div>
                      <div className="text-xs text-gray-500">
                        Duration: {patient.duration} min
                      </div>
                    </Card>
                  ))}
                  {byStatus('nursing').length === 0 && <div className="text-center text-gray-400 py-4">No patients</div>}
                </Space>
              </Card>

              <Card title={<Badge count={byStatus('tests').length} showZero><span style={{ fontWeight: 'normal' }}>Tests/Labs</span></Badge>} size="small" type="inner">
                <Space orientation="vertical" style={{ width: '100%' }}>
                  {byStatus('tests').map((patient) => (
                    <Card key={patient.id} size="small" className="shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{patient.name}</div>
                          <div className="text-xs text-gray-500">{patient.age} yrs • {patient.complaint}</div>
                        </div>
                        <Tag color={getPriorityColor(patient.priority)}>{patient.priority}</Tag>
                      </div>
                      <div className="text-xs text-gray-500">
                        Duration: {patient.duration} min
                      </div>
                    </Card>
                  ))}
                  {byStatus('tests').length === 0 && <div className="text-center text-gray-400 py-4">No patients</div>}
                </Space>
              </Card>

              <Card title={<Badge count={byStatus('doctor').length} showZero><span style={{ fontWeight: 'normal' }}>With Doctor</span></Badge>} size="small" type="inner">
                <Space orientation="vertical" style={{ width: '100%' }}>
                  {byStatus('doctor').map((patient) => (
                    <Card key={patient.id} size="small" className="shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{patient.name}</div>
                          <div className="text-xs text-gray-500">{patient.age} yrs • {patient.complaint}</div>
                        </div>
                        <Tag color={getPriorityColor(patient.priority)}>{patient.priority}</Tag>
                      </div>
                      <div className="text-xs text-gray-500">
                        {patient.doctor} • {patient.duration} min
                      </div>
                    </Card>
                  ))}
                  {byStatus('doctor').length === 0 && <div className="text-center text-gray-400 py-4">No patients</div>}
                </Space>
              </Card>

              <Card title={<Badge count={byStatus('discharge').length} showZero><span style={{ fontWeight: 'normal' }}>Discharge</span></Badge>} size="small" type="inner">
                <Space orientation="vertical" style={{ width: '100%' }}>
                  {byStatus('discharge').map((patient) => (
                    <Card key={patient.id} size="small" className="shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{patient.name}</div>
                          <div className="text-xs text-gray-500">{patient.age} yrs • {patient.complaint}</div>
                        </div>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      </div>
                      <div className="text-xs text-gray-500">
                        {patient.doctor} • Ready for discharge
                      </div>
                    </Card>
                  ))}
                  {byStatus('discharge').length === 0 && <div className="text-center text-gray-400 py-4">No patients</div>}
                </Space>
              </Card>
            </div>
          </TabPane>

          <TabPane tab="By Priority" key="priority">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <Card title={<Tag color="error">Critical</Tag>} size="small" type="inner">
                <Space orientation="vertical" style={{ width: '100%' }}>
                  {byPriority('critical').map((patient) => (
                    <Card key={patient.id} size="small" className="shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{patient.name}</div>
                          <div className="text-xs text-gray-500">{patient.age} yrs • {patient.complaint}</div>
                        </div>
                        <Tag color={getStatusColor(patient.status)}>{getStatusLabel(patient.status)}</Tag>
                      </div>
                    </Card>
                  ))}
                  {byPriority('critical').length === 0 && <div className="text-center text-gray-400 py-4">No patients</div>}
                </Space>
              </Card>

              <Card title={<Tag color="warning">High</Tag>} size="small" type="inner">
                <Space orientation="vertical" style={{ width: '100%' }}>
                  {byPriority('high').map((patient) => (
                    <Card key={patient.id} size="small" className="shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{patient.name}</div>
                          <div className="text-xs text-gray-500">{patient.age} yrs • {patient.complaint}</div>
                        </div>
                        <Tag color={getStatusColor(patient.status)}>{getStatusLabel(patient.status)}</Tag>
                      </div>
                    </Card>
                  ))}
                  {byPriority('high').length === 0 && <div className="text-center text-gray-400 py-4">No patients</div>}
                </Space>
              </Card>

              <Card title={<Tag color="processing">Medium</Tag>} size="small" type="inner">
                <Space orientation="vertical" style={{ width: '100%' }}>
                  {byPriority('medium').map((patient) => (
                    <Card key={patient.id} size="small" className="shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{patient.name}</div>
                          <div className="text-xs text-gray-500">{patient.age} yrs • {patient.complaint}</div>
                        </div>
                        <Tag color={getStatusColor(patient.status)}>{getStatusLabel(patient.status)}</Tag>
                      </div>
                    </Card>
                  ))}
                  {byPriority('medium').length === 0 && <div className="text-center text-gray-400 py-4">No patients</div>}
                </Space>
              </Card>

              <Card title={<Tag color="default">Low</Tag>} size="small" type="inner">
                <Space orientation="vertical" style={{ width: '100%' }}>
                  {byPriority('low').map((patient) => (
                    <Card key={patient.id} size="small" className="shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{patient.name}</div>
                          <div className="text-xs text-gray-500">{patient.age} yrs • {patient.complaint}</div>
                        </div>
                        <Tag color={getStatusColor(patient.status)}>{getStatusLabel(patient.status)}</Tag>
                      </div>
                    </Card>
                  ))}
                  {byPriority('low').length === 0 && <div className="text-center text-gray-400 py-4">No patients</div>}
                </Space>
              </Card>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
