'use client';

import React from 'react';
import { Card, Typography, Table, Tag, Button, Space, Modal, Form, Select, Input, App, Descriptions } from 'antd';
import { SendOutlined, EyeOutlined, CheckOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function ReferralsRequestsPage() {
  const [selectedReferral, setSelectedReferral] = React.useState<any>(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const referrals = [
    {
      id: 'REF-2024-0892',
      patient: 'Ngozi Eze',
      mrn: 'MRN-2024-0005',
      from: 'Dr. Okonkwo',
      fromDepartment: 'Cardiology',
      to: 'Dr. Eze',
      toDepartment: 'General Medicine',
      reason: 'Patient requires evaluation for comorbidities',
      priority: 'Routine',
      requestedDate: '2024-02-05',
      status: 'Pending',
      notes: 'Patient has diabetes and hypertension requiring optimization'},
    {
      id: 'REF-2024-0891',
      patient: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-2024-0001',
      from: 'Dr. Eze',
      fromDepartment: 'General Medicine',
      to: 'Dr. Okafor',
      toDepartment: 'Orthopedics',
      reason: 'Chronic joint pain evaluation',
      priority: 'Routine',
      requestedDate: '2024-02-04',
      status: 'Accepted',
      notes: 'Patient reports knee pain for 6 months'},
    {
      id: 'REF-2024-0890',
      patient: 'Tobi Okafor',
      mrn: 'MRN-2024-0007',
      from: 'Dr. Nnamdi',
      fromDepartment: 'Pediatrics',
      to: 'Dr. Okonkwo',
      toDepartment: 'Cardiology',
      reason: 'Cardiac evaluation for congenital heart murmur',
      priority: 'Urgent',
      requestedDate: '2024-02-03',
      status: 'Completed',
      notes: 'Murmur detected during routine examination'},
  ];

  const columns = [
    { title: 'Referral ID', dataIndex: 'id', key: 'id' },
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'MRN', dataIndex: 'mrn', key: 'mrn', render: (mrn: string) => <Tag color="blue">{mrn}</Tag> },
    { title: 'From', dataIndex: 'from', key: 'from' },
    { title: 'From Dept', dataIndex: 'fromDepartment', key: 'fromDepartment', render: (dept: string) => <Tag color="purple">{dept}</Tag> },
    { title: 'To', dataIndex: 'to', key: 'to' },
    { title: 'To Dept', dataIndex: 'toDepartment', key: 'toDepartment', render: (dept: string) => <Tag color="green">{dept}</Tag> },
    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => <Tag color={priority === 'Urgent' ? 'error' : 'default'}>{priority}</Tag>},
    { title: 'Date', dataIndex: 'requestedDate', key: 'requestedDate' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Completed' ? 'success' : status === 'Accepted' ? 'processing' : 'warning'}>{status}</Tag>},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: any) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setSelectedReferral(record)}>View</Button>
          {record.status === 'Pending' && (
            <>
              <Button type="link" size="small" icon={<CheckOutlined />}>Accept</Button>
            </>
          )}
        </Space>
      )},
  ];

  const handleCreate = () => {
    form.validateFields().then((values) => {
      message.success('Referral created successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-6">
        <Title level={3}>Referral Requests</Title>
        <Button type="primary" icon={<SendOutlined />} onClick={() => setIsModalVisible(true)}>
          New Referral
        </Button>
      </div>

      <Card title="All Referrals">
        <Table dataSource={referrals} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        title={selectedReferral?.patient ? `Referral Details: ${selectedReferral.patient}` : 'Create New Referral'}
        open={isModalVisible || !!selectedReferral}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedReferral(null);
        }}
        footer={selectedReferral ? [
          <Button key="close" onClick={() => setSelectedReferral(null)}>Close</Button>,
        ] : undefined}
        width={700}
      >
        {selectedReferral ? (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Referral ID" span={2}>{selectedReferral.id}</Descriptions.Item>
            <Descriptions.Item label="Patient" span={2}>{selectedReferral.patient} ({selectedReferral.mrn})</Descriptions.Item>
            <Descriptions.Item label="From">{selectedReferral.from}</Descriptions.Item>
            <Descriptions.Item label="Department">{selectedReferral.fromDepartment}</Descriptions.Item>
            <Descriptions.Item label="To">{selectedReferral.to}</Descriptions.Item>
            <Descriptions.Item label="Department">{selectedReferral.toDepartment}</Descriptions.Item>
            <Descriptions.Item label="Reason" span={2}>{selectedReferral.reason}</Descriptions.Item>
            <Descriptions.Item label="Priority">{selectedReferral.priority}</Descriptions.Item>
            <Descriptions.Item label="Status">{selectedReferral.status}</Descriptions.Item>
            <Descriptions.Item label="Notes" span={2}>{selectedReferral.notes}</Descriptions.Item>
            <Descriptions.Item label="Requested Date">{selectedReferral.requestedDate}</Descriptions.Item>
          </Descriptions>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item name="patient" label="Patient" rules={[{ required: true }]}>
              <Select placeholder="Select patient" showSearch>
                <Select.Option value="MRN-2024-0001">Chukwuemeka Okonkwo</Select.Option>
                <Select.Option value="MRN-2024-0002">Emeka Okafor</Select.Option>
                <Select.Option value="MRN-2024-0003">Adaobi Nwosu</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="to" label="Referred To (Doctor)" rules={[{ required: true }]}>
              <Select placeholder="Select doctor">
                <Select.Option value="dr-okonkwo">Dr. Okonkwo</Select.Option>
                <Select.Option value="dr-eze">Dr. Eze</Select.Option>
                <Select.Option value="dr-nnamdi">Dr. Nnamdi</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="reason" label="Reason for Referral" rules={[{ required: true }]}>
              <Input.TextArea rows={3} placeholder="Enter reason for referral" />
            </Form.Item>
            <Form.Item name="priority" label="Priority">
              <Select placeholder="Select priority">
                <Select.Option value="routine">Routine</Select.Option>
                <Select.Option value="urgent">Urgent</Select.Option>
                <Select.Option value="emergency">Emergency</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="notes" label="Additional Notes">
              <Input.TextArea rows={2} placeholder="Enter any additional notes" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}
