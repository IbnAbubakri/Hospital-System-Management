'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Modal, Form, Input, Select, App, Progress } from 'antd';
import { CarOutlined, PlusOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function AmbulancePage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const ambulances = [
    { id: 'AMB-001', vehicle: 'Toyota Hiace', plate: 'ABC-123-GH', driver: 'Ahmed Ibrahim', phone: '+2348012345678', status: 'Available', location: 'Hospital Base', equipment: 'BLS', lastService: '2024-01-15' },
    { id: 'AMB-002', vehicle: 'Ford Transit', plate: 'DEF-456-IJ', driver: 'Chukwuemeka Okafor', phone: '+2348023456789', status: 'On Call', location: 'En Route - Ikeja', equipment: 'ALS', lastService: '2024-01-20' },
    { id: 'AMB-003', vehicle: 'Mercedes Sprinter', plate: 'GHI-789-KL', driver: 'Emeka Nwosu', phone: '+2348034567890', status: 'Available', location: 'Hospital Base', equipment: 'BLS', lastService: '2024-01-10' },
    { id: 'AMB-004', vehicle: 'Toyota Hiace', plate: 'JKL-012-MN', driver: 'Ibrahim Yusuf', phone: '+2348045678901', status: 'Maintenance', location: 'Workshop', equipment: 'ALS', lastService: '2024-01-25' },
  ];

  const requests = [
    { id: 'REQ-2024-0892', patient: 'Fatima Ahmed', pickup: 'Ikeja City Mall', destination: 'City Hospital', priority: 'Critical', ambulance: 'AMB-002', status: 'En Route', eta: '8 min', requestedAt: '2024-02-05 14:25' },
    { id: 'REQ-2024-0891', patient: 'Chukwuemeka Okonkwo', pickup: 'Lagos Island', destination: 'City Hospital', priority: 'High', ambulance: 'AMB-001', status: 'Completed', eta: '-', requestedAt: '2024-02-05 13:45' },
    { id: 'REQ-2024-0890', patient: 'Adanna Okafor', pickup: 'Victoria Island', destination: 'City Hospital', priority: 'Medium', ambulance: 'AMB-003', status: 'Completed', eta: '-', requestedAt: '2024-02-05 12:30' },
  ];

  const ambulanceColumns = [
    { title: 'Ambulance ID', dataIndex: 'id', key: 'id' },
    { title: 'Vehicle', dataIndex: 'vehicle', key: 'vehicle' },
    { title: 'Plate Number', dataIndex: 'plate', key: 'plate' },
    { title: 'Driver', dataIndex: 'driver', key: 'driver' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', render: (phone: string) => <a href={`tel:${phone}`}><PhoneOutlined /> {phone}</a> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Available' ? 'success' : status === 'On Call' ? 'processing' : 'error';
        return <Tag color={color}>{status}</Tag>;
      }},
    { title: 'Current Location', dataIndex: 'location', key: 'location' },
    { title: 'Equipment', dataIndex: 'equipment', key: 'equipment', render: (eq: string) => <Tag color="blue">{eq}</Tag> },
    { title: 'Last Service', dataIndex: 'lastService', key: 'lastService' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">Track</Button>
          <Button type="link" size="small">Dispatch</Button>
        </Space>
      )},
  ];

  const requestColumns = [
    { title: 'Request ID', dataIndex: 'id', key: 'id' },
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'Pickup Location', dataIndex: 'pickup', key: 'pickup' },
    { title: 'Destination', dataIndex: 'destination', key: 'destination' },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const color = priority === 'Critical' ? 'error' : priority === 'High' ? 'warning' : 'processing';
        return <Tag color={color}>{priority}</Tag>;
      }},
    { title: 'Ambulance', dataIndex: 'ambulance', key: 'ambulance' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'En Route' ? 'processing' : status === 'Completed' ? 'success' : 'default';
        return <Tag color={color}>{status}</Tag>;
      }},
    { title: 'ETA', dataIndex: 'eta', key: 'eta' },
    { title: 'Requested', dataIndex: 'requestedAt', key: 'requestedAt' },
  ];

  const handleDispatch = () => {
    form.validateFields().then((values) => {
      message.success('Ambulance dispatched successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const availableAmbulances = ambulances.filter(a => a.status === 'Available').length;
  const onCallAmbulances = ambulances.filter(a => a.status === 'On Call').length;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Title level={3}>Ambulance Services</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Dispatch Ambulance
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{ambulances.length}</div>
            <div className="text-gray-500">Total Ambulances</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{availableAmbulances}</div>
            <div className="text-gray-500">Available</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{onCallAmbulances}</div>
            <div className="text-gray-500">On Call</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{requests.filter(r => r.status === 'En Route').length}</div>
            <div className="text-gray-500">Active Requests</div>
          </div>
        </Card>
      </div>

      <Card title="Ambulance Fleet" style={{ marginBottom: '24px' }}>
        <div className="overflow-x-auto">
        <Table
          dataSource={ambulances}
          columns={ambulanceColumns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        </div>
      </Card>

      <Card title="Service Requests">
        <div className="overflow-x-auto">
        <Table
          dataSource={requests}
          columns={requestColumns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        </div>
      </Card>

      <Modal
        title="Dispatch Ambulance"
        open={isModalVisible}
        onOk={handleDispatch}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="patient" label="Patient Name" rules={[{ required: true }]}>
            <Input placeholder="Enter patient name" />
          </Form.Item>
          <Form.Item name="pickup" label="Pickup Location" rules={[{ required: true }]}>
            <Input.TextArea rows={2} placeholder="Enter pickup address" />
          </Form.Item>
          <Form.Item name="destination" label="Destination" rules={[{ required: true }]}>
            <Select placeholder="Select destination" defaultValue="City Hospital">
              <Select.Option value="city-hospital">City Hospital</Select.Option>
              <Select.Option value="general-hospital">General Hospital</Select.Option>
              <Select.Option value="medical-center">Medical Center</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="critical">Critical - Life threatening</Select.Option>
              <Select.Option value="high">High - Urgent</Select.Option>
              <Select.Option value="medium">Medium - Non-urgent</Select.Option>
              <Select.Option value="low">Low - Routine</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="ambulance" label="Assign Ambulance" rules={[{ required: true }]}>
            <Select placeholder="Select available ambulance">
              {ambulances.filter(a => a.status === 'Available').map(amb => (
                <Select.Option key={amb.id} value={amb.id}>
                  {amb.id} - {amb.vehicle} ({amb.driver})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Additional Notes">
            <Input.TextArea rows={3} placeholder="Enter any special instructions" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
