'use client';

import React from 'react';
import { Card, Typography, Alert, List, Tag, Space, Input, Button } from 'antd';
import { BulbOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function ClinicalDecisionSupportPage() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const alerts = [
    {
      id: 1,
      patient: 'Ngozi Eze',
      mrn: 'MRN-2024-0005',
      type: 'Drug Interaction',
      severity: 'High',
      title: 'Potential Drug-Drug Interaction',
      recommendation: 'Patient prescribed Amlodipine and Simvastatin. Monitor for muscle pain and consider dose adjustment.',
      category: 'Medication Safety',
    },
    {
      id: 2,
      patient: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-2024-0001',
      type: 'Allergy Alert',
      severity: 'Critical',
      title: 'Known Allergy Detected',
      recommendation: 'Patient has documented allergy to Penicillin. Prescribed Amoxicillin. Consider alternative antibiotic.',
      category: 'Patient Safety',
    },
    {
      id: 3,
      patient: 'Tobi Okafor',
      mrn: 'MRN-2024-0007',
      type: 'Duplicate Therapy',
      severity: 'Medium',
      title: 'Duplicate Medication',
      recommendation: 'Patient prescribed two NSAIDs (Ibuprofen and Diclofenac). Consider discontinuing one to avoid adverse effects.',
      category: 'Medication Safety',
    },
    {
      id: 4,
      patient: 'Adaobi Nwosu',
      mrn: 'MRN-2024-0003',
      type: 'Clinical Guideline',
      severity: 'Low',
      title: 'Guideline Recommendation',
      recommendation: 'For hypertension management, consider ACE inhibitor based on latest clinical guidelines.',
      category: 'Best Practice',
    },
  ];

  const guidelines = [
    {
      id: 1,
      condition: 'Hypertension',
      guideline: 'JNC 8',
      recommendation: 'Initiate ACE inhibitor or ARB for patients with diabetes or CKD. Target BP < 140/90 for most patients.',
      source: 'JNC 8 Guidelines',
      lastUpdated: '2023',
    },
    {
      id: 2,
      condition: 'Diabetes Type 2',
      guideline: 'ADA Standards',
      recommendation: 'Metformin as first-line therapy. Target HbA1c < 7.0% for most non-pregnant adults.',
      source: 'American Diabetes Association',
      lastUpdated: '2024',
    },
    {
      id: 3,
      condition: 'Community Acquired Pneumonia',
      guideline: 'CURB-65 Score',
      recommendation: 'Use CURB-65 severity score to determine if patient can be managed as outpatient or requires admission.',
      source: 'IDSA/ATS Guidelines',
      lastUpdated: '2023',
    },
  ];

  const protocols = [
    {
      id: 1,
      name: 'Sepsis Management',
      trigger: 'SIRS Criteria Met',
      actions: ['Obtain blood cultures', 'Administer broad-spectrum antibiotics within 1 hour', 'Obtain lactate', 'Give fluids 30mL/kg if hypotensive'],
    },
    {
      id: 2,
      name: 'Chest Pain Evaluation',
      trigger: 'Chest Pain Presentation',
      actions: ['Obtain ECG within 10 minutes', 'Measure cardiac enzymes', 'Administer aspirin if not contraindicated', 'Perform risk stratification'],
    },
    {
      id: 3,
      name: 'Stroke Alert',
      trigger: 'Suspected Stroke',
      actions: ['Activate stroke team', 'Obtain non-contrast CT head within 25 minutes', 'Check blood glucose', 'Consider thrombolysis if within window'],
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Clinical Decision Support</Title>

      <Alert
        title="Decision Support Alerts"
        description={`You have ${alerts.filter(a => a.severity === 'Critical').length} critical and ${alerts.filter(a => a.severity === 'High').length} high priority alerts requiring attention.`}
        type="warning"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Card title="Active Alerts" style={{ marginBottom: '24px' }}>
        <List
          dataSource={alerts}
          renderItem={(alert) => (
            <Alert
              key={alert.id}
              title={
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{alert.title}</div>
                    <div className="text-sm">{alert.patient} ({alert.mrn})</div>
                  </div>
                  <div className="flex gap-2">
                    <Tag color={alert.category === 'Patient Safety' ? 'red' : 'blue'}>{alert.category}</Tag>
                    <Tag color={alert.severity === 'Critical' ? 'error' : alert.severity === 'High' ? 'warning' : 'default'}>
                      {alert.severity}
                    </Tag>
                  </div>
                </div>
              }
              description={alert.recommendation}
              type={alert.severity === 'Critical' ? 'error' : alert.severity === 'High' ? 'warning' : 'info'}
              showIcon
              style={{ marginBottom: '12px' }}
            />
          )}
        />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
        <Card title="Clinical Guidelines">
          <Input.Search
            placeholder="Search guidelines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: '16px' }}
          />
          <List
            dataSource={guidelines.filter(g =>
              g.condition.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            renderItem={(guideline) => (
              <List.Item key={guideline.id}>
                <List.Item.Meta
                  avatar={<BulbOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
                  title={guideline.condition}
                  description={
                    <div>
                      <div><strong>Guideline:</strong> {guideline.guideline}</div>
                      <div className="text-sm text-gray-700 mt-1">{guideline.recommendation}</div>
                      <div className="text-xs text-gray-500 mt-1">Source: {guideline.source} • Updated: {guideline.lastUpdated}</div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        <Card title="Clinical Protocols">
          <List
            dataSource={protocols}
            renderItem={(protocol) => (
              <Card key={protocol.id} size="small" className="mb-3" style={{ backgroundColor: '#f0f7ff' }}>
                <div className="font-semibold mb-2">{protocol.name}</div>
                <div className="text-sm text-gray-600 mb-2"><strong>Trigger:</strong> {protocol.trigger}</div>
                <div className="text-sm">
                  <strong>Actions:</strong>
                  <ul style={{ paddingLeft: '20px', margin: '4px 0 0 0' }}>
                    {protocol.actions.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}
          />
        </Card>
      </div>
    </div>
  );
}
