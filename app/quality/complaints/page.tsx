'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Modal, Form, Input, Select, App } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function QualityComplaintsPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const complaints = [
    {
      id: 'CMP-2024-0892',
      patient: 'Ngozi Eze',
      mrn: 'MRN-2024-0005',
      category: 'Service Quality',
      complaint: 'Long waiting time at pharmacy',
      date: '2024-02-05',
      status: 'Open',
      assignedTo: 'Pharmacy Manager',
      priority: 'Medium'},
    {
      id: 'CMP-2024-0891',
      patient: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-2024-0001',
      category: 'Staff Behavior',
      complaint: 'Rude attitude from nursing staff',
      date: '2024-02-04',
      status: 'In Review',
      assignedTo: 'Nursing Director',
      priority: 'High'},
    {
      id: 'CMP-2024-0890',
      patient: 'Tobi Okafor',
      mrn: 'MRN-2024-0007',
      category: 'Facility Cleanliness',
      complaint: 'Unclean bathroom in waiting area',
      date: '2024-02-03',
      status: 'Resolved',
      assignedTo: 'Housekeeping Supervisor',
      priority: 'Medium'},
    {
      id: 'CMP-2024-0889',
      patient: 'Anonymous',
      mrn: 'N/A',
      category: 'Billing',
      complaint: 'Overcharged for services',
      date: '2024-02-02',
      status: 'In Review',
      assignedTo: 'Billing Manager',
      priority: 'High'},
  ];

  const columns = [
    { title: 'Complaint ID', dataIndex: 'id', key: 'id' },
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'MRN', dataIndex: 'mrn', key: 'mrn', render: (mrn: string) => <Tag color="blue">{mrn}</Tag> },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat: string) => <Tag color="purple">{cat}</Tag> },
    { title: 'Complaint', dataIndex: 'complaint', key: 'complaint' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => <Tag color={priority === 'High' ? 'error' : 'warning'}>{priority}</Tag>},
    { title: 'Assigned To', dataIndex: 'assignedTo', key: 'assignedTo' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Resolved' ? 'success' : status === 'In Review' ? 'processing' : 'error'}>{status}</Tag>},
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>View</Button>
        </Space>
      )},
  ];

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      message.success('Complaint submitted successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-6">
        <Title level={3}>Patient Complaints Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Log Complaint
        </Button>
      </div>

      <Card title="Complaint Register">
        <Table
          dataSource={complaints}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Log Patient Complaint"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="patient" label="Patient Name" rules={[{ required: true }]}>
            <Input placeholder="Enter patient name" />
          </Form.Item>
          <Form.Item name="mrn" label="MRN">
            <Input placeholder="Enter MRN if available" />
          </Form.Item>
          <Form.Item name="category" label="Complaint Category" rules={[{ required: true }]}>
            <Select placeholder="Select category">
              <Select.Option value="service">Service Quality</Select.Option>
              <Select.Option value="staff">Staff Behavior</Select.Option>
              <Select.Option value="facility">Facility Cleanliness</Select.Option>
              <Select.Option value="billing">Billing</Select.Option>
              <Select.Option value="communication">Communication</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="complaint" label="Complaint Details" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Describe the complaint in detail" />
          </Form.Item>
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select placeholder="Select priority">
              <Select.Option value="high">High</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="low">Low</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="assignedTo" label="Assign To" rules={[{ required: true }]}>
            <Select placeholder="Select department/manager">
              <Select.Option value="pharmacy">Pharmacy Manager</Select.Option>
              <Select.Option value="nursing">Nursing Director</Select.Option>
              <Select.Option value="housekeeping">Housekeeping Supervisor</Select.Option>
              <Select.Option value="billing">Billing Manager</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
