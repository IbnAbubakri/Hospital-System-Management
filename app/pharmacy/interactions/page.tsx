'use client';

import React from 'react';
import { Card, Typography, Table, Tag, Alert, Space, Input, Select } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function PharmacyInteractionsPage() {
  const [severityFilter, setSeverityFilter] = React.useState<string>('all');

  const interactions = [
    {
      id: 1,
      drug1: 'Warfarin',
      drug2: 'Aspirin',
      severity: 'Major',
      effect: 'Increased risk of bleeding',
      mechanism: 'Antiplatelet effects additive',
      recommendation: 'Consider alternative. Monitor INR closely.',
      status: 'Active',
    },
    {
      id: 2,
      drug1: 'Lisinopril',
      drug2: 'Potassium Supplements',
      severity: 'Major',
      effect: 'Hyperkalemia risk',
      mechanism: 'Reduced potassium excretion',
      recommendation: 'Monitor potassium levels. Avoid potassium supplements.',
      status: 'Active',
    },
    {
      id: 3,
      drug1: 'Simvastatin',
      drug2: 'Clarithromycin',
      severity: 'Major',
      effect: 'Rhabdomyolysis risk',
      mechanism: 'CYP3A4 inhibition',
      recommendation: 'Suspend simvastatin. Use alternative antibiotic.',
      status: 'Active',
    },
    {
      id: 4,
      drug1: 'Metformin',
      drug2: 'Furosemide',
      severity: 'Moderate',
      effect: 'Increased lactic acidosis risk',
      mechanism: 'Renal function impairment',
      recommendation: 'Monitor renal function. Adjust doses.',
      status: 'Active',
    },
    {
      id: 5,
      drug1: 'Digoxin',
      drug2: 'Amiodarone',
      severity: 'Major',
      effect: 'Digoxin toxicity',
      mechanism: 'P-glycoprotein inhibition',
      recommendation: 'Reduce digoxin dose by 50%. Monitor levels.',
      status: 'Active',
    },
    {
      id: 6,
      drug1: 'Omeprazole',
      drug2: 'Clopidogrel',
      severity: 'Moderate',
      effect: 'Reduced antiplatelet effect',
      mechanism: 'CYP2C19 inhibition',
      recommendation: 'Consider alternative PPI or antiplatelet.',
      status: 'Active',
    },
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Drug 1',
      dataIndex: 'drug1',
      key: 'drug1',
      render: (drug: string) => <Tag color="blue">{drug}</Tag>,
    },
    {
      title: 'Drug 2',
      dataIndex: 'drug2',
      key: 'drug2',
      render: (drug: string) => <Tag color="purple">{drug}</Tag>,
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => {
        const color = severity === 'Major' ? 'error' : severity === 'Moderate' ? 'warning' : 'default';
        return <Tag color={color}>{severity}</Tag>;
      },
    },
    { title: 'Effect', dataIndex: 'effect', key: 'effect' },
    { title: 'Mechanism', dataIndex: 'mechanism', key: 'mechanism' },
    { title: 'Recommendation', dataIndex: 'recommendation', key: 'recommendation' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color="success">{status}</Tag> },
  ];

  const filteredInteractions = interactions.filter(interaction => {
    if (severityFilter === 'all') return true;
    return interaction.severity.toLowerCase() === severityFilter.toLowerCase();
  });

  const majorCount = interactions.filter(i => i.severity === 'Major').length;
  const moderateCount = interactions.filter(i => i.severity === 'Moderate').length;

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Drug Interactions Database</Title>

      <Alert
        title="Important Clinical Reference"
        description="This database contains known drug-drug interactions. Always verify current medications before prescribing. Severity levels: Major (avoid combination), Moderate (monitor closely), Minor (no action needed)."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{majorCount}</div>
            <div className="text-gray-500">Major Interactions</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{moderateCount}</div>
            <div className="text-gray-500">Moderate Interactions</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{interactions.length}</div>
            <div className="text-gray-500">Total Interactions</div>
          </div>
        </Card>
      </div>

      <Card title="Interaction Database">
        <div className="mb-4 flex gap-3">
          <Input.Search placeholder="Search drugs..." allowClear style={{ width: 300 }} />
          <Select
            value={severityFilter}
            onChange={setSeverityFilter}
            style={{ width: 150 }}
          >
            <Select.Option value="all">All Severities</Select.Option>
            <Select.Option value="major">Major</Select.Option>
            <Select.Option value="moderate">Moderate</Select.Option>
            <Select.Option value="minor">Minor</Select.Option>
          </Select>
        </div>
        <Table
          dataSource={filteredInteractions}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
