'use client';

import React from 'react';
import { Card, Typography, Table, Tag, Tabs, DatePicker, Button } from 'antd';
import { FileTextOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export default function RecordsViewPage() {
  const documents = [
    { id: 'DOC-001', type: 'Discharge Summary', date: '2024-02-01', doctor: 'Dr. Okonkwo', department: 'Cardiology', size: '245 KB' },
    { id: 'DOC-002', type: 'Lab Report', date: '2024-01-28', doctor: 'Dr. Eze', department: 'Laboratory', size: '128 KB' },
    { id: 'DOC-003', type: 'Radiology Report', date: '2024-01-25', doctor: 'Dr. Okafor', department: 'Radiology', size: '2.4 MB' },
    { id: 'DOC-004', type: 'Prescription', date: '2024-01-20', doctor: 'Dr. Nnamdi', department: 'General Medicine', size: '85 KB' },
    { id: 'DOC-005', type: 'Discharge Summary', date: '2024-01-15', doctor: 'Dr. Okonkwo', department: 'Cardiology', size: '312 KB' },
  ];

  const visits = [
    { id: 1, date: '2024-02-01', type: 'Admission', department: 'Cardiology', doctor: 'Dr. Okonkwo', diagnosis: 'Hypertension', status: 'Discharged' },
    { id: 2, date: '2024-01-28', type: 'Outpatient', department: 'Laboratory', doctor: 'Dr. Eze', diagnosis: 'Routine Tests', status: 'Completed' },
    { id: 3, date: '2024-01-25', type: 'Outpatient', department: 'Radiology', doctor: 'Dr. Okafor', diagnosis: 'Chest X-Ray', status: 'Completed' },
    { id: 4, date: '2024-01-20', type: 'Outpatient', department: 'General Medicine', doctor: 'Dr. Nnamdi', diagnosis: 'Malaria', status: 'Completed' },
    { id: 5, date: '2024-01-15', type: 'Admission', department: 'Cardiology', doctor: 'Dr. Okonkwo', diagnosis: 'Hypertension', status: 'Discharged' },
  ];

  const vitals = [
    { id: 1, date: '2024-02-01', bp: '140/90', pulse: 88, temp: 37.2, weight: 75, height: 175, bmi: 24.5, nurse: 'Nurse Chioma' },
    { id: 2, date: '2024-01-28', bp: '135/85', pulse: 82, temp: 36.8, weight: 75, height: 175, bmi: 24.5, nurse: 'Nurse Amina' },
    { id: 3, date: '2024-01-25', bp: '138/88', pulse: 85, temp: 37.0, weight: 74, height: 175, bmi: 24.2, nurse: 'Nurse Grace' },
    { id: 4, date: '2024-01-20', bp: '142/92', pulse: 90, temp: 37.5, weight: 76, height: 175, bmi: 24.8, nurse: 'Nurse Chioma' },
  ];

  const documentColumns = [
    { title: 'Document ID', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Doctor', dataIndex: 'doctor', key: 'doctor' },
    { title: 'Department', dataIndex: 'department', key: 'department', render: (dept: string) => <Tag color="blue">{dept}</Tag> },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button.Group size="small">
          <Button icon={<EyeOutlined />}>View</Button>
          <Button icon={<DownloadOutlined />}>Download</Button>
        </Button.Group>
      ),
    },
  ];

  const visitColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Visit Type', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color={type === 'Admission' ? 'orange' : 'blue'}>{type}</Tag> },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Doctor', dataIndex: 'doctor', key: 'doctor' },
    { title: 'Diagnosis', dataIndex: 'diagnosis', key: 'diagnosis' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color="success">{status}</Tag> },
  ];

  const vitalColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Blood Pressure', dataIndex: 'bp', key: 'bp' },
    { title: 'Pulse', dataIndex: 'pulse', key: 'pulse' },
    { title: 'Temperature (°C)', dataIndex: 'temp', key: 'temp' },
    { title: 'Weight (kg)', dataIndex: 'weight', key: 'weight' },
    { title: 'Height (cm)', dataIndex: 'height', key: 'height' },
    { title: 'BMI', dataIndex: 'bmi', key: 'bmi' },
    { title: 'Recorded By', dataIndex: 'nurse', key: 'nurse' },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={3}>My Medical Records</Title>

      <Card>
        <Tabs defaultActiveKey="documents">
          <TabPane tab="Documents" key="documents">
            <div style={{ marginBottom: '16px' }}>
              <RangePicker style={{ marginRight: '8px' }} />
              <Button type="primary">Filter</Button>
            </div>
            <Table dataSource={documents} columns={documentColumns} rowKey="id" pagination={{ pageSize: 10 }} />
          </TabPane>

          <TabPane tab="Visit History" key="visits">
            <div style={{ marginBottom: '16px' }}>
              <RangePicker style={{ marginRight: '8px' }} />
              <Button type="primary">Filter</Button>
            </div>
            <Table dataSource={visits} columns={visitColumns} rowKey="id" pagination={{ pageSize: 10 }} />
          </TabPane>

          <TabPane tab="Vitals History" key="vitals">
            <div style={{ marginBottom: '16px' }}>
              <RangePicker style={{ marginRight: '8px' }} />
              <Button type="primary">Filter</Button>
            </div>
            <Table dataSource={vitals} columns={vitalColumns} rowKey="id" pagination={{ pageSize: 10 }} />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
