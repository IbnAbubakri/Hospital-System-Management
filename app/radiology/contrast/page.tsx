'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Alert } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function RadiologyContrastPage() {
  const allergies = [
    { id: 1, patient: 'Chukwuemeka Okonkwo', mrn: 'MRN-2024-0050', allergen: 'Iodine Contrast', severity: 'Severe', reaction: 'Anaphylaxis', dateRecorded: '2024-01-15', lastStudy: 'CT Abdomen', protocols: 'Alternative imaging or premedication' },
    { id: 2, patient: 'Adanna Okafor', mrn: 'MRN-2024-0051', allergen: 'Gadolinium', severity: 'Moderate', reaction: 'Rash, Itching', dateRecorded: '2024-01-20', lastStudy: 'MRI Brain', protocols: 'Premedication with antihistamines' },
    { id: 3, patient: 'Baby Ibrahim', mrn: 'MRN-2024-0075', allergen: 'Iodine Contrast', severity: 'Mild', reaction: 'Nausea', dateRecorded: '2024-01-25', lastStudy: 'CT Chest', protocols: 'Monitor during contrast administration' },
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'MRN', dataIndex: 'mrn', key: 'mrn', render: (mrn: string) => <Tag color="blue">{mrn}</Tag> },
    { title: 'Allergen', dataIndex: 'allergen', key: 'allergen' },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => {
        const color = severity === 'Severe' ? 'error' : severity === 'Moderate' ? 'warning' : 'default';
        return <Tag color={color}>{severity}</Tag>;
      },
    },
    { title: 'Reaction', dataIndex: 'reaction', key: 'reaction' },
    { title: 'Last Study', dataIndex: 'lastStudy', key: 'lastStudy' },
    { title: 'Safety Protocols', dataIndex: 'protocols', key: 'protocols', render: (protocols: string) => <Tag color="blue">{protocols}</Tag> },
    { title: 'Date Recorded', dataIndex: 'dateRecorded', key: 'dateRecorded' },
  ];

  const severeAllergies = allergies.filter(a => a.severity === 'Severe').length;
  const totalAllergies = allergies.length;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Contrast Media Safety Management</Title>

      <Alert
        title="Critical Safety Information"
        description={`There are ${severeAllergies} patients with severe contrast allergies currently in the system. Always verify allergy status before scheduling contrast-enhanced procedures.`}
        type="warning"
        showIcon
        icon={<WarningOutlined />}
        style={{ marginBottom: '24px' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{severeAllergies}</div>
            <div className="text-gray-500">Severe Allergies</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{allergies.filter(a => a.severity === 'Moderate').length}</div>
            <div className="text-gray-500">Moderate Allergies</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{totalAllergies}</div>
            <div className="text-gray-500">Total Recorded</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">100%</div>
            <div className="text-gray-500">Screening Rate</div>
          </div>
        </Card>
      </div>

      <Card title="Documented Contrast Allergies">
        <div className="overflow-x-auto">
        <Table
          dataSource={allergies}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        </div>
      </Card>

      <Card title="Safety Protocols" style={{ marginTop: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <Card size="small" type="inner" title="Mild Reaction">
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li>Monitor patient during procedure</li>
              <li>Have emergency equipment available</li>
              <li>Consider slower contrast injection rate</li>
              <li>Document patient response</li>
            </ul>
          </Card>
          <Card size="small" type="inner" title="Moderate Reaction">
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li>Premedication with antihistamines</li>
              <li>Consider alternative contrast agents</li>
              <li>Extended monitoring post-procedure</li>
              <li>Consult with radiologist</li>
            </ul>
          </Card>
          <Card size="small" type="inner" title="Severe Reaction">
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li>Avoid contrast if possible</li>
              <li>Use alternative imaging modalities</li>
              <li>If unavoidable: Premedication + ICU setup</li>
              <li>Must have physician approval</li>
            </ul>
          </Card>
        </div>
      </Card>
    </div>
  );
}
