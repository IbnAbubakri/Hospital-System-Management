'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  Input,
  Button,
  Tag,
  Select,
  Drawer,
  Avatar,
  Typography,
  Tabs,
  Descriptions,
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  BankOutlined,
  PhoneOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { mockInsurancePartners } from '@/lib/mockDataExtended';
import { InsurancePartner } from '@/types';
import { formatDate } from '@/lib/utils';

const { Search } = Input;
const { Option } = Select;
const { Text, Title } = Typography;

export default function InsurancePartnersPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedPartner, setSelectedPartner] = useState<InsurancePartner | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Count-up animation for stats
  const [animatedStats, setAnimatedStats] = useState({
    total: 0,
    active: 0,
    tpa: 0,
    insurance: 0,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const total = mockInsurancePartners.length;
    const active = mockInsurancePartners.filter((p: any) => p.status === 'active').length;
    const tpa = mockInsurancePartners.filter((p: any) => p.type === 'tpa').length;
    const insurance = mockInsurancePartners.filter((p: any) => p.type === 'insurance').length;

    return { total, active, tpa, insurance };
  }, []);

  // Animate stats
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
        active: Math.round(currentValues.active + (targets.active - currentValues.active) * easeProgress),
        tpa: Math.round(currentValues.tpa + (targets.tpa - currentValues.tpa) * easeProgress),
        insurance: Math.round(currentValues.insurance + (targets.insurance - currentValues.insurance) * easeProgress),
      });

      if (step >= steps) {
        clearInterval(interval);
        setAnimatedStats(targets);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  // Filter partners
  const filteredPartners = useMemo(() => {
    return mockInsurancePartners.filter((partner) => {
      const matchesSearch =
        partner.name.toLowerCase().includes(searchText.toLowerCase()) ||
        partner.code.toLowerCase().includes(searchText.toLowerCase()) ||
        partner.contactPerson.toLowerCase().includes(searchText.toLowerCase());
      const matchesType = !typeFilter || partner.type === typeFilter;
      const matchesStatus = !statusFilter || partner.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchText, typeFilter, statusFilter]);

  // Table columns
  const columns = [
    {
      title: 'Partner',
      key: 'partner',
      render: (_: any, record: InsurancePartner) => (
        <div className="partner-name-cell flex items-center gap-3">
          <Avatar
            size={40}
            icon={<BankOutlined />}
            style={{
              backgroundColor: record.type === 'tpa' ? '#10B981' : record.type === 'government' ? '#F59E0B' : '#3B82F6',
            }}
          />
          <div>
            <div className="font-medium text-gray-900">{record.name}</div>
            <div className="text-xs text-gray-500">{record.code}</div>
          </div>
        </div>
      ),
      sorter: (a: InsurancePartner, b: InsurancePartner) => a.name.localeCompare(b.name),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const config: Record<string, { color: string; bg: string; label: string }> = {
          tpa: { color: '#059669', bg: '#D1FAE5', label: 'TPA' },
          insurance: { color: '#2563EB', bg: '#DBEAFE', label: 'Insurance' },
          government: { color: '#D97706', bg: '#FEF3C7', label: 'Government' },
        };
        const { color, bg, label } = config[type] || config.insurance;
        return (
          <Tag style={{ backgroundColor: bg, color, border: 'none', fontWeight: 500, padding: '3px 10px', borderRadius: '6px' }}>
            {label}
          </Tag>
        );
      },
      width: 120,
    },
    {
      title: 'Network',
      dataIndex: 'networkType',
      key: 'networkType',
      render: (network: string) => {
        const config: Record<string, { color: string; bg: string }> = {
          cashless: { color: '#059669', bg: '#D1FAE5' },
          reimbursement: { color: '#DC2626', bg: '#FEE2E2' },
          both: { color: '#7C3AED', bg: '#EDE9FE' },
        };
        const { color, bg } = config[network] || config.cashless;
        return (
          <Tag style={{ backgroundColor: bg, color, border: 'none', fontWeight: 500, fontSize: '12px', padding: '3px 8px', borderRadius: '6px' }}>
            {network.toUpperCase()}
          </Tag>
        );
      },
      width: 120,
    },
    {
      title: 'Contact Person',
      key: 'contact',
      render: (_: any, record: InsurancePartner) => (
        <div>
          <div className="text-sm font-medium">{record.contactPerson}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <PhoneOutlined style={{ fontSize: '11px' }} /> {record.phoneNumber}
          </div>
        </div>
      ),
      width: 180,
    },
    {
      title: 'Panel',
      key: 'panel',
      render: (_: any, record: InsurancePartner) => (
        <div>
          <div className="text-xs text-gray-500">Doctors: {record.panelDoctors}</div>
          <div className="text-xs text-gray-500">Hospitals: {record.panelHospitals}</div>
        </div>
      ),
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config: Record<string, { color: string; bg: string }> = {
          active: { color: '#059669', bg: '#D1FAE5' },
          inactive: { color: '#6B7280', bg: '#F3F4F6' },
          suspended: { color: '#DC2626', bg: '#FEE2E2' },
        };
        const { color, bg } = config[status] || config.inactive;
        return (
          <Tag
            icon={status === 'active' ? <CheckCircleOutlined /> : status === 'suspended' ? <CloseCircleOutlined /> : null}
            style={{ backgroundColor: bg, color, border: 'none', fontWeight: 500, fontSize: '13px', padding: '3px 10px', borderRadius: '6px' }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
        );
      },
      width: 100,
    },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: InsurancePartner) => (
        <div className="flex gap-1">
          <Button type="text" icon={<EyeOutlined />} onClick={() => viewPartner(record)} style={{ padding: '4px 8px' }} />
          <Button type="text" icon={<EditOutlined />} onClick={() => editPartner(record)} style={{ padding: '4px 8px' }} />
        </div>
      ),
      width: 80,
    },
  ];

  const viewPartner = (partner: InsurancePartner) => {
    setSelectedPartner(partner);
    setDrawerVisible(true);
  };

  const editPartner = (partner: InsurancePartner) => {
    router.push(`/insurance/partners/${partner.id}/edit`);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)' }}>
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .page-content { animation: fadeInUp 0.5s ease-out forwards; }
        .stat-card {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--card-color) 0%, rgba(255,255,255,0.5) 50%, var(--card-color) 100%);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        .stat-card:nth-child(1) { animation-delay: 0.1s; --card-color: #3B82F6; }
        .stat-card:nth-child(2) { animation-delay: 0.15s; --card-color: #10B981; }
        .stat-card:nth-child(3) { animation-delay: 0.2s; --card-color: #F59E0B; }
        .stat-card:nth-child(4) { animation-delay: 0.25s; --card-color: #8B5CF6; }
        .stat-card:hover { transform: translateY(-4px); transition: transform 0.3s ease; box-shadow: 0 12px 24px -8px var(--card-color); }
        .stat-number { transition: transform 0.3s ease; }
        .stat-card:hover .stat-number { transform: scale(1.1); }
        .ant-table-tbody > tr { transition: all 0.2s ease; animation: fadeIn 0.3s ease-out forwards; }
        .ant-table-tbody > tr:hover > td { background: linear-gradient(90deg, #EFF6FF 0%, #F0F9FF 100%) !important; }
        .ant-btn-primary { transition: all 0.3s ease !important; background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%) !important; border: none !important; }
        .ant-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4) !important; }
      `}</style>

      {/* Header */}
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)', borderBottom: '1px solid #E2E8F0' }}>
        <div className="page-content">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)', borderRadius: '2px' }} />
                <h1 className="text-2xl font-semibold text-gray-900">Insurance Partners</h1>
              </div>
              <p className="text-gray-500 text-sm" style={{ marginLeft: '7px' }}>
                Manage insurance companies and TPA partners
              </p>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push('/insurance/partners/new')}
              style={{ height: '42px', borderRadius: '10px', fontWeight: 600, padding: '0 20px' }}
              className="w-full sm:w-auto"
            >
              Add Partner
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              { label: 'Total Partners', value: animatedStats.total, color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
              { label: 'Active', value: animatedStats.active, color: '#10B981', bg: '#D1FAE5', border: '#A7F3D0' },
              { label: 'TPA', value: animatedStats.tpa, color: '#F59E0B', bg: '#FEF3C7', border: '#FDE68A' },
              { label: 'Insurance', value: animatedStats.insurance, color: '#8B5CF6', bg: '#EDE9FE', border: '#DDD6FE' },
            ].map((stat, index) => (
              <div
                key={index}
                className="stat-card p-4 sm:p-5"
                style={{ borderRadius: '12px', background: `linear-gradient(135deg, ${stat.bg} 0%, rgba(255,255,255,0.8) 100%)`, border: `1px solid ${stat.border}` }}
              >
                <div className="text-sm font-medium" style={{ color: '#64748B', marginBottom: '6px' }}>{stat.label}</div>
                <div className="stat-number" style={{ fontSize: '28px', fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 page-content" style={{ animationDelay: '0.1s' }}>
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 p-4 overflow-x-auto" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <div className="flex-1 min-w-[200px]">
            <Search placeholder="Search partners..." allowClear value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ borderRadius: '8px' }} />
          </div>
          <Select placeholder="Type" value={typeFilter} onChange={setTypeFilter} allowClear className="w-full sm:w-[120px]">
            <Option value="tpa">TPA</Option>
            <Option value="insurance">Insurance</Option>
            <Option value="government">Government</Option>
          </Select>
          <Select placeholder="Status" value={statusFilter} onChange={setStatusFilter} allowClear className="w-full sm:w-[120px]">
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="suspended">Suspended</Option>
          </Select>
          <div className="w-full sm:w-auto text-center" style={{ padding: '8px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', border: '1px solid #BFDBFE' }}>
            <span className="text-sm font-medium" style={{ color: '#1D4ED8' }}>{filteredPartners.length} partners</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <Table
            dataSource={filteredPartners}
            columns={columns}
            rowKey="id"
            pagination={{ defaultPageSize: 10, showSizeChanger: false, showTotal: (total) => `${total} partners` }}
          />
        </div>
      </div>

      {/* Partner Detail Drawer */}
      <Drawer
        title="Partner Details"
        placement="right"
        width={720}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedPartner(null);
        }}
      >
        {selectedPartner && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar size={80} icon={<BankOutlined />} style={{ backgroundColor: selectedPartner.type === 'tpa' ? '#10B981' : '#3B82F6' }} />
              <Title level={4} style={{ marginTop: '16px', marginBottom: '4px' }}>{selectedPartner.name}</Title>
              <Tag color="blue">{selectedPartner.code}</Tag>
            </div>

            <Descriptions column={1} bordered>
              <Descriptions.Item label="Type">
                <Tag color={selectedPartner.type === 'tpa' ? 'green' : 'blue'}>
                  {selectedPartner.type.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Network Type">
                <Tag>{selectedPartner.networkType.toUpperCase()}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Contact Person">{selectedPartner.contactPerson}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedPartner.phoneNumber}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedPartner.email}</Descriptions.Item>
              <Descriptions.Item label="Panel Doctors">{selectedPartner.panelDoctors}</Descriptions.Item>
              <Descriptions.Item label="Panel Hospitals">{selectedPartner.panelHospitals}</Descriptions.Item>
              <Descriptions.Item label="Payment Terms">{selectedPartner.paymentTerms} days</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedPartner.status === 'active' ? 'success' : 'default'}>
                  {selectedPartner.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  );
}
