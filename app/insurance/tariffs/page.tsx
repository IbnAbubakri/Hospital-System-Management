'use client';

import React, { useState, useMemo } from 'react';
import { Table, Input, Select, Button, Tag, Typography } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { mockPayerTariffs } from '@/lib/mockDataExtended';
import { PayerTariff } from '@/types';
import { formatCurrency } from '@/lib/utils';

const { Option } = Select;

export default function TariffsPage() {
  const [searchText, setSearchText] = useState('');
  const [partnerFilter, setPartnerFilter] = useState<string | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();

  const filteredTariffs = useMemo(() => {
    return mockPayerTariffs.filter((tariff) => {
      const matchesSearch =
        tariff.procedureName.toLowerCase().includes(searchText.toLowerCase()) ||
        tariff.procedureCode.toLowerCase().includes(searchText.toLowerCase());
      const matchesPartner = !partnerFilter || tariff.insurancePartnerId === partnerFilter;
      const matchesCategory = !categoryFilter || tariff.category === categoryFilter;
      return matchesSearch && matchesPartner && matchesCategory;
    });
  }, [searchText, partnerFilter, categoryFilter]);

  const columns = [
    { title: 'Procedure Code', dataIndex: 'procedureCode', key: 'code', sorter: (a: PayerTariff, b: PayerTariff) => a.procedureCode.localeCompare(b.procedureCode) },
    { title: 'Procedure Name', dataIndex: 'procedureName', key: 'name', ellipsis: true },
    {
      title: 'Insurance Partner',
      dataIndex: 'insurancePartnerName',
      key: 'partner',
      width: 200,
    },
    { title: 'Category', dataIndex: 'category', key: 'category', width: 150 },
    {
      title: 'Room Type',
      dataIndex: 'roomType',
      key: 'roomType',
      width: 120,
      render: (type: string) => type.toUpperCase(),
    },
    {
      title: 'Tariff Amount',
      dataIndex: 'tariffAmount',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Co-pay',
      key: 'copay',
      render: (_: any, record: PayerTariff) => (
        <div>
          {record.copayAmount && <div className="text-sm">{formatCurrency(record.copayAmount)}</div>}
          {record.copayPercentage && <div className="text-xs text-gray-500">{record.copayPercentage}%</div>}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>{status.toUpperCase()}</Tag>
      ),
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)' }}>
      <style jsx global>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .page-content { animation: fadeInUp 0.5s ease-out forwards; }
      `}</style>

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)', borderBottom: '1px solid #E2E8F0' }}>
        <div className="page-content">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #8B5CF6 0%, #7C3AED 100%)', borderRadius: '2px' }} />
                <h1 className="text-2xl font-semibold text-gray-900">Payer Tariffs</h1>
              </div>
              <p className="text-gray-500 text-sm" style={{ marginLeft: '7px' }}>Manage insurance partner tariff rates</p>
            </div>
            <Button type="primary" icon={<PlusOutlined />} style={{ height: '42px', borderRadius: '10px', fontWeight: 600, padding: '0 20px' }} className="w-full sm:w-auto">Add Tariff</Button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 page-content">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 p-4 overflow-x-auto" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search tariffs..."
              allowClear
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ borderRadius: '8px' }}
            />
          </div>
          <Select placeholder="Insurance Partner" value={partnerFilter} onChange={setPartnerFilter} allowClear className="w-full sm:w-[200px]">
            <Option value="ip1">AXA Mansard</Option>
            <Option value="ip2">Hygeia HMO</Option>
            <Option value="ip4">NHIS</Option>
          </Select>
          <Select placeholder="Category" value={categoryFilter} onChange={setCategoryFilter} allowClear className="w-full sm:w-[150px]">
            <Option value="Cardiology">Cardiology</Option>
            <Option value="Laboratory">Laboratory</Option>
            <Option value="Radiology">Radiology</Option>
          </Select>
          <div className="w-full sm:w-auto text-center" style={{ padding: '8px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', border: '1px solid #BFDBFE' }}>
            <span className="text-sm font-medium" style={{ color: '#1D4ED8' }}>{filteredTariffs.length} tariffs</span>
          </div>
        </div>

        <div className="overflow-x-auto" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <Table dataSource={filteredTariffs} columns={columns} rowKey="id" pagination={{ defaultPageSize: 10, showSizeChanger: false }} />
        </div>
      </div>
    </div>
  );
}
