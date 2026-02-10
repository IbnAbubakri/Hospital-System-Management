'use client';

import React, { useState } from 'react';
import { Card, Button, Input, Form, Select, DatePicker, Table, Tag, Badge, Modal, App } from 'antd';

const { RangePicker } = DatePicker;
import { BarChartOutlined, LineChartOutlined, PieChartOutlined, PlusOutlined, DownloadOutlined, TableOutlined } from '@ant-design/icons';
import { formatDate } from '@/lib/utils';

interface CustomReport {
  id: string;
  name: string;
  type: 'table' | 'chart' | 'summary';
  category: string;
  createdAt: Date;
}

const mockCustomReports: CustomReport[] = [
  { id: 'cr1', name: 'Daily Revenue by Department', type: 'chart', category: 'Financial', createdAt: new Date('2024-01-15') },
  { id: 'cr2', name: 'Patient Admissions Report', type: 'table', category: 'Operational', createdAt: new Date('2024-01-20') },
  { id: 'cr3', name: 'Doctor Performance Summary', type: 'summary', category: 'Clinical', createdAt: new Date('2024-02-01') },
];

export default function ReportBuilderPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const { message } = App.useApp();
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState<'table' | 'chart' | 'summary'>('table');
  const [category, setCategory] = useState('');

  const handleCreateReport = () => {
    message.success('Report created successfully!');
    setModalVisible(false);
    setReportName('');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '24px' }} className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }} className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <BarChartOutlined style={{ color: '#8B5CF6' }} />
              Custom Report Builder
            </h1>
            <p className="text-gray-500 text-sm">Create and manage custom reports</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)} className="w-full sm:w-auto">
            New Report
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card hoverable style={{ borderRadius: '12px' }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TableOutlined style={{ color: '#3B82F6' }} />
              </div>
              <span className="font-medium">Tabular Report</span>
            </div>
            <p className="text-sm text-gray-500">Create detailed data tables with filters and grouping</p>
          </Card>

          <Card hoverable style={{ borderRadius: '12px' }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LineChartOutlined style={{ color: '#10B981' }} />
              </div>
              <span className="font-medium">Chart Report</span>
            </div>
            <p className="text-sm text-gray-500">Visualize data with line, bar, and pie charts</p>
          </Card>

          <Card hoverable style={{ borderRadius: '12px' }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#FED7AA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PieChartOutlined style={{ color: '#F59E0B' }} />
              </div>
              <span className="font-medium">Summary Report</span>
            </div>
            <p className="text-sm text-gray-500">Key metrics and KPIs in summary format</p>
          </Card>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Reports</h2>
        </div>

        <div className="overflow-x-auto">
          <Table
            dataSource={mockCustomReports}
            columns={[
            { title: 'Report Name', dataIndex: 'name', key: 'name' },
            {
              title: 'Type',
              dataIndex: 'type',
              key: 'type',
              render: (type: string) => {
                const icons: Record<string, any> = { table: <TableOutlined />, chart: <LineChartOutlined />, summary: <BarChartOutlined /> };
                return <Tag icon={icons[type]}>{type.toUpperCase()}</Tag>;
              }},
            { title: 'Category', dataIndex: 'category', key: 'category' },
            {
              title: 'Created',
              dataIndex: 'createdAt',
              key: 'created',
              render: (d: Date) => formatDate(d)},
            {
              title: 'Actions',
              key: 'actions',
              render: () => (
                <div className="flex gap-2 flex-wrap">
                  <Button size="small" icon={<DownloadOutlined />}>Export</Button>
                  <Button size="small" danger>Delete</Button>
                </div>
              )},
          ]}
          rowKey="id"
          pagination={false}
          size="middle"
        />
        </div>
      </div>

      <Modal title="Create Custom Report" open={modalVisible} onCancel={() => setModalVisible(false)} onOk={handleCreateReport} width={600}>
        <Form layout="vertical">
          <Form.Item label="Report Name" rules={[{ required: true }]}>
            <Input value={reportName} onChange={(e) => setReportName(e.target.value)} placeholder="Enter report name" />
          </Form.Item>
          <Form.Item label="Report Type" rules={[{ required: true }]}>
            <Select value={reportType} onChange={(v) => setReportType(v)}>
              <Select.Option value="table">Tabular Report</Select.Option>
              <Select.Option value="chart">Chart Report</Select.Option>
              <Select.Option value="summary">Summary Report</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" rules={[{ required: true }]}>
            <Select value={category} onChange={(v) => setCategory(v)}>
              <Select.Option value="Clinical">Clinical</Select.Option>
              <Select.Option value="Financial">Financial</Select.Option>
              <Select.Option value="Operational">Operational</Select.Option>
              <Select.Option value="Inventory">Inventory</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date Range">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
