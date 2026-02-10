'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Modal, Form, Input, App } from 'antd';
import { MedicineBoxOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function RefillsPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const medications = [
    { id: 1, name: 'Amlodipine 10mg', dosage: '1 tablet daily', prescribedBy: 'Dr. Okonkwo', prescribedDate: '2024-01-28', refillsRemaining: 2, status: 'Active', lastRefill: '2024-01-28' },
    { id: 2, name: 'Metformin 500mg', dosage: '2 tablets daily', prescribedBy: 'Dr. Nnamdi', prescribedDate: '2024-01-25', refillsRemaining: 1, status: 'Active', lastRefill: '2024-01-25' },
    { id: 3, name: 'Lisinopril 20mg', dosage: '1 tablet daily', prescribedBy: 'Dr. Okonkwo', prescribedDate: '2024-01-20', refillsRemaining: 0, status: 'No Refills', lastRefill: '2024-01-20' },
    { id: 4, name: 'Atorvastatin 20mg', dosage: '1 tablet at night', prescribedBy: 'Dr. Eze', prescribedDate: '2024-01-15', refillsRemaining: 3, status: 'Active', lastRefill: '2024-01-15' },
  ];

  const refillHistory = [
    { id: 1, medication: 'Amlodipine 10mg', requestDate: '2024-02-01', status: 'Approved', processedDate: '2024-02-01', pickupBy: 'Patient' },
    { id: 2, medication: 'Metformin 500mg', requestDate: '2024-01-28', status: 'Approved', processedDate: '2024-01-28', pickupBy: 'Patient' },
    { id: 3, medication: 'Lisinopril 20mg', requestDate: '2024-01-20', status: 'Approved', processedDate: '2024-01-20', pickupBy: 'Patient' },
    { id: 4, medication: 'Ibuprofen 400mg', requestDate: '2024-01-10', status: 'Declined', processedDate: '-', pickupBy: '-' },
  ];

  const medicationColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Medication', dataIndex: 'name', key: 'name' },
    { title: 'Dosage', dataIndex: 'dosage', key: 'dosage' },
    { title: 'Prescribed By', dataIndex: 'prescribedBy', key: 'prescribedBy' },
    { title: 'Prescribed Date', dataIndex: 'prescribedDate', key: 'prescribedDate' },
    {
      title: 'Refills Remaining',
      dataIndex: 'refillsRemaining',
      key: 'refillsRemaining',
      render: (count: number) => (
        <Tag color={count > 0 ? 'success' : 'error'}>{count} refills</Tag>
      )},
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color={status === 'Active' ? 'success' : 'default'}>{status}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: any) => (
        <Button
          type="primary"
          size="small"
          disabled={record.refillsRemaining === 0}
          onClick={() => handleRefillRequest(record)}
        >
          Request Refill
        </Button>
      )},
  ];

  const historyColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Medication', dataIndex: 'medication', key: 'medication' },
    { title: 'Request Date', dataIndex: 'requestDate', key: 'requestDate' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color={status === 'Approved' ? 'success' : 'error'}>{status}</Tag> },
    { title: 'Processed Date', dataIndex: 'processedDate', key: 'processedDate' },
    { title: 'Pickup By', dataIndex: 'pickupBy', key: 'pickupBy' },
  ];

  const handleRefillRequest = (medication: any) => {
    Modal.confirm({
      title: 'Request Refill',
      content: `Are you sure you want to request a refill for ${medication.name}? You have ${medication.refillsRemaining} refills remaining.`,
      onOk: () => {
        message.success(`Refill request submitted for ${medication.name}`);
      }});
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={3}>Medication Refills</Title>

      <Card title="Active Medications" style={{ marginBottom: '24px' }}>
        <div className="overflow-x-auto">
        <Table
          dataSource={medications}
          columns={medicationColumns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        </div>
      </Card>

      <Card title="Refill History">
        <div className="overflow-x-auto">
        <Table
          dataSource={refillHistory}
          columns={historyColumns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        </div>
      </Card>
    </div>
  );
}
