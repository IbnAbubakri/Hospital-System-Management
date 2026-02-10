'use client';

import React, { useState } from 'react';
import { Card, Typography, Table, Button, Space, Row, Col, Select, Tag, Statistic, Input, Progress, Modal, Form } from 'antd';
import { PlusOutlined, SearchOutlined, WarningOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface DrugItem {
  id: string;
  drugName: string;
  genericName: string;
  category: string;
  currentStock: number;
  unit: string;
  minStock: number;
  maxStock: number;
  expiryDate: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export default function PharmacyInventoryPage() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const [items] = useState<DrugItem[]>([
    {
      id: '1',
      drugName: 'Paracetamol Tablets',
      genericName: 'Acetaminophen',
      category: 'Analgesic',
      currentStock: 5000,
      unit: 'tabs',
      minStock: 1000,
      maxStock: 10000,
      expiryDate: '2025-06-30',
      status: 'In Stock',
    },
    {
      id: '2',
      drugName: 'Amoxicillin Capsules',
      genericName: 'Amoxicillin',
      category: 'Antibiotic',
      currentStock: 2500,
      unit: 'caps',
      minStock: 500,
      maxStock: 5000,
      expiryDate: '2024-12-15',
      status: 'In Stock',
    },
    {
      id: '3',
      drugName: 'Ibuprofen Suspension',
      genericName: 'Ibuprofen',
      category: 'Analgesic',
      currentStock: 180,
      unit: 'bottles',
      minStock: 200,
      maxStock: 500,
      expiryDate: '2024-08-20',
      status: 'Low Stock',
    },
    {
      id: '4',
      drugName: 'Vitamin D3 Drops',
      genericName: 'Cholecalciferol',
      category: 'Vitamin',
      currentStock: 0,
      unit: 'bottles',
      minStock: 50,
      maxStock: 200,
      expiryDate: '2025-03-10',
      status: 'Out of Stock',
    },
    {
      id: '5',
      drugName: 'Cetirizine Tablets',
      genericName: 'Cetirizine',
      category: 'Antihistamine',
      currentStock: 1200,
      unit: 'tabs',
      minStock: 300,
      maxStock: 2000,
      expiryDate: '2025-01-25',
      status: 'In Stock',
    },
  ]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'In Stock': 'success',
      'Low Stock': 'warning',
      'Out of Stock': 'error',
    };
    return colors[status] || 'default';
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = !searchText ||
      item.drugName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.genericName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { title: 'Drug Name', dataIndex: 'drugName', key: 'drugName' },
    { title: 'Generic Name', dataIndex: 'genericName', key: 'genericName' },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat: string) => <Tag>{cat}</Tag> },
    {
      title: 'Stock Level',
      key: 'stockLevel',
      render: (_: any, record: DrugItem) => {
        const percent = (record.currentStock / record.maxStock) * 100;
        return (
          <div style={{ width: 120 }}>
            <Progress
              percent={percent}
              status={record.status === 'Out of Stock' ? 'exception' : record.status === 'Low Stock' ? 'exception' : 'normal'}
              size="small"
            />
            <Text type="secondary" className="text-xs">{record.currentStock} / {record.maxStock} {record.unit}</Text>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={status === 'Low Stock' || status === 'Out of Stock' ? <WarningOutlined /> : null}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date: string) => {
        const daysUntilExpiry = dayjs(date).diff(dayjs(), 'days');
        const isExpiringSoon = daysUntilExpiry < 90;
        return (
          <span style={{ color: isExpiringSoon ? '#cf1322' : undefined }}>
            {dayjs(date).format('MMM DD, YYYY')}
            {isExpiringSoon && <Tag color="warning" style={{ marginLeft: 8 }}>Expiring Soon</Tag>}
          </span>
        );
      },
    },
  ];

  const stats = {
    total: items.length,
    inStock: items.filter((i: any) => i.status === 'In Stock').length,
    lowStock: items.filter((i: any) => i.status === 'Low Stock').length,
    outOfStock: items.filter((i: any) => i.status === 'Out of Stock').length,
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Pharmacy Inventory</Title>
      <Text type="secondary">Manage pharmaceutical stock levels and expiry tracking</Text>

      <Row gutter={[16, 16]} style={{ marginTop: '24px', marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card className="p-4 sm:p-6">
            <Statistic title="Total Items" value={stats.total} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="p-4 sm:p-6">
            <Statistic title="In Stock" value={stats.inStock} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="p-4 sm:p-6">
            <Statistic title="Low Stock" value={stats.lowStock} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="p-4 sm:p-6">
            <Statistic title="Out of Stock" value={stats.outOfStock} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
      </Row>

      <Card className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <Space style={{ marginBottom: 16 }} className="w-full sm:w-auto">
            <Input
              placeholder="Search drugs..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
              className="sm:w-[300px]"
            />
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              style={{ width: 120 }}
              className="sm:w-[150px]"
            >
              <Select.Option value="In Stock">In Stock</Select.Option>
              <Select.Option value="Low Stock">Low Stock</Select.Option>
              <Select.Option value="Out of Stock">Out of Stock</Select.Option>
            </Select>
            <Button type="primary" icon={<PlusOutlined />} className="w-full sm:w-auto">Add Item</Button>
          </Space>
        </div>

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredItems}
            rowKey="id"
            pagination={{ defaultPageSize: 10 }}
          />
        </div>
      </Card>
    </div>
  );
}
