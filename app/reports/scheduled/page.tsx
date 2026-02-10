'use client';

import React from 'react';
import { Card, Typography, List, Button, Space, Tag, Alert, Form, Input, InputNumber, Select, Row, Col, Statistic, Table, Modal } from 'antd';
import { PlusOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

interface ScheduledReport {
  id: string;
  name: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  recipients: string[];
  lastRun: string;
  nextRun: string;
  format: 'PDF' | 'Excel' | 'Email';
}

export default function ScheduledReportsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [form] = Form.useForm();

  const [reports, setReports] = React.useState<ScheduledReport[]>([
    {
      id: '1',
      name: 'Daily Revenue Report',
      frequency: 'Daily',
      recipients: ['admin@hospital.com', 'finance@hospital.com'],
      lastRun: '2024-02-02 06:00',
      nextRun: '2024-02-03 06:00',
      format: 'Email',
    },
    {
      id: '2',
      name: 'Weekly Patient Statistics',
      frequency: 'Weekly',
      recipients: ['admin@hospital.com', 'medical-director@hospital.com'],
      lastRun: '2024-01-29 08:00',
      nextRun: '2024-02-05 08:00',
      format: 'PDF',
    },
    {
      id: '3',
      name: 'Monthly Financial Summary',
      frequency: 'Monthly',
      recipients: ['admin@hospital.com', 'cfo@hospital.com', 'board@hospital.com'],
      lastRun: '2024-01-31 23:00',
      nextRun: '2024-02-28 23:00',
      format: 'Excel',
    },
  ]);

  const handleCreate = (values: { [key: string]: string | number }) => {
    const newReport: ScheduledReport = {
      id: Date.now().toString(),
      ...(values as any),
      lastRun: 'Not yet run',
      nextRun: values.frequency === 'Daily' ? 'Tomorrow' : values.frequency === 'Weekly' ? 'Next week' : 'Next month',
      recipients: [values.recipients],
      format: values.format,
    };

    setReports([...reports, newReport]);
    setIsModalOpen(false);
  };

  const columns = [
    { title: 'Report Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      render: (freq: string) => <Tag>{freq}</Tag>,
    },
    { title: 'Recipients', dataIndex: 'recipients', key: 'recipients', render: (recipients: string[]) => recipients.join(', ') },
    { title: 'Format', dataIndex: 'format', key: 'format', render: (format: string) => <Tag>{format}</Tag> },
    { title: 'Last Run', dataIndex: 'lastRun', key: 'lastRun' },
    { title: 'Next Run', dataIndex: 'nextRun', key: 'nextRun', render: (date: string) => <span className="text-blue-600">{date}</span> },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: ScheduledReport) => (
        <Space>
          <Button type="link" size="small">Edit</Button>
          <Button type="link" size="small" onClick={() => router.push(`/reports/custom?id=${record.id}`)}>Run Now</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }} className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
      <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-3">
        <Title level={3}>Scheduled Reports</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          Schedule Report
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card className="p-4 sm:p-6">
            <Statistic title="Total Scheduled" value={reports.length} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="p-4 sm:p-6">
            <Statistic title="Daily Reports" value={reports.filter((r: any) => r.frequency === 'Daily').length} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="p-4 sm:p-6">
            <Statistic title="Monthly Reports" value={reports.filter((r: any) => r.frequency === 'Monthly').length} />
          </Card>
        </Col>
      </Row>

      <Card className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <Table
            dataSource={reports}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Card>

      <Modal
        title="Schedule New Report"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label="Report Name" rules={[{ required: true }]}>
            <Input placeholder="e.g., Daily Revenue Report" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="frequency" label="Frequency" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="Daily">Daily</Select.Option>
                  <Select.Option value="Weekly">Weekly</Select.Option>
                  <Select.Option value="Monthly">Monthly</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="format" label="Output Format" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="PDF">PDF</Select.Option>
                  <Select.Option value="Excel">Excel</Select.Option>
                  <Select.Option value="Email">Email</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="recipients" label="Recipients" rules={[{ required: true }]}>
            <Select mode="tags" placeholder="Enter email addresses">
              <Select.Option value="admin@hospital.com">admin@hospital.com</Select.Option>
              <Select.Option value="finance@hospital.com">finance@hospital.com</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full sm:w-auto">
              Schedule Report
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
