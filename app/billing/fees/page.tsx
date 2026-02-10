'use client';

import React, { useState } from 'react';
import { Card, Table, Button, Input, Space, Tag, Typography, Row, Col, Modal, Form, InputNumber, Select, App, Drawer, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DollarOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton, InfoCard } from '@/components/design-system';
import { useAuth } from '@/lib/contexts/AuthContext';

const { Title, Text } = Typography;
const { Search } = Input;

interface FeeSchedule {
  id: string;
  category: string;
  service: string;
  code: string;
  amount: number;
  currency: string;
  effectiveDate: string;
  status: 'Active' | 'Inactive';
}

export default function FeesPage() {
  const { user, hasPermission } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { message } = App.useApp();
  const [editingFee, setEditingFee] = useState<FeeSchedule | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();

  // CRITICAL SECURITY: Restrict access to administrators only
  if (!hasPermission('billing:fees:view')) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
        <Card className="mt-6 rounded-xl">
          <Alert
            title="Access Denied"
            description="You don&apos;tt have permission to access fee schedule management. This area is restricted to billing staff and administrators only."
            type="error"
            showIcon
          />
        </Card>
      </div>
    );
  }

  const [fees, setFees] = useState<FeeSchedule[]>([
    {
      id: '1',
      category: 'Outpatient Consultation',
      service: 'General Physician Consultation',
      code: 'OP-001',
      amount: 5000,
      currency: '₦',
      effectiveDate: '2024-01-01',
      status: 'Active'},
    {
      id: '2',
      category: 'Outpatient Consultation',
      service: 'Specialist Consultation',
      code: 'OP-002',
      amount: 10000,
      currency: '₦',
      effectiveDate: '2024-01-01',
      status: 'Active'},
    {
      id: '3',
      category: 'Laboratory',
      service: 'Complete Blood Count',
      code: 'LAB-001',
      amount: 2500,
      currency: '₦',
      effectiveDate: '2024-01-01',
      status: 'Active'},
    {
      id: '4',
      category: 'Laboratory',
      service: 'Lipid Profile',
      code: 'LAB-002',
      amount: 3500,
      currency: '₦',
      effectiveDate: '2024-01-01',
      status: 'Active'},
    {
      id: '5',
      category: 'Procedures',
      service: 'Minor Surgery',
      code: 'PROC-001',
      amount: 25000,
      currency: '₦',
      effectiveDate: '2024-01-01',
      status: 'Active'},
    {
      id: '6',
      category: 'Radiology',
      service: 'X-Ray (Single View)',
      code: 'RAD-001',
      amount: 5000,
      currency: '₦',
      effectiveDate: '2024-01-01',
      status: 'Active'},
    {
      id: '7',
      category: 'Inpatient',
      service: 'Bed Charge (Per Day)',
      code: 'IP-001',
      amount: 15000,
      currency: '₦',
      effectiveDate: '2024-01-01',
      status: 'Active'},
    {
      id: '8',
      category: 'Emergency',
      service: 'Emergency Registration',
      code: 'EMG-001',
      amount: 10000,
      currency: '₦',
      effectiveDate: '2024-01-01',
      status: 'Active'},
  ]);

  const categories = ['Outpatient Consultation', 'Laboratory', 'Radiology', 'Procedures', 'Inpatient', 'Emergency', 'Pharmacy', 'Other'];

  const stats = {
    totalFees: fees.length,
    activeFees: fees.filter((f: any) => f.status === 'Active').length,
    avgFee: Math.round(fees.reduce((sum, f) => sum + f.amount, 0) / fees.length),
    categories: categories.length,
  };

  const handleSubmit = (values: { [key: string]: string | number }) => {
    const newFee: FeeSchedule = {
      id: editingFee?.id || Date.now().toString(),
      ...(values as any),
      status: 'Active'};

    if (editingFee) {
      setFees(fees.map((f) => (f.id === editingFee.id ? newFee : f)));
      message.success('Fee updated successfully');
    } else {
      setFees([...fees, newFee]);
      message.success('Fee added successfully');
    }

    setIsModalOpen(false);
    form.resetFields();
    setEditingFee(null);
  };

  const handleEdit = (fee: FeeSchedule) => {
    setEditingFee(fee);
    form.setFieldsValue(fee);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setFees(fees.filter((f: any) => f.id !== id));
    message.success('Fee deleted successfully');
  };

  const filteredFees = fees.filter((fee) => {
    const matchesSearch =
      fee.service.toLowerCase().includes(searchText.toLowerCase()) ||
      fee.code.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !categoryFilter || fee.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: '#DBEAFE',
            color: '#1E40AF',
          }}
        >
          {code}
        </span>
      )},
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: '#F1F5F9',
            color: '#475569',
          }}
        >
          {category}
        </span>
      )},
    {
      title: 'Service Description',
      dataIndex: 'service',
      key: 'service',
      sorter: (a: FeeSchedule, b: FeeSchedule) => a.service.localeCompare(b.service)},
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span className="font-semibold text-green-600">₦{amount.toLocaleString()}</span>
      ),
      sorter: (a: FeeSchedule, b: FeeSchedule) => a.amount - b.amount},
    {
      title: 'Effective Date',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate'},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status.toLowerCase()} type="billing" showIcon />},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: FeeSchedule) => (
        <Space>
          <GradientButton variant="secondary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </GradientButton>
          <GradientButton variant="secondary" size="small" danger onClick={() => handleDelete(record.id)}>
            Delete
          </GradientButton>
        </Space>
      )},
  ];

  return (
    <PageShell
      title="Fee Schedule Management"
      subtitle="Configure and manage service fees across all departments"
      action={
        <GradientButton icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          Add New Fee
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Total Fees"
          value={stats.totalFees}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Active Fees"
          value={stats.activeFees}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="Avg. Fee Amount"
          value={stats.avgFee}
          prefix="₦"
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={2}
        />
        <StatCard
          label="Categories"
          value={stats.categories}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={3}
        />
      </div>

      {/* Fee Schedule List */}
      <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-6 border border-slate-200">
        <SearchFilterBar
          searchPlaceholder="Search fees by code or service..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'category',
              label: 'Category',
              value: categoryFilter,
              options: [
                { label: 'All Categories', value: '' },
                ...categories.map((cat) => ({ label: cat, value: cat })),
              ],
              onChange: (value) => setCategoryFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredFees.length}
          totalCount={fees.length}
          filterLabel="fees"
        />

        <div className="overflow-x-auto">
          <ModernTable
            dataSource={filteredFees}
            columns={columns}
            rowKey="id"
            pagination={{ defaultPageSize: 20 }}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>

      {/* Add/Edit Fee Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <PlusOutlined style={{ color: '#3B82F6' }} />
            <span>{editingFee ? 'Edit Fee' : 'Add New Fee'}</span>
          </div>
        }
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingFee(null);
        }}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-6">
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select category">
              {categories.map((cat) => (
                <Select.Option key={cat} value={cat}>
                  {cat}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="service" label="Service Description" rules={[{ required: true }]}>
            <Input placeholder="Enter service description" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="code" label="Fee Code" rules={[{ required: true }]}>
                <Input placeholder="e.g., OP-001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="amount" label="Amount (₦)" rules={[{ required: true }]}>
                <InputNumber placeholder="Enter amount" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="effectiveDate" label="Effective Date" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </PageShell>
  );
}
