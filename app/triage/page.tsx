'use client';

import React, { useState, useMemo } from 'react';
import { App, Card, Form, Input, Select, Button, DatePicker, Row, Col, Typography, Alert, Tag, Divider, List, Avatar} from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  WarningOutlined} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { mockPatients, doctorAvailability, getDepartmentByComplaint, getAvailableDoctorsForDay } from '@/lib/mockData';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

export default function TriagePage() {
  const { message } = App.useApp();
  const router = useRouter();
  const { user, getUserFullName } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [availableDoctors, setAvailableDoctors] = useState<any[]>([]);

  // Get day of week from selected date
  const dayOfWeek = selectedDate ? selectedDate.format('dddd') : '';

  // Update available doctors when department or date changes
  React.useEffect(() => {
    if (selectedDepartment && dayOfWeek) {
      const doctors = getAvailableDoctorsForDay(selectedDepartment, dayOfWeek);
      setAvailableDoctors(doctors);
    } else {
      setAvailableDoctors([]);
    }
  }, [selectedDepartment, dayOfWeek]);

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
    form.setFieldValue('doctorId', undefined);
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setSelectedDate(date);
    form.setFieldValue('doctorId', undefined);
  };

  const handleSubmitTriage = async (values: { [key: string]: string | number }) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get doctor name
      const selectedDoctor = availableDoctors.find((d) => d.doctorId === values.doctorId);
      const doctorName = selectedDoctor?.doctorName || 'Unknown';

      message.success(
        <>
          <div>
            <strong>Appointment Scheduled Successfully!</strong>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            Patient assigned to <strong>{doctorName}</strong> on {values.date?.format('MMMM D, YYYY')} at {values.time}
          </div>
        </>
      );

      form.resetFields();
      setSelectedDepartment(null);
      setAvailableDoctors([]);
    } catch (error) {
      message.error('Failed to create appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' };
      case 'urgent':
        return { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' };
      case 'routine':
        return { bg: '#DBEAFE', color: '#1D4ED8', border: '#BFDBFE' };
      default:
        return { bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' };
    }
  };

  const severityOptions = [
    { value: 'routine', label: 'Routine', description: 'Non-urgent, can wait for routine appointment' },
    { value: 'urgent', label: 'Urgent', description: 'Requires attention within 24 hours' },
    { value: 'critical', label: 'Critical/Emergency', description: 'Requires immediate attention' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)' }}>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .page-content {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>

      {/* Header Section */}
      <div
        style={{
          padding: '32px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          borderBottom: '1px solid #E2E8F0',
          position: 'relative',
          overflow: 'hidden'}}
      >
        <div className="page-content">
          <div className="flex items-center gap-3 mb-2">
            <div
              style={{
                width: '4px',
                height: '28px',
                background: 'linear-gradient(180deg, #EC4899 0%, #DB2777 100%)',
                borderRadius: '2px'}}
            />
            <h1 className="text-2xl font-semibold text-gray-900">
              Nurse Triage Center
            </h1>
          </div>
          <p className="text-gray-500 text-sm" style={{ marginLeft: '7px' }}>
            Receive patient complaints, assess severity, and assign to appropriate doctors based on availability
          </p>
          <Alert
            title={`Logged in as ${getUserFullName()} (${user?.role})`}
            description="You can triage patients and schedule appointments with appropriate doctors."
            type="info"
            showIcon
            icon={<TeamOutlined />}
            style={{ marginTop: '16px', maxWidth: '600px' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8 page-content" style={{ animationDelay: '0.1s' }}>
        <Row gutter={[24, 24]}>
          {/* Left Column - Triage Form */}
          <Col xs={24} lg={16}>
            <Card
              title={
                <div className="flex items-center gap-2">
                  <MedicineBoxOutlined style={{ color: '#EC4899' }} />
                  <span>Patient Triage Form</span>
                </div>
              }
              className="p-4 sm:p-6"
              style={{ borderRadius: '12px', border: '1px solid #E2E8F0' }}
            >
              <Form form={form} layout="vertical" onFinish={handleSubmitTriage}>
                {/* Patient Selection */}
                <Form.Item
                  label="Patient"
                  name="patientId"
                  rules={[{ required: true, message: 'Please select a patient' }]}
                >
                  <Select
                    placeholder="Select or search patient"
                    size="large"
                    showSearch
                    optionFilterProp="children"
                  >
                    {mockPatients.map((patient) => (
                      <Option key={patient.id} value={patient.id}>
                        <div>
                          <div className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            MRN: {patient.mrn} • {calculateAge(patient.dateOfBirth)}y • {patient.gender}
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Chief Complaint */}
                <Form.Item
                  label="Chief Complaint / Symptoms"
                  name="complaint"
                  rules={[{ required: true, message: 'Please enter the chief complaint' }]}
                  tooltip="Describe the patient's main complaint or symptoms"
                >
                  <TextArea
                    rows={3}
                    placeholder="e.g., Patient complains of severe chest pain, shortness of breath, and palpitations..."
                    showCount
                    maxLength={500}
                  />
                </Form.Item>

                {/* Severity Assessment */}
                <Form.Item
                  label="Severity Assessment"
                  name="severity"
                  rules={[{ required: true, message: 'Please assess severity' }]}
                  tooltip="How urgent is this case?"
                >
                  <Select placeholder="Select severity level" size="large">
                    {severityOptions.map((option) => (
                      <Option key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Auto-detected Department */}
                <Form.Item label="Assigned Department">
                  <Input
                    value={
                      form.getFieldValue('complaint')
                        ? getDepartmentByComplaint(form.getFieldValue('complaint')) || 'General Medicine'
                        : 'Enter complaint to auto-detect'
                    }
                    disabled
                    placeholder="Auto-detected based on complaint"
                    style={{
                      background: getDepartmentByComplaint(form.getFieldValue('complaint'))
                        ? '#F0FDF4'
                        : '#F3F4F6'}}
                  />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Department is automatically detected based on complaint. You can manually override below.
                  </Text>
                </Form.Item>

                {/* Manual Department Selection */}
                <Form.Item
                  label="Department (Manual Override)"
                  name="department"
                  rules={[{ required: true, message: 'Please select a department' }]}
                >
                  <Select
                    placeholder="Select department"
                    size="large"
                    onChange={handleDepartmentChange}
                  >
                    <Option value="Cardiology">
                      <Tag color="red">Cardiology</Tag>
                    </Option>
                    <Option value="General Medicine">
                      <Tag color="blue">General Medicine</Tag>
                    </Option>
                    <Option value="Orthopedics">
                      <Tag color="orange">Orthopedics</Tag>
                    </Option>
                    <Option value="Pediatrics">
                      <Tag color="purple">Pediatrics</Tag>
                    </Option>
                    <Option value="Neurology">
                      <Tag color="green">Neurology</Tag>
                    </Option>
                  </Select>
                </Form.Item>

                {/* Appointment Date */}
                <Form.Item
                  label="Appointment Date"
                  name="date"
                  initialValue={dayjs()}
                  rules={[{ required: true, message: 'Please select appointment date' }]}
                >
                  <DatePicker
                    size="large"
                    style={{ width: '100%' }}
                    onChange={handleDateChange}
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                  />
                </Form.Item>

                {/* Available Time Slots */}
                {selectedDate && selectedDepartment && (
                  <>
                    <Alert
                      title={`Available doctors for ${selectedDepartment} on ${dayOfWeek}, ${selectedDate.format('MMM D')}`}
                      description={
                        availableDoctors.length > 0
                          ? `${availableDoctors.length} doctor(s) available`
                          : 'No doctors available on this day. Please choose a different date.'
                      }
                      type={availableDoctors.length > 0 ? 'success' : 'warning'}
                      showIcon
                      style={{ marginBottom: '16px' }}
                    />

                    {/* Show Available Time Slots for Each Doctor */}
                    {availableDoctors.map((doctor) => (
                      <Card
                        key={doctor.doctorId}
                        size="small"
                        style={{ marginBottom: '12px', border: '1px solid #E5E7EB' }}
                      >
                        <div style={{ marginBottom: '8px' }}>
                          <Text strong>{doctor.doctorName}</Text>
                          <Tag color="blue" style={{ marginLeft: '8px' }}>
                            {doctor.maxAppointmentsPerDay} slots/day
                          </Tag>
                        </div>
                        <div style={{ marginTop: '8px' }}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Available times:
                          </Text>
                          <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {doctor.timeSlots.map((time: string) => (
                              <Tag
                                key={time}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  form.setFieldValue('doctorId', doctor.doctorId);
                                  form.setFieldValue('time', time);
                                }}
                              >
                                {time}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}

                    <Form.Item
                      label="Select Doctor & Time"
                      name="doctorId"
                      rules={[{ required: true, message: 'Please select a doctor and time' }]}
                    >
                      <Select placeholder="Select doctor" size="large">
                        {availableDoctors.map((doctor) => (
                          <Option key={doctor.doctorId} value={doctor.doctorId}>
                            {doctor.doctorName} ({doctor.department})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Appointment Time"
                      name="time"
                      rules={[{ required: true, message: 'Please select a time' }]}
                    >
                      <Select placeholder="Select time slot" size="large">
                        {availableDoctors.length > 0 &&
                          availableDoctors[0].timeSlots.map((time: string) => (
                            <Option key={time} value={time}>
                              {time}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </>
                )}

                {/* Additional Notes */}
                <Form.Item label="Additional Notes" name="notes">
                  <TextArea rows={2} placeholder="Any additional notes for the doctor..." />
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    block
                    icon={<CheckCircleOutlined />}
                    style={{
                      height: '48px',
                      borderRadius: '10px',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
                      border: 'none'}}
                  >
                    Assign to Doctor & Schedule Appointment
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Right Column - Information */}
          <Col xs={24} lg={8}>
            {/* Doctor Availability Reference */}
            <Card
              title={<span style={{ fontSize: '14px', fontWeight: 600 }}>Doctor Schedule Reference</span>}
              size="small"
              style={{ borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '16px' }}
            >
              <List
                size="small"
                dataSource={doctorAvailability}
                renderItem={(item) => (
                  <List.Item style={{ padding: '8px 0' }}>
                    <div style={{ width: '100%' }}>
                      <div style={{ fontWeight: 500, fontSize: '13px' }}>{item.doctorName}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>
                        <Tag color="blue" style={{ fontSize: '11px', marginTop: '4px' }}>
                          {item.department}
                        </Tag>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                        <ClockCircleOutlined style={{ marginRight: '4px' }} />
                        {item.availableDays.join(', ')}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            {/* Department Guide */}
            <Card
              title={<span style={{ fontSize: '14px', fontWeight: 600 }}>Department Triage Guide</span>}
              size="small"
              style={{ borderRadius: '12px', border: '1px solid #E2E8F0' }}
            >
              <div style={{ fontSize: '12px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <Tag color="red">Cardiology</Tag>
                  <div style={{ marginTop: '4px', color: '#64748B' }}>
                    Chest pain, heart issues, hypertension
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <Tag color="blue">General Medicine</Tag>
                  <div style={{ marginTop: '4px', color: '#64748B' }}>
                    Fever, malaria, flu, general checkup
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <Tag color="orange">Orthopedics</Tag>
                  <div style={{ marginTop: '4px', color: '#64748B' }}>
                    Fractures, bone/joint pain, sports injuries
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <Tag color="purple">Pediatrics</Tag>
                  <div style={{ marginTop: '4px', color: '#64748B' }}>
                    Children, infants, pediatric issues
                  </div>
                </div>
                <div>
                  <Tag color="green">Neurology</Tag>
                  <div style={{ marginTop: '4px', color: '#64748B' }}>
                    Migraine, seizures, neurological issues
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

// Helper function to calculate age
function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
