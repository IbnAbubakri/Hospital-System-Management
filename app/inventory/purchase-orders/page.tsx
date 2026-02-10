'use client';

import React, { useState } from 'react';
import { Table, Button, Tag, Input, Badge, Progress, Drawer, Typography, Descriptions, Select, Divider } from 'antd';
import { ShoppingOutlined, PlusOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { PurchaseOrder } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';

const { Option } = Select;
const { Title } = Typography;

const mockPOs: PurchaseOrder[] = [
  {
    id: 'po1',
    orderNumber: 'PO-2024-001',
    supplierId: 'v1',
    supplierName: 'Pharma Distributors Ltd',
    orderDate: new Date('2024-01-28'),
    expectedDeliveryDate: new Date('2024-02-15'),
    items: [
      { itemId: '1', itemName: 'Amoxicillin 500mg', quantity: 1000, unitPrice: 50, discount: 0, tax: 5, total: 52500 },
      { itemId: '2', itemName: 'Paracetamol 500mg', quantity: 5000, unitPrice: 20, discount: 0, tax: 5, total: 105000 },
    ],
    subtotal: 150000,
    tax: 7500,
    total: 157500,
    status: 'submitted',
  },
  {
    id: 'po2',
    orderNumber: 'PO-2024-002',
    supplierId: 'v2',
    supplierName: 'MediSupply Solutions',
    orderDate: new Date('2024-02-01'),
    expectedDeliveryDate: new Date('2024-02-20'),
    items: [
      { itemId: '3', itemName: 'Insulin Glargine', quantity: 200, unitPrice: 8500, discount: 50000, tax: 5, total: 1785000 },
    ],
    subtotal: 1700000,
    tax: 85000,
    total: 1785000,
    status: 'approved',
    approvedBy: 'Finance Manager',
    approvedDate: new Date('2024-02-03'),
  },
  {
    id: 'po3',
    orderNumber: 'PO-2024-003',
    supplierId: 'v1',
    supplierName: 'Pharma Distributors Ltd',
    orderDate: new Date('2024-02-04'),
    expectedDeliveryDate: new Date('2024-02-25'),
    items: [
      { itemId: '4', itemName: 'Ceftriaxone 1g', quantity: 500, unitPrice: 2500, discount: 0, tax: 5, total: 1312500 },
    ],
    subtotal: 1250000,
    tax: 62500,
    total: 1312500,
    status: 'received',
    receivedDate: new Date('2024-02-04'),
    receivedBy: 'Pharmacy Manager',
  },
];

export default function PharmacyPurchasesPage() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const filteredPOs = mockPOs.filter((po) => {
    const matchesSearch = po.orderNumber.toLowerCase().includes(searchText.toLowerCase()) || po.supplierName.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; text: string }> = {
      draft: { color: '#6B7280', bg: '#F3F4F6', text: 'Draft' },
      submitted: { color: '#3B82F6', bg: '#DBEAFE', text: 'Submitted' },
      approved: { color: '#10B981', bg: '#D1FAE5', text: 'Approved' },
      ordered: { color: '#8B5CF6', bg: '#EDE9FE', text: 'Ordered' },
      received: { color: '#059669', bg: '#D1FAE5', text: 'Received' },
      cancelled: { color: '#EF4444', bg: '#FEE2E2', text: 'Cancelled' },
    };
    return configs[status] || configs.draft;
  };

  const columns = [
    { title: 'PO Number', dataIndex: 'orderNumber', key: 'orderNumber' },
    { title: 'Supplier', dataIndex: 'supplierName', key: 'supplier' },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (d: Date) => formatDate(d),
    },
    {
      title: 'Expected Delivery',
      dataIndex: 'expectedDeliveryDate',
      key: 'delivery',
      render: (d: Date) => formatDate(d),
    },
    {
      title: 'Total Amount',
      dataIndex: 'total',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getStatusConfig(status);
        return <Tag style={{ backgroundColor: config.bg, color: config.color, border: 'none', fontWeight: 500 }}>{config.text}</Tag>;
      },
    },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: PurchaseOrder) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => viewPO(record)} />
      ),
    },
  ];

  const viewPO = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setDrawerVisible(true);
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)' }}>
      <div className="p-4 sm:p-6" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Purchase Orders</h1>
            <p className="text-gray-500 text-sm">Pharmacy purchase order management</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} className="w-full sm:w-auto">New PO</Button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <Input placeholder="Search POs..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} className="flex-1 max-w-full sm:max-w-[400px]" />
          <Select placeholder="Status" value={statusFilter} onChange={setStatusFilter} allowClear className="w-full sm:w-[140px]">
            <Option value="draft">Draft</Option>
            <Option value="submitted">Submitted</Option>
            <Option value="approved">Approved</Option>
            <Option value="received">Received</Option>
          </Select>
          <Badge count={filteredPOs.length} style={{ background: '#14B8A6' }} />
        </div>

        <div className="overflow-x-auto">
          <Table dataSource={filteredPOs} columns={columns} rowKey="id" pagination={{ defaultPageSize: 10 }} size="middle" />
        </div>
      </div>

      <Drawer
        title="Purchase Order Details"
        placement="right"
        width={720}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedPO(null);
        }}
      >
        {selectedPO && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="PO Number" span={2}>{selectedPO.orderNumber}</Descriptions.Item>
              <Descriptions.Item label="Supplier" span={2}>{selectedPO.supplierName}</Descriptions.Item>
              <Descriptions.Item label="Order Date">{formatDate(selectedPO.orderDate)}</Descriptions.Item>
              <Descriptions.Item label="Expected Delivery">{formatDate(selectedPO.expectedDeliveryDate)}</Descriptions.Item>
              <Descriptions.Item label="Subtotal">{formatCurrency(selectedPO.subtotal)}</Descriptions.Item>
              <Descriptions.Item label="Tax">{formatCurrency(selectedPO.tax)}</Descriptions.Item>
              <Descriptions.Item label="Total" span={2}>
                <span style={{ fontSize: '18px', fontWeight: 600, color: '#10B981' }}>{formatCurrency(selectedPO.total)}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {(() => {
                  const config = getStatusConfig(selectedPO.status);
                  return <Tag style={{ backgroundColor: config.bg, color: config.color, border: 'none', fontWeight: 500 }}>{config.text}</Tag>;
                })()}
              </Descriptions.Item>
              {selectedPO.approvedBy && (
                <Descriptions.Item label="Approved By">{selectedPO.approvedBy}</Descriptions.Item>
              )}
            </Descriptions>

            <Divider />

            <Title level={5}>Items</Title>
            <Table
              dataSource={selectedPO.items}
              columns={[
                { title: 'Item', dataIndex: 'itemName', key: 'itemName' },
                { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
                { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice', render: (price: number) => formatCurrency(price) },
                { title: 'Total', dataIndex: 'total', key: 'total', render: (total: number) => formatCurrency(total) },
              ]}
              rowKey="itemId"
              pagination={false}
              size="small"
            />
          </div>
        )}
      </Drawer>
    </div>
  );
}
