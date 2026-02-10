'use client';

import React, { useEffect } from 'react';
import { Modal, Form, App, Select, DatePicker, Input, Button } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined} from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { mockPatients, mockDoctors } from '@/lib/mockData';

const { TextArea } = Input;
const { Option } = Select;

interface NewAppointmentModalProps {
  open: boolean;
  onCancel: () => void;
  defaultDate?: Dayjs;
}

export function NewAppointmentModal({
  open,
  onCancel,
  defaultDate}: NewAppointmentModalProps) {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (open && defaultDate) {
      form.setFieldsValue({
        date: defaultDate});
    }
  }, [open, defaultDate, form]);

  const handleSubmit = async (values: { [key: string]: string | number }) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success('Appointment booked successfully!');
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={580}
      styles={{ body: { padding: 0 } }}
      centered
      closeIcon={
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#F3F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'}}
        >
          ×
        </div>
      }
    >
      <div style={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
        padding: '24px 24px 20px',
        borderBottom: '1px solid #E2E8F0'}}>
        <div className="flex items-center gap-3 mb-2">
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'}}>
            <CalendarOutlined style={{ fontSize: '24px', color: 'white' }} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 m-0">
              Book New Appointment
            </h2>
            <p className="text-sm text-gray-500 m-0">
              Schedule an appointment for a patient
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          {/* Patient Selection */}
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            border: '1px solid #BFDBFE',
            borderRadius: '12px',
            marginBottom: '20px'}}>
            <div className="flex items-center gap-2 mb-3">
              <UserOutlined style={{ color: '#3B82F6' }} />
              <span className="text-sm font-semibold" style={{ color: '#1D4ED8' }}>
                Patient Information
              </span>
            </div>
            <Form.Item
              name="patientId"
              rules={[{ required: true, message: 'Please select a patient' }]}
              style={{ marginBottom: 0 }}
            >
              <Select
                placeholder="Select patient"
                size="large"
                showSearch
                optionFilterProp="children"
                style={{ width: '100%' }}
              >
                {mockPatients.map((patient) => (
                  <Option key={patient.id} value={patient.id}>
                    <div>
                      <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                      <div className="text-xs text-gray-500">MRN: {patient.mrn}</div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Doctor & Department */}
          <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '16px' }}>
            <div>
              <Form.Item
                label={<span className="text-sm font-medium text-gray-700">Doctor</span>}
                name="doctorId"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Select
                  placeholder="Select doctor"
                  size="large"
                >
                  {mockDoctors.map((doctor) => (
                    <Option key={doctor.id} value={doctor.id}>
                      {doctor.firstName} {doctor.lastName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label={<span className="text-sm font-medium text-gray-700">Type</span>}
                name="type"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Select
                  placeholder="Select type"
                  size="large"
                >
                  <Option value="new">New Consultation</Option>
                  <Option value="followup">Follow-up</Option>
                  <Option value="emergency">Emergency</Option>
                  <Option value="consultation">Consultation</Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          {/* Date & Time */}
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            border: '1px solid #FCD34D',
            borderRadius: '12px',
            marginBottom: '20px'}}>
            <div className="flex items-center gap-2 mb-3">
              <ClockCircleOutlined style={{ color: '#D97706' }} />
              <span className="text-sm font-semibold" style={{ color: '#92400E' }}>
                Date & Time
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="date"
                rules={[{ required: true, message: 'Required' }]}
                style={{ marginBottom: 0 }}
              >
                <DatePicker
                  placeholder="Select date"
                  size="large"
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
              <Form.Item
                name="time"
                rules={[{ required: true, message: 'Required' }]}
                style={{ marginBottom: 0 }}
              >
                <Select
                  placeholder="Select time"
                  size="large"
                >
                  <Option value="09:00">09:00 AM</Option>
                  <Option value="09:30">09:30 AM</Option>
                  <Option value="10:00">10:00 AM</Option>
                  <Option value="10:30">10:30 AM</Option>
                  <Option value="11:00">11:00 AM</Option>
                  <Option value="11:30">11:30 AM</Option>
                  <Option value="14:00">02:00 PM</Option>
                  <Option value="14:30">02:30 PM</Option>
                  <Option value="15:00">03:00 PM</Option>
                  <Option value="15:30">03:30 PM</Option>
                  <Option value="16:00">04:00 PM</Option>
                  <Option value="16:30">04:30 PM</Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          {/* Reason for Visit */}
          <div style={{ marginBottom: '20px' }}>
            <Form.Item
              label={
                <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileTextOutlined />
                  Reason for Visit
                </span>
              }
              name="reason"
              rules={[{ required: true, message: 'Please enter reason' }]}
            >
              <TextArea
                rows={3}
                placeholder="Describe the reason for this appointment..."
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          </div>

          {/* Additional Notes */}
          <div style={{ marginBottom: '24px' }}>
            <Form.Item
              label={<span className="text-sm font-medium text-gray-700">Additional Notes</span>}
              name="notes"
            >
              <TextArea
                rows={2}
                placeholder="Any additional notes (optional)"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                flex: 1,
                height: '44px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '15px'}}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
            <Button
              onClick={handleCancel}
              style={{
                flex: 1,
                height: '44px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '15px',
                border: '1px solid #D1D5DB'}}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
