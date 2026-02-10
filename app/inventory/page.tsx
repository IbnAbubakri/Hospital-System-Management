'use client';

import React, { useState } from 'react';
import { Space, Progress, Alert } from 'antd';
import { InboxOutlined, ShoppingOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';
import { useAuth } from '@/lib/contexts/AuthContext';

interface InventoryItem {
  key: string;
  itemCode: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  reorderLevel: number;
  expiryDate: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export default function InventoryPage() {
  const { hasPermission } = useAuth();
  const [searchText, setSearchText] = useState('');

  // CRITICAL SECURITY: Restrict access to inventory staff
  if (!hasPermission('inventory:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '24px' }}>
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access inventory management. This area is restricted to inventory staff and administrators."
          type="error"
          showIcon
          style={{ marginTop: '24px', borderRadius: '12px' }}
        />
      </div>
    );
  }

  const items: InventoryItem[] = [
    {
      key: '1',
      itemCode: 'MED-001',
      name: 'Paracetamol 500mg',
      category: 'Medication',
      stock: 450,
      unit: 'tablets',
      reorderLevel: 200,
      expiryDate: '2025-06-30',
      status: 'in_stock',
    },
    {
      key: '2',
      itemCode: 'MED-002',
      name: 'Amoxicillin 250mg',
      category: 'Medication',
      stock: 85,
      unit: 'capsules',
      reorderLevel: 100,
      expiryDate: '2024-08-15',
      status: 'low_stock',
    },
    {
      key: '3',
      itemCode: 'SUP-001',
      name: 'Surgical Gloves (M)',
      category: 'Consumable',
      stock: 1200,
      unit: 'pairs',
      reorderLevel: 500,
      expiryDate: '2026-01-20',
      status: 'in_stock',
    },
    {
      key: '4',
      itemCode: 'MED-003',
      name: 'Insulin Pen',
      category: 'Medication',
      stock: 0,
      unit: 'pens',
      reorderLevel: 50,
      expiryDate: '2024-12-10',
      status: 'out_of_stock',
    },
  ];

  const filteredItems = items.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const columns = [
    { title: 'Item Code', dataIndex: 'itemCode', key: 'itemCode' },
    { title: 'Item Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: '#F3E8FF',
            color: '#7C3AED',
          }}
        >
          {cat}
        </span>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number, record: InventoryItem) => (
        <div>
          <div className="font-medium">{stock} {record.unit}</div>
          <Progress
            percent={Math.min((stock / record.reorderLevel) * 100, 100)}
            size="small"
            strokeColor={stock < record.reorderLevel ? '#EF4444' : '#10B981'}
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="admission" showIcon />,
    },
    { title: 'Expiry Date', dataIndex: 'expiryDate', key: 'expiryDate' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <GradientButton variant="secondary" size="small">
          Manage
        </GradientButton>
      ),
    },
  ];

  const purchaseOrders = [
    { key: '1', orderNumber: 'PO-2024-0045', supplier: 'MedSupply Inc.', items: 15, amount: 4500, status: 'pending' },
    { key: '2', orderNumber: 'PO-2024-0044', supplier: 'HealthCare Ltd.', items: 8, amount: 3200, status: 'approved' },
    { key: '3', orderNumber: 'PO-2024-0043', supplier: 'PharmaDist Co.', items: 22, amount: 8900, status: 'received' },
  ];

  const poColumns = [
    { title: 'PO #', dataIndex: 'orderNumber', key: 'orderNumber' },
    { title: 'Supplier', dataIndex: 'supplier', key: 'supplier' },
    { title: 'Items', dataIndex: 'items', key: 'items' },
    {
      title: 'Amount (₦)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amt: number) => `₦${(amt * 1000).toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="admission" showIcon />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <GradientButton variant="secondary" size="small">
          View
        </GradientButton>
      ),
    },
  ];

  const stats = {
    total: 1250,
    lowStock: 23,
    outOfStock: 8,
    pendingOrders: 5,
  };

  return (
    <PageShell
      title="Inventory Management"
      subtitle="Track medical supplies, equipment, and purchase orders"
      action={
        <GradientButton icon={<PlusOutlined />}>
          Add Item
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Total Items"
          value={stats.total}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Low Stock Items"
          value={stats.lowStock}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={1}
        />
        <StatCard
          label="Out of Stock"
          value={stats.outOfStock}
          color="#EF4444"
          bg="linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCA5A5"
          index={2}
        />
        <StatCard
          label="Pending Orders"
          value={stats.pendingOrders}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Items - Takes 2 columns */}
        <div className="lg:col-span-2 p-4 sm:p-6" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <SearchFilterBar
            searchPlaceholder="Search items by name, code, or category..."
            searchValue={searchText}
            onSearchChange={setSearchText}
            resultCount={filteredItems.length}
            totalCount={items.length}
            filterLabel="items"
          />

          <ModernTable
            dataSource={filteredItems}
            columns={columns}
            pagination={{ defaultPageSize: 5 }}
          />
        </div>

        {/* Sidebar - Takes 1 column */}
        <div className="space-y-6 p-4 sm:p-6" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Level Overview</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Medications</span>
                  <span className="text-sm text-gray-500">75%</span>
                </div>
                <Progress percent={75} strokeColor="#3B82F6" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Consumables</span>
                  <span className="text-sm text-gray-500">82%</span>
                </div>
                <Progress percent={82} strokeColor="#10B981" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Equipment</span>
                  <span className="text-sm text-gray-500">90%</span>
                </div>
                <Progress percent={90} strokeColor="#F59E0B" />
              </div>
            </div>

            {/* Recent Purchase Orders */}
            <div className="p-4 sm:p-6" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Purchase Orders</h3>
              <ModernTable
                dataSource={purchaseOrders}
                columns={poColumns}
                pagination={false}
                size="small"
              />
              <div className="mt-3 text-center">
                <GradientButton variant="secondary" size="small" className="w-full sm:w-auto">
                  View All Orders
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
    </PageShell>
  );
}
