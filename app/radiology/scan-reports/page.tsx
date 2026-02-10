'use client';

import React, { useState } from 'react';
import { Table, Button, Input, Select, Tag, Drawer, Descriptions, Badge, Card, DatePicker } from 'antd';
import { SearchOutlined, ScanOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { formatDate, formatDateTime } from '@/lib/utils';

const { RangePicker } = DatePicker;

interface RadiologyReport {
  id: string;
  studyId: string;
  patientName: string;
  study: string;
  modality: 'X-Ray' | 'CT' | 'MRI' | 'Ultrasound';
  radiologist: string;
  scanDate: Date;
  reportDate: Date;
  status: 'preliminary' | 'final';
}

const mockRadiologyReports: RadiologyReport[] = [
  { id: 'rad1', studyId: 'STUD-2024-001', patientName: 'Chukwuemeka Okonkwo', study: 'Chest X-Ray PA View', modality: 'X-Ray', radiologist: 'Dr. Radiologist 1', scanDate: new Date('2024-02-05'), reportDate: new Date('2024-02-05'), status: 'final' },
  { id: 'rad2', studyId: 'STUD-2024-002', patientName: 'Adanna Okafor', study: 'CT Scan Head Plain', modality: 'CT', radiologist: 'Dr. Radiologist 2', scanDate: new Date('2024-02-05'), reportDate: new Date('2024-02-05'), status: 'preliminary' },
  { id: 'rad3', studyId: 'STUD-2024-003', patientName: 'Tobi Okafor', study: 'MRI Brain', modality: 'MRI', radiologist: 'Dr. Radiologist 1', scanDate: new Date('2024-02-04'), reportDate: new Date('2024-02-04'), status: 'final' },
];

export default function ScanReportsPage() {
  const [searchText, setSearchText] = useState('');
  const [modalityFilter, setModalityFilter] = useState<string | undefined>();

  const filteredReports = mockRadiologyReports.filter((report) => {
    const matchesSearch =
      report.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
      report.studyId.toLowerCase().includes(searchText.toLowerCase());
    const matchesModality = !modalityFilter || report.modality === modalityFilter;
    return matchesSearch && matchesModality;
  });

  const columns = [
    { title: 'Study ID', dataIndex: 'studyId', key: 'studyId' },
    { title: 'Patient', dataIndex: 'patientName', key: 'patient' },
    {
      title: 'Modality',
      dataIndex: 'modality',
      key: 'modality',
      render: (modality: string) => <Tag>{modality.toUpperCase()}</Tag>,
    },
    { title: 'Study', dataIndex: 'study', key: 'study', ellipsis: true },
    { title: 'Radiologist', dataIndex: 'radiologist', key: 'radiologist' },
    {
      title: 'Scan Date',
      dataIndex: 'scanDate',
      key: 'scanDate',
      render: (d: Date) => formatDate(d),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'final' ? 'success' : 'warning'}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => <Button size="small">View Details</Button>,
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <FileTextOutlined style={{ color: '#6366F1' }} />
              Radiology Reports
            </h1>
            <p className="text-gray-500 text-sm">Imaging reports and documentation</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Input placeholder="Search reports..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ flex: 1, maxWidth: '400px' }} />
          <Select placeholder="Modality" value={modalityFilter} onChange={setModalityFilter} allowClear style={{ width: '140px' }}>
            <Select.Option value="X-Ray">X-Ray</Select.Option>
            <Select.Option value="CT">CT</Select.Option>
            <Select.Option value="MRI">MRI</Select.Option>
            <Select.Option value="Ultrasound">Ultrasound</Select.Option>
          </Select>
          <RangePicker style={{ width: '300px' }} />
          <Badge count={filteredReports.length} style={{ background: '#6366F1' }} />
        </div>

        <Table dataSource={filteredReports} columns={columns} rowKey="id" pagination={{ defaultPageSize: 10 }} size="middle" />
      </div>
    </div>
  );
}
