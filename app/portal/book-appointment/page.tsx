'use client';

import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Select, App, Card, Steps, Progress } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { UserOutlined, CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

export default function BookAppointmentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const steps = [
    { title: 'Select Service', icon: <UserOutlined /> },
    { title: 'Choose Date & Time', icon: <CalendarOutlined /> },
    { title: 'Confirm Details', icon: <ClockCircleOutlined /> },
    { title: 'Booking Confirmed', icon: <CheckCircleOutlined /> },
  ];

  const [formData, setFormData] = useState<{
    department: string;
    doctor: string;
    appointmentType: string;
    date: Dayjs | null;
    time: string;
    reason: string;
  }>({
    department: '',
    doctor: '',
    appointmentType: '',
    date: null,
    time: '',
    reason: ''});

  const departments = [
    'Cardiology',
    'General Medicine',
    'Orthopedics',
    'Pediatrics',
    'Neurology',
  ];

  const doctors = {
    'Cardiology': ['Dr. Ngozi Adeleke'],
    'General Medicine': ['Dr. Emeka Okoro'],
    'Orthopedics': ['Dr. Tunde Bakare'],
    'Pediatrics': ['Dr. Aisha Yusuf'],
    'Neurology': ['Dr. Chinedu Nwosu']};

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  ];

  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.department || !formData.doctor || !formData.appointmentType) {
        message.error('Please fill all required fields');
        return;
      }
    }
    if (currentStep === 1) {
      if (!formData.date || !formData.time) {
        message.error('Please select date and time');
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.reason) {
        message.error('Please provide reason for visit');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBook = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(3);
      message.success('Appointment booked successfully!');
    }, 2000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="  sm: sm: lg: lg:" >
            <Form layout="vertical">
              <Form.Item label="Department" required>
                <Select
                  placeholder="Select Department"
                  size="large"
                  value={formData.department}
                  onChange={(v) => setFormData({ ...formData, department: v, doctor: '' })}
                >
                  {departments.map((dept) => (
                    <Option key={dept} value={dept}>{dept}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Doctor" required>
                <Select
                  placeholder="Select Doctor"
                  size="large"
                  value={formData.doctor}
                  onChange={(v) => setFormData({ ...formData, doctor: v })}
                  disabled={!formData.department}
                >
                  {formData.department &&
                    doctors[formData.department as keyof typeof doctors]?.map((doc) => (
                      <Option key={doc} value={doc}>{doc}</Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item label="Appointment Type" required>
                <Select
                  placeholder="Select Type"
                  size="large"
                  value={formData.appointmentType}
                  onChange={(v) => setFormData({ ...formData, appointmentType: v })}
                >
                  <Option value="consultation">New Consultation</Option>
                  <Option value="followup">Follow-up</Option>
                  <Option value="procedure">Procedure</Option>
                  <Option value="telemedicine">Telemedicine</Option>
                </Select>
              </Form.Item>
            </Form>
          </div>
        );

      case 1:
        return (
          <div className="  sm: sm: lg: lg:" >
            <Form layout="vertical">
              <Form.Item label="Select Date" required>
                <DatePicker
                  style={{ width: '100%' }}
                  size="large"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  onChange={(v) => setFormData({ ...formData, date: v as Dayjs | null })}
                />
              </Form.Item>
              <Form.Item label="Select Time Slot" required>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 ">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      size="large"
                      type={formData.time === time ? 'primary' : 'default'}
                      onClick={() => setFormData({ ...formData, time })}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </Form.Item>
            </Form>
          </div>
        );

      case 2:
        return (
          <div className="  sm: sm: lg: lg:" >
            <Form layout="vertical">
              <Form.Item label="Reason for Visit" required>
                <TextArea
                  rows={4}
                  placeholder="Describe your symptoms or reason for appointment..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </Form.Item>
              <div className=" bg-gray-50 -lg">
                <div className="  ">Booking Summary</div>
                <div><strong>Department:</strong> {formData.department}</div>
                <div><strong>Doctor:</strong> {formData.doctor}</div>
                <div><strong>Type:</strong> {formData.appointmentType}</div>
                <div><strong>Date:</strong> {formData.date?.format('YYYY-MM-DD')}</div>
                <div><strong>Time:</strong> {formData.time}</div>
              </div>
            </Form>
          </div>
        );

      case 3:
        return (
          <div className=" text-center">
            <CheckCircleOutlined className="text-6xl color: '#10B981' " />
            <h2 className="text-2xl font-semibold  ">Booking Confirmed!</h2>
            <p className=" ">Your appointment has been successfully booked.</p>
            <p className="">You will receive a confirmation email shortly.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 ">
      <div className="max-w-[800px] mx-auto">
        <Card className="-xl">
          <Steps current={currentStep} items={steps} className="" />

          <div className="min-h-[400px]">
            {renderStep()}
          </div>

          <div className="  ">
            <Button
              disabled={currentStep === 0 || currentStep === 3}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </Button>
            {currentStep < 3 && (
              <Button type="primary" onClick={currentStep === 2 ? handleBook : handleNext} loading={loading}>
                {currentStep === 2 ? 'Confirm Booking' : 'Next'}
              </Button>
            )}
          </div>

          {currentStep === 3 && (
            <div className="text-center ">
              <Button type="primary" size="large">
                Book Another Appointment
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
