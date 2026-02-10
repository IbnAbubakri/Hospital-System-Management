'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Select, Modal, Form, Input, DatePicker, App } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function QualityIncidentsPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const incidents = [
    {
      id: 'INC-2024-0892',
      title: 'Medication Error - Wrong Dose',
      type: 'Medication Error',
      severity: 'Moderate',
      department: 'Pharmacy',
      date: '2024-02-05',
      reportedBy: 'Chukwu Emeka',
      description: 'Patient received double dose of Amlodipine',
      status: 'Open',
      actions: 'Investigation ongoing'},
    {
      id: 'INC-2024-0891',
      title: 'Patient Fall - Ward 3',
      type: 'Patient Safety',
      severity: 'Major',
      department: 'Nursing',
      date: '2024-02-04',
      reportedBy: 'Nurse Chioma',
      description: 'Patient fell while attempting to use bathroom without assistance',
      status: 'In Review',
      actions: 'Root cause analysis in progress'},
    {
      id: 'INC-2024-0890',
      title: 'Equipment Failure - BP Monitor',
      type: 'Equipment',
      severity: 'Minor',
      department: 'Clinical',
      date: '2024-02-03',
      reportedBy: 'Dr. Okonkwo',
      description: 'BP monitor giving inaccurate readings',
      status: 'Resolved',
      actions: 'Equipment replaced, staff notified'},
    {
      id: 'INC-2024-0889',
      title: 'Documentation Error',
      type: 'Documentation',
      severity: 'Minor',
      department: 'Nursing',
      date: '2024-02-02',
      reportedBy: 'Quality Assurance',
      description: 'Incomplete nursing documentation on patient care',
      status: 'Resolved',
      actions: 'Staff education completed'},
  ];

  const columns = [
    { title: 'Incident ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color="blue">{type}</Tag> },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => {
        const color = severity === 'Major' ? 'error' : severity === 'Moderate' ? 'warning' : 'default';
        return <Tag color={color}>{severity}</Tag>;
      }},
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Reported By', dataIndex: 'reportedBy', key: 'reportedBy' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Open' ? 'error' : status === 'In Review' ? 'warning' : 'success';
        return <Tag color={color}>{status}</Tag>;
      }},
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>View</Button>
        </Space>
      )},
  ];

  const handleReport = () => {
    form.validateFields().then((values) => {
      message.success('Incident reported successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const filteredIncidents = incidents.filter(incident => {
    if (statusFilter === 'all') return true;
    return incident.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const openCount = incidents.filter(i => i.status === 'Open').length;
  const reviewCount = incidents.filter(i => i.status === 'In Review').length;
  const resolvedCount = incidents.filter(i => i.status === 'Resolved').length;

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-6">
        <Title level={3}>Incident Reporting</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Report Incident
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{openCount}</div>
            <div className="text-gray-500">Open Incidents</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{reviewCount}</div>
            <div className="text-gray-500">Under Review</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{resolvedCount}</div>
            <div className="text-gray-500">Resolved</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{incidents.length}</div>
            <div className="text-gray-500">Total Incidents</div>
          </div>
        </Card>
      </div>

      <Card title="Incident Log">
        <div className="mb-4">
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
          >
            <Select.Option value="all">All Status</Select.Option>
            <Select.Option value="open">Open</Select.Option>
            <Select.Option value="in review">In Review</Select.Option>
            <Select.Option value="resolved">Resolved</Select.Option>
          </Select>
        </div>
        <Table
          dataSource={filteredIncidents}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Report New Incident"
        open={isModalVisible}
        onOk={handleReport}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Incident Title" rules={[{ required: true }]}>
            <Input placeholder="Brief title of the incident" />
          </Form.Item>
          <Form.Item name="type" label="Incident Type" rules={[{ required: true }]}>
            <Select placeholder="Select incident type">
              <Select.Option value="medication">Medication Error</Select.Option>
              <Select.Option value="patient-safety">Patient Safety</Select.Option>
              <Select.Option value="equipment">Equipment</Select.Option>
              <Select.Option value="documentation">Documentation</Select.Option>
              <Select.Option value="communication">Communication</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="severity" label="Severity" rules={[{ required: true }]}>
            <Select placeholder="Select severity level">
              <Select.Option value="major">Major - Serious harm or potential harm</Select.Option>
              <Select.Option value="moderate">Moderate - Moderate impact</Select.Option>
              <Select.Option value="minor">Minor - Minimal impact</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true }]}>
            <Select placeholder="Select department">
              <Select.Option value="pharmacy">Pharmacy</Select.Option>
              <Select.Option value="nursing">Nursing</Select.Option>
              <Select.Option value="clinical">Clinical</Select.Option>
              <Select.Option value="laboratory">Laboratory</Select.Option>
              <Select.Option value="radiology">Radiology</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Incident Date" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Describe what happened" />
          </Form.Item>
          <Form.Item name="actions" label="Immediate Actions Taken">
            <Input.TextArea rows={2} placeholder="Describe immediate actions taken" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
