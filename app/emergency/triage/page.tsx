'use client';

import React from 'react';
import { Card, Typography, Form, Input, Select, InputNumber, Button, Table, Tag, Space, App } from 'antd';
import { PlusOutlined, UserAddOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function TriagePage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const patients = [
    { id: 'TRI-001', name: 'Chukwuemeka Okonkwo', age: 45, vitals: 'BP: 150/95, HR: 110', complaints: 'Chest pain', priority: 'High', timeIn: '2024-02-05 14:30', nurse: 'Nurse Chioma' },
    { id: 'TRI-002', name: 'Adanna Okafor', age: 32, vitals: 'BP: 120/80, HR: 88', complaints: 'Severe headache', priority: 'Medium', timeIn: '2024-02-05 14:25', nurse: 'Nurse Amina' },
    { id: 'TRI-003', name: 'Baby Ibrahim', age: 3, vitals: 'BP: 90/60, HR: 140, Temp: 39.5°C', complaints: 'High fever', priority: 'High', timeIn: '2024-02-05 14:20', nurse: 'Nurse Grace' },
    { id: 'TRI-004', name: 'Emeka Okafor', age: 28, vitals: 'BP: 130/85, HR: 92', complaints: 'Minor laceration', priority: 'Low', timeIn: '2024-02-05 14:15', nurse: 'Nurse Chioma' },
    { id: 'TRI-005', name: 'Fatima Ahmed', age: 55, vitals: 'BP: 180/110, HR: 105', complaints: 'Difficulty breathing', priority: 'Critical', timeIn: '2024-02-05 14:10', nurse: 'Nurse Amina' },
  ];

  const columns = [
    { title: 'Triage ID', dataIndex: 'id', key: 'id' },
    { title: 'Patient Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Vitals', dataIndex: 'vitals', key: 'vitals' },
    { title: 'Chief Complaint', dataIndex: 'complaints', key: 'complaints' },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const color = priority === 'Critical' ? 'error' : priority === 'High' ? 'warning' : priority === 'Medium' ? 'processing' : 'default';
        return <Tag color={color}>{priority}</Tag>;
      },
      sorter: (a: any, b: any) => {
        const order: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        return (order[a.priority] ?? 99) - (order[b.priority] ?? 99);
      }},
    { title: 'Time In', dataIndex: 'timeIn', key: 'timeIn' },
    { title: 'Triage Nurse', dataIndex: 'nurse', key: 'nurse' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">View Details</Button>
          <Button type="link" size="small">Assign Doctor</Button>
        </Space>
      )},
  ];

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      message.success('Patient triaged successfully');
      form.resetFields();
    });
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Title level={3}>Emergency Triage</Title>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexDirection: 'row', flexWrap: 'wrap' }}>
        <Card title="New Patient Triage" style={{ flex: 1, minWidth: 350 }}>
          <Form form={form} layout="vertical">
            <Form.Item name="patientName" label="Patient Name" rules={[{ required: true }]}>
              <Input placeholder="Enter patient name" />
            </Form.Item>
            <Form.Item name="age" label="Age" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} placeholder="Enter age" min={0} max={150} />
            </Form.Item>
            <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
              <Select placeholder="Select gender">
                <Select.Option value="male">Male</Select.Option>
                <Select.Option value="female">Female</Select.Option>
              </Select>
            </Form.Item>

            <Card size="small" title="Vital Signs" className="mb-4">
              <Form.Item name="bloodPressure" label="Blood Pressure">
                <Input placeholder="e.g., 120/80" />
              </Form.Item>
              <Form.Item name="heartRate" label="Heart Rate">
                <InputNumber style={{ width: '100%' }} placeholder="bpm" min={0} />
              </Form.Item>
              <Form.Item name="temperature" label="Temperature">
                <InputNumber style={{ width: '100%' }} placeholder="°C" min={30} max={45} />
              </Form.Item>
              <Form.Item name="respiratoryRate" label="Respiratory Rate">
                <InputNumber style={{ width: '100%' }} placeholder="breaths/min" min={0} />
              </Form.Item>
              <Form.Item name="spo2" label="SpO2">
                <InputNumber style={{ width: '100%' }} placeholder="%" min={0} max={100} />
              </Form.Item>
            </Card>

            <Form.Item name="complaints" label="Chief Complaint" rules={[{ required: true }]}>
              <Input.TextArea rows={3} placeholder="Describe the primary complaint" />
            </Form.Item>

            <Form.Item name="priority" label="Triage Priority" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="critical">Critical - Immediate attention</Select.Option>
                <Select.Option value="high">High - Urgent</Select.Option>
                <Select.Option value="medium">Medium - Standard</Select.Option>
                <Select.Option value="low">Low - Non-urgent</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="allergies" label="Known Allergies">
              <Input placeholder="List any known allergies" />
            </Form.Item>

            <Form.Item name="notes" label="Additional Notes">
              <Input.TextArea rows={2} placeholder="Enter any additional observations" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" block icon={<UserAddOutlined />} onClick={handleSubmit}>
                Complete Triage
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="Triage Queue" style={{ flex: 2, minWidth: 500 }}>
          <div className="overflow-x-auto">
        <Table
            dataSource={patients}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
          </div>
        </Card>
      </div>
    </div>
  );
}
