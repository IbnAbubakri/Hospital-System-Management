'use client';

import React, { useState } from 'react';
import { Card, Table, Button, Input, Space, Tag, Typography, Row, Col, Select, Modal, Form, InputNumber, Switch, App, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PercentageOutlined, SearchOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton, InfoCard } from '@/components/design-system';
import { useAuth } from '@/lib/contexts/AuthContext';

const { Title, Text } = Typography;

interface DiscountRule {
  id: string;
  name: string;
  type: 'Percentage' | 'Fixed Amount' | 'Buy X Get Y';
  value: number;
  category: string;
  minAmount?: number;
  maxDiscount?: number;
  applicableTo: 'All Services' | 'Specific Services' | 'Packages';
  services?: string[];
  validFrom: string;
  validUntil?: string;
  status: 'Active' | 'Inactive';
}

export default function DiscountsPage() {
  const { user, hasPermission } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  // CRITICAL SECURITY: Restrict access to administrators only
  if (!hasPermission('billing:discounts:view')) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
        <Card className="mt-6 rounded-xl">
          <Alert
            title="Access Denied"
            description="You don&apos;tt have permission to access discount management. This area is restricted to billing staff and administrators only."
            type="error"
            showIcon
          />
        </Card>
      </div>
    );
  }

  const [discounts, setDiscounts] = useState<DiscountRule[]>([
    {
      id: '1',
      name: 'Senior Citizen Discount',
      type: 'Percentage',
      value: 15,
      category: 'Age-Based',
      applicableTo: 'All Services',
      validFrom: '2024-01-01',
      status: 'Active'},
    {
      id: '2',
      name: 'Early Bird Payment',
      type: 'Percentage',
      value: 10,
      category: 'Payment-Based',
      minAmount: 50000,
      maxDiscount: 10000,
      applicableTo: 'All Services',
      validFrom: '2024-01-01',
      status: 'Active'},
    {
      id: '3',
      name: 'Lab Test Bundle',
      type: 'Fixed Amount',
      value: 2000,
      category: 'Service-Based',
      applicableTo: 'Specific Services',
      services: ['CBC', 'Lipid Profile', 'Blood Sugar'],
      validFrom: '2024-01-01',
      status: 'Active'},
    {
      id: '4',
      name: 'Corporate Partner Discount',
      type: 'Percentage',
      value: 20,
      category: 'Partnership',
      applicableTo: 'All Services',
      validFrom: '2024-01-01',
      validUntil: '2024-12-31',
      status: 'Active'},
  ]);

  const handleSubmit = (values: { [key: string]: string | number }) => {
    const newDiscount: DiscountRule = {
      id: Date.now().toString(),
      ...(values as any),
      status: 'Active'};

    setDiscounts([...discounts, newDiscount]);
    message.success('Discount rule created successfully');
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleToggle = (id: string) => {
    setDiscounts(
      discounts.map((d) =>
        d.id === id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } : d
      )
    );
    message.success('Discount status updated');
  };

  const handleDelete = (id: string) => {
    setDiscounts(discounts.filter((d: any) => d.id !== id));
    message.success('Discount deleted');
  };

  const filteredDiscounts = discounts.filter((d: any) =>
    d.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Rule Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: DiscountRule, b: DiscountRule) => a.name.localeCompare(b.name)},
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <StatusTag status={type.toLowerCase().replace(' ', '_')} type="billing" showIcon />
      )},
    {
      title: 'Value',
      key: 'value',
      render: (_: any, record: DiscountRule) => (
        <span className="font-semibold text-green-600">
          {record.type === 'Percentage' ? `${record.value}%` : `₦${record.value.toLocaleString()}`}
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
      title: 'Applicable To',
      dataIndex: 'applicableTo',
      key: 'applicableTo',
      render: (applicableTo: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: applicableTo === 'All Services' ? '#DBEAFE' : '#D1FAE5',
            color: applicableTo === 'All Services' ? '#1E40AF' : '#065F46',
          }}
        >
          {applicableTo}
        </span>
      )},
    {
      title: 'Valid From',
      dataIndex: 'validFrom',
      key: 'validFrom'},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status.toLowerCase()} type="billing" showIcon />},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: DiscountRule) => (
        <Space>
          <Switch
            checked={record.status === 'Active'}
            onChange={() => handleToggle(record.id)}
            size="small"
          />
          <GradientButton variant="secondary" size="small" onClick={() => {}}>
            Edit
          </GradientButton>
          <GradientButton variant="secondary" size="small" danger onClick={() => handleDelete(record.id)}>
            Delete
          </GradientButton>
        </Space>
      )},
  ];

  const stats = {
    total: discounts.length,
    active: discounts.filter((d: any) => d.status === 'Active').length,
    percentage: discounts.filter((d: any) => d.type === 'Percentage').length,
    fixed: discounts.filter((d: any) => d.type === 'Fixed Amount').length};

  return (
    <PageShell
      title="Discount Rules Management"
      subtitle="Configure discounts, promotional offers, and special pricing"
      action={
        <GradientButton icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          Add Discount Rule
        </GradientButton>
      }
    >
      <Alert
        title="Discount Configuration"
        description="Create percentage-based or fixed-amount discounts. Set eligibility criteria and validity periods for each rule."
        type="info"
        showIcon
        closable
        className="mb-6 rounded-xl"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Total Rules"
          value={stats.total}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Active Rules"
          value={stats.active}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="Percentage Based"
          value={stats.percentage}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={2}
        />
        <StatCard
          label="Fixed Amount"
          value={stats.fixed}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={3}
        />
      </div>

      {/* Discount Rules List */}
      <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-6 border border-slate-200">
        <SearchFilterBar
          searchPlaceholder="Search discount rules..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          resultCount={filteredDiscounts.length}
          totalCount={discounts.length}
          filterLabel="rules"
        />

        <div className="overflow-x-auto">
          <ModernTable
            dataSource={filteredDiscounts}
            columns={columns}
            rowKey="id"
            pagination={{ defaultPageSize: 15 }}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>

      {/* Add Discount Rule Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <PlusOutlined style={{ color: '#3B82F6' }} />
            <span>Add Discount Rule</span>
          </div>
        }
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-6">
          <Form.Item name="name" label="Rule Name" rules={[{ required: true }]}>
            <Input placeholder="Enter discount rule name" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Discount Type" rules={[{ required: true }]}>
                <Select placeholder="Select type">
                  <Select.Option value="Percentage">Percentage</Select.Option>
                  <Select.Option value="Fixed Amount">Fixed Amount</Select.Option>
                  <Select.Option value="Buy X Get Y">Buy X Get Y</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="value" label="Value" rules={[{ required: true }]}>
                <InputNumber placeholder="Enter value" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select placeholder="Select category">
                  <Select.Option value="Age-Based">Age-Based</Select.Option>
                  <Select.Option value="Payment-Based">Payment-Based</Select.Option>
                  <Select.Option value="Service-Based">Service-Based</Select.Option>
                  <Select.Option value="Partnership">Partnership</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="applicableTo" label="Applicable To" rules={[{ required: true }]}>
                <Select placeholder="Select scope">
                  <Select.Option value="All Services">All Services</Select.Option>
                  <Select.Option value="Specific Services">Specific Services</Select.Option>
                  <Select.Option value="Packages">Packages</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="minAmount" label="Minimum Amount (₦)">
                <InputNumber placeholder="Optional" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maxDiscount" label="Max Discount (₦)">
                <InputNumber placeholder="Optional" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="validFrom" label="Valid From" rules={[{ required: true }]}>
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="validUntil" label="Valid Until">
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageShell>
  );
}
