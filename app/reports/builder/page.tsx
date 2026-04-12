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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50   sm: sm: lg: lg:">
      <div className="bg-white -xl  border border-slate-200">
        <div className="    -col sm:-row ">
          <div>
            <h1 className="text-2xl font-semibold     ">
              <BarChartOutlined className="" />
              Custom Report Builder
            </h1>
            <p className=" ">Create and manage custom reports</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)} className="w-full sm:w-auto">
            New Report
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  ">
          <Card hoverable className="-xl">
            <div className="   ">
              <div className="  -lg bg-blue-100   ">
                <TableOutlined className="" />
              </div>
              <span className="font-medium">Tabular Report</span>
            </div>
            <p className=" ">Create detailed data tables with filters and grouping</p>
          </Card>

          <Card hoverable className="-xl">
            <div className="   ">
              <div className="  -lg bg-emerald-100   ">
                <LineChartOutlined className="" />
              </div>
              <span className="font-medium">Chart Report</span>
            </div>
            <p className=" ">Visualize data with line, bar, and pie charts</p>
          </Card>

          <Card hoverable className="-xl">
            <div className="   ">
              <div className="  -lg bg-orange-100   ">
                <PieChartOutlined className="" />
              </div>
              <span className="font-medium">Summary Report</span>
            </div>
            <p className=" ">Key metrics and KPIs in summary format</p>
          </Card>
        </div>

        <div className="">
          <h2 className=" font-semibold  ">My Reports</h2>
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
                <div className="  -wrap">
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
            <RangePicker className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
