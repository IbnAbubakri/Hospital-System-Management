'use client';

import React, { useState } from 'react';
import { Card, Typography, Table, Button, Space, Tag, Modal, Form, Input, Select, InputNumber, Alert, QRCode, App } from 'antd';
import { ScanOutlined, PrinterOutlined, DownloadOutlined, BarcodeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface BarcodeLabel {
  id: string;
  sampleId: string;
  patientName: string;
  mrn: string;
  testType: string;
  collectionDate: string;
  printed: boolean;
}

export default function BarcodesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { message } = App.useApp();
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [form] = Form.useForm();

  const [barcodes] = useState<BarcodeLabel[]>([
    {
      id: '1',
      sampleId: 'SMP-2024-001',
      patientName: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-2024-0001',
      testType: 'Complete Blood Count',
      collectionDate: '2024-02-02',
      printed: true},
    {
      id: '2',
      sampleId: 'SMP-2024-002',
      patientName: 'Amaka Okafor',
      mrn: 'MRN-2024-0002',
      testType: 'Lipid Profile',
      collectionDate: '2024-02-02',
      printed: true},
    {
      id: '3',
      sampleId: 'SMP-2024-003',
      patientName: 'Tobi Okafor',
      mrn: 'MRN-2024-0007',
      testType: 'Malaria Parasite',
      collectionDate: '2024-02-02',
      printed: false},
  ]);

  const handlePrint = (id: string) => {
    message.success('Barcode label sent to printer');
  };

  const handleBatchPrint = () => {
    message.success(`${selectedLabels.length} barcode labels sent to printer`);
    setSelectedLabels([]);
  };

  const handleGenerate = (values: { [key: string]: string | number }) => {
    const newLabel: BarcodeLabel = {
      id: Date.now().toString(),
      sampleId: `SMP-${new Date().getFullYear()}-${String(barcodes.length + 1).padStart(3, '0')}`,
      ...(values as any),
      printed: false};
    message.success(`Barcode ${newLabel.sampleId} generated`);
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: '',
      key: 'select',
      render: (_: any, record: BarcodeLabel) => (
        <input
          type="checkbox"
          checked={selectedLabels.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedLabels([...selectedLabels, record.id]);
            } else {
              setSelectedLabels(selectedLabels.filter((id) => id !== record.id));
            }
          }}
        />
      )},
    { title: 'Sample ID', dataIndex: 'sampleId', key: 'sampleId' },
    { title: 'Patient Name', dataIndex: 'patientName', key: 'patientName' },
    { title: 'MRN', dataIndex: 'mrn', key: 'mrn' },
    { title: 'Test Type', dataIndex: 'testType', key: 'testType' },
    { title: 'Collection Date', dataIndex: 'collectionDate', key: 'collectionDate' },
    {
      title: 'Status',
      dataIndex: 'printed',
      key: 'printed',
      render: (printed: boolean) => (
        <Tag color={printed ? 'success' : 'default'}>{printed ? 'Printed' : 'Pending'}</Tag>
      )},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: BarcodeLabel) => (
        <Space>
          <Button type="primary" size="small" icon={<PrinterOutlined />} onClick={() => handlePrint(record.id)}>
            Print
          </Button>
          <Button size="small" icon={<ScanOutlined />}>
            Scan
          </Button>
        </Space>
      )},
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={3}>Barcode Label Generation & Printing</Title>

      <Alert
        title="Sample Barcode System"
        description="Generate and print barcode labels for sample identification and tracking. Each sample must have a unique barcode for proper traceability."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Card
        title="Barcode Labels"
        extra={
          <Space wrap>
            <Button icon={<BarcodeOutlined />} type="primary" onClick={() => setIsModalOpen(true)}>
              Generate Barcode
            </Button>
            {selectedLabels.length > 0 && (
              <Button icon={<PrinterOutlined />} onClick={handleBatchPrint}>
                Print Selected ({selectedLabels.length})
              </Button>
            )}
          </Space>
        }
      >
        <div className="overflow-x-auto">
          <Table
            dataSource={barcodes}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 15 }}
            rowSelection={{
              selectedRowKeys: selectedLabels,
              onChange: (keys) => setSelectedLabels(keys as string[])}}
          />
        </div>
      </Card>

      <Modal
        title="Generate New Barcode"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleGenerate}>
          <Form.Item name="patientName" label="Patient Name" rules={[{ required: true }]}>
            <Input placeholder="Enter patient name" />
          </Form.Item>

          <Form.Item name="mrn" label="MRN" rules={[{ required: true }]}>
            <Input placeholder="MRN-XXXX" />
          </Form.Item>

          <Form.Item name="testType" label="Test Type" rules={[{ required: true }]}>
            <Select placeholder="Select test type">
              <Select.Option value="Complete Blood Count">Complete Blood Count</Select.Option>
              <Select.Option value="Lipid Profile">Lipid Profile</Select.Option>
              <Select.Option value="Urine Routine">Urine Routine</Select.Option>
              <Select.Option value="Malaria Parasite">Malaria Parasite</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="collectionDate" label="Collection Date" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>

          <Form.Item name="copies" label="Number of Copies" initialValue={2}>
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
