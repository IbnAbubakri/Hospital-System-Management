'use client';

import React from 'react';
import { Card, Typography, Table, Tag, Button, Space, Modal, Form, Input, Select, DatePicker, App } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function IncidentReportingPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const incidents = [
    { id: 'INC-2024-001', type: 'Patient Fall', severity: 'Moderate', patient: 'Ngozi Eze', location: 'Ward 3', date: '2024-02-05', time: '14:30', reportedBy: 'Nurse Chioma', description: 'Patient slipped in bathroom, no injury', status: 'Under Investigation', actions: 'Increased monitoring, non-slip mats installed' },
    { id: 'INC-2024-002', type: 'Medication Error', severity: 'Minor', patient: 'Chukwuemeka Okonkwo', location: 'Ward 2', date: '2024-02-04', time: '10:15', reportedBy: 'Dr. Eze', description: 'Wrong dose administered', status: 'Resolved', actions: 'Staff education, protocol revised' },
    { id: 'INC-2024-003', type: 'Equipment Malfunction', severity: 'Major', patient: 'N/A', location: 'Radiology', date: '2024-02-03', time: '09:00', reportedBy: 'Radiographer', description: 'X-Ray machine malfunction during procedure', status: 'Resolved', actions: 'Equipment repaired, backup activated' },
    { id: 'INC-2024-004', type: 'Near Miss', severity: 'Low', patient: 'N/A', location: 'Pharmacy', date: '2024-02-02', time: '16:45', reportedBy: 'Pharmacist', description: 'Almost dispensed wrong medication', status: 'Resolved', actions: 'Double-check protocol reinforced' },
  ];

  const columns = [
    { title: 'Incident ID', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color="blue">{type}</Tag> },
    { title: 'Severity', dataIndex: 'severity', key: 'severity', render: (severity: string) => <Tag color={severity === 'Major' ? 'error' : severity === 'Moderate' ? 'warning' : 'default'}>{severity}</Tag> },
    { title: 'Patient', dataIndex: 'patient', key: 'patient', render: (patient: string) => patient || 'N/A' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Date & Time', dataIndex: 'date', key: 'date', render: (_: unknown, record: any) => `${record.date} ${record.time}` },
    { title: 'Reported By', dataIndex: 'reportedBy', key: 'reportedBy' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Resolved' ? 'success' : status === 'Under Investigation' ? 'warning' : 'error'}>{status}</Tag>},
    { title: 'Actions Taken', dataIndex: 'actions', key: 'actions' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">View Details</Button>
          <Button type="link" size="small">Follow-up</Button>
        </Space>
      )},
  ];

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      message.success('Incident reported successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-6">
        <Title level={3}>Incident Reporting System</Title>
        <Button type="primary" icon={<WarningOutlined />} onClick={() => setIsModalVisible(true)}>
          Report Incident
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{incidents.filter(i => i.severity === 'Major').length}</div>
            <div className="text-gray-500">Major Incidents</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{incidents.filter(i => i.severity === 'Moderate').length}</div>
            <div className="text-gray-500">Moderate Incidents</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{incidents.filter(i => i.status === 'Under Investigation').length}</div>
            <div className="text-gray-500">Under Investigation</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{incidents.filter(i => i.status === 'Resolved').length}</div>
            <div className="text-gray-500">Resolved</div>
          </div>
        </Card>
      </div>

      <Card title="Incident Log">
        <Table dataSource={incidents} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal title="Report Incident" open={isModalVisible} onOk={handleSubmit} onCancel={() => setIsModalVisible(false)} width={700}>
        <Form form={form} layout="vertical">
          <Form.Item name="type" label="Incident Type" rules={[{ required: true }]}>
            <Select placeholder="Select incident type">
              <Select.Option value="patient-fall">Patient Fall</Select.Option>
              <Select.Option value="medication-error">Medication Error</Select.Option>
              <Select.Option value="equipment">Equipment Malfunction</Select.Option>
              <Select.Option value="near-miss">Near Miss</Select.Option>
              <Select.Option value="security">Security Breach</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="severity" label="Severity" rules={[{ required: true }]}>
            <Select placeholder="Select severity">
              <Select.Option value="major">Major - Significant impact</Select.Option>
              <Select.Option value="moderate">Moderate - Some impact</Select.Option>
              <Select.Option value="minor">Minor - Minimal impact</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="patient" label="Patient Involved (if applicable)">
            <Input placeholder="Enter patient name or MRN" />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input placeholder="Enter location where incident occurred" />
          </Form.Item>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item name="date" label="Date" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="time" label="Time" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input type="time" />
            </Form.Item>
          </div>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Provide detailed description of the incident" />
          </Form.Item>
          <Form.Item name="immediateActions" label="Immediate Actions Taken">
            <Input.TextArea rows={2} placeholder="Describe any immediate actions taken" />
          </Form.Item>
          <Form.Item name="witnesses" label="Witnesses (if any)">
            <Input.TextArea rows={2} placeholder="List any witnesses to the incident" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
