'use client';

import React, { useState } from 'react';
import { Table, Button, Tag, Badge, Card, Form, Input, Select, DatePicker, Progress, Statistic, Row, Col, App, Modal } from 'antd';
import { ShoppingOutlined, DollarOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { formatDate, formatCurrency } from '@/lib/utils';

const { Option } = Select;

interface Requisition {
  id: string;
  requisitionNumber: string;
  department: string;
  requestedBy: string;
  requestDate: Date;
  requiredDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'ordered' | 'received';
  itemCount: number;
  totalAmount: number;
}

const mockRequisitions: Requisition[] = [
  {
    id: 'req1',
    requisitionNumber: 'PR-2024-001',
    department: 'Pharmacy',
    requestedBy: 'Pharmacy Manager',
    requestDate: new Date('2024-02-01'),
    requiredDate: new Date('2024-02-15'),
    status: 'approved',
    itemCount: 5,
    totalAmount: 500000},
  {
    id: 'req2',
    requisitionNumber: 'PR-2024-002',
    department: 'Laboratory',
    requestedBy: 'Lab Manager',
    requestDate: new Date('2024-02-03'),
    requiredDate: new Date('2024-02-20'),
    status: 'pending',
    itemCount: 3,
    totalAmount: 250000},
  {
    id: 'req3',
    requisitionNumber: 'PR-2024-003',
    department: 'General Ward',
    requestedBy: 'Ward Manager',
    requestDate: new Date('2024-02-04'),
    requiredDate: new Date('2024-02-25'),
    status: 'ordered',
    itemCount: 8,
    totalAmount: 180000},
];

export default function RequisitionsPage() {
  const [searchText, setSearchText] = useState('');
  const { message } = App.useApp();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredRequisitions = mockRequisitions.filter((req) => {
    return (
      req.requisitionNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      req.department.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; text: string }> = {
      pending: { color: '#F59E0B', bg: '#FEF3C7', text: 'Pending' },
      approved: { color: '#10B981', bg: '#D1FAE5', text: 'Approved' },
      rejected: { color: '#EF4444', bg: '#FEE2E2', text: 'Rejected' },
      ordered: { color: '#3B82F6', bg: '#DBEAFE', text: 'Ordered' },
      received: { color: '#059669', bg: '#D1FAE5', text: 'Received' }};
    return configs[status] || configs.pending;
  };

  const columns = [
    { title: 'PR Number', dataIndex: 'requisitionNumber', key: 'number' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Requested By', dataIndex: 'requestedBy', key: 'by' },
    {
      title: 'Request Date',
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (d: Date) => formatDate(d)},
    {
      title: 'Required Date',
      dataIndex: 'requiredDate',
      key: 'requiredDate',
      render: (d: Date) => formatDate(d)},
    { title: 'Items', dataIndex: 'itemCount', key: 'items' },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount)},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getStatusConfig(status);
        return <Tag style={{ backgroundColor: config.bg, color: config.color, border: 'none', fontWeight: 500 }}>{config.text}</Tag>;
      }},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Requisition) => (
        <div className="flex gap-2">
          <Button size="small" disabled={record.status !== 'approved'}>Create PO</Button>
          <Button size="small">View Details</Button>
        </div>
      )},
  ];

  const handleCreateRequisition = () => {
    form.validateFields().then((values) => {
      message.success('Purchase requisition created successfully!');
      setModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)' }}>
      <div className="p-4 sm:p-6" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <ShoppingOutlined style={{ color: '#8B5CF6' }} />
              Purchase Requisitions
            </h1>
            <p className="text-gray-500 text-sm">Manage purchase requests and approvals</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)} className="w-full sm:w-auto">
            New Requisition
          </Button>
        </div>

        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={12} sm={6}>
            <Card className="p-4 sm:p-6">
              <Statistic
                title="Pending"
                value={mockRequisitions.filter((r: any) => r.status === 'pending').length}
                valueStyle={{ color: '#F59E0B' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="p-4 sm:p-6">
              <Statistic
                title="Approved"
                value={mockRequisitions.filter((r: any) => r.status === 'approved').length}
                valueStyle={{ color: '#10B981' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="p-4 sm:p-6">
              <Statistic
                title="Ordered"
                value={mockRequisitions.filter((r: any) => r.status === 'ordered').length}
                valueStyle={{ color: '#3B82F6' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="p-4 sm:p-6">
              <Statistic
                title="Total Value"
                value={mockRequisitions.reduce((sum, r) => sum + r.totalAmount, 0)}
                prefix="₦"
                formatter={(value) => `₦${Number(value).toLocaleString()}`}
                valueStyle={{ color: '#8B5CF6' }}
              />
            </Card>
          </Col>
        </Row>

        <div className="flex items-center gap-3 mb-6">
          <Input placeholder="Search requisitions..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ flex: 1, maxWidth: '400px' }} />
          <Select placeholder="Status" value={statusFilter} onChange={setStatusFilter} allowClear style={{ width: '140px' }}>
            <Option value="pending">Pending</Option>
            <Option value="approved">Approved</Option>
            <Option value="ordered">Ordered</Option>
            <Option value="received">Received</Option>
          </Select>
        </div>

        <Table dataSource={filteredRequisitions} columns={columns} rowKey="id" pagination={{ defaultPageSize: 10 }} size="middle" />
      </div>

      <Modal
        title="New Purchase Requisition"
        open={modalVisible}
        onOk={handleCreateRequisition}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="department" label="Department" rules={[{ required: true }]}>
            <Select placeholder="Select department">
              <Option value="Pharmacy">Pharmacy</Option>
              <Option value="Laboratory">Laboratory</Option>
              <Option value="General Ward">General Ward</Option>
            </Select>
          </Form.Item>
          <Form.Item name="requiredDate" label="Required Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="items" label="Items" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="List items required" />
          </Form.Item>
          <Form.Item name="justification" label="Justification">
            <Input.TextArea rows={3} placeholder="Provide justification" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
