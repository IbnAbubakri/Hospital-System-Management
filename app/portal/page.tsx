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
    { title: 'Test', dataIndex: 'test', key: 'test', render: (test: string) => <span className="font-medium ">{test}</span> },
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
      render: (amt: number) => <span className="font-semibold ">₦{amt.toLocaleString()}</span>,
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
      <div className="bg-white -xl  border border-gray-200 ">
        <Row gutter={24} align="middle">
          <Col>
            <Avatar size={80} icon={<UserOutlined />} className="bg-gradient-to-br from-blue-500 to-blue-700" />
          </Col>
          <Col span={1}>
            <Title level={3} className="! !">{patientInfo.name}</Title>
            <Text type="secondary" className="">Patient ID: {patientInfo.id} • Age: {patientInfo.age} • Blood Type: {patientInfo.bloodType}</Text>
            <div className="    ">
              <div className="  ">
                <MailOutlined className="" />
                {patientInfo.email}
              </div>
              <div className="  ">
                <PhoneOutlined className="" />
                {patientInfo.phone}
              </div>
              <div className="  ">
                <EnvironmentOutlined className="" />
                {patientInfo.address}
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4  sm: ">
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
          <div className="bg-white -xl  border border-gray-200 ">
            <h3 className=" font-semibold  ">Upcoming Appointments</h3>
            <Timeline>
              {upcomingAppointments.map((apt) => (
                <Timeline.Item
                  key={apt.id}
                  dot={<CalendarOutlined className="text-base " />}
                >
                  <div>
                    <div className="font-medium ">{apt.doctor}</div>
                    <div className=" ">
                      {apt.department} • {formatDate(apt.date)} at {apt.time}
                    </div>
                    <div className="">
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
            <GradientButton icon={<CalendarOutlined />} block className="">
              Book New Appointment
            </GradientButton>
          </div>

          {/* Recent Lab Results */}
          <div className="bg-white -xl  border border-gray-200">
            <h3 className=" font-semibold  ">Recent Lab Results</h3>
            <ModernTable
              dataSource={recentLabResults}
              columns={labColumns}
              pagination={false}
            />
          </div>
        </Col>

        <Col xs={24} lg={12}>
          {/* Billing & Payments */}
          <div className="bg-white -xl  border border-gray-200 ">
            <h3 className=" font-semibold  ">Billing & Payments</h3>
            <ModernTable
              dataSource={invoices}
              columns={invoiceColumns}
              pagination={false}
            />
            <GradientButton icon={<DollarOutlined />} block className="">
              View All Bills
            </GradientButton>
          </div>

          {/* Quick Actions */}
          <div className="bg-white -xl  border border-gray-200">
            <h3 className=" font-semibold  ">Quick Actions</h3>
            <div className="grid grid-cols-2 ">
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
              <h4 className="text-base font-semibold  ">Health Summary</h4>
              <div className="space-y-2">
                <div className="    bg-gray-50 ">
                  <span className=" ">Blood Pressure</span>
                  <span className=" font-medium ">120/80 mmHg</span>
                </div>
                <div className="    bg-gray-50 ">
                  <span className=" ">Heart Rate</span>
                  <span className=" font-medium ">72 bpm</span>
                </div>
                <div className="    bg-gray-50 ">
                  <span className=" ">Last Checkup</span>
                  <span className=" font-medium ">Jan 25, 2024</span>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </PageShell>
  );
}
