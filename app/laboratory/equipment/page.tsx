'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Progress, Form, Input, Select, Modal, App } from 'antd';
import { PlusOutlined, EditOutlined, BuildOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function LaboratoryEquipmentPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const equipment = [
    { id: 'EQ-001', name: 'Auto Hematology Analyzer', model: 'Sysmex XN-1000', serial: 'XN1000-2024-001', location: 'Hematology Lab', status: 'Operational', lastService: '2024-01-20', nextService: '2024-04-20', uptime: 99, technician: 'John Tech' },
    { id: 'EQ-002', name: 'Biochemistry Analyzer', model: 'Cobas c311', serial: 'COB311-2024-002', location: 'Chemistry Lab', status: 'Operational', lastService: '2024-01-25', nextService: '2024-04-25', uptime: 98, technician: 'Jane Tech' },
    { id: 'EQ-003', name: 'Microscope', model: 'Olympus CX23', serial: 'OLY23-2024-003', location: 'Microscopy', status: 'Operational', lastService: '2024-01-15', nextService: '2024-04-15', uptime: 100, technician: 'John Tech' },
    { id: 'EQ-004', name: 'Centrifuge', model: 'Eppendorf 5702', serial: 'EPP5702-2024-004', location: 'Hematology Lab', status: 'Needs Maintenance', lastService: '2023-12-10', nextService: '2024-01-10', uptime: 85, technician: 'Jane Tech' },
    { id: 'EQ-005', name: 'Incubator', model: 'Binder BD53', serial: 'BIN53-2024-005', location: 'Microbiology', status: 'Operational', lastService: '2024-01-18', nextService: '2024-04-18', uptime: 97, technician: 'John Tech' },
    { id: 'EQ-006', name: 'PCR Machine', model: 'Bio-Rad CFX96', serial: 'CFX96-2024-006', location: 'Molecular Lab', status: 'Operational', lastService: '2024-01-22', nextService: '2024-04-22', uptime: 99, technician: 'Jane Tech' },
  ];

  const columns = [
    { title: 'Equipment ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Model', dataIndex: 'model', key: 'model' },
    { title: 'Serial No.', dataIndex: 'serial', key: 'serial' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Operational' ? 'success' : status === 'Needs Maintenance' ? 'warning' : 'error';
        return <Tag color={color}>{status}</Tag>;
      }},
    { title: 'Last Service', dataIndex: 'lastService', key: 'lastService' },
    { title: 'Next Service', dataIndex: 'nextService', key: 'nextService' },
    {
      title: 'Uptime',
      dataIndex: 'uptime',
      key: 'uptime',
      render: (uptime: number) => <Progress percent={uptime} size="small" />},
    { title: 'Technician', dataIndex: 'technician', key: 'technician' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>Edit</Button>
          <Button type="link" size="small" icon={<BuildOutlined />}>Schedule Service</Button>
        </Space>
      )},
  ];

  const handleAdd = () => {
    form.validateFields().then((values) => {
      message.success('Equipment added successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const operationalCount = equipment.filter(e => e.status === 'Operational').length;
  const maintenanceCount = equipment.filter(e => e.status === 'Needs Maintenance').length;
  const avgUptime = Math.round(equipment.reduce((sum, e) => sum + e.uptime, 0) / equipment.length);

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1600px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <Title level={3}>Laboratory Equipment Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} className="w-full sm:w-auto">
          Add Equipment
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{equipment.length}</div>
            <div className="text-gray-500">Total Equipment</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{operationalCount}</div>
            <div className="text-gray-500">Operational</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{maintenanceCount}</div>
            <div className="text-gray-500">Needs Maintenance</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{avgUptime}%</div>
            <div className="text-gray-500">Avg Uptime</div>
          </div>
        </Card>
      </div>

      <Card title="Equipment Inventory" className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <Table
            dataSource={equipment}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Card>

      <Modal
        title="Add Equipment"
        open={isModalVisible}
        onOk={handleAdd}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Equipment Name" rules={[{ required: true }]}>
            <Input placeholder="Enter equipment name" />
          </Form.Item>
          <Form.Item name="model" label="Model" rules={[{ required: true }]}>
            <Input placeholder="Enter model number" />
          </Form.Item>
          <Form.Item name="serial" label="Serial Number" rules={[{ required: true }]}>
            <Input placeholder="Enter serial number" />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Select placeholder="Select location">
              <Select.Option value="hematology">Hematology Lab</Select.Option>
              <Select.Option value="chemistry">Chemistry Lab</Select.Option>
              <Select.Option value="microscopy">Microscopy</Select.Option>
              <Select.Option value="microbiology">Microbiology</Select.Option>
              <Select.Option value="molecular">Molecular Lab</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="technician" label="Assigned Technician" rules={[{ required: true }]}>
            <Select placeholder="Select technician">
              <Select.Option value="john">John Tech</Select.Option>
              <Select.Option value="jane">Jane Tech</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="nextService" label="Next Service Date">
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
