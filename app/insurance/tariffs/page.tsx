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
          {record.copayAmount && <div className="">{formatCurrency(record.copayAmount)}</div>}
          {record.copayPercentage && <div className=" ">{record.copayPercentage}%</div>}
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
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <style jsx global>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .page-content { animation: fadeInUp 0.5s ease-out forwards; }
      `}</style>

      <div className="  sm: sm: lg: lg: bg-gradient-to-br from-white to-slate-50 border-b border-slate-200">
        <div className="page-content">
          <div className=" -col sm:-row items-start sm:   ">
            <div>
              <div className="   ">
                <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #8B5CF6 0%, #7C3AED 100%)', borderRadius: '2px' }} />
                <h1 className="text-2xl font-semibold ">Payer Tariffs</h1>
              </div>
              <p className="  .5">Manage insurance partner tariff rates</p>
            </div>
            <Button type="primary" icon={<PlusOutlined />} className=" -xl font-semibold  w-full sm:w-auto">Add Tariff</Button>
          </div>
        </div>
      </div>

      <div className=" sm: lg:  page-content">
        <div className=" -col sm:-row items-stretch sm:    overflow-x-auto bg-white -xl border border-slate-200">
          <div className="-1 min-w-[200px]">
            <Input
              placeholder="Search tariffs..."
              allowClear
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="-lg"
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
          <div className="w-full sm:w-auto text-center   -lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <span className=" font-medium ">{filteredTariffs.length} tariffs</span>
          </div>
        </div>

        <div className="overflow-x-auto bg-white -xl border border-slate-200">
          <Table dataSource={filteredTariffs} columns={columns} rowKey="id" pagination={{ defaultPageSize: 10, showSizeChanger: false }} />
        </div>
      </div>
    </div>
  );
}
