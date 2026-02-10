'use client';

import React from 'react';
import { Table, Button, Space, Switch, Select, Form, Modal, Input, App } from 'antd';
import { BellOutlined, MailOutlined, MessageOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';
import { Alert } from 'antd';

export default function NotificationsPage() {
  const { user, hasPermission } = useAuth();
  const [isTemplateModalVisible, setIsTemplateModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [searchText, setSearchText] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string | undefined>();

  // CRITICAL SECURITY: Restrict access to administrators only
  if (!hasPermission('admin:notifications:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '16px' }}>
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access notification management. This area is restricted to administrators only."
          type="error"
          showIcon
          icon={<StopOutlined />}
          style={{ marginTop: '24px', borderRadius: '12px' }}
        />
      </div>
    );
  }

  const notificationRules = [
    { id: 1, event: 'Patient Admission', channels: ['Email', 'SMS'], recipients: 'Admin, Ward Nurse', status: 'active' },
    { id: 2, event: 'Patient Discharge', channels: ['Email'], recipients: 'Admin, Billing', status: 'active' },
    { id: 3, event: 'Critical Lab Result', channels: ['Email', 'SMS', 'In-App'], recipients: 'Doctor, Nurse', status: 'active' },
    { id: 4, event: 'Medication Due', channels: ['In-App'], recipients: 'Nurse', status: 'active' },
    { id: 5, event: 'Payment Received', channels: ['Email', 'SMS'], recipients: 'Patient, Billing', status: 'active' },
    { id: 6, event: 'Appointment Reminder', channels: ['Email', 'SMS'], recipients: 'Patient', status: 'active' },
    { id: 7, event: 'Low Stock Alert', channels: ['Email', 'In-App'], recipients: 'Pharmacy, Admin', status: 'active' },
    { id: 8, event: 'System Maintenance', channels: ['Email'], recipients: 'All Users', status: 'inactive' },
  ];

  const templates = [
    { id: 1, name: 'Appointment Confirmation', type: 'Email', subject: 'Appointment Confirmed', lastModified: '2024-02-01', status: 'active' },
    { id: 2, name: 'Lab Result Ready', type: 'SMS', subject: 'N/A', lastModified: '2024-01-28', status: 'active' },
    { id: 3, name: 'Payment Reminder', type: 'Email', subject: 'Payment Reminder', lastModified: '2024-02-03', status: 'active' },
    { id: 4, name: 'Discharge Summary', type: 'Email', subject: 'Discharge Summary', lastModified: '2024-01-25', status: 'active' },
  ];

  const recentNotifications = [
    { id: 1, recipient: 'dr.okonkwo@hospital.com', type: 'Email', subject: 'Critical Lab Result - MRN-2024-0005', sentAt: '2024-02-05 14:25', status: 'delivered' },
    { id: 2, recipient: '+2348012345678', type: 'SMS', subject: 'Appointment Reminder', sentAt: '2024-02-05 14:20', status: 'delivered' },
    { id: 3, recipient: 'nurse.chioma@hospital.com', type: 'In-App', subject: 'Medication Due - Patient Ward 3', sentAt: '2024-02-05 14:15', status: 'read' },
    { id: 4, recipient: 'patient@email.com', type: 'Email', subject: 'Lab Results Ready', sentAt: '2024-02-05 14:10', status: 'delivered' },
  ];

  // Filter notification rules
  const filteredRules = notificationRules.filter((rule) => {
    const matchesSearch =
      rule.event.toLowerCase().includes(searchText.toLowerCase()) ||
      rule.recipients.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter ? rule.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const ruleColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Event', dataIndex: 'event', key: 'event' },
    {
      title: 'Channels',
      dataIndex: 'channels',
      key: 'channels',
      render: (channels: string[]) => (
        <Space>
          {channels.map(c => (
            <StatusTag
              key={c}
              status={c}
              type="appointment"
            />
          ))}
        </Space>
      )
    },
    { title: 'Recipients', dataIndex: 'recipients', key: 'recipients' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="patient" showIcon />
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">Edit</Button>
          <Button type="link" size="small">Toggle</Button>
        </Space>
      )
    },
  ];

  const templateColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Template Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <StatusTag status={type} type="appointment" />
    },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    { title: 'Last Modified', dataIndex: 'lastModified', key: 'lastModified' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="patient" showIcon />
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">Edit</Button>
          <Button type="link" size="small">Preview</Button>
        </Space>
      )
    },
  ];

  const recentColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Recipient', dataIndex: 'recipient', key: 'recipient' },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <StatusTag status={type} type="appointment" />
    },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    { title: 'Sent At', dataIndex: 'sentAt', key: 'sentAt' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="patient" showIcon />
    },
  ];

  const handleCreateTemplate = () => {
    form.validateFields().then((values) => {
      message.success('Template created successfully');
      setIsTemplateModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <PageShell
      title="Notification Management"
      subtitle="Configure notification rules, templates, and delivery channels"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Active Rules"
          value={notificationRules.filter(r => r.status === 'active').length}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={0}
        />
        <StatCard
          label="Total Templates"
          value={templates.length}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={1}
        />
        <StatCard
          label="Sent Today"
          value={recentNotifications.length}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={2}
        />
        <StatCard
          label="Delivery Rate"
          value={98.5}
          suffix="%"
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={3}
        />
      </div>

      {/* Notification Rules Section */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <BellOutlined style={{ color: '#6366F1', fontSize: '20px' }} />
            <h2 className="text-lg font-semibold text-gray-900">Notification Rules</h2>
          </div>
        </div>

        <SearchFilterBar
          searchPlaceholder="Search rules by event or recipient..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { label: 'All Status', value: '' },
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ],
              onChange: (value) => setStatusFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredRules.length}
          totalCount={notificationRules.length}
          filterLabel="rules"
        />

        <ModernTable
          dataSource={filteredRules}
          columns={ruleColumns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </div>

      {/* Notification Templates Section */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <MailOutlined style={{ color: '#8B5CF6', fontSize: '20px' }} />
            <h2 className="text-lg font-semibold text-gray-900">Notification Templates</h2>
          </div>
          <GradientButton
            variant="secondary"
            icon={<PlusOutlined />}
            onClick={() => setIsTemplateModalVisible(true)}
          >
            Create Template
          </GradientButton>
        </div>

        <ModernTable
          dataSource={templates}
          columns={templateColumns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </div>

      {/* Recent Notifications Section */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
        <div className="flex items-center gap-2 mb-4">
          <MessageOutlined style={{ color: '#10B981', fontSize: '20px' }} />
          <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
        </div>

        <ModernTable
          dataSource={recentNotifications}
          columns={recentColumns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </div>

      {/* Create Template Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MailOutlined style={{ color: '#3B82F6' }} />
            <span>Create Notification Template</span>
          </div>
        }
        open={isTemplateModalVisible}
        onOk={handleCreateTemplate}
        onCancel={() => setIsTemplateModalVisible(false)}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
          <Form.Item name="name" label="Template Name" rules={[{ required: true }]}>
            <Input placeholder="Enter template name" style={{ borderRadius: '8px' }} />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select style={{ borderRadius: '8px' }}>
              <Select.Option value="Email">Email</Select.Option>
              <Select.Option value="SMS">SMS</Select.Option>
              <Select.Option value="In-App">In-App</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="subject" label="Subject">
            <Input placeholder="Enter subject (for Email)" style={{ borderRadius: '8px' }} />
          </Form.Item>
          <Form.Item name="body" label="Message Body" rules={[{ required: true }]}>
            <Input.TextArea rows={6} placeholder="Enter message content" style={{ borderRadius: '8px' }} />
          </Form.Item>
        </Form>
      </Modal>
    </PageShell>
  );
}
