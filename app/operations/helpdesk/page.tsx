'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Modal, Form, Input, Select, App } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function HelpdeskPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const tickets = [
    { id: 'TKT-001', title: 'Computer not booting in Ward 3', category: 'IT Hardware', priority: 'High', status: 'Open', submittedBy: 'Nurse Chioma', department: 'Ward 3', date: '2024-02-05 14:20', assignedTo: 'IT Support' },
    { id: 'TKT-002', title: 'AC not working in Pharmacy', category: 'Facilities', priority: 'Medium', status: 'In Progress', submittedBy: 'Pharmacy Manager', department: 'Pharmacy', date: '2024-02-05 11:30', assignedTo: 'Engineering' },
    { id: 'TKT-003', title: 'Need additional office chair', category: 'General', priority: 'Low', status: 'Open', submittedBy: 'Admin Staff', department: 'Administration', date: '2024-02-05 09:15', assignedTo: null },
    { id: 'TKT-004', title: 'Printer jam in Records', category: 'IT Hardware', priority: 'Medium', status: 'Resolved', submittedBy: 'Records Clerk', department: 'Records', date: '2024-02-04 16:45', assignedTo: 'IT Support' },
  ];

  const columns = [
    { title: 'Ticket ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat: string) => <Tag color="blue">{cat}</Tag> },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => <Tag color={priority === 'High' ? 'error' : priority === 'Medium' ? 'warning' : 'default'}>{priority}</Tag>},
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Submitted By', dataIndex: 'submittedBy', key: 'submittedBy' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Assigned To', dataIndex: 'assignedTo', key: 'assignedTo', render: (to: string | null) => to || '-' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Resolved' ? 'success' : status === 'In Progress' ? 'processing' : 'warning'}>{status}</Tag>},
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">View</Button>
          <Button type="link" size="small">Update</Button>
        </Space>
      )},
  ];

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      message.success('Support ticket created successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <Title level={3}>Helpdesk & Support</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} className="w-full sm:w-auto">
          New Ticket
        </Button>
      </div>

      <Card title="Support Tickets" className="overflow-x-auto">
        <Table dataSource={tickets} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal title="Create Support Ticket" open={isModalVisible} onOk={handleSubmit} onCancel={() => setIsModalVisible(false)} width={700}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Issue Title" rules={[{ required: true }]}>
            <Input placeholder="Brief description of the issue" />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select category">
              <Select.Option value="it-hardware">IT Hardware</Select.Option>
              <Select.Option value="it-software">IT Software</Select.Option>
              <Select.Option value="facilities">Facilities</Select.Option>
              <Select.Option value="housekeeping">Housekeeping</Select.Option>
              <Select.Option value="security">Security</Select.Option>
              <Select.Option value="general">General</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Select placeholder="Select priority">
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
              <Select.Option value="critical">Critical</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true }]}>
            <Select placeholder="Select your department">
              <Select.Option value="pharmacy">Pharmacy</Select.Option>
              <Select.Option value="nursing">Nursing</Select.Option>
              <Select.Option value="administration">Administration</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Detailed Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Describe the issue in detail" />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input placeholder="Specific location where issue occurred" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
