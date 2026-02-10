'use client';

import React from 'react';
import { Card, Typography, Table, Tag, Space, Button, Input, Select, Drawer } from 'antd';
import { EyeOutlined, CheckOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function ResultsTrackingPage() {
  const [selectedResult, setSelectedResult] = React.useState<any>(null);
  const [isDrawerVisible, setIsDrawerVisible] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');

  const results = [
    {
      id: 'RES-2024-0892',
      patient: 'Ngozi Eze',
      mrn: 'MRN-2024-0005',
      type: 'Laboratory',
      test: 'Complete Blood Count',
      orderedDate: '2024-02-05',
      orderedTime: '09:00',
      collectedDate: '2024-02-05',
      collectedTime: '09:15',
      expectedDate: '2024-02-05',
      expectedTime: '12:00',
      actualDate: '2024-02-05',
      actualTime: '11:45',
      status: 'Completed',
      orderedBy: 'Dr. Okonkwo',
      performedBy: 'Lab Technician',
      reviewedBy: 'Pathologist',
    },
    {
      id: 'RES-2024-0891',
      patient: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-2024-0001',
      type: 'Radiology',
      test: 'Chest X-Ray',
      orderedDate: '2024-02-05',
      orderedTime: '10:30',
      collectedDate: '2024-02-05',
      collectedTime: '10:45',
      expectedDate: '2024-02-05',
      expectedTime: '14:00',
      actualDate: null,
      actualTime: null,
      status: 'In Progress',
      orderedBy: 'Dr. Eze',
      performedBy: 'Radiographer',
      reviewedBy: null,
    },
    {
      id: 'RES-2024-0890',
      patient: 'Tobi Okafor',
      mrn: 'MRN-2024-0007',
      type: 'Laboratory',
      test: 'Malaria Parasite',
      orderedDate: '2024-02-05',
      orderedTime: '08:00',
      collectedDate: '2024-02-05',
      collectedTime: '08:15',
      expectedDate: '2024-02-05',
      expectedTime: '10:00',
      actualDate: '2024-02-05',
      actualTime: '09:45',
      status: 'Review Pending',
      orderedBy: 'Dr. Nnamdi',
      performedBy: 'Lab Technician',
      reviewedBy: null,
    },
  ];

  const columns = [
    { title: 'Result ID', dataIndex: 'id', key: 'id' },
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'MRN', dataIndex: 'mrn', key: 'mrn', render: (mrn: string) => <Tag color="blue">{mrn}</Tag> },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color="purple">{type}</Tag> },
    { title: 'Test', dataIndex: 'test', key: 'test' },
    { title: 'Ordered', dataIndex: 'orderedTime', key: 'orderedTime', render: (time: string, record: any) => `${record.orderedDate} ${time}` },
    {
      title: 'Collected',
      key: 'collected',
      render: (_: unknown, record: any) => `${record.collectedDate} ${record.collectedTime}`,
    },
    {
      title: 'Expected',
      key: 'expected',
      render: (_: unknown, record: any) => `${record.expectedDate} ${record.expectedTime}`,
    },
    {
      title: 'Completed',
      key: 'completed',
      render: (_: unknown, record: any) => record.actualDate ? `${record.actualDate} ${record.actualTime}` : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Completed' ? 'success' : status === 'In Progress' ? 'processing' : 'warning';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: any) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedResult(record); setIsDrawerVisible(true); }}>
            View
          </Button>
          {record.status === 'Review Pending' && (
            <Button type="link" size="small" icon={<CheckOutlined />}>Review</Button>
          )}
        </Space>
      ),
    },
  ];

  const filteredResults = results.filter(result => {
    const matchStatus = statusFilter === 'all' || result.status.toLowerCase() === statusFilter.toLowerCase();
    const matchType = typeFilter === 'all' || result.type.toLowerCase() === typeFilter.toLowerCase();
    return matchStatus && matchType;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Test Results Tracking</Title>

      <Card>
        <div className="mb-4 flex gap-3">
          <Input.Search placeholder="Search results..." allowClear style={{ width: 250 }} />
          <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 150 }}>
            <Select.Option value="all">All Status</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
            <Select.Option value="in progress">In Progress</Select.Option>
            <Select.Option value="review pending">Review Pending</Select.Option>
          </Select>
          <Select value={typeFilter} onChange={setTypeFilter} style={{ width: 150 }}>
            <Select.Option value="all">All Types</Select.Option>
            <Select.Option value="laboratory">Laboratory</Select.Option>
            <Select.Option value="radiology">Radiology</Select.Option>
          </Select>
        </div>
        <Table dataSource={filteredResults} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Drawer
        title={selectedResult ? `Result Details: ${selectedResult.test}` : 'Result Details'}
        placement="right"
        width={700}
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      >
        {selectedResult && (
          <div>
            <Card size="small" title="Patient Information" className="mb-4">
              <p><strong>Patient:</strong> {selectedResult.patient}</p>
              <p><strong>MRN:</strong> {selectedResult.mrn}</p>
            </Card>

            <Card size="small" title="Test Information" className="mb-4">
              <p><strong>Type:</strong> {selectedResult.type}</p>
              <p><strong>Test:</strong> {selectedResult.test}</p>
              <p><strong>Ordered By:</strong> {selectedResult.orderedBy}</p>
              <p><strong>Performed By:</strong> {selectedResult.performedBy}</p>
            </Card>

            <Card size="small" title="Timeline" className="mb-4">
              <p><strong>Ordered:</strong> {selectedResult.orderedDate} at {selectedResult.orderedTime}</p>
              <p><strong>Collected:</strong> {selectedResult.collectedDate} at {selectedResult.collectedTime}</p>
              <p><strong>Expected:</strong> {selectedResult.expectedDate} by {selectedResult.expectedTime}</p>
              <p><strong>Completed:</strong> {selectedResult.actualDate ? `${selectedResult.actualDate} at ${selectedResult.actualTime}` : 'Pending'}</p>
            </Card>

            <Card size="small" title="Status">
              <Tag color={selectedResult.status === 'Completed' ? 'success' : selectedResult.status === 'In Progress' ? 'processing' : 'warning'}>
                {selectedResult.status}
              </Tag>
            </Card>

            {selectedResult.status === 'Completed' && (
              <Button type="primary" block className="mt-4">View Full Results</Button>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
