'use client';

import React from 'react';
import { Card, Row, Col, Typography, Button, Timeline, Table, Avatar, Divider } from 'antd';
import { UserOutlined, CalendarOutlined, FileTextOutlined, DollarOutlined, SettingOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, StatusTag, GradientButton, InfoCard } from '@/components/design-system';
import { formatDate } from '@/lib/utils';

const { Title, Text } = Typography;

export default function PatientPortalPage() {
  const patientInfo = {
    name: 'John Doe',
    id: 'MRN-2024-0001',
    age: 45,
    bloodType: 'O+',
    email: 'john.doe@email.com',
    phone: '+234 801 234 5678',
    address: '123 Lagos Street, Nigeria',
  };

  const upcomingAppointments = [
    { id: '1', doctor: 'Dr. Emily Brown', date: '2024-02-05', time: '09:00 AM', department: 'Cardiology', status: 'confirmed' },
    { id: '2', doctor: 'Dr. Michael Chen', date: '2024-02-15', time: '10:30 AM', department: 'General Medicine', status: 'scheduled' },
  ];

  const recentLabResults = [
    { key: '1', test: 'Complete Blood Count', date: '2024-01-25', status: 'normal' },
    { key: '2', test: 'Lipid Panel', date: '2024-01-25', status: 'abnormal' },
    { key: '3', test: 'Thyroid Function', date: '2024-01-20', status: 'normal' },
    { key: '4', test: 'Liver Function', date: '2024-01-18', status: 'normal' },
  ];

  const invoices = [
    { key: '1', invoiceNumber: 'INV-2024-0156', date: '2024-01-25', amount: 250000, status: 'paid' },
    { key: '2', invoiceNumber: 'INV-2024-0157', date: '2024-02-01', amount: 850000, status: 'pending' },
    { key: '3', invoiceNumber: 'INV-2024-0158', date: '2024-02-03', amount: 120000, status: 'pending' },
  ];

  const labStatusConfig = {
    'normal': { color: '#10B981', bg: '#D1FAE5', icon: <FileTextOutlined /> },
    'abnormal': { color: '#F59E0B', bg: '#FEF3C7', icon: <FileTextOutlined /> },
    'critical': { color: '#EF4444', bg: '#FEE2E2', icon: <FileTextOutlined /> },
  };

  const invoiceStatusConfig = {
    'paid': { color: '#10B981', bg: '#D1FAE5', icon: <DollarOutlined /> },
    'pending': { color: '#F59E0B', bg: '#FEF3C7', icon: <ClockCircleOutlined /> },
    'overdue': { color: '#EF4444', bg: '#FEE2E2', icon: <DollarOutlined /> },
  };

  const labColumns = [
    { title: 'Test', dataIndex: 'test', key: 'test', render: (test: string) => <span className="font-medium text-gray-900">{test}</span> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <StatusTag status={status} customConfig={labStatusConfig} showIcon />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <GradientButton variant="secondary" size="small">
          View
        </GradientButton>
      ),
    },
  ];

  const invoiceColumns = [
    {
      title: 'Invoice #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (num: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: '#DBEAFE',
            color: '#1E40AF',
          }}
        >
          {num}
        </span>
      ),
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amt: number) => <span className="font-semibold text-gray-900">₦{amt.toLocaleString()}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <StatusTag status={status} customConfig={invoiceStatusConfig} showIcon />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <GradientButton variant="secondary" size="small">
          View/Pay
        </GradientButton>
      ),
    },
  ];

  const stats = {
    medicalRecords: 12,
    upcomingAppointments: upcomingAppointments.length,
    pendingBills: invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0),
    labResults: recentLabResults.length,
  };

  return (
    <PageShell
      title="Welcome, John!"
      subtitle="Patient ID: MRN-2024-0001"
      action={
        <GradientButton variant="secondary" icon={<SettingOutlined />}>
          Settings
        </GradientButton>
      }
    >
      {/* Patient Profile Card */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
        <Row gutter={24} align="middle">
          <Col>
            <Avatar size={80} icon={<UserOutlined />} style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }} />
          </Col>
          <Col flex="1">
            <Title level={3} className="!mb-1 !text-gray-900">{patientInfo.name}</Title>
            <Text type="secondary" className="text-sm">Patient ID: {patientInfo.id} • Age: {patientInfo.age} • Blood Type: {patientInfo.bloodType}</Text>
            <div className="flex gap-4 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MailOutlined style={{ fontSize: '14px' }} />
                {patientInfo.email}
              </div>
              <div className="flex items-center gap-1">
                <PhoneOutlined style={{ fontSize: '14px' }} />
                {patientInfo.phone}
              </div>
              <div className="flex items-center gap-1">
                <EnvironmentOutlined style={{ fontSize: '14px' }} />
                {patientInfo.address}
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Medical Records"
          value={stats.medicalRecords}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Upcoming Appointments"
          value={stats.upcomingAppointments}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="Pending Bills"
          value={Math.round(stats.pendingBills / 1000)}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={2}
          prefix="₦"
          suffix="K"
        />
        <StatCard
          label="Lab Results"
          value={stats.labResults}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#DDD6FE"
          index={3}
        />
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={12}>
          {/* Upcoming Appointments */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
            <Timeline>
              {upcomingAppointments.map((apt) => (
                <Timeline.Item
                  key={apt.id}
                  dot={<CalendarOutlined style={{ fontSize: '16px', color: '#3B82F6' }} />}
                >
                  <div>
                    <div className="font-medium text-gray-900">{apt.doctor}</div>
                    <div className="text-sm text-gray-500">
                      {apt.department} • {formatDate(apt.date)} at {apt.time}
                    </div>
                    <div className="mt-2">
                      <StatusTag
                        status={apt.status}
                        type="appointment"
                        showIcon
                      />
                    </div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
            <GradientButton icon={<CalendarOutlined />} block className="mt-4">
              Book New Appointment
            </GradientButton>
          </div>

          {/* Recent Lab Results */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Lab Results</h3>
            <ModernTable
              dataSource={recentLabResults}
              columns={labColumns}
              pagination={false}
            />
          </div>
        </Col>

        <Col xs={24} lg={12}>
          {/* Billing & Payments */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing & Payments</h3>
            <ModernTable
              dataSource={invoices}
              columns={invoiceColumns}
              pagination={false}
            />
            <GradientButton icon={<DollarOutlined />} block className="mt-4">
              View All Bills
            </GradientButton>
          </div>

          {/* Quick Actions */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <GradientButton variant="secondary" icon={<FileTextOutlined />} block>
                View Records
              </GradientButton>
              <GradientButton variant="secondary" icon={<CalendarOutlined />} block>
                Book Appointment
              </GradientButton>
              <GradientButton variant="secondary" icon={<DollarOutlined />} block>
                Pay Bills
              </GradientButton>
              <GradientButton variant="secondary" icon={<SettingOutlined />} block>
                Update Profile
              </GradientButton>
            </div>

            <Divider />

            {/* Health Summary */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-3">Health Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Blood Pressure</span>
                  <span className="text-sm font-medium text-gray-900">120/80 mmHg</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Heart Rate</span>
                  <span className="text-sm font-medium text-gray-900">72 bpm</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Last Checkup</span>
                  <span className="text-sm font-medium text-gray-900">Jan 25, 2024</span>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </PageShell>
  );
}
