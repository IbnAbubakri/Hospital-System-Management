'use client';

import React, { useState } from 'react';
import { Table, Button, Tag, Input, Select, Modal, Form, InputNumber, DatePicker, App } from 'antd';
import { VideoCameraOutlined, PlusOutlined, SearchOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { mockTelemedicineConsultations, mockTelemedicineSlots } from '@/lib/mockDataExtended';
import { TelemedicineConsultation, TelemedicineSlot } from '@/types';
import { formatDate, formatDateTime } from '@/lib/utils';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

export default function TelemedicineBookPage() {
  const [searchText, setSearchText] = useState('');
  const { message } = App.useApp();
  const [doctorFilter, setDoctorFilter] = useState<string | undefined>();
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredConsultations = mockTelemedicineConsultations.filter((consult) => {
    return (
      consult.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
      consult.doctorName.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; text: string }> = {
      scheduled: { color: '#3B82F6', bg: '#DBEAFE', text: 'Scheduled' },
      confirmed: { color: '#10B981', bg: '#D1FAE5', text: 'Confirmed' },
      in_progress: { color: '#F59E0B', bg: '#FEF3C7', text: 'In Progress' },
      completed: { color: '#059669', bg: '#D1FAE5', text: 'Completed' },
      no_show: { color: '#6B7280', bg: '#F3F4F6', text: 'No Show' },
      cancelled: { color: '#EF4444', bg: '#FEE2E2', text: 'Cancelled' }};
    return configs[status] || configs.scheduled;
  };

  const columns = [
    { title: 'Consultation ID', dataIndex: 'consultationNumber', key: 'id' },
    { title: 'Patient', dataIndex: 'patientName', key: 'patient' },
    { title: 'Doctor', dataIndex: 'doctorName', key: 'doctor' },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department'},
    {
      title: 'Scheduled Date',
      dataIndex: 'scheduledDate',
      key: 'date',
      render: (d: Date) => formatDate(d)},
    {
      title: 'Time',
      dataIndex: 'scheduledTime',
      key: 'time'},
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => `${duration} min`},
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag icon={type === 'video' ? <VideoCameraOutlined /> : null}>{type.toUpperCase()}</Tag>},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getStatusConfig(status);
        return <Tag style={{ backgroundColor: config.bg, color: config.color, border: 'none', fontWeight: 500 }}>{config.text}</Tag>;
      }},
  ];

  const handleBookConsultation = () => {
    form.validateFields().then((values) => {
      message.success('Telemedicine consultation booked successfully!');
      setBookingModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <VideoCameraOutlined style={{ color: '#8B5CF6' }} />
              Book Telemedicine Consultation
            </h1>
            <p className="text-gray-500 text-sm">Schedule online consultation with doctors</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setBookingModalVisible(true)}>
            Book Consultation
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div style={{ padding: '20px', background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', borderRadius: '12px', color: 'white' }}>
            <div className="flex items-center gap-3 mb-3">
              <CalendarOutlined style={{ fontSize: '24px' }} />
              <span className="text-lg font-semibold">Available Slots Today</span>
            </div>
            <div className="text-3xl font-bold">{mockTelemedicineSlots.filter((s: any) => s.available).length}</div>
          </div>
          <div style={{ padding: '20px', background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', borderRadius: '12px', color: 'white' }}>
            <div className="flex items-center gap-3 mb-3">
              <VideoCameraOutlined style={{ fontSize: '24px' }} />
              <span className="text-lg font-semibold">Upcoming Consultations</span>
            </div>
            <div className="text-3xl font-bold">{mockTelemedicineConsultations.filter((c: any) => c.status === 'scheduled' || c.status === 'confirmed').length}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Input placeholder="Search consultations..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ flex: 1, maxWidth: '400px' }} />
        </div>

        <Table dataSource={filteredConsultations} columns={columns} rowKey="id" pagination={{ defaultPageSize: 10 }} size="middle" />
      </div>

      <Modal
        title="Book Telemedicine Consultation"
        open={bookingModalVisible}
        onCancel={() => setBookingModalVisible(false)}
        onOk={handleBookConsultation}
        okText="Book Now"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Patient" name="patientId" rules={[{ required: true, message: 'Please select patient' }]}>
            <Select placeholder="Select Patient">
              <Option value="1">Chukwuemeka Okonkwo</Option>
              <Option value="2">Adanna Okafor</Option>
              <Option value="3">Olufemi Adebayo</Option>
              <Option value="4">Chioma Eze</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Department" name="department" rules={[{ required: true }]}>
            <Select placeholder="Select Department">
              <Option value="Cardiology">Cardiology</Option>
              <Option value="General Medicine">General Medicine</Option>
              <Option value="Pediatrics">Pediatrics</Option>
              <Option value="Neurology">Neurology</Option>
              <Option value="Orthopedics">Orthopedics</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Doctor" name="doctorId" rules={[{ required: true }]}>
            <Select placeholder="Select Doctor">
              <Option value="d1">Dr. Emeka Adeleke (Cardiology)</Option>
              <Option value="d2">Dr. Ibrahim Musa (General Medicine)</Option>
              <Option value="d4">Dr. Aisha Yusuf (Pediatrics)</Option>
              <Option value="d5">Dr. Chioma Nnamani (Neurology)</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Consultation Type" name="type" rules={[{ required: true }]}>
            <Select placeholder="Select Type">
              <Option value="video">Video Consultation</Option>
              <Option value="audio">Audio Consultation</Option>
              <Option value="chat">Chat</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} disabledDate={(current) => current && current < dayjs().startOf('day')} />
          </Form.Item>

          <Form.Item label="Time Slot" name="timeSlot" rules={[{ required: true }]}>
            <Select placeholder="Select Available Slot">
              <Option value="09:00">09:00 AM</Option>
              <Option value="10:00">10:00 AM</Option>
              <Option value="11:00">11:00 AM</Option>
              <Option value="14:00">02:00 PM</Option>
              <Option value="15:00">03:00 PM</Option>
              <Option value="16:00">04:00 PM</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Chief Complaint" name="complaint" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Describe your symptoms or reason for consultation..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
