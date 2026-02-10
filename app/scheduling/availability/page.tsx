'use client';

import React from 'react';
import { Card, Typography, Table, Tag, Space, Button, Switch, TimePicker, Modal, Form, Input, App, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function SchedulingAvailabilityPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const schedules = [
    { id: 1, doctor: 'Dr. Okonkwo', department: 'Cardiology', monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false, startTime: '08:00', endTime: '16:00', status: 'Active' },
    { id: 2, doctor: 'Dr. Eze', department: 'General Medicine', monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false, startTime: '09:00', endTime: '17:00', status: 'Active' },
    { id: 3, doctor: 'Dr. Nnamdi', department: 'Pediatrics', monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true, startTime: '08:00', endTime: '20:00', status: 'Active' },
    { id: 4, doctor: 'Dr. Okafor', department: 'Orthopedics', monday: true, tuesday: true, wednesday: false, thursday: true, friday: true, saturday: false, sunday: false, startTime: '09:00', endTime: '15:00', status: 'On Leave' },
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Doctor', dataIndex: 'doctor', key: 'doctor' },
    { title: 'Department', dataIndex: 'department', key: 'department', render: (dept: string) => <Tag color="blue">{dept}</Tag> },
    {
      title: 'Mon',
      dataIndex: 'monday',
      key: 'monday',
      render: (available: boolean) => <Tag color={available ? 'success' : 'default'}>{available ? '✓' : '✗'}</Tag>,
      align: 'center' as const},
    {
      title: 'Tue',
      dataIndex: 'tuesday',
      key: 'tuesday',
      render: (available: boolean) => <Tag color={available ? 'success' : 'default'}>{available ? '✓' : '✗'}</Tag>,
      align: 'center' as const},
    {
      title: 'Wed',
      dataIndex: 'wednesday',
      key: 'wednesday',
      render: (available: boolean) => <Tag color={available ? 'success' : 'default'}>{available ? '✓' : '✗'}</Tag>,
      align: 'center' as const},
    {
      title: 'Thu',
      dataIndex: 'thursday',
      key: 'thursday',
      render: (available: boolean) => <Tag color={available ? 'success' : 'default'}>{available ? '✓' : '✗'}</Tag>,
      align: 'center' as const},
    {
      title: 'Fri',
      dataIndex: 'friday',
      key: 'friday',
      render: (available: boolean) => <Tag color={available ? 'success' : 'default'}>{available ? '✓' : '✗'}</Tag>,
      align: 'center' as const},
    {
      title: 'Sat',
      dataIndex: 'saturday',
      key: 'saturday',
      render: (available: boolean) => <Tag color={available ? 'success' : 'default'}>{available ? '✓' : '✗'}</Tag>,
      align: 'center' as const},
    {
      title: 'Sun',
      dataIndex: 'sunday',
      key: 'sunday',
      render: (available: boolean) => <Tag color={available ? 'success' : 'default'}>{available ? '✓' : '✗'}</Tag>,
      align: 'center' as const},
    { title: 'Start Time', dataIndex: 'startTime', key: 'startTime' },
    { title: 'End Time', dataIndex: 'endTime', key: 'endTime' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Active' ? 'success' : 'default'}>{status}</Tag>},
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button type="link" size="small">Edit</Button>
      )},
  ];

  const handleSave = () => {
    form.validateFields().then((values) => {
      message.success('Availability saved successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1600px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Title level={3}>Staff Availability</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Set Availability
        </Button>
      </div>

      <Card title="Weekly Schedule">
        <Table dataSource={schedules} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 1400 }} />
      </Card>

      <Modal title="Set Availability" open={isModalVisible} onOk={handleSave} onCancel={() => setIsModalVisible(false)} width={700}>
        <Form form={form} layout="vertical">
          <Form.Item name="doctor" label="Doctor/Staff" rules={[{ required: true }]}>
            <Select placeholder="Select doctor">
              <Select.Option value="dr-okonkwo">Dr. Okonkwo</Select.Option>
              <Select.Option value="dr-eze">Dr. Eze</Select.Option>
              <Select.Option value="dr-nnamdi">Dr. Nnamdi</Select.Option>
            </Select>
          </Form.Item>

          <Card size="small" title="Working Days" className="mb-4">
            <Form.Item name="weekdays" label="Select Working Days">
              <Select mode="multiple" placeholder="Select days" defaultValue={['mon', 'tue', 'wed', 'thu', 'fri']}>
                <Select.Option value="mon">Monday</Select.Option>
                <Select.Option value="tue">Tuesday</Select.Option>
                <Select.Option value="wed">Wednesday</Select.Option>
                <Select.Option value="thu">Thursday</Select.Option>
                <Select.Option value="fri">Friday</Select.Option>
                <Select.Option value="sat">Saturday</Select.Option>
                <Select.Option value="sun">Sunday</Select.Option>
              </Select>
            </Form.Item>
          </Card>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item name="startTime" label="Start Time" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="Select start time">
                <Select.Option value="08:00">08:00 AM</Select.Option>
                <Select.Option value="09:00">09:00 AM</Select.Option>
                <Select.Option value="10:00">10:00 AM</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="endTime" label="End Time" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="Select end time">
                <Select.Option value="16:00">04:00 PM</Select.Option>
                <Select.Option value="17:00">05:00 PM</Select.Option>
                <Select.Option value="18:00">06:00 PM</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="breakDuration" label="Break Duration (minutes)">
            <Select placeholder="Select break duration">
              <Select.Option value="30">30 minutes</Select.Option>
              <Select.Option value="45">45 minutes</Select.Option>
              <Select.Option value="60">1 hour</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="Active">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
          </Form.Item>

          <Form.Item name="notes" label="Special Notes">
            <Input.TextArea rows={2} placeholder="Enter any special notes" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
