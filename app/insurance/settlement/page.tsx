'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Table, Input, Button, Tag, Drawer, Typography, Descriptions } from 'antd';
import { EyeOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { mockClaimSettlements } from '@/lib/mockDataExtended';
import { ClaimSettlement } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';

const { Search } = Input;

export default function SettlementsPage() {
  const [searchText, setSearchText] = useState('');
  const [selectedSettlement, setSelectedSettlement] = useState<ClaimSettlement | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const stats = useMemo(() => ({
    total: mockClaimSettlements.length,
    settled: mockClaimSettlements.filter((s: any) => s.status === 'completed').length,
    totalAmount: mockClaimSettlements.reduce((sum, s) => sum + s.settledAmount, 0),
  }), []);

  const [animatedStats, setAnimatedStats] = useState({ total: 0, settled: 0, totalAmount: 0 });

  useEffect(() => {
    setMounted(true);
    const duration = 1000;
    const steps = 30;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedStats({
        total: Math.round(stats.total * easeProgress),
        settled: Math.round(stats.settled * easeProgress),
        totalAmount: Math.round(stats.totalAmount * easeProgress),
      });
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  const filteredSettlements = useMemo(() => {
    return mockClaimSettlements.filter((settlement) => {
      return (
        settlement.settlementNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        settlement.claimNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        settlement.insurancePartnerName.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }, [searchText]);

  const columns = [
    { title: 'Settlement No.', dataIndex: 'settlementNumber', key: 'settlementNumber' },
    { title: 'Claim No.', dataIndex: 'claimNumber', key: 'claimNumber' },
    {
      title: 'Insurance Partner',
      dataIndex: 'insurancePartnerName',
      key: 'insurancePartnerName',
    },
    {
      title: 'Amount',
      dataIndex: 'settledAmount',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Settlement Date',
      dataIndex: 'settlementDate',
      key: 'settlementDate',
      render: (date: Date) => formatDate(date),
    },
    {
      title: 'Payment Mode',
      dataIndex: 'paymentMode',
      key: 'paymentMode',
      render: (mode: string) => mode.replace('_', ' ').toUpperCase(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'success' : 'processing'} icon={status === 'completed' ? <CheckCircleOutlined /> : null}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: ClaimSettlement) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => viewSettlement(record)} className="" />
      ),
    },
  ];

  const viewSettlement = (settlement: ClaimSettlement) => {
    setSelectedSettlement(settlement);
    setDrawerVisible(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <style jsx global>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .page-content { animation: fadeInUp 0.5s ease-out forwards; }
      `}</style>

      <div className="  sm: sm: lg: lg: bg-gradient-to-br from-white to-slate-50 border-b border-slate-200">
        <div className="page-content">
          <div className=" -col sm:-row items-start sm:    sm:">
            <div>
              <div className="   ">
                <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)', borderRadius: '2px' }} />
                <h1 className="text-2xl font-semibold ">Claim Settlements</h1>
              </div>
              <p className="  .5">Track insurance claim settlements</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  sm:">
            {[
              { label: 'Total Settlements', value: animatedStats.total, color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
              { label: 'Completed', value: animatedStats.settled, color: '#10B981', bg: '#D1FAE5', border: '#A7F3D0' },
              { label: 'Total Amount', value: formatCurrency(animatedStats.totalAmount), color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' },
            ].map((stat, index) => (
              <div className=" sm: bg-white -xl border" style={{ background: `linear-gradient(135deg, ${stat.bg} 0%, rgba(255,255,255,0.8) 100%)`, borderColor: stat.border }}>
                <div className=" font-medium text-slate-500 .5">{stat.label}</div>
                <div className="text-2xl font-bold leading-none" style={{ color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className=" sm: lg:  page-content">
        <div className=" -col sm:-row items-stretch sm:    overflow-x-auto bg-white -xl border border-slate-200">
          <div className="-1 min-w-[200px]">
            <Search placeholder="Search settlements..." allowClear value={searchText} onChange={(e) => setSearchText(e.target.value)} className="-lg" />
          </div>
          <div className="w-full sm:w-auto text-center   -lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <span className=" font-medium ">{filteredSettlements.length} settlements</span>
          </div>
        </div>

        <div className="overflow-x-auto bg-white -xl border border-slate-200">
          <Table dataSource={filteredSettlements} columns={columns} rowKey="id" pagination={{ defaultPageSize: 10, showSizeChanger: false }} />
        </div>
      </div>

      <Drawer
        title="Settlement Details"
        placement="right"
        width={600}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedSettlement(null);
        }}
      >
        {selectedSettlement && (
          <div>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Settlement Number">{selectedSettlement.settlementNumber}</Descriptions.Item>
              <Descriptions.Item label="Claim Number">{selectedSettlement.claimNumber}</Descriptions.Item>
              <Descriptions.Item label="Insurance Partner">{selectedSettlement.insurancePartnerName}</Descriptions.Item>
              <Descriptions.Item label="Settled Amount">
                <span className=" font-semibold ">{formatCurrency(selectedSettlement.settledAmount)}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Settlement Date">{formatDate(selectedSettlement.settlementDate)}</Descriptions.Item>
              <Descriptions.Item label="Payment Mode">{selectedSettlement.paymentMode.replace('_', ' ').toUpperCase()}</Descriptions.Item>
              <Descriptions.Item label="Transaction Reference">{selectedSettlement.transactionReference || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedSettlement.status === 'completed' ? 'success' : 'processing'} icon={selectedSettlement.status === 'completed' ? <CheckCircleOutlined /> : null}>
                  {selectedSettlement.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  );
}
