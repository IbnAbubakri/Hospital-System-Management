'use client';

import React, { useState } from 'react';
import { Table, Button, Tag, Input, Select, Tabs, Descriptions, Badge } from 'antd';
import { MedicineBoxOutlined, PlusOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { mockDrugs } from '@/lib/mockDrugs';
import { Drug } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function FormularyPage() {
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();

  const filteredDrugs = mockDrugs.filter((drug) => {
    const matchesSearch = drug.name.toLowerCase().includes(searchText.toLowerCase()) || drug.genericName.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !categoryFilter || drug.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    { title: 'Drug Name', dataIndex: 'name', key: 'name', sorter: (a: Drug, b: Drug) => a.name.localeCompare(b.name) },
    { title: 'Generic Name', dataIndex: 'genericName', key: 'generic' },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Dosage Form',
      dataIndex: 'dosageForm',
      key: 'form',
      render: (form: string) => form.toUpperCase(),
    },
    { title: 'Strength', dataIndex: 'strength', key: 'strength' },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number, record: Drug) => (
        <div>
          <div>{stock} units</div>
          <div className="text-xs text-gray-500">Reorder: {record.reorderLevel}</div>
        </div>
      ),
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'price',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiry',
      render: (date: Date) => formatDate(date),
    },
    {
      title: 'Controlled',
      dataIndex: 'controlled',
      key: 'controlled',
      render: (controlled: boolean) => (
        controlled ? <Tag icon={<ExclamationCircleOutlined />} color="warning">CONTROLLED</Tag> : <Tag color="default">STANDARD</Tag>
      ),
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Drug Formulary</h1>
            <p className="text-gray-500 text-sm">Hospital drug catalog and inventory</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />}>Add Drug</Button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Input
            placeholder="Search drugs..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ flex: 1, maxWidth: '400px' }}
          />
          <Select placeholder="Category" value={categoryFilter} onChange={setCategoryFilter} allowClear style={{ width: '150px' }}>
            <Select.Option value="Antibiotics">Antibiotics</Select.Option>
            <Select.Option value="Analgesics">Analgesics</Select.Option>
            <Select.Option value="Cardiovascular">Cardiovascular</Select.Option>
            <Select.Option value="Antidiabetic">Antidiabetic</Select.Option>
          </Select>
          <Badge count={filteredDrugs.length} style={{ background: '#14B8A6' }} />
        </div>

        <Table dataSource={filteredDrugs} columns={columns} rowKey="id" pagination={{ defaultPageSize: 10 }} size="middle" />
      </div>
    </div>
  );
}
