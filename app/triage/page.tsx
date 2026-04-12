'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
import { mockPatients, doctorAvailability, getDepartmentByComplaint, getAvailableDoctorsForDay, mockUsers } from '@/lib/mockData';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

export default function TriagePage() {
  const { message } = App.useApp();
  const router = useRouter();
  const { user, getUserFullName, hasPermission, addNotification, getNotifications } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [availableDoctors, setAvailableDoctors] = useState<any[]>([]);

  // Permission check - only nurses and admins can access triage
  if (!hasPermission('triage_patients') && user?.role !== 'Administrator') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50">
        <div className="">
          <Alert
            title="Access Denied"
            description="You don't have permission to access the triage center. This area is restricted to nurses and administrators only."
            type="error"
            showIcon
            className="-xl"
          />
        </div>
      </div>
    );
  }

  // Get day of week from selected date
  const dayOfWeek = selectedDate ? selectedDate.format('dddd') : '';

  // Update available doctors when department or date changes
  useEffect(() => {
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

      // Get doctor and patient information
      const selectedDoctor = availableDoctors.find((d) => d.doctorId === values.doctorId);
      const doctorName = selectedDoctor?.doctorName || 'Unknown';
      const selectedPatient = mockPatients.find((p) => p.id === values.patientId);
      const patientName = selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : 'Unknown Patient';

      // Send notification to the assigned doctor
      const notification = {
        id: `notif-${Date.now()}`,
        type: 'appointment' as const,
        title: 'New Patient Assignment',
        message: `${patientName} has been assigned to you for ${values.date?.format('MMMM D, YYYY')} at ${values.time}`,
        patientName: patientName,
        mrn: selectedPatient?.mrn || '',
        appointmentTime: `${values.date?.format('MMMM D, YYYY')} at ${values.time}`,
        department: selectedDepartment || '',
        severity: values.severity as string,
        read: false,
        createdAt: new Date().toISOString(),
      };

      // Add notification to doctor's notifications
      addNotification(values.doctorId as string, notification);

      message.success(
        <>
          <div>
            <strong>Appointment Scheduled Successfully!</strong>
          </div>
          <div className=" ">
            Patient assigned to <strong>{doctorName}</strong> on {values.date?.format('MMMM D, YYYY')} at {values.time}
          </div>
          <div className="  ">
            Doctor has been notified
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50">
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
        className=" bg-gradient-to-br from-white to-slate-50 border-b border-slate-200 relative overflow-hidden">
        <div className="page-content">
          <div className="   ">
            <div
              className="  -[2px]"
              style={{ background: 'linear-gradient(180deg, #EC4899 0%, #DB2777 100%)' }}
            />
            <h1 className="text-2xl font-semibold ">
              Nurse Triage Center
            </h1>
          </div>
          <p className="color: '#6B7280'  ml-[7px]">
            Receive patient complaints, assess severity, and assign to appropriate doctors based on availability
          </p>
          <Alert
            title={`Logged in as ${getUserFullName()} (${user?.role})`}
            description="You can triage patients and schedule appointments with appropriate doctors."
            type="info"
            showIcon
            icon={<TeamOutlined />}
            className=" max-w-2xl"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="  sm: sm: lg: lg: page-content" style={{ animationDelay: '0.1s' }}>
        <Row gutter={[24, 24]}>
          {/* Left Column - Triage Form */}
          <Col xs={24} lg={16}>
            <Card
              title={
                <div className="  ">
                  <MedicineBoxOutlined className="text-pink-500" />
                  <span>Patient Triage Form</span>
                </div>
              }
              className=" sm: -xl border border-slate-200"
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
                          <div className=" color: '#6B7280'">
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
                          <div className=" color: '#6B7280'">{option.description}</div>
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
                    className={getDepartmentByComplaint(form.getFieldValue('complaint')) ? 'bg-green-50' : 'bg-gray-100'}
                  />
                  <Text type="secondary" className="">
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
                    className="w-full"
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
                    className=""
                  />

                    {/* Show Available Time Slots for Each Doctor */}
                    {availableDoctors.map((doctor) => (
                      <Card
                        key={doctor.doctorId}
                        size="small"
                        className=" border border-gray-200"
                      >
                        <div className="">
                          <Text strong>{doctor.doctorName}</Text>
                          <Tag color="blue" className="">
                            {doctor.maxAppointmentsPerDay} slots/day
                          </Tag>
                        </div>
                        <div className="">
                          <Text type="secondary" className="">
                            Available times:
                          </Text>
                          <div className="  -wrap ">
                            {doctor.timeSlots.map((time: string) => (
                              <Tag
                                key={time}
                                className="cursor-pointer"
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
                    className=" -xl font-semibold bg-gradient-to-r from-pink-500 to-pink-700 border-none"
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
              title={<span className=" font-semibold">Doctor Schedule Reference</span>}
              size="small"
              className="-xl border border-slate-200 "
            >
              <List
                size="small"
                dataSource={doctorAvailability}
                renderItem={(item) => (
                  <List.Item className="">
                    <div className="w-full">
                      <div className="font-medium ">{item.doctorName}</div>
                      <div className=" text-slate-500">
                        <Tag color="blue" className=" ">
                          {item.department}
                        </Tag>
                      </div>
                      <div className=" text-slate-500 ">
                        <ClockCircleOutlined className="" />
                        {item.availableDays.join(', ')}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            {/* Department Guide */}
            <Card
              title={<span className=" font-semibold">Department Triage Guide</span>}
              size="small"
              className="-xl border border-slate-200"
            >
              <div className="">
                <div className="">
                  <Tag color="red">Cardiology</Tag>
                  <div className=" text-slate-500">
                    Chest pain, heart issues, hypertension
                  </div>
                </div>
                <div className="">
                  <Tag color="blue">General Medicine</Tag>
                  <div className=" text-slate-500">
                    Fever, malaria, flu, general checkup
                  </div>
                </div>
                <div className="">
                  <Tag color="orange">Orthopedics</Tag>
                  <div className=" text-slate-500">
                    Fractures, bone/joint pain, sports injuries
                  </div>
                </div>
                <div className="">
                  <Tag color="purple">Pediatrics</Tag>
                  <div className=" text-slate-500">
                    Children, infants, pediatric issues
                  </div>
                </div>
                <div>
                  <Tag color="green">Neurology</Tag>
                  <div className=" text-slate-500">
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
