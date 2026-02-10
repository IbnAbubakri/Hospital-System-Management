'use client';

import React from 'react';
import { Card, Typography, Form, Select, DatePicker, Button, Input, App, TimePicker } from 'antd';
import { VideoCameraOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

export default function TelemedicineAppointmentPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const doctors = [
    { id: 'dr-okonkwo', name: 'Dr. Okonkwo', specialty: 'Cardiology', availability: ['Mon', 'Wed', 'Fri'] },
    { id: 'dr-eze', name: 'Dr. Eze', specialty: 'General Medicine', availability: ['Tue', 'Thu', 'Sat'] },
    { id: 'dr-nnamdi', name: 'Dr. Nnamdi', specialty: 'Pediatrics', availability: ['Mon', 'Tue', 'Thu'] },
    { id: 'dr-okafor', name: 'Dr. Okafor', specialty: 'Family Medicine', availability: ['Wed', 'Fri', 'Sat'] },
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  ];

  const appointmentTypes = [
    { value: 'consultation', label: 'Initial Consultation', duration: 30 },
    { value: 'followup', label: 'Follow-up Visit', duration: 20 },
    { value: 'review', label: 'Test Results Review', duration: 15 },
    { value: 'prescription', label: 'Prescription Renewal', duration: 15 },
    { value: 'mental', label: 'Mental Health Session', duration: 45 },
  ];

  const handleSchedule = () => {
    form.validateFields().then((values) => {
      message.success('Telemedicine appointment scheduled successfully');
      form.resetFields();
    });
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Title level={3}>Schedule Telemedicine Appointment</Title>

      <Card>
        <Form form={form} layout="vertical">
          <Form.Item name="patient" label="Patient" rules={[{ required: true }]}>
            <Select
              placeholder="Select patient"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={[
                { value: 'MRN-2024-0001', label: 'Chukwuemeka Okonkwo (MRN-2024-0001)' },
                { value: 'MRN-2024-0002', label: 'Emeka Okafor (MRN-2024-0002)' },
                { value: 'MRN-2024-0003', label: 'Adaobi Nwosu (MRN-2024-0003)' },
                { value: 'MRN-2024-0004', label: 'Fatima Ahmed (MRN-2024-0004)' },
                { value: 'MRN-2024-0005', label: 'Ngozi Eze (MRN-2024-0005)' },
              ]}
            />
          </Form.Item>

          <Form.Item name="doctor" label="Select Doctor" rules={[{ required: true }]}>
            <Select
              placeholder="Choose a doctor"
              onChange={() => form.setFieldsValue({ time: null })}
            >
              {doctors.map((doctor) => (
                <Select.Option key={doctor.id} value={doctor.id}>
                  <div>
                    <div className="font-medium">{doctor.name}</div>
                    <div className="text-xs text-gray-500">{doctor.specialty} • Available: {doctor.availability.join(', ')}</div>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="appointmentType" label="Appointment Type" rules={[{ required: true }]}>
            <Select placeholder="Select appointment type">
              {appointmentTypes.map((type) => (
                <Select.Option key={type.value} value={type.value}>
                  {type.label} ({type.duration} min)
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item name="date" label="Date" rules={[{ required: true }]} style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} disabledDate={(current) => current && current < dayjs().startOf('day')} />
            </Form.Item>

            <Form.Item name="time" label="Time" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="Select time slot">
                {timeSlots.map((slot) => (
                  <Select.Option key={slot} value={slot}>{slot}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="reason" label="Reason for Visit" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="Describe the reason for this telemedicine consultation" />
          </Form.Item>

          <Form.Item name="symptoms" label="Symptoms (Optional)">
            <TextArea rows={2} placeholder="List any symptoms you would like to discuss" />
          </Form.Item>

          <Card size="small" title="Important Information" className="mb-4">
            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '14px' }}>
              <li>Please ensure you have a stable internet connection</li>
              <li>Use a device with a camera and microphone</li>
              <li>Find a quiet, private location for the consultation</li>
              <li>Have your current medications ready if applicable</li>
              <li>Join 5 minutes before your scheduled time</li>
            </ul>
          </Card>

          <Form.Item>
            <Button type="primary" block size="large" icon={<VideoCameraOutlined />} onClick={handleSchedule}>
              Schedule Appointment
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
