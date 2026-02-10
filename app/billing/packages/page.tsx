'use client';

import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Typography, Row, Col, Modal, Form, Input, InputNumber, Select, App, List, Divider, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined, FolderOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton, InfoCard } from '@/components/design-system';
import { useAuth } from '@/lib/contexts/AuthContext';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface PackageItem {
  service: string;
  code: string;
  amount: number;
}

interface Package {
  id: string;
  name: string;
  code: string;
  category: 'Health Checkup' | 'Maternity' | 'Senior Care' | 'Executive' | 'Custom';
  originalPrice: number;
  packagePrice: number;
  discount: number;
  duration: string;
  items: PackageItem[];
  status: 'Active' | 'Inactive';
}

export default function PackagesPage() {
  const { user, hasPermission } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();

  // CRITICAL SECURITY: Restrict access to administrators only
  if (!hasPermission('billing:packages:view')) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
        <Card className="mt-6 rounded-xl">
          <Alert
            title="Access Denied"
            description="You don&apos;tt have permission to access package management. This area is restricted to billing staff and administrators only."
            type="error"
            showIcon
          />
        </Card>
      </div>
    );
  }

  const [packages, setPackages] = useState<Package[]>([
    {
      id: '1',
      name: 'Basic Health Checkup',
      code: 'PKG-BASIC',
      category: 'Health Checkup',
      originalPrice: 15000,
      packagePrice: 12000,
      discount: 20,
      duration: '1 day',
      items: [
        { service: 'Complete Blood Count', code: 'LAB-001', amount: 2500 },
        { service: 'Lipid Profile', code: 'LAB-002', amount: 3500 },
        { service: 'Blood Sugar Fasting', code: 'LAB-003', amount: 1500 },
        { service: 'Urine Routine', code: 'LAB-004', amount: 2000 },
        { service: 'General Physician Consultation', code: 'OP-001', amount: 5000 },
      ],
      status: 'Active'},
    {
      id: '2',
      name: 'Executive Health Checkup',
      code: 'PKG-EXEC',
      category: 'Executive',
      originalPrice: 45000,
      packagePrice: 35000,
      discount: 22,
      duration: '2 days',
      items: [
        { service: 'Complete Blood Count', code: 'LAB-001', amount: 2500 },
        { service: 'Comprehensive Metabolic Panel', code: 'LAB-005', amount: 8000 },
        { service: 'Lipid Profile', code: 'LAB-002', amount: 3500 },
        { service: 'Thyroid Panel', code: 'LAB-006', amount: 4000 },
        { service: 'ECG', code: 'CARD-001', amount: 5000 },
        { service: 'Chest X-Ray', code: 'RAD-001', amount: 5000 },
        { service: 'Specialist Consultation', code: 'OP-002', amount: 10000 },
        { service: 'Dietician Consultation', code: 'NUT-001', amount: 5000 },
      ],
      status: 'Active'},
    {
      id: '3',
      name: 'Maternity Package',
      code: 'PKG-MAT',
      category: 'Maternity',
      originalPrice: 120000,
      packagePrice: 100000,
      discount: 17,
      duration: '9 months',
      items: [
        { service: 'Initial Consultation', code: 'OP-002', amount: 10000 },
        { service: 'Monthly Checkups (9)', code: 'OP-001', amount: 45000 },
        { service: 'Delivery (Normal)', code: 'PROC-003', amount: 50000 },
        { service: 'Postnatal Care (2 visits)', code: 'OP-001', amount: 10000 },
      ],
      status: 'Active'},
  ]);

  const handleViewDetails = (pkg: Package) => {
    Modal.info({
      title: pkg.name,
      width: 600,
      content: (
        <div>
          <Row gutter={16} className="mb-4">
            <Col span={12}>
              <Text strong>Category:</Text> <Tag>{pkg.category}</Tag>
            </Col>
            <Col span={12}>
              <Text strong>Duration:</Text> {pkg.duration}
            </Col>
          </Row>
          <Row gutter={16} className="mb-4">
            <Col span={8}>
              <Text strong>Original Price:</Text>{' '}
              <Text delete type="secondary">₦{pkg.originalPrice.toLocaleString()}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Package Price:</Text>{' '}
              <Text type="success" className="text-lg font-semibold">₦{pkg.packagePrice.toLocaleString()}</Text>
            </Col>
            <Col span={8}>
              <Text strong>You Save:</Text>{' '}
              <Text type="danger">₦{(pkg.originalPrice - pkg.packagePrice).toLocaleString()} ({pkg.discount}%)</Text>
            </Col>
          </Row>
          <Divider />
          <Title level={5}>Included Services:</Title>
          <List
            dataSource={pkg.items}
            renderItem={(item) => (
              <List.Item>
                <div className="flex justify-between w-full">
                  <span>{item.service}</span>
                  <Tag>₦{item.amount.toLocaleString()}</Tag>
                </div>
              </List.Item>
            )}
          />
        </div>
      )});
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchText.toLowerCase()) ||
      pkg.code.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !categoryFilter || pkg.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      title: 'Package Code',
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
      title: 'Package Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Package) => (
        <Space>
          <FolderOutlined style={{ color: '#10B981' }} />
          <span className="font-medium">{name}</span>
        </Space>
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
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration'},
    {
      title: 'Pricing',
      key: 'pricing',
      render: (_: any, record: Package) => (
        <div>
          <div>
            <Text delete type="secondary" className="text-sm">₦{record.originalPrice.toLocaleString()}</Text>
          </div>
          <div className="font-semibold text-green-600">₦{record.packagePrice.toLocaleString()}</div>
          <div>
            <Tag color="red">{record.discount}% OFF</Tag>
          </div>
        </div>
      )},
    {
      title: 'Services Included',
      dataIndex: 'items',
      key: 'items',
      render: (items: PackageItem[]) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: '#D1FAE5',
            color: '#065F46',
          }}
        >
          {items.length} services
        </span>
      )},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status.toLowerCase()} type="billing" showIcon />},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Package) => (
        <Space>
          <GradientButton variant="secondary" size="small" onClick={() => handleViewDetails(record)}>
            View Details
          </GradientButton>
          <GradientButton variant="secondary" size="small">
            Edit
          </GradientButton>
          <GradientButton variant="secondary" size="small" danger>
            Delete
          </GradientButton>
        </Space>
      )},
  ];

  const stats = {
    total: packages.length,
    active: packages.filter((p: any) => p.status === 'Active').length,
    totalSavings: packages.reduce((acc, pkg) => acc + (pkg.originalPrice - pkg.packagePrice), 0),
    avgDiscount: Math.round(packages.reduce((acc, pkg) => acc + pkg.discount, 0) / packages.length),
  };

  return (
    <PageShell
      title="Package Pricing"
      subtitle="Create and manage service bundles and health packages"
      action={
        <GradientButton icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          Create Package
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Total Packages"
          value={stats.total}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Active Packages"
          value={stats.active}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="Total Patient Savings"
          value={stats.totalSavings}
          prefix="₦"
          color="#EF4444"
          bg="linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCA5A5"
          index={2}
        />
        <StatCard
          label="Avg. Discount"
          value={stats.avgDiscount}
          suffix="%"
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={3}
        />
      </div>

      {/* Package List Section */}
      <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-6 border border-slate-200">
        <SearchFilterBar
          searchPlaceholder="Search packages by name or code..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'category',
              label: 'Category',
              value: categoryFilter,
              options: [
                { label: 'All Categories', value: '' },
                { label: 'Health Checkup', value: 'Health Checkup' },
                { label: 'Maternity', value: 'Maternity' },
                { label: 'Senior Care', value: 'Senior Care' },
                { label: 'Executive', value: 'Executive' },
                { label: 'Custom', value: 'Custom' },
              ],
              onChange: (value) => setCategoryFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredPackages.length}
          totalCount={packages.length}
          filterLabel="packages"
        />

        <div className="overflow-x-auto">
          <ModernTable
            dataSource={filteredPackages}
            columns={columns}
            rowKey="id"
            pagination={{ defaultPageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>

      {/* Create Package Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <PlusOutlined style={{ color: '#3B82F6' }} />
            <span>Create New Package</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Create Package"
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={(values) => {
          const newPackage: Package = {
            id: Date.now().toString(),
            ...(values as any),
            originalPrice: 0,
            packagePrice: 0,
            discount: 0,
            items: [],
            status: 'Active'
          };
          setPackages([...packages, newPackage]);
          message.success('Package created successfully');
          setIsModalOpen(false);
          form.resetFields();
        }} className="mt-6">
          <Form.Item name="name" label="Package Name" rules={[{ required: true }]}>
            <Input placeholder="Enter package name" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="code" label="Package Code" rules={[{ required: true }]}>
                <Input placeholder="e.g., PKG-BASIC" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select placeholder="Select category">
                  <Select.Option value="Health Checkup">Health Checkup</Select.Option>
                  <Select.Option value="Maternity">Maternity</Select.Option>
                  <Select.Option value="Senior Care">Senior Care</Select.Option>
                  <Select.Option value="Executive">Executive</Select.Option>
                  <Select.Option value="Custom">Custom</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="originalPrice" label="Original Price (₦)" rules={[{ required: true }]}>
                <InputNumber placeholder="0" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="packagePrice" label="Package Price (₦)" rules={[{ required: true }]}>
                <InputNumber placeholder="0" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="discount" label="Discount (%)" rules={[{ required: true }]}>
                <InputNumber placeholder="0" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="duration" label="Duration" rules={[{ required: true }]}>
            <Input placeholder="e.g., 1 day, 9 months" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Enter package description" />
          </Form.Item>
        </Form>
      </Modal>
    </PageShell>
  );
}
