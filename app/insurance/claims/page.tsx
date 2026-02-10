'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Table, Input, Button, Tag, Select, Drawer, Badge, Typography, Descriptions, Progress } from 'antd';
import { PlusOutlined, EyeOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { mockClaims } from '@/lib/mockDataExtended';
import { Claim } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';

const { Search } = Input;
const { Option } = Select;

export default function ClaimsPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const stats = useMemo(() => ({
    total: mockClaims.length,
    submitted: mockClaims.filter((c: any) => c.status === 'submitted' || c.status === 'under_review').length,
    approved: mockClaims.filter((c: any) => c.status === 'approved' || c.status === 'partially_approved').length,
    settled: mockClaims.filter((c: any) => c.status === 'settled').length,
  }), []);

  const [animatedStats, setAnimatedStats] = useState({ total: 0, submitted: 0, approved: 0, settled: 0 });

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
        submitted: Math.round(stats.submitted * easeProgress),
        approved: Math.round(stats.approved * easeProgress),
        settled: Math.round(stats.settled * easeProgress),
      });
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  const filteredClaims = useMemo(() => {
    return mockClaims.filter((claim) => {
      const matchesSearch =
        claim.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
        claim.claimNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        claim.insurancePartnerName.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = !statusFilter || claim.status === statusFilter;
      const matchesType = !typeFilter || claim.claimType === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchText, statusFilter, typeFilter]);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; text: string }> = {
      draft: { color: '#6B7280', bg: '#F3F4F6', text: 'Draft' },
      submitted: { color: '#3B82F6', bg: '#DBEAFE', text: 'Submitted' },
      under_review: { color: '#F59E0B', bg: '#FEF3C7', text: 'Under Review' },
      approved: { color: '#10B981', bg: '#D1FAE5', text: 'Approved' },
      partially_approved: { color: '#8B5CF6', bg: '#EDE9FE', text: 'Partially Approved' },
      rejected: { color: '#EF4444', bg: '#FEE2E2', text: 'Rejected' },
      settled: { color: '#059669', bg: '#D1FAE5', text: 'Settled' },
      cancelled: { color: '#6B7280', bg: '#F3F4F6', text: 'Cancelled' },
    };
    return configs[status] || configs.draft;
  };

  const columns = [
    { title: 'Claim Number', dataIndex: 'claimNumber', key: 'claimNumber', sorter: (a: Claim, b: Claim) => a.claimNumber.localeCompare(b.claimNumber) },
    { title: 'Patient', dataIndex: 'patientName', key: 'patientName' },
    {
      title: 'Insurance Partner',
      dataIndex: 'insurancePartnerName',
      key: 'insurancePartnerName',
      ellipsis: true,
    },
    {
      title: 'Type',
      dataIndex: 'claimType',
      key: 'claimType',
      render: (type: string) => (
        <Tag color={type === 'cashless' ? 'blue' : 'green'} style={{ textTransform: 'uppercase' }}>{type.replace('_', ' ')}</Tag>
      ),
    },
    {
      title: 'Amounts',
      key: 'amounts',
      render: (_: any, record: Claim) => (
        <div>
          <div className="text-sm">Billed: {formatCurrency(record.billedAmount)}</div>
          <div className="text-xs text-gray-500">Claimed: {formatCurrency(record.claimedAmount)}</div>
          {record.approvedAmount && <div className="text-xs text-green-600">Approved: {formatCurrency(record.approvedAmount)}</div>}
        </div>
      ),
    },
    {
      title: 'Submitted Date',
      dataIndex: 'submittedDate',
      key: 'submittedDate',
      render: (date: Date) => formatDate(date),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getStatusConfig(status);
        return <Tag style={{ backgroundColor: config.bg, color: config.color, border: 'none', fontWeight: 500, fontSize: '12px', padding: '3px 10px', borderRadius: '6px' }}>{config.text}</Tag>;
      },
    },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: Claim) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => viewClaim(record)} style={{ padding: '4px 8px' }} />
      ),
    },
  ];

  const viewClaim = (claim: Claim) => {
    setSelectedClaim(claim);
    setDrawerVisible(true);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)' }}>
      <style jsx global>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .page-content { animation: fadeInUp 0.5s ease-out forwards; }
        .stat-card { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; position: relative; }
        .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--card-color) 0%, rgba(255,255,255,0.5) 50%, var(--card-color) 100%); background-size: 200% 100%; animation: shimmer 3s infinite; }
        .stat-card:nth-child(1) { animation-delay: 0.1s; --card-color: #3B82F6; }
        .stat-card:nth-child(2) { animation-delay: 0.15s; --card-color: #F59E0B; }
        .stat-card:nth-child(3) { animation-delay: 0.2s; --card-color: #10B981; }
        .stat-card:nth-child(4) { animation-delay: 0.25s; --card-color: #059669; }
        .stat-card:hover { transform: translateY(-4px); transition: transform 0.3s ease; }
        .stat-number { transition: transform 0.3s ease; }
        .stat-card:hover .stat-number { transform: scale(1.1); }
        .ant-btn-primary { transition: all 0.3s ease !important; background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%) !important; border: none !important; }
        .ant-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4) !important; }
      `}</style>

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)', borderBottom: '1px solid #E2E8F0' }}>
        <div className="page-content">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)', borderRadius: '2px' }} />
                <h1 className="text-2xl font-semibold text-gray-900">Insurance Claims</h1>
              </div>
              <p className="text-gray-500 text-sm" style={{ marginLeft: '7px' }}>Manage insurance claims and settlements</p>
            </div>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/insurance/claims/new')} style={{ height: '42px', borderRadius: '10px', fontWeight: 600, padding: '0 20px' }} className="w-full sm:w-auto">New Claim</Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              { label: 'Total Claims', value: animatedStats.total, color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
              { label: 'Submitted', value: animatedStats.submitted, color: '#F59E0B', bg: '#FEF3C7', border: '#FDE68A' },
              { label: 'Approved', value: animatedStats.approved, color: '#10B981', bg: '#D1FAE5', border: '#A7F3D0' },
              { label: 'Settled', value: animatedStats.settled, color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' },
            ].map((stat, index) => (
              <div key={index} className="stat-card p-4 sm:p-5" style={{ borderRadius: '12px', background: `linear-gradient(135deg, ${stat.bg} 0%, rgba(255,255,255,0.8) 100%)`, border: `1px solid ${stat.border}` }}>
                <div className="text-sm font-medium" style={{ color: '#64748B', marginBottom: '6px' }}>{stat.label}</div>
                <div className="stat-number" style={{ fontSize: '28px', fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 page-content" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 p-4 overflow-x-auto" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <div className="flex-1 min-w-[200px]">
            <Search placeholder="Search claims..." allowClear value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ borderRadius: '8px' }} />
          </div>
          <Select placeholder="Type" value={typeFilter} onChange={setTypeFilter} allowClear className="w-full sm:w-[140px]">
            <Option value="cashless">Cashless</Option>
            <Option value="reimbursement">Reimbursement</Option>
          </Select>
          <Select placeholder="Status" value={statusFilter} onChange={setStatusFilter} allowClear className="w-full sm:w-[140px]">
            <Option value="submitted">Submitted</Option>
            <Option value="under_review">Under Review</Option>
            <Option value="approved">Approved</Option>
            <Option value="settled">Settled</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
          <div className="w-full sm:w-auto text-center" style={{ padding: '8px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', border: '1px solid #BFDBFE' }}>
            <span className="text-sm font-medium" style={{ color: '#1D4ED8' }}>{filteredClaims.length} claims</span>
          </div>
        </div>

        <div className="overflow-x-auto" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <Table dataSource={filteredClaims} columns={columns} rowKey="id" pagination={{ defaultPageSize: 10, showSizeChanger: false, showTotal: (total) => `${total} claims` }} />
        </div>
      </div>

      <Drawer
        title="Claim Details"
        placement="right"
        width={720}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedClaim(null);
        }}
      >
        {selectedClaim && (
          <div>
            <Typography.Title level={5}>Claim Information</Typography.Title>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Claim Number">{selectedClaim.claimNumber}</Descriptions.Item>
              <Descriptions.Item label="Patient">{selectedClaim.patientName}</Descriptions.Item>
              <Descriptions.Item label="Insurance Partner">{selectedClaim.insurancePartnerName}</Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag color={selectedClaim.claimType === 'cashless' ? 'blue' : 'green'}>
                  {selectedClaim.claimType.replace('_', ' ').toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Billed Amount">{formatCurrency(selectedClaim.billedAmount)}</Descriptions.Item>
              <Descriptions.Item label="Claimed Amount">{formatCurrency(selectedClaim.claimedAmount)}</Descriptions.Item>
              {selectedClaim.approvedAmount && (
                <Descriptions.Item label="Approved Amount">
                  <span style={{ color: '#10B981', fontWeight: 600 }}>{formatCurrency(selectedClaim.approvedAmount)}</span>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Submitted Date">{formatDate(selectedClaim.submittedDate)}</Descriptions.Item>
              <Descriptions.Item label="Status">
                {(() => {
                  const config = getStatusConfig(selectedClaim.status);
                  return <Tag style={{ backgroundColor: config.bg, color: config.color, border: 'none', fontWeight: 500 }}>{config.text}</Tag>;
                })()}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  );
}
