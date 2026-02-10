'use client';

import React from 'react';
import { Card, Typography, Table, Tag, Space, Button, Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ReadmissionsPage() {
  const [searchText, setSearchText] = React.useState('');

  const readmissions = [
    { id: '1', patient: 'Ngozi Eze', mrn: 'MRN-2024-0005', primaryDiagnosis: 'Leg Fracture', readmissionDate: '2024-02-01', originalAdmission: '2024-01-15', reason: 'Complications', department: 'Orthopedics' },
    { id: '2', patient: 'Chukwuemeka Okonkwo', mrn: 'MRN-2024-0001', primaryDiagnosis: 'Hypertension', readmissionDate: '2024-01-28', originalAdmission: '2024-01-10', reason: 'Medication Non-compliance', department: 'Cardiology' },
    { id: '3', patient: 'Tobi Okafor', mrn: 'MRN-2024-0007', primaryDiagnosis: 'Asthma Exacerbation', readmissionDate: '2024-01-25', originalAdmission: '2024-01-15', reason: 'Trigger Exposure', department: 'Pediatrics' },
  ];

  const columns = [
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'MRN', dataIndex: 'mrn', key: 'mrn', render: (mrn: string) => <Tag color="blue">{mrn}</Tag> },
    { title: 'Primary Diagnosis', dataIndex: 'primaryDiagnosis', key: 'primaryDiagnosis' },
    { title: 'Department', dataIndex: 'department', key: 'department', render: (dept: string) => <Tag>{dept}</Tag> },
    { title: 'Readmission Date', dataIndex: 'readmissionDate', key: 'readmissionDate' },
    { title: 'Original Admission', dataIndex: 'originalAdmission', key: 'originalAdmission' },
    { title: 'Reason', dataIndex: 'reason', key: 'reason', render: (reason: string) => <Tag color="warning">{reason}</Tag> },
    {
      title: 'Days Between',
      key: 'daysBetween',
      render: (_: unknown, record: any) => {
        const days = Math.ceil((new Date(record.readmissionDate).getTime() - new Date(record.originalAdmission).getTime()) / (1000 * 60 * 60 * 24));
        return <Tag color={days <= 7 ? 'error' : days <= 30 ? 'warning' : 'success'}>{days} days</Tag>;
      },
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }} className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
      <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-3">
        <Title level={3}>Patient Readmissions Analysis</Title>
        <Input.Search
          placeholder="Search readmissions..."
          allowClear
          style={{ width: '100%', maxWidth: '250px' }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
        />
      </div>

      <Card title="Readmission Cases" className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <Table
            dataSource={readmissions.filter(r =>
              r.patient.toLowerCase().includes(searchText.toLowerCase()) ||
              r.primaryDiagnosis.toLowerCase().includes(searchText.toLowerCase())
            )}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 15 }}
          />
        </div>
      </Card>
    </div>
  );
}
