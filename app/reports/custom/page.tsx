'use client';

import React from 'react';
import { Card, Typography, Row, Col, Select, Button, Space, Table, Tag, DatePicker, App, Input } from 'antd';
import { DownloadOutlined, PrinterOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function CustomReportPage() {
  const [reportType, setReportType] = React.useState<string>('patient-stats');
  const [dateRange, setDateRange] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const { message } = App.useApp();

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Report generated successfully');
    }, 2000);
  };

  const reportTypes = [
    { value: 'patient-stats', label: 'Patient Statistics' },
    { value: 'disease-trends', label: 'Disease Trends' },
    { value: 'outcomes', label: 'Treatment Outcomes' },
    { value: 'readmissions', label: 'Readmission Analysis' },
    { value: 'revenue', label: 'Revenue Analysis' },
    { value: 'staff-performance', label: 'Staff Performance' },
    { value: 'inventory', label: 'Inventory Status' },
  ];

  const sampleData = [
    { metric: 'Total Patients', value: 1247, change: '+12.5%', period: 'vs last month' },
    { metric: 'Total Revenue', value: '₦15.2M', change: '+15.3%', period: 'vs last month' },
    { metric: 'Bed Occupancy', value: '78%', change: '-5.1%', period: 'vs last month' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }} className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
      <Title level={3}>Custom Report Builder</Title>

      <Card style={{ marginBottom: '24px' }} className="p-4 sm:p-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Text strong>Report Type</Text>
            <Select
              style={{ width: '100%', marginTop: '8px' }}
              value={reportType}
              onChange={setReportType}
              options={reportTypes}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Text strong>Date Range</Text>
            <DatePicker.RangePicker
              style={{ width: '100%', marginTop: '8px' }}
              value={dateRange}
              onChange={setDateRange}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Text strong>Export Format</Text>
            <Select
              style={{ width: '100%', marginTop: '8px' }}
              defaultValue="pdf"
              options={[
                { value: 'pdf', label: 'PDF Document' },
                { value: 'excel', label: 'Excel Spreadsheet' },
                { value: 'csv', label: 'CSV File' },
              ]}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Text strong>Actions</Text>
            <div style={{ marginTop: '8px' }}>
              <Space wrap>
                <Button type="primary" onClick={handleGenerate} loading={loading} className="w-full sm:w-auto">
                  Generate Report
                </Button>
                <Button icon={<DownloadOutlined />} className="w-full sm:w-auto">Export</Button>
                <Button icon={<PrinterOutlined />} className="w-full sm:w-auto">Print</Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      <Card title="Report Preview" className="p-4 sm:p-6">
        <div className="mb-4">
          <Text strong>Report Type:</Text> <Tag color="blue">{reportTypes.find(r => r.value === reportType)?.label}</Tag>
        </div>
        <div className="overflow-x-auto">
          <Table
            dataSource={sampleData}
            columns={[
              { title: 'Metric', dataIndex: 'metric' },
              { title: 'Value', dataIndex: 'value' },
              { title: 'Change', dataIndex: 'change', render: (change: string) => (
                <span className={change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>{change}</span>
              )},
              { title: 'Period', dataIndex: 'period' },
            ]}
            pagination={false}
          />
        </div>
      </Card>
    </div>
  );
}
