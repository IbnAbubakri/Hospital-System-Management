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
        return <Tag className="border-none font-medium" style={{ backgroundColor: config.bg, color: config.color }}>{config.text}</Tag>;
      }},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Requisition) => (
        <div className=" ">
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
    <div className="min-h-screen   sm: sm: lg: lg: bg-gradient-to-b from-blue-50 to-slate-50">
      <div className=" sm: bg-white -xl border border-slate-200">
        <div className=" -col sm:-row items-start sm:   ">
          <div>
            <h1 className="text-2xl font-semibold     ">
              <ShoppingOutlined className="" />
              Purchase Requisitions
            </h1>
            <p className=" ">Manage purchase requests and approvals</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)} className="w-full sm:w-auto">
            New Requisition
          </Button>
        </div>

        <Row gutter={[16, 16]} className="">
          <Col xs={12} sm={6}>
            <Card className=" sm:">
              <Statistic
                title="Pending"
                value={mockRequisitions.filter((r: any) => r.status === 'pending').length}
                valueStyle={{ color: '#F59E0B' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className=" sm:">
              <Statistic
                title="Approved"
                value={mockRequisitions.filter((r: any) => r.status === 'approved').length}
                valueStyle={{ color: '#10B981' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className=" sm:">
              <Statistic
                title="Ordered"
                value={mockRequisitions.filter((r: any) => r.status === 'ordered').length}
                valueStyle={{ color: '#3B82F6' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className=" sm:">
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

        <div className="   ">
          <Input placeholder="Search requisitions..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} className="-1 max-w" />
          <Select placeholder="Status" value={statusFilter} onChange={setStatusFilter} allowClear className="">
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
            <DatePicker className="w-full" />
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
