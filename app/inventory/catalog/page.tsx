'use client';

import React, { useState } from 'react';
import { Card, Table, Button, Space, Typography, Tag, Input, Select, Row, Col, Modal, Form, InputNumber, App, Badge, Progress, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, BarcodeOutlined, ExclamationCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  maxStock: number;
  location: string;
  supplier: string;
  lastRestocked: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export default function InventoryCatalogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { message } = App.useApp();
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();

  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Paracetamol 500mg',
      sku: 'MED-001',
      category: 'Medication',
      quantity: 500,
      unit: 'tablets',
      minStock: 100,
      maxStock: 1000,
      location: 'Pharmacy A1',
      supplier: 'PharmaCorp',
      lastRestocked: '2024-01-28',
      status: 'In Stock'},
    {
      id: '2',
      name: 'Surgical Gloves (Medium)',
      sku: 'SUP-001',
      category: 'Supplies',
      quantity: 50,
      unit: 'boxes',
      minStock: 100,
      maxStock: 500,
      location: 'Store Room B2',
      supplier: 'MedSupplies Ltd',
      lastRestocked: '2024-01-20',
      status: 'Low Stock'},
    {
      id: '3',
      name: 'Syringes 5ml',
      sku: 'SUP-002',
      category: 'Supplies',
      quantity: 0,
      unit: 'pieces',
      minStock: 200,
      maxStock: 1000,
      location: 'Store Room A3',
      supplier: 'MedSupplies Ltd',
      lastRestocked: '2024-01-15',
      status: 'Out of Stock'},
  ]);

  const handleSubmit = (values: { [key: string]: string | number }) => {
    const newItem: InventoryItem = {
      id: editingItem?.id || Date.now().toString(),
      ...(values as any),
      status: values.quantity === 0 ? 'Out of Stock' : values.quantity <= values.minStock ? 'Low Stock' : 'In Stock'};

    if (editingItem) {
      setInventory(inventory.map((i) => (i.id === editingItem.id ? newItem : i)));
      message.success('Item updated');
    } else {
      setInventory([...inventory, newItem]);
      message.success('Item added');
    }

    setIsModalOpen(false);
    form.resetFields();
    setEditingItem(null);
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: any }> = {
      'In Stock': { color: 'success', icon: <CheckCircleOutlined /> },
      'Low Stock': { color: 'warning', icon: <ExclamationCircleOutlined /> },
      'Out of Stock': { color: 'error', icon: <CloseCircleOutlined /> }};
    return configs[status] || configs['In Stock'];
  };

  const columns = [
    { title: 'SKU', dataIndex: 'sku', key: 'sku', render: (sku: string) => <Tag color="blue">{sku}</Tag> },
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <span className="font-medium">{name}</span>},
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat: string) => <Tag>{cat}</Tag> },
    {
      title: 'Stock',
      key: 'stock',
      render: (_: any, record: InventoryItem) => (
        <div>
          <div className="font-semibold">{record.quantity} {record.unit}</div>
          <Progress
            percent={(record.quantity / record.maxStock) * 100}
            size="small"
            status={record.quantity <= record.minStock ? 'exception' : 'normal'}
          />
        </div>
      )},
    {
      title: 'Min/Max',
      key: 'limits',
      render: (_: any, record: InventoryItem) => (
        <Text className="text-sm">{record.minStock} / {record.maxStock}</Text>
      )},
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Supplier', dataIndex: 'supplier', key: 'supplier' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getStatusConfig(status);
        return <Tag icon={config.icon} color={config.color}>{status}</Tag>;
      }},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: InventoryItem) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => {/* edit */ }}>Edit</Button>
          <Button type="text" danger icon={<DeleteOutlined />}>Delete</Button>
        </Space>
      )},
  ];

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: inventory.length,
    inStock: inventory.filter((i: any) => i.status === 'In Stock').length,
    lowStock: inventory.filter((i: any) => i.status === 'Low Stock').length,
    outOfStock: inventory.filter((i: any) => i.status === 'Out of Stock').length};

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <Title level={3} className="!mb-1">Inventory Catalog</Title>
          <Text type="secondary">Manage hospital inventory, supplies, and equipment</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          Add Item
        </Button>
      </div>

      {stats.lowStock > 0 && (
        <Alert
          title={`${stats.lowStock} items are low in stock`}
          description="Please review and place orders soon"
          type="warning"
          showIcon
          closable
          className="mb-4"
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card className="p-4 sm:p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Items</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="p-4 sm:p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
              <div className="text-sm text-gray-500">In Stock</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="p-4 sm:p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
              <div className="text-sm text-gray-500">Low Stock</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="p-4 sm:p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
              <div className="text-sm text-gray-500">Out of Stock</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title="Inventory Items"
        className="p-4 sm:p-6"
        extra={
          <div className="overflow-x-auto w-full">
            <Space className="w-full sm:w-auto">
              <Input.Search
                placeholder="Search items..."
                allowClear
                style={{ width: 150 }}
                className="sm:w-[200px]"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
              />
              <Select
                placeholder="Category"
                value={categoryFilter}
                onChange={setCategoryFilter}
                allowClear
                style={{ width: 100 }}
                className="sm:w-[120px]"
              >
                <Select.Option value="Medication">Medication</Select.Option>
                <Select.Option value="Supplies">Supplies</Select.Option>
                <Select.Option value="Equipment">Equipment</Select.Option>
              </Select>
            </Space>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <Table
            dataSource={filteredInventory}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 15 }}
            scroll={{ x: 1100 }}
          />
        </div>
      </Card>

      <Modal
        title={editingItem ? 'Edit Item' : 'Add Item'}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingItem(null);
        }}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Item Name" rules={[{ required: true }]}>
                <Input placeholder="e.g., Paracetamol 500mg" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
                <Input placeholder="e.g., MED-001" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="Medication">Medication</Select.Option>
                  <Select.Option value="Supplies">Supplies</Select.Option>
                  <Select.Option value="Equipment">Equipment</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="supplier" label="Supplier" rules={[{ required: true }]}>
                <Input placeholder="Supplier name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
                <Input placeholder="tablets, boxes, etc." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="location" label="Storage Location" rules={[{ required: true }]}>
                <Input placeholder="e.g., Pharmacy A1" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="minStock" label="Min Stock Level" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maxStock" label="Max Stock Level" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
