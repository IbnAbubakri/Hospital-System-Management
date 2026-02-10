'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Input, Modal, Form, Select, InputNumber, App } from 'antd';
import { PlusOutlined, EditOutlined, DollarOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function AdminFeesPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [searchText, setSearchText] = React.useState('');

  const fees = [
    { id: 1, name: 'Consultation - General', category: 'Outpatient', amount: 5000, currency: 'NGN', status: 'Active' },
    { id: 2, name: 'Consultation - Specialist', category: 'Outpatient', amount: 10000, currency: 'NGN', status: 'Active' },
    { id: 3, name: 'Emergency Room Fee', category: 'Emergency', amount: 15000, currency: 'NGN', status: 'Active' },
    { id: 4, name: 'Admission Fee', category: 'Inpatient', amount: 25000, currency: 'NGN', status: 'Active' },
    { id: 5, name: 'Bed Per Day - General Ward', category: 'Inpatient', amount: 8000, currency: 'NGN', status: 'Active' },
    { id: 6, name: 'Bed Per Day - Private Room', category: 'Inpatient', amount: 25000, currency: 'NGN', status: 'Active' },
    { id: 7, name: 'Bed Per Day - ICU', category: 'Inpatient', amount: 75000, currency: 'NGN', status: 'Active' },
    { id: 8, name: 'Laboratory - CBC', category: 'Laboratory', amount: 3500, currency: 'NGN', status: 'Active' },
    { id: 9, name: 'X-Ray - Chest', category: 'Radiology', amount: 8000, currency: 'NGN', status: 'Active' },
    { id: 10, name: 'CT Scan', category: 'Radiology', amount: 45000, currency: 'NGN', status: 'Active' },
    { id: 11, name: 'Physiotherapy Session', category: 'Therapy', amount: 7000, currency: 'NGN', status: 'Active' },
    { id: 12, name: 'Vaccination - Routine', category: 'Outpatient', amount: 2500, currency: 'NGN', status: 'Active' },
  ];

  const categories = ['Outpatient', 'Inpatient', 'Emergency', 'Laboratory', 'Radiology', 'Therapy', 'Surgery'];

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Fee Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat: string) => <Tag color="blue">{cat}</Tag> },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span className="font-semibold">₦{amount.toLocaleString()}</span>
      )},
    { title: 'Currency', dataIndex: 'currency', key: 'currency' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Active' ? 'success' : 'default'}>{status}</Tag>},
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>Edit</Button>
        </Space>
      )},
  ];

  const handleCreate = () => {
    form.validateFields().then((values) => {
      message.success('Fee added successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const filteredFees = fees.filter(fee =>
    fee.name.toLowerCase().includes(searchText.toLowerCase()) ||
    fee.category.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <Title level={3}>Fee Schedule</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} className="w-full sm:w-auto">
          Add Fee
        </Button>
      </div>

      <Card className="overflow-x-auto">
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <Input.Search
            placeholder="Search fees..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full sm:w-auto"
          />
        </div>
        <div className="overflow-x-auto">
        <Table
          dataSource={filteredFees}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        </div>
      </Card>

      <Modal
        title="Add New Fee"
        open={isModalVisible}
        onOk={handleCreate}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Fee Name" rules={[{ required: true }]}>
            <Input placeholder="Enter fee name" />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select category">
              {categories.map(cat => <Select.Option key={cat} value={cat}>{cat}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="Amount (₦)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} placeholder="Enter amount" min={0} />
          </Form.Item>
          <Form.Item name="currency" label="Currency" initialValue="NGN">
            <Select>
              <Select.Option value="NGN">NGN</Select.Option>
              <Select.Option value="USD">USD</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="Active">
            <Select>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
