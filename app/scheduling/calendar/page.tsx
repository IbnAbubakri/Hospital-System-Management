'use client';

import React from 'react';
import { Card, Typography, Calendar, Badge, Tag, Space, Button, Modal, Form, Select, Input } from 'antd';
import { PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

const { Title } = Typography;

export default function SchedulingCalendarPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Dayjs>(dayjs());
  const [form] = Form.useForm();

  const appointments = [
    { id: 1, title: 'Dr. Okonkwo - Cardiology Clinic', date: '2024-02-05', time: '09:00', type: 'clinic', status: 'confirmed' },
    { id: 2, title: 'Dr. Eze - General OPD', date: '2024-02-05', time: '10:30', type: 'opd', status: 'confirmed' },
    { id: 3, title: 'Dr. Nnamdi - Pediatrics', date: '2024-02-05', time: '14:00', type: 'clinic', status: 'pending' },
    { id: 4, title: 'Dr. Okafor - Surgery', date: '2024-02-05', time: '08:00', type: 'surgery', status: 'confirmed' },
    { id: 5, title: 'Staff Meeting', date: '2024-02-05', time: '16:00', type: 'meeting', status: 'confirmed' },
  ];

  const dateCellRender = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayAppointments = appointments.filter(a => a.date === dateStr);

    return (
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {dayAppointments.map((apt) => (
          <li key={apt.id} style={{ marginBottom: '4px' }}>
            <Badge
              status={apt.status === 'confirmed' ? 'success' : 'warning'}
              text={
                <span style={{ fontSize: '12px' }}>
                  <Tag color={
                    apt.type === 'clinic' ? 'blue' :
                    apt.type === 'opd' ? 'green' :
                    apt.type === 'surgery' ? 'red' : 'orange'
                  }>{apt.time}</Tag>
                  {apt.title.substring(0, 20)}...
                </span>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
    setIsModalVisible(true);
  };

  const handleSchedule = () => {
    form.validateFields().then((values) => {
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Title level={3}>Scheduling Calendar</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          New Appointment
        </Button>
      </div>

      <Card>
        <Calendar
          cellRender={dateCellRender}
          onSelect={handleDateSelect}
          fullscreen={true}
        />
      </Card>

      <Modal
        title={`Schedule Appointment - ${selectedDate?.format('YYYY-MM-DD')}`}
        open={isModalVisible}
        onOk={handleSchedule}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Appointment Title" rules={[{ required: true }]}>
            <Input placeholder="Enter appointment title" />
          </Form.Item>
          <Form.Item name="type" label="Appointment Type" rules={[{ required: true }]}>
            <Select placeholder="Select type">
              <Select.Option value="clinic">Clinic</Select.Option>
              <Select.Option value="opd">OPD</Select.Option>
              <Select.Option value="surgery">Surgery</Select.Option>
              <Select.Option value="meeting">Meeting</Select.Option>
              <Select.Option value="procedure">Procedure</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="doctor" label="Doctor/Staff" rules={[{ required: true }]}>
            <Select placeholder="Select doctor or staff">
              <Select.Option value="dr-okonkwo">Dr. Okonkwo</Select.Option>
              <Select.Option value="dr-eze">Dr. Eze</Select.Option>
              <Select.Option value="dr-nnamdi">Dr. Nnamdi</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="time" label="Time" rules={[{ required: true }]}>
            <Select placeholder="Select time slot">
              <Select.Option value="08:00">08:00 AM</Select.Option>
              <Select.Option value="09:00">09:00 AM</Select.Option>
              <Select.Option value="10:00">10:00 AM</Select.Option>
              <Select.Option value="11:00">11:00 AM</Select.Option>
              <Select.Option value="14:00">02:00 PM</Select.Option>
              <Select.Option value="15:00">03:00 PM</Select.Option>
              <Select.Option value="16:00">04:00 PM</Select.Option>
            </Select>
          </Form.Item>
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
