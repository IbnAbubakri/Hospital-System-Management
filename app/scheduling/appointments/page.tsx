'use client';

import React from 'react';
import { Card, Typography, Table, Tag, Space, Button, Input, Select, DatePicker, Modal, Form, App } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function SchedulingAppointmentsPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const appointments = [
    { id: 'APT-2024-0892', patient: 'Ngozi Eze', mrn: 'MRN-2024-0005', doctor: 'Dr. Okonkwo', department: 'Cardiology', date: '2024-02-06', time: '09:00', type: 'Follow-up', status: 'Confirmed', duration: 30 },
    { id: 'APT-2024-0891', patient: 'Chukwuemeka Okonkwo', mrn: 'MRN-2024-0001', doctor: 'Dr. Eze', department: 'General Medicine', date: '2024-02-06', time: '10:30', type: 'Consultation', status: 'Confirmed', duration: 30 },
    { id: 'APT-2024-0890', patient: 'Tobi Okafor', mrn: 'MRN-2024-0007', doctor: 'Dr. Nnamdi', department: 'Pediatrics', date: '2024-02-06', time: '14:00', type: 'Initial Visit', status: 'Pending', duration: 45 },
    { id: 'APT-2024-0889', patient: 'Adaobi Nwosu', mrn: 'MRN-2024-0003', doctor: 'Dr. Okafor', department: 'Orthopedics', date: '2024-02-05', time: '11:00', type: 'Follow-up', status: 'Completed', duration: 30 },
    { id: 'APT-2024-0888', patient: 'Emeka Okafor', mrn: 'MRN-2024-0002', doctor: 'Dr. Okonkwo', department: 'Cardiology', date: '2024-02-05', time: '15:30', type: 'Consultation', status: 'Cancelled', duration: 30 },
  ];

  const columns = [
    { title: 'Appointment ID', dataIndex: 'id', key: 'id' },
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'MRN', dataIndex: 'mrn', key: 'mrn', render: (mrn: string) => <Tag color="blue">{mrn}</Tag> },
    { title: 'Doctor', dataIndex: 'doctor', key: 'doctor' },
    { title: 'Department', dataIndex: 'department', key: 'department', render: (dept: string) => <Tag color="purple">{dept}</Tag> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Time', dataIndex: 'time', key: 'time' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type: string) => <Tag>{type}</Tag> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Confirmed' ? 'success' : status === 'Completed' ? 'default' : status === 'Pending' ? 'warning' : 'error';
        return <Tag color={color}>{status}</Tag>;
      }},
    { title: 'Duration (min)', dataIndex: 'duration', key: 'duration' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>Edit</Button>
          <Button type="link" size="small">Cancel</Button>
        </Space>
      )},
  ];

  const handleBook = () => {
    form.validateFields().then((values) => {
      message.success('Appointment booked successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const filteredAppointments = appointments.filter(apt => {
    if (statusFilter === 'all') return true;
    return apt.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const todayCount = appointments.filter(a => a.date === '2024-02-05' && a.status === 'Confirmed').length;
  const confirmedCount = appointments.filter(a => a.status === 'Confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Title level={3}>Appointments Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Book Appointment
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{todayCount}</div>
            <div className="text-gray-500">Today's Appointments</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{confirmedCount}</div>
            <div className="text-gray-500">Confirmed</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{completedCount}</div>
            <div className="text-gray-500">Completed Today</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{appointments.filter(a => a.status === 'Pending').length}</div>
            <div className="text-gray-500">Pending Confirmation</div>
          </div>
        </Card>
      </div>

      <Card title="All Appointments">
        <div className="mb-4 flex gap-3">
          <Input.Search placeholder="Search appointments..." allowClear style={{ width: 250 }} />
          <DatePicker.RangePicker style={{ width: 280 }} />
          <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 150 }}>
            <Select.Option value="all">All Status</Select.Option>
            <Select.Option value="confirmed">Confirmed</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
            <Select.Option value="cancelled">Cancelled</Select.Option>
          </Select>
        </div>
        <Table dataSource={filteredAppointments} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal title="Book New Appointment" open={isModalVisible} onOk={handleBook} onCancel={() => setIsModalVisible(false)} width={700}>
        <Form form={form} layout="vertical">
          <Form.Item name="patient" label="Patient" rules={[{ required: true }]}>
            <Select placeholder="Select patient" showSearch>
              <Select.Option value="MRN-2024-0001">Chukwuemeka Okonkwo (MRN-2024-0001)</Select.Option>
              <Select.Option value="MRN-2024-0002">Emeka Okafor (MRN-2024-0002)</Select.Option>
              <Select.Option value="MRN-2024-0003">Adaobi Nwosu (MRN-2024-0003)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="doctor" label="Doctor" rules={[{ required: true }]}>
            <Select placeholder="Select doctor">
              <Select.Option value="dr-okonkwo">Dr. Okonkwo - Cardiology</Select.Option>
              <Select.Option value="dr-eze">Dr. Eze - General Medicine</Select.Option>
              <Select.Option value="dr-nnamdi">Dr. Nnamdi - Pediatrics</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="type" label="Appointment Type" rules={[{ required: true }]}>
            <Select placeholder="Select type">
              <Select.Option value="consultation">Consultation</Select.Option>
              <Select.Option value="followup">Follow-up</Select.Option>
              <Select.Option value="initial">Initial Visit</Select.Option>
              <Select.Option value="procedure">Procedure</Select.Option>
            </Select>
          </Form.Item>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item name="date" label="Date" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="time" label="Time" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="Select time">
                <Select.Option value="09:00">09:00 AM</Select.Option>
                <Select.Option value="10:00">10:00 AM</Select.Option>
                <Select.Option value="11:00">11:00 AM</Select.Option>
                <Select.Option value="14:00">02:00 PM</Select.Option>
                <Select.Option value="15:00">03:00 PM</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="duration" label="Duration">
            <Select placeholder="Select duration">
              <Select.Option value="15">15 minutes</Select.Option>
              <Select.Option value="30">30 minutes</Select.Option>
              <Select.Option value="45">45 minutes</Select.Option>
              <Select.Option value="60">1 hour</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={2} placeholder="Enter any notes" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
