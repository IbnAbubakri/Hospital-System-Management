'use client';

import React from 'react';
import { Card, Typography, Row, Col, Select, Button, Space, Form, DatePicker, Table, Tag, App } from 'antd';
import { DownloadOutlined, FilePdfOutlined, FileExcelOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function ExportReportPage() {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [selectedReports, setSelectedReports] = React.useState<string[]>([]);

  const availableReports = [
    { id: 'patient-stats', name: 'Patient Statistics', category: 'Clinical', format: ['PDF', 'Excel', 'CSV'] },
    { id: 'disease-trends', name: 'Disease Trends', category: 'Clinical', format: ['PDF', 'Excel'] },
    { id: 'outcomes', name: 'Treatment Outcomes', category: 'Clinical', format: ['PDF', 'Excel'] },
    { id: 'readmissions', name: 'Readmission Analysis', category: 'Quality', format: ['PDF', 'Excel'] },
    { id: 'revenue', name: 'Revenue Analysis', category: 'Financial', format: ['PDF', 'Excel'] },
    { id: 'staff-performance', name: 'Staff Performance', category: 'HR', format: ['PDF', 'Excel'] },
    { id: 'inventory', name: 'Inventory Status', category: 'Operations', format: ['PDF', 'Excel', 'CSV'] },
    { id: 'utilization', name: 'Bed Utilization', category: 'Operations', format: ['PDF', 'Excel'] },
    { id: 'patient-satisfaction', name: 'Patient Satisfaction', category: 'Quality', format: ['PDF'] },
    { id: 'doctor-metrics', name: 'Doctor Metrics', category: 'Clinical', format: ['PDF', 'Excel'] },
  ];

  const exportHistory = [
    { id: 1, report: 'Patient Statistics', format: 'PDF', date: '2024-02-05 14:30', requestedBy: 'Admin', status: 'Completed', size: '2.4 MB' },
    { id: 2, report: 'Revenue Analysis', format: 'Excel', date: '2024-02-05 12:15', requestedBy: 'Finance', status: 'Completed', size: '1.8 MB' },
    { id: 3, report: 'Disease Trends', format: 'PDF', date: '2024-02-05 10:00', requestedBy: 'Medical Director', status: 'Completed', size: '3.2 MB' },
    { id: 4, report: 'Bed Utilization', format: 'Excel', date: '2024-02-04 16:45', requestedBy: 'Admin', status: 'Completed', size: '890 KB' },
    { id: 5, report: 'Staff Performance', format: 'PDF', date: '2024-02-04 14:20', requestedBy: 'HR', status: 'Processing', size: '-' },
  ];

  const reportColumns = [
    { title: 'Report Name', dataIndex: 'report', key: 'report' },
    { title: 'Format', dataIndex: 'format', key: 'format', render: (format: string) => <Tag color="blue">{format}</Tag> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Requested By', dataIndex: 'requestedBy', key: 'requestedBy' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color={status === 'Completed' ? 'success' : 'processing'}>{status}</Tag> },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: any) => (
        record.status === 'Completed' && (
          <Button type="link" size="small" icon={<DownloadOutlined />}>Download</Button>
        )
      )},
  ];

  const handleExport = () => {
    if (selectedReports.length === 0) {
      message.warning('Please select at least one report');
      return;
    }
    message.success(`Exporting ${selectedReports.length} report(s)`);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }} className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
      <Title level={3}>Export Reports</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title="Select Reports to Export" className="p-4 sm:p-6">
            <Form layout="vertical" form={form}>
              <Form.Item label="Date Range">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item label="Report Category">
                <Select placeholder="Filter by category" allowClear>
                  <Select.Option value="clinical">Clinical</Select.Option>
                  <Select.Option value="financial">Financial</Select.Option>
                  <Select.Option value="hr">HR</Select.Option>
                  <Select.Option value="operations">Operations</Select.Option>
                  <Select.Option value="quality">Quality</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Available Reports">
                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #d9d9d9', borderRadius: '4px', padding: '8px' }}>
                  {availableReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{report.name}</div>
                        <div className="text-xs text-gray-500">
                          <Tag>{report.category}</Tag>
                          {report.format.join(', ')}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedReports([...selectedReports, report.id]);
                          } else {
                            setSelectedReports(selectedReports.filter(id => id !== report.id));
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Form.Item>

              <Form.Item label="Export Format">
                <Select defaultValue="pdf">
                  <Select.Option value="pdf">PDF Document</Select.Option>
                  <Select.Option value="excel">Excel Spreadsheet</Select.Option>
                  <Select.Option value="csv">CSV File</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Space wrap>
                  <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport} className="w-full sm:w-auto">
                    Export Selected ({selectedReports.length})
                  </Button>
                  <Button onClick={() => setSelectedReports([])} className="w-full sm:w-auto">Clear Selection</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="Quick Export" className="p-4 sm:p-6">
            <Space orientation="vertical" style={{ width: '100%' }}>
              <Button block icon={<FilePdfOutlined />} className="w-full">Export All Reports (PDF)</Button>
              <Button block icon={<FileExcelOutlined />} className="w-full">Export All Reports (Excel)</Button>
              <Button block icon={<FileTextOutlined />} className="w-full">Export Summary (CSV)</Button>
            </Space>
          </Card>

          <Card title="Export History" style={{ marginTop: '24px' }} className="p-4 sm:p-6">
            <div className="overflow-x-auto">
              <Table
                dataSource={exportHistory}
                columns={reportColumns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                size="small"
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
