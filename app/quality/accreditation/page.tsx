'use client';

import React from 'react';
import { Card, Typography, List, Tag, Button, Progress, Space, Alert, Tabs } from 'antd';
import { CheckCircleOutlined, WarningOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TabPane } = Tabs;

export default function QualityAccreditationPage() {
  const standards = [
    {
      id: 1,
      category: 'Patient Safety',
      requirement: 'Medication Management',
      compliance: 92,
      status: 'Compliant',
      lastAudit: '2024-01-15',
      nextAudit: '2024-07-15',
      findings: 3,
    },
    {
      id: 2,
      category: 'Clinical Governance',
      requirement: 'Clinical Documentation',
      compliance: 88,
      status: 'Compliant',
      lastAudit: '2024-01-10',
      nextAudit: '2024-07-10',
      findings: 5,
    },
    {
      id: 3,
      category: 'Facility Management',
      requirement: 'Emergency Preparedness',
      compliance: 95,
      status: 'Compliant',
      lastAudit: '2024-01-20',
      nextAudit: '2024-07-20',
      findings: 2,
    },
    {
      id: 4,
      category: 'Infection Control',
      requirement: 'Hand Hygiene Compliance',
      compliance: 78,
      status: 'Partial Compliance',
      lastAudit: '2024-01-18',
      nextAudit: '2024-04-18',
      findings: 8,
    },
    {
      id: 5,
      category: 'Human Resources',
      requirement: 'Staff Qualifications',
      compliance: 100,
      status: 'Compliant',
      lastAudit: '2024-01-12',
      nextAudit: '2024-07-12',
      findings: 0,
    },
  ];

  const upcomingSurveys = [
    { id: 1, accreditor: 'NHIS', type: 'Renewal Survey', date: '2024-06-15', status: 'Scheduled' },
    { id: 2, accreditor: 'ISO 9001', type: 'Surveillance Audit', date: '2024-08-20', status: 'Scheduled' },
    { id: 3, accreditor: 'Joint Commission', type: 'Full Survey', date: '2025-02-01', status: 'Scheduled' },
  ];

  const documents = [
    { id: 1, name: 'Accreditation Certificate', type: 'Certificate', expiry: '2025-06-15', status: 'Valid' },
    { id: 2, name: 'Last Survey Report', type: 'Report', date: '2023-06-15', status: 'Current' },
    { id: 3, name: 'Quality Improvement Plan', type: 'Plan', date: '2024-01-01', status: 'Active' },
    { id: 4, name: 'Compliance Dashboard', type: 'Dashboard', date: '2024-02-01', status: 'Current' },
  ];

  const overallCompliance = Math.round(standards.reduce((sum, s) => sum + s.compliance, 0) / standards.length);

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Accreditation & Compliance</Title>

      <Alert
        title="Accreditation Status"
        description={`Overall compliance rate: ${overallCompliance}%. Next major survey: NHIS Renewal - June 2024`}
        type={overallCompliance >= 90 ? 'success' : 'warning'}
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{overallCompliance}%</div>
            <div className="text-gray-500">Overall Compliance</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{standards.filter(s => s.status === 'Compliant').length}/{standards.length}</div>
            <div className="text-gray-500">Standards Met</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{standards.reduce((sum, s) => sum + s.findings, 0)}</div>
            <div className="text-gray-500">Open Findings</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{upcomingSurveys.length}</div>
            <div className="text-gray-500">Upcoming Surveys</div>
          </div>
        </Card>
      </div>

      <Card title="Accreditation Standards" className="overflow-x-auto" style={{ marginBottom: '24px' }}>
        <List
          dataSource={standards}
          renderItem={(standard) => (
            <List.Item key={standard.id}>
              <List.Item.Meta
                avatar={
                  <div style={{ width: '60px', textAlign: 'center' }}>
                    <div className="text-2xl font-bold" style={{ color: standard.compliance >= 90 ? '#52c41a' : standard.compliance >= 80 ? '#faad14' : '#ff4d4f' }}>
                      {standard.compliance}%
                    </div>
                  </div>
                }
                title={
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{standard.requirement}</span>
                      <Tag color="blue" className="ml-2">{standard.category}</Tag>
                    </div>
                    <Tag color={standard.status === 'Compliant' ? 'success' : 'warning'} icon={standard.status === 'Compliant' ? <CheckCircleOutlined /> : <WarningOutlined />}>
                      {standard.status}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <Progress percent={standard.compliance} size="small" strokeColor={standard.compliance >= 90 ? '#52c41a' : standard.compliance >= 80 ? '#faad14' : '#ff4d4f'} />
                    <div className="text-sm text-gray-500 mt-1">
                      Last Audit: {standard.lastAudit} • Next Audit: {standard.nextAudit} • {standard.findings} findings
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="Upcoming Accreditation Surveys" className="overflow-x-auto" style={{ marginBottom: '24px' }}>
        <List
          dataSource={upcomingSurveys}
          renderItem={(survey) => (
            <List.Item
              actions={[
                <Button type="link" size="small">View Details</Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                title={`${survey.accreditor} - ${survey.type}`}
                description={`Scheduled: ${survey.date} • Status: ${survey.status}`}
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="Accreditation Documents" className="overflow-x-auto">
        <List
          dataSource={documents}
          renderItem={(doc) => (
            <List.Item
              actions={[
                <Button type="link" size="small">Download</Button>,
                <Button type="link" size="small">View</Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<FileTextOutlined style={{ fontSize: '20px', color: '#8B5CF6' }} />}
                title={doc.name}
                description={`${doc.type} • ${doc.date} • Status: ${doc.status}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
