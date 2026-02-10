'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Modal, Form, Select, Input, App } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function SchedulingWaitlistPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const waitlist = [
    { id: 1, patient: 'Ngozi Eze', mrn: 'MRN-2024-0005', doctor: 'Dr. Okonkwo', department: 'Cardiology', requestedDate: '2024-02-05', priority: 'Urgent', requestedBy: 'Self', reason: 'Chest pain', contact: '+2348012345678', status: 'Waiting' },
    { id: 2, patient: 'Chukwuemeka Okonkwo', mrn: 'MRN-2024-0001', doctor: 'Dr. Eze', department: 'General Medicine', requestedDate: '2024-02-04', priority: 'Routine', requestedBy: 'Dr. Nnamdi', reason: 'Follow-up consultation', contact: '+2348023456789', status: 'Waiting' },
    { id: 3, patient: 'Tobi Okafor', mrn: 'MRN-2024-0007', doctor: 'Dr. Nnamdi', department: 'Pediatrics', requestedDate: '2024-02-03', priority: 'Urgent', requestedBy: 'Nurse Chioma', reason: 'High fever', contact: '+2348034567890', status: 'Scheduled' },
    { id: 4, patient: 'Adaobi Nwosu', mrn: 'MRN-2024-0003', doctor: 'Dr. Okafor', department: 'Orthopedics', requestedDate: '2024-02-02', priority: 'Routine', requestedBy: 'Self', reason: 'Joint pain review', contact: '+2348045678901', status: 'Waiting' },
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'MRN', dataIndex: 'mrn', key: 'mrn', render: (mrn: string) => <Tag color="blue">{mrn}</Tag> },
    { title: 'Doctor', dataIndex: 'doctor', key: 'doctor' },
    { title: 'Department', dataIndex: 'department', key: 'department', render: (dept: string) => <Tag color="purple">{dept}</Tag> },
    { title: 'Requested Date', dataIndex: 'requestedDate', key: 'requestedDate' },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => <Tag color={priority === 'Urgent' ? 'error' : 'default'}>{priority}</Tag>},
    { title: 'Requested By', dataIndex: 'requestedBy', key: 'requestedBy' },
    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
    { title: 'Contact', dataIndex: 'contact', key: 'contact' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Scheduled' ? 'success' : 'warning'}>{status}</Tag>},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: any) => (
        <Space>
          {record.status === 'Waiting' && (
            <>
              <Button type="link" size="small" icon={<CheckOutlined />}>Schedule</Button>
              <Button type="link" size="small">Cancel</Button>
            </>
          )}
        </Space>
      )},
  ];

  const handleAdd = () => {
    form.validateFields().then((values) => {
      message.success('Patient added to waitlist successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const urgentCount = waitlist.filter(w => w.priority === 'Urgent' && w.status === 'Waiting').length;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Title level={3}>Appointment Waitlist</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Add to Waitlist
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{urgentCount}</div>
            <div className="text-gray-500">Urgent Cases</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{waitlist.filter(w => w.status === 'Waiting').length}</div>
            <div className="text-gray-500">Waiting</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{waitlist.filter(w => w.status === 'Scheduled').length}</div>
            <div className="text-gray-500">Scheduled Today</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{waitlist.length}</div>
            <div className="text-gray-500">Total on Waitlist</div>
          </div>
        </Card>
      </div>

      <Card title="Waitlist">
        <Table dataSource={waitlist} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal title="Add to Waitlist" open={isModalVisible} onOk={handleAdd} onCancel={() => setIsModalVisible(false)} width={700}>
        <Form form={form} layout="vertical">
          <Form.Item name="patient" label="Patient" rules={[{ required: true }]}>
            <Select placeholder="Select patient" showSearch>
              <Select.Option value="MRN-2024-0001">Chukwuemeka Okonkwo (MRN-2024-0001)</Select.Option>
              <Select.Option value="MRN-2024-0002">Emeka Okafor (MRN-2024-0002)</Select.Option>
              <Select.Option value="MRN-2024-0003">Adaobi Nwosu (MRN-2024-0003)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="doctor" label="Preferred Doctor" rules={[{ required: true }]}>
            <Select placeholder="Select doctor">
              <Select.Option value="dr-okonkwo">Dr. Okonkwo - Cardiology</Select.Option>
              <Select.Option value="dr-eze">Dr. Eze - General Medicine</Select.Option>
              <Select.Option value="dr-nnamdi">Dr. Nnamdi - Pediatrics</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select placeholder="Select priority">
              <Select.Option value="urgent">Urgent</Select.Option>
              <Select.Option value="routine">Routine</Select.Option>
              <Select.Option value="elective">Elective</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="reason" label="Reason for Visit" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Describe the reason for appointment" />
          </Form.Item>
          <Form.Item name="contact" label="Contact Number" rules={[{ required: true }]}>
            <Input placeholder="+234..." />
          </Form.Item>
          <Form.Item name="availability" label="Preferred Availability">
            <Select placeholder="Select preferred times">
              <Select.Option value="morning">Morning (8AM - 12PM)</Select.Option>
              <Select.Option value="afternoon">Afternoon (12PM - 4PM)</Select.Option>
              <Select.Option value="anytime">Anytime</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
