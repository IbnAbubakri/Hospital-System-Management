'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Table, Input, Button, Tag, Select, Drawer, Badge, Typography, Progress, Descriptions } from 'antd';
import { PlusOutlined, EyeOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { mockPreAuthorizations } from '@/lib/mockDataExtended';
import { PreAuthorization } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';

const { Search } = Input;
const { Option } = Select;
const { Text, Title } = Typography;

export default function PreAuthorizationsPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedPreAuth, setSelectedPreAuth] = useState<PreAuthorization | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const stats = useMemo(() => ({
    total: mockPreAuthorizations.length,
    pending: mockPreAuthorizations.filter((p: any) => (p.status as string) === 'pending' || (p.status as string) === 'under_review').length,
    approved: mockPreAuthorizations.filter((p: any) => (p.status as string) === 'approved' || (p.status as string) === 'partially_approved').length,
    rejected: mockPreAuthorizations.filter((p: any) => (p.status as string) === 'rejected').length,
  }), []);

  const [animatedStats, setAnimatedStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    setMounted(true);
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;
    const currentValues = { ...animatedStats };
    const targets = stats;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        total: Math.round(currentValues.total + (targets.total - currentValues.total) * easeProgress),
        pending: Math.round(currentValues.pending + (targets.pending - currentValues.pending) * easeProgress),
        approved: Math.round(currentValues.approved + (targets.approved - currentValues.approved) * easeProgress),
        rejected: Math.round(currentValues.rejected + (targets.rejected - currentValues.rejected) * easeProgress),
      });

      if (step >= steps) clearInterval(interval);
    }, stepDuration);
    return () => clearInterval(interval);
  }, []);

  const filteredPreAuths = useMemo(() => {
    return mockPreAuthorizations.filter((preAuth) => {
      const matchesSearch =
        preAuth.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
        preAuth.preAuthNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        preAuth.insurancePartnerName.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = !statusFilter || preAuth.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter]);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; text: string; icon: React.ReactNode }> = {
      pending: { color: '#F59E0B', bg: '#FEF3C7', text: 'Pending', icon: <ClockCircleOutlined /> },
      under_review: { color: '#3B82F6', bg: '#DBEAFE', text: 'Under Review', icon: <ClockCircleOutlined /> },
      approved: { color: '#10B981', bg: '#D1FAE5', text: 'Approved', icon: <CheckCircleOutlined /> },
      partially_approved: { color: '#8B5CF6', bg: '#EDE9FE', text: 'Partially Approved', icon: <CheckCircleOutlined /> },
      rejected: { color: '#EF4444', bg: '#FEE2E2', text: 'Rejected', icon: <CloseCircleOutlined /> },
      cancelled: { color: '#6B7280', bg: '#F3F4F6', text: 'Cancelled', icon: <CloseCircleOutlined /> },
    };
    return configs[status] || configs.pending;
  };

  const columns = [
    {
      title: 'Pre-Auth',
      key: 'preAuth',
      render: (_: any, record: PreAuthorization) => (
        <div>
          <div className="font-medium text-gray-900">{record.preAuthNumber}</div>
          <div className="text-xs text-gray-500">{record.patientName}</div>
        </div>
      ),
    },
    {
      title: 'Patient',
      key: 'patient',
      render: (_: any, record: PreAuthorization) => (
        <div>
          <div className="text-sm">{record.patientName}</div>
          <div className="text-xs text-gray-500">{record.mrn}</div>
        </div>
      ),
    },
    {
      title: 'Insurance Partner',
      dataIndex: 'insurancePartnerName',
      key: 'insurance',
      ellipsis: true,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Diagnosis',
      key: 'diagnosis',
      ellipsis: true,
      render: (_: any, record: PreAuthorization) => (
        <div>
          <div className="text-sm truncate" style={{ maxWidth: '200px' }}>{record.diagnosis}</div>
          <div className="text-xs text-gray-500">{record.icdCode}</div>
        </div>
      ),
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (_: any, record: PreAuthorization) => (
        <div>
          <div className="text-sm font-medium">{formatCurrency(record.estimatedAmount)}</div>
          {record.approvedAmount && (
            <div className="text-xs text-green-600">{formatCurrency(record.approvedAmount)}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getStatusConfig(status);
        return (
          <Tag icon={config.icon} style={{ backgroundColor: config.bg, color: config.color, border: 'none', fontWeight: 500, fontSize: '12px', padding: '3px 10px', borderRadius: '6px' }}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: PreAuthorization) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => viewPreAuth(record)} style={{ padding: '4px 8px' }} />
      ),
    },
  ];

  const viewPreAuth = (preAuth: PreAuthorization) => {
    setSelectedPreAuth(preAuth);
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
        .stat-card:nth-child(4) { animation-delay: 0.25s; --card-color: #EF4444; }
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
                <h1 className="text-2xl font-semibold text-gray-900">Pre-Authorizations</h1>
              </div>
              <p className="text-gray-500 text-sm" style={{ marginLeft: '7px' }}>Manage insurance pre-authorizations</p>
            </div>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/insurance/pre-auth/new')} style={{ height: '42px', borderRadius: '10px', fontWeight: 600, padding: '0 20px' }} className="w-full sm:w-auto">New Pre-Auth</Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              { label: 'Total Requests', value: animatedStats.total, color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
              { label: 'Pending', value: animatedStats.pending, color: '#F59E0B', bg: '#FEF3C7', border: '#FDE68A' },
              { label: 'Approved', value: animatedStats.approved, color: '#10B981', bg: '#D1FAE5', border: '#A7F3D0' },
              { label: 'Rejected', value: animatedStats.rejected, color: '#EF4444', bg: '#FEE2E2', border: '#FECACA' },
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
            <Search placeholder="Search pre-authorizations..." allowClear value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ borderRadius: '8px' }} />
          </div>
          <Select placeholder="Status" value={statusFilter} onChange={setStatusFilter} allowClear className="w-full sm:w-[140px]">
            <Option value="pending">Pending</Option>
            <Option value="under_review">Under Review</Option>
            <Option value="approved">Approved</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
          <div className="w-full sm:w-auto text-center" style={{ padding: '8px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', border: '1px solid #BFDBFE' }}>
            <span className="text-sm font-medium" style={{ color: '#1D4ED8' }}>{filteredPreAuths.length} requests</span>
          </div>
        </div>

        <div className="overflow-x-auto" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <Table dataSource={filteredPreAuths} columns={columns} rowKey="id" pagination={{ defaultPageSize: 10, showSizeChanger: false, showTotal: (total) => `${total} requests` }} />
        </div>
      </div>

      <Drawer
        title="Pre-Authorization Details"
        placement="right"
        width={720}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedPreAuth(null);
        }}
      >
        {selectedPreAuth && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Pre-Auth Number" span={2}>{selectedPreAuth.preAuthNumber}</Descriptions.Item>
              <Descriptions.Item label="Patient Name" span={2}>{selectedPreAuth.patientName}</Descriptions.Item>
              <Descriptions.Item label="MRN">{selectedPreAuth.mrn}</Descriptions.Item>
              <Descriptions.Item label="Department">{selectedPreAuth.department}</Descriptions.Item>
              <Descriptions.Item label="Insurance Partner" span={2}>{selectedPreAuth.insurancePartnerName}</Descriptions.Item>
              <Descriptions.Item label="Diagnosis" span={2}>{selectedPreAuth.diagnosis}</Descriptions.Item>
              <Descriptions.Item label="ICD Code">{selectedPreAuth.icdCode}</Descriptions.Item>
              <Descriptions.Item label="Status">
                {(() => {
                  const config = getStatusConfig(selectedPreAuth.status);
                  return <Tag icon={config.icon} style={{ backgroundColor: config.bg, color: config.color, border: 'none', fontWeight: 500 }}>{config.text}</Tag>;
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Estimated Amount">{formatCurrency(selectedPreAuth.estimatedAmount)}</Descriptions.Item>
              {selectedPreAuth.approvedAmount && (
                <Descriptions.Item label="Approved Amount">
                  <span style={{ color: '#10B981', fontWeight: 600 }}>{formatCurrency(selectedPreAuth.approvedAmount)}</span>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  );
}
