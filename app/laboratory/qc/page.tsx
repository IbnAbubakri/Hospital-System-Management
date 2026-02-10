'use client';

import React from 'react';
import { Table, Button, Input, Badge, Tag, Card, Form, DatePicker, InputNumber, App } from 'antd';
import { SearchOutlined, CheckOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface QualityControlItem {
  id: string;
  test: string;
  controlNumber: string;
  lotNumber: string;
  expiryDate: Date;
  result: string;
  expected: string;
  status: 'pass' | 'fail' | 'pending';
}

const mockQC: QualityControlItem[] = [
  { id: 'qc1', test: 'Glucose Fasting', controlNumber: 'QC-GLU-001', lotNumber: 'QC-2024-001', expiryDate: new Date('2024-12-31'), result: '95 mg/dL', expected: '70-100 mg/dL', status: 'pass' },
  { id: 'qc2', test: 'HbA1c Control', controlNumber: 'QC-HBA-001', lotNumber: 'QC-2024-002', expiryDate: new Date('2024-10-31'), result: '6.8%', expected: '6.5-7.5%', status: 'pass' },
  { id: 'qc3', test: 'Lipid Control', controlNumber: 'QC-LIP-001', lotNumber: 'QC-2024-003', expiryDate: new Date('2024-11-30'), result: '220 mg/dL', expected: '180-200 mg/dL', status: 'fail' },
];

export default function QualityControlPage() {
  const [searchText, setSearchText] = React.useState('');
  const { message } = App.useApp();

  const filteredQC = mockQC.filter((qc) => {
    return qc.test.toLowerCase().includes(searchText.toLowerCase()) || qc.controlNumber.toLowerCase().includes(searchText.toLowerCase());
  });

  const columns = [
    { title: 'Test', dataIndex: 'test', key: 'test' },
    { title: 'Control Number', dataIndex: 'controlNumber', key: 'controlNumber' },
    { title: 'Lot Number', dataIndex: 'lotNumber', key: 'lotNumber' },
    { title: 'Result', dataIndex: 'result', key: 'result' },
    { title: 'Expected Range', dataIndex: 'expected', key: 'expected' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'pass' ? 'success' : status === 'fail' ? 'error' : 'warning'} icon={status === 'pass' ? <CheckOutlined /> : null}>
          {status.toUpperCase()}
        </Tag>
      )},
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '24px' }}>
      <div className="p-4 sm:p-6" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Quality Control</h1>
            <p className="text-gray-500 text-sm">Lab quality control checks and calibration logs</p>
          </div>
          <Button type="primary" className="w-full sm:w-auto">Run QC Test</Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <Input placeholder="Search QC records..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-full sm:flex-1 sm:max-w-xs" />
          <Badge count={filteredQC.length} style={{ background: '#10B981' }} />
        </div>

        <div className="overflow-x-auto">
          <Table dataSource={filteredQC} columns={columns} rowKey="id" pagination={{ defaultPageSize: 10 }} size="middle" />
        </div>
      </div>
    </div>
  );
}
