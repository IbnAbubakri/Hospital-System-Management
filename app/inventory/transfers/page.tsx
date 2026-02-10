'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Modal, Form, Input, Select, DatePicker, App } from 'antd';
import { SwapOutlined, ExportOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function InventoryTransfersPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const transfers = [
    { id: 'TRF-2024-001', item: 'Paracetamol 500mg', from: 'Main Store', to: 'Pharmacy', quantity: 500, status: 'Completed', date: '2024-02-01', requestedBy: 'Chinedu Okafor' },
    { id: 'TRF-2024-002', item: 'Surgical Gloves', from: 'Main Store', to: 'OT', quantity: 1000, status: 'In Transit', date: '2024-02-02', requestedBy: 'Ngozi Adeleke' },
    { id: 'TRF-2024-003', item: 'Insulin Pens', from: 'Pharmacy', to: 'Ward 3', quantity: 50, status: 'Pending', date: '2024-02-03', requestedBy: 'Dr. Okonkwo' },
    { id: 'TRF-2024-004', item: 'IV Cannulas', from: 'Main Store', to: 'Emergency', quantity: 200, status: 'Completed', date: '2024-02-01', requestedBy: 'Nurse Chioma' },
    { id: 'TRF-2024-005', item: 'Oxygen Masks', from: 'Main Store', to: 'ICU', quantity: 30, status: 'In Transit', date: '2024-02-04', requestedBy: 'Dr. Emeka' },
  ];

  const columns = [
    { title: 'Transfer ID', dataIndex: 'id', key: 'id' },
    { title: 'Item', dataIndex: 'item', key: 'item' },
    { title: 'From Location', dataIndex: 'from', key: 'from', render: (loc: string) => <Tag color="blue">{loc}</Tag> },
    { title: 'To Location', dataIndex: 'to', key: 'to', render: (loc: string) => <Tag color="green">{loc}</Tag> },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Requested By', dataIndex: 'requestedBy', key: 'requestedBy' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Completed' ? 'success' : status === 'In Transit' ? 'processing' : 'warning';
        return <Tag color={color}>{status}</Tag>;
      }},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: any) => (
        <Space>
          <Button type="link" size="small">View</Button>
          {record.status === 'Pending' && <Button type="link" size="small">Approve</Button>}
        </Space>
      )},
  ];

  const handleCreate = () => {
    form.validateFields().then((values) => {
      message.success('Transfer request created successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Title level={3}>Inventory Transfers</Title>
        <Button type="primary" icon={<SwapOutlined />} onClick={() => setIsModalVisible(true)} className="w-full sm:w-auto">
          New Transfer
        </Button>
      </div>

      <Card title="Transfer History" className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <Table
            dataSource={transfers}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Card>

      <Modal
        title="Create Transfer Request"
        open={isModalVisible}
        onOk={handleCreate}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="item" label="Item" rules={[{ required: true }]}>
            <Select placeholder="Select item" showSearch>
              <Select.Option value="paracetamol">Paracetamol 500mg</Select.Option>
              <Select.Option value="gloves">Surgical Gloves</Select.Option>
              <Select.Option value="insulin">Insulin Pens</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="from" label="From Location" rules={[{ required: true }]}>
            <Select placeholder="Select source">
              <Select.Option value="main">Main Store</Select.Option>
              <Select.Option value="pharmacy">Pharmacy</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="to" label="To Location" rules={[{ required: true }]}>
            <Select placeholder="Select destination">
              <Select.Option value="pharmacy">Pharmacy</Select.Option>
              <Select.Option value="ot">OT</Select.Option>
              <Select.Option value="ward">Ward 3</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <Input type="number" placeholder="Enter quantity" />
          </Form.Item>
          <Form.Item name="reason" label="Reason">
            <Input.TextArea rows={3} placeholder="Enter reason for transfer" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
