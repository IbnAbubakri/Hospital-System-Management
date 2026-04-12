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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 ">
      <div className="bg-white -xl  border border-slate-200">
        <div className=" -col sm:-row items-start sm:   ">
          <div>
            <h1 className="text-2xl font-semibold     ">
              <VideoCameraOutlined className="color: '#8B5CF6' text-xl" />
              Book Telemedicine Consultation
            </h1>
            <p className=" ">Schedule online consultation with doctors</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setBookingModalVisible(true)}>
            Book Consultation
          </Button>
        </div>

        <div className="grid grid-cols-2  ">
          <div className=" bg-gradient-to-r from-violet-600 to-violet-700 -xl ">
            <div className="   ">
              <CalendarOutlined className="text-2xl" />
              <span className=" font-semibold">Available Slots Today</span>
            </div>
            <div className="text-3xl font-bold">{mockTelemedicineSlots.filter((s: any) => s.available).length}</div>
          </div>
          <div className=" bg-gradient-to-r from-cyan-600 to-cyan-700 -xl ">
            <div className="   ">
              <VideoCameraOutlined className="text-2xl" />
              <span className=" font-semibold">Upcoming Consultations</span>
            </div>
            <div className="text-3xl font-bold">{mockTelemedicineConsultations.filter((c: any) => c.status === 'scheduled' || c.status === 'confirmed').length}</div>
          </div>
        </div>

        <div className="   ">
          <Input placeholder="Search consultations..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} className="-1 max-w" />
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
              <Option value="d1">Dr. Ngozi Adeleke (Cardiology)</Option>
              <Option value="d2">Dr. Emeka Okoro (General Medicine)</Option>
              <Option value="d4">Dr. Aisha Yusuf (Pediatrics)</Option>
              <Option value="d5">Dr. Chinedu Nwosu (Neurology)</Option>
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
            <DatePicker className="w-full" disabledDate={(current) => current && current < dayjs().startOf('day')} />
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
