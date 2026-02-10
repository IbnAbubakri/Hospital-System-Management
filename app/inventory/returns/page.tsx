'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Modal, Form, Input, Select, App } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function InventoryReturnsPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const returns = [
    { id: 'RET-2024-0042', vendor: 'MedSupply Nigeria Ltd', item: 'Paracetamol 500mg', quantity: 100, reason: 'Damaged Packaging', returnDate: '2024-02-05', status: 'Approved', creditNote: 'CN-2024-0038' },
    { id: 'RET-2024-0041', vendor: 'Surgical Equip Co.', item: 'Surgical Masks Size M', quantity: 500, reason: 'Wrong Size', returnDate: '2024-02-04', status: 'Pending', creditNote: '-' },
    { id: 'RET-2024-0040', vendor: 'LabTech Solutions', item: 'Test Tubes', quantity: 200, reason: 'Defective', returnDate: '2024-02-03', status: 'Completed', creditNote: 'CN-2024-0037' },
    { id: 'RET-2024-0039', vendor: 'Pharma Distributors', item: 'Insulin Vials', quantity: 25, reason: 'Expired Stock', returnDate: '2024-02-02', status: 'Rejected', creditNote: '-' },
    { id: 'RET-2024-0038', vendor: 'Medical Supplies Ltd', item: 'Syringes 5ml', quantity: 1000, reason: 'Over Supply', returnDate: '2024-02-01', status: 'Completed', creditNote: 'CN-2024-0036' },
  ];

  const columns = [
    { title: 'Return ID', dataIndex: 'id', key: 'id' },
    { title: 'Vendor', dataIndex: 'vendor', key: 'vendor' },
    { title: 'Item', dataIndex: 'item', key: 'item' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
    { title: 'Return Date', dataIndex: 'returnDate', key: 'returnDate' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Completed' ? 'success' : status === 'Approved' ? 'processing' : status === 'Pending' ? 'warning' : 'error';
        return <Tag color={color}>{status}</Tag>;
      }},
    { title: 'Credit Note', dataIndex: 'creditNote', key: 'creditNote' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">View</Button>
        </Space>
      )},
  ];

  const handleCreate = () => {
    form.validateFields().then((values) => {
      message.success('Return request created successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Title level={3}>Inventory Returns</Title>
        <Button type="primary" icon={<RollbackOutlined />} onClick={() => setIsModalVisible(true)} className="w-full sm:w-auto">
          Initiate Return
        </Button>
      </div>

      <Card title="Return History" className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <Table
            dataSource={returns}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Card>

      <Modal
        title="Initiate Return Request"
        open={isModalVisible}
        onOk={handleCreate}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="vendor" label="Vendor" rules={[{ required: true }]}>
            <Select placeholder="Select vendor">
              <Select.Option value="medsupply">MedSupply Nigeria Ltd</Select.Option>
              <Select.Option value="surgical">Surgical Equip Co.</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="item" label="Item" rules={[{ required: true }]}>
            <Select placeholder="Select item" showSearch>
              <Select.Option value="paracetamol">Paracetamol 500mg</Select.Option>
              <Select.Option value="masks">Surgical Masks</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <Input type="number" placeholder="Enter quantity" />
          </Form.Item>
          <Form.Item name="reason" label="Reason" rules={[{ required: true }]}>
            <Select placeholder="Select reason">
              <Select.Option value="damaged">Damaged Packaging</Select.Option>
              <Select.Option value="wrong">Wrong Item</Select.Option>
              <Select.Option value="defective">Defective</Select.Option>
              <Select.Option value="expired">Expired</Select.Option>
              <Select.Option value="over">Over Supply</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Additional Notes">
            <Input.TextArea rows={3} placeholder="Enter any additional details" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
