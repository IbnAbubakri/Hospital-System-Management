'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Row, Col, Typography, Button, Form, Input, InputNumber, DatePicker, Table, Tag, Space, Alert, Empty, Select, App } from 'antd';
import { PlusOutlined, LineChartOutlined, EyeOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/shared/PageHeader';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser } from '@/lib/dataFilters';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface VitalsRecord {
  id: string;
  date: string;
  time: string;
  temperature: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
  bmi: number;
  recordedBy: string;
}

export default function VitalsPage() {
  const params = useParams();
  const router = useRouter();
  const { message } = App.useApp();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [isAdding, setIsAdding] = useState(false);

  const accessiblePatients = useMemo(() => {
    if (!user) return [];
    return filterPatientsByUser(user);
  }, [user]);

  const patient = accessiblePatients.find((p: any) => p.id === params.id) as any;

  if (!patient) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <Title level={3}>Access Denied</Title>
        <Text>Patient not found or you do not have permission to view this page.</Text>
        <br />
        <Button type="primary" onClick={() => router.back()} style={{ marginTop: '16px' }}>
          Go Back
        </Button>
      </div>
    );
  }

  const [vitals, setVitals] = useState<VitalsRecord[]>([
    {
      id: '1',
      date: '2024-02-01',
      time: '09:30',
      temperature: 37.2,
      bloodPressureSystolic: 130,
      bloodPressureDiastolic: 85,
      heartRate: 78,
      respiratoryRate: 18,
      oxygenSaturation: 98,
      weight: 72.5,
      height: 175,
      bmi: 23.7,
      recordedBy: 'Nurse Amaka Okafor'},
    {
      id: '2',
      date: '2024-01-25',
      time: '14:15',
      temperature: 37.0,
      bloodPressureSystolic: 128,
      bloodPressureDiastolic: 82,
      heartRate: 76,
      respiratoryRate: 16,
      oxygenSaturation: 99,
      weight: 73.0,
      height: 175,
      bmi: 23.9,
      recordedBy: 'Nurse Grace Adebayo'},
    {
      id: '3',
      date: '2024-01-15',
      time: '10:00',
      temperature: 37.1,
      bloodPressureSystolic: 135,
      bloodPressureDiastolic: 88,
      heartRate: 80,
      respiratoryRate: 18,
      oxygenSaturation: 97,
      weight: 72.8,
      height: 175,
      bmi: 23.8,
      recordedBy: 'Nurse Chinedu Eze'},
  ]);

  const handleSubmit = (values: { [key: string]: string | number }) => {
    const weight = Number(values.weight) || 0;
    const height = Number(values.height) || 0;
    const bmi = weight > 0 && height > 0 ? (weight / Math.pow(height / 100, 2)).toFixed(1) : 0;

    const newVital: VitalsRecord = {
      id: Date.now().toString(),
      date: dayjs().format('YYYY-MM-DD'),
      time: dayjs().format('HH:mm'),
      temperature: values.temperature as any,
      bloodPressureSystolic: values.bpSystolic as any,
      bloodPressureDiastolic: values.bpDiastolic as any,
      heartRate: values.heartRate as any,
      respiratoryRate: values.respiratoryRate as any,
      oxygenSaturation: values.oxygenSaturation as any,
      weight,
      height,
      bmi: Number(bmi),
      recordedBy: user ? `${user.firstName} ${user.lastName}` : 'Unknown'};

    setVitals([newVital, ...vitals]);
    setIsAdding(false);
    form.resetFields();
    message.success('Vitals recorded successfully');
  };

  const getBPStatus = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) return { color: 'green', text: 'Normal' };
    if (systolic < 140 && diastolic < 90) return { color: 'orange', text: 'Elevated' };
    return { color: 'red', text: 'High' };
  };

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date', render: (date: string) => <span className="text-sm">{date}</span> },
    { title: 'Time', dataIndex: 'time', key: 'time', render: (time: string) => <span className="text-sm">{time}</span> },
    {
      title: 'Temperature (°C)',
      dataIndex: 'temperature',
      key: 'temperature',
      render: (temp: number) => <span className={temp > 37.5 ? 'text-red-500 font-medium' : ''}>{temp}°C</span>},
    {
      title: 'Blood Pressure',
      key: 'bloodPressure',
      render: (_: any, record: VitalsRecord) => {
        const status = getBPStatus(record.bloodPressureSystolic, record.bloodPressureDiastolic);
        return (
          <Tag color={status.color}>
            {record.bloodPressureSystolic}/{record.bloodPressureDiastolic} mmHg
          </Tag>
        );
      }},
    {
      title: 'Heart Rate',
      dataIndex: 'heartRate',
      key: 'heartRate',
      render: (hr: number) => <span className={hr < 60 || hr > 100 ? 'text-orange-500 font-medium' : ''}>{hr} bpm</span>},
    {
      title: 'SpO2',
      dataIndex: 'oxygenSaturation',
      key: 'oxygenSaturation',
      render: (spo2: number) => <span className={spo2 < 95 ? 'text-red-500 font-medium' : ''}>{spo2}%</span>},
    { title: 'BMI', dataIndex: 'bmi', key: 'bmi', render: (bmi: number) => <span className="text-sm">{bmi}</span> },
    { title: 'Recorded By', dataIndex: 'recordedBy', key: 'recordedBy', render: (name: string) => <span className="text-sm">{name}</span> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: VitalsRecord) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" danger icon={<DeleteOutlined />} size="small" />
        </Space>
      )},
  ];

  const latestVitals = vitals[0];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <PageHeader
        title={`${patient.firstName} ${patient.lastName} - Vital Signs`}
        subtitle={`MRN: ${patient.mrn}`}
        extra={
          <Space>
            <Button icon={<PlusOutlined />} type="primary" onClick={() => setIsAdding(true)}>
              Record Vitals
            </Button>
            <Button icon={<ArrowLeftOutlined />} onClick={() => router.push(`/patients/${patient.id}`)}>
              Back to Patient
            </Button>
          </Space>
        }
      />

      {latestVitals && (
        <Alert
          title={`Latest Vitals from ${latestVitals.date} at ${latestVitals.time}`}
          description={
            <Row gutter={16}>
              <Col>
                <Text>BP: <strong>{latestVitals.bloodPressureSystolic}/{latestVitals.bloodPressureDiastolic}</strong> mmHg</Text>
              </Col>
              <Col>
                <Text>HR: <strong>{latestVitals.heartRate}</strong> bpm</Text>
              </Col>
              <Col>
                <Text>SpO2: <strong>{latestVitals.oxygenSaturation}</strong>%</Text>
              </Col>
              <Col>
                <Text>Temp: <strong>{latestVitals.temperature}</strong>°C</Text>
              </Col>
            </Row>
          }
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      {isAdding && (
        <Card title="Record Vital Signs" style={{ marginBottom: '24px' }}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="temperature" label="Temperature (°C)" rules={[{ required: true }]}>
                  <InputNumber step={0.1} min={35} max={42} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="bpSystolic" label="BP Systolic" rules={[{ required: true }]}>
                  <InputNumber min={70} max={250} style={{ width: '100%' }} placeholder="mmHg" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="bpDiastolic" label="BP Diastolic" rules={[{ required: true }]}>
                  <InputNumber min={40} max={150} style={{ width: '100%' }} placeholder="mmHg" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="heartRate" label="Heart Rate" rules={[{ required: true }]}>
                  <InputNumber min={30} max={200} style={{ width: '100%' }} placeholder="bpm" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="respiratoryRate" label="Respiratory Rate" rules={[{ required: true }]}>
                  <InputNumber min={8} max={40} style={{ width: '100%' }} placeholder="/min" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="oxygenSaturation" label="SpO2" rules={[{ required: true }]}>
                  <InputNumber min={70} max={100} style={{ width: '100%' }} placeholder="%" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="weight" label="Weight (kg)">
                  <InputNumber min={1} max={300} step={0.1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="height" label="Height (cm)">
                  <InputNumber min={50} max={250} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">Save Vitals</Button>
                <Button onClick={() => { setIsAdding(false); form.resetFields(); }}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      <Card
        title={
          <Space>
            <LineChartOutlined style={{ color: '#3B82F6' }} />
            <span>Vital Signs History</span>
            <Tag>{vitals.length} records</Tag>
          </Space>
        }
      >
        {vitals.length > 0 ? (
          <Table
            dataSource={vitals}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
          />
        ) : (
          <Empty description="No vital signs recorded yet" />
        )}
      </Card>
    </div>
  );
}
