'use client';

import React, { useState } from 'react';
import { Card, Table, Button, Space, Typography, Input, Select, Tag, Alert } from 'antd';
import { SearchOutlined, MergeCellsOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function PatientMergePage() {
  const [primaryPatient, setPrimaryPatient] = useState('');
  const [duplicatePatients] = useState([
    { id: '1', mrn: 'MRN-2024-0001', name: 'Chukwuemeka Okonkwo', dob: '1979-03-15', phone: '+234 801 234 5678', email: 'chukwu@email.com' },
    { id: '2', mrn: 'MRN-2024-0025', name: 'Chukwuemeka Okonkwo', dob: '1979-03-15', phone: '+234 801 999 8888', email: 'c.okonkwo@email.com' },
  ]);

  const columns = [
    { title: 'MRN', dataIndex: 'mrn', key: 'mrn', render: (mrn: string) => <Tag color="blue">{mrn}</Tag> },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Date of Birth', dataIndex: 'dob', key: 'dob' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Actions', key: 'actions', render: () => <Button type="link">Select as Primary</Button> },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <Title level={3} className="!mb-1">Duplicate Patient Records</Title>
          <Text type="secondary">Merge duplicate patient records</Text>
        </div>
      </div>

      <Alert
        title="Patient Merge"
        description="Select the primary record to keep. All medical history will be consolidated into the selected record."
        type="warning"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Card
        title="Search for Duplicates"
        extra={<Button icon={<MergeCellsOutlined />} type="primary">Auto-Detect Duplicates</Button>}
      >
        <Input.Search
          placeholder="Search by name or MRN..."
          enterButton="Search"
          size="large"
          prefix={<SearchOutlined />}
        />

        <div className="mt-6">
          <Title level={5}>Potential Duplicates Found</Title>
          <div className="overflow-x-auto">
        <Table
            dataSource={duplicatePatients}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
          </div>
        </div>
      </Card>

      <Card style={{ marginTop: '24px' }} title="Merge Summary">
        <Space orientation="vertical" size="middle">
          <div><strong>Primary Record:</strong> MRN-2024-0001</div>
          <div><strong>Merge with:</strong> MRN-2024-0025</div>
          <div><strong>Records to consolidate:</strong> 15 EMRs, 8 appointments, 3 lab results</div>
          <div><strong>Action:</strong> <Text type="danger">MRN-2024-0025 will be archived</Text></div>
          <Button type="primary" danger>Confirm Merge</Button>
        </Space>
      </Card>
    </div>
  );
}
