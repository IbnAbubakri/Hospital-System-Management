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
} from 'antd';
import {
  PlusOutlined,
  UserOutlined,
  EyeOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { mockPatients } from '@/lib/mockData';
import { Patient } from '@/types';
import { calculateAge, formatDate } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser } from '@/lib/dataFilters';
import { getDepartmentColors } from '@/lib/departmentColors';
import { ResponsiveContainer, ResponsiveGrid } from '@/components/design-system/ResponsiveContainer';

const { Search } = Input;
const { Option } = Select;
const { Text, Title } = Typography;

export default function PatientsPage() {
  const router = useRouter();
  const { user, getUserFullName } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Get patients accessible to logged-in user
  const accessiblePatients = useMemo(() => {
    if (!user) return [];
    return filterPatientsByUser(user);
  }, [user]);

  // Count-up animation for stats
  const [animatedStats, setAnimatedStats] = useState({ total: 0, active: 0, newThisMonth: 0, withAllergies: 0 });

  // Calculate statistics based on accessible patients
  const stats = useMemo(() => {
    const patients = accessiblePatients;
    const total = patients.length;
    const active = patients.filter((p: any) => p.status === 'active').length;
    const newThisMonth = patients.filter((p: any) => {
      const registeredDate = new Date(p.registrationDate);
      const now = new Date();
      return (
        registeredDate.getMonth() === now.getMonth() &&
        registeredDate.getFullYear() === now.getFullYear()
      );
    }).length;
    const withAllergies = patients.filter((p: any) => p.allergies.length > 0).length;

    return { total, active, newThisMonth, withAllergies };
  }, [accessiblePatients]);

  // Animate stats on mount
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
      const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out

      setAnimatedStats({
        total: Math.round(currentValues.total + (targets.total - currentValues.total) * easeProgress),
        active: Math.round(currentValues.active + (targets.active - currentValues.active) * easeProgress),
        newThisMonth: Math.round(currentValues.newThisMonth + (targets.newThisMonth - currentValues.newThisMonth) * easeProgress),
        withAllergies: Math.round(currentValues.withAllergies + (targets.withAllergies - currentValues.withAllergies) * easeProgress),
      });

      if (step >= steps) {
        clearInterval(interval);
        setAnimatedStats(targets);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  // Filter patients
  const filteredPatients = useMemo(() => {
    return accessiblePatients.filter((patient) => {
      const matchesSearch =
        patient.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
        patient.mrn.toLowerCase().includes(searchText.toLowerCase()) ||
        patient.contactNumber.includes(searchText);
      const matchesStatus = !statusFilter || patient.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter, accessiblePatients]);

  // Table columns
  const columns = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_: any, record: Patient) => (
        <div className="patient-name-cell">
          <div className="font-medium text-gray-900">{record.firstName} {record.lastName}</div>
          <div className="text-xs text-gray-500">{record.mrn}</div>
        </div>
      ),
      sorter: (a: Patient, b: Patient) =>
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
    },
    {
      title: 'Age/Sex',
      key: 'ageSex',
      render: (_: any, record: Patient) => (
        <span className="text-sm">
          {calculateAge(record.dateOfBirth)} / {record.gender.toUpperCase()}
        </span>
      ),
      width: 100,
    },
    {
      title: 'Contact',
      dataIndex: 'contactNumber',
      key: 'contactNumber',
      render: (phone: string) => <span className="text-sm">{phone}</span>,
      width: 140,
    },
    {
      title: 'Last Visit',
      key: 'lastVisit',
      render: (_: any, record: Patient) => (
        <span className="text-sm text-gray-600">
          {record.lastVisitDate ? formatDate(record.lastVisitDate) : '—'}
        </span>
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
          deceased: { color: '#DC2626', bg: '#FEE2E2' },
          transferred: { color: '#D97706', bg: '#FEF3C7' },
        };
        const { color, bg } = config[status] || config.inactive;
        return (
          <Tag
            className="status-tag"
            style={{
              backgroundColor: bg,
              color,
              border: 'none',
              fontWeight: 500,
              fontSize: '13px',
              padding: '3px 10px',
              borderRadius: '6px',
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
        );
      },
      width: 110,
    },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: Patient) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => viewPatient(record)}
          className="view-btn"
          style={{ padding: '4px 8px' }}
        />
      ),
      width: 50,
    },
  ];

  const viewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setDrawerVisible(true);
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; text: string }> = {
      active: { color: '#10B981', bg: '#D1FAE5', text: 'Active' },
      inactive: { color: '#6B7280', bg: '#F3F4F6', text: 'Inactive' },
      deceased: { color: '#EF4444', bg: '#FEE2E2', text: 'Deceased' },
      transferred: { color: '#F59E0B', bg: '#FEF3C7', text: 'Transferred' },
    };
    return configs[status] || configs.inactive;
  };

  // Get department colors for styling
  const departmentColors = user?.department ? getDepartmentColors(user.department) : null;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)' }}>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .page-content {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .stat-card {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--card-color) 0%, rgba(255,255,255,0.5) 50%, var(--card-color) 100%);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }

        .stat-card:nth-child(1) { animation-delay: 0.1s; --card-color: #3B82F6; }
        .stat-card:nth-child(2) { animation-delay: 0.15s; --card-color: #10B981; }
        .stat-card:nth-child(3) { animation-delay: 0.2s; --card-color: #F59E0B; }
        .stat-card:nth-child(4) { animation-delay: 0.25s; --card-color: #EF4444; }

        .stat-card:hover {
          transform: translateY(-4px);
          transition: transform 0.3s ease;
          box-shadow: 0 12px 24px -8px var(--card-color);
        }

        .stat-number {
          transition: transform 0.3s ease;
        }

        .stat-card:hover .stat-number {
          transform: scale(1.1);
        }

        .ant-table-tbody > tr {
          transition: all 0.2s ease;
          animation: fadeIn 0.3s ease-out forwards;
        }

        .ant-table-tbody > tr:nth-child(1) { animation-delay: 0.05s; }
        .ant-table-tbody > tr:nth-child(2) { animation-delay: 0.08s; }
        .ant-table-tbody > tr:nth-child(3) { animation-delay: 0.11s; }
        .ant-table-tbody > tr:nth-child(4) { animation-delay: 0.14s; }
        .ant-table-tbody > tr:nth-child(5) { animation-delay: 0.17s; }

        .ant-table-tbody > tr:hover > td {
          background: linear-gradient(90deg, #EFF6FF 0%, #F0F9FF 100%) !important;
          transform: scale(1.005);
        }

        .patient-name-cell {
          transition: color 0.2s ease;
          position: relative;
        }

        .ant-table-tbody > tr:hover .patient-name-cell {
          color: #2563EB;
        }

        .status-tag {
          transition: all 0.2s ease;
        }

        .status-tag:hover {
          transform: scale(1.05);
          filter: brightness(0.95);
        }

        .view-btn {
          transition: all 0.2s ease;
        }

        .view-btn:hover {
          background: #DBEAFE !important;
          color: #1D4ED8 !important;
          transform: scale(1.15) rotate(15deg);
        }

        .ant-btn-primary {
          transition: all 0.3s ease !important;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%) !important;
          border: none !important;
        }

        .ant-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4) !important;
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%) !important;
        }

        .ant-btn-primary:active {
          transform: translateY(0);
        }

        .drawer-content {
          animation: slideInRight 0.3s ease-out;
        }

        .drawer-section {
          animation: fadeInUp 0.4s ease-out forwards;
          opacity: 0;
        }

        .drawer-section:nth-child(1) { animation-delay: 0.1s; }
        .drawer-section:nth-child(2) { animation-delay: 0.15s; }
        .drawer-section:nth-child(3) { animation-delay: 0.2s; }
        .drawer-section:nth-child(4) { animation-delay: 0.25s; }

        .ant-table-thead > tr > th {
          background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%) !important;
          border-bottom: 2px solid #E2E8F0 !important;
          font-weight: 600;
          color: #1E293B;
          padding: 14px 16px !important;
          font-size: 13px;
        }
        .ant-table-tbody > tr > td {
          padding: 12px 16px !important;
          border-bottom: 1px solid #F1F5F9 !important;
          font-size: 14px;
        }
        .ant-pagination-item {
          border-radius: 8px !important;
          border: 1px solid #E2E8F0 !important;
          transition: all 0.2s ease !important;
        }
        .ant-pagination-item:hover {
          border-color: #3B82F6 !important;
          color: #3B82F6 !important;
          background: #EFF6FF !important;
        }
        .ant-pagination-item-active {
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%) !important;
          border-color: #3B82F6 !important;
        }
        .ant-select-selector {
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
          border: 1px solid #E2E8F0 !important;
        }
        .ant-select:hover .ant-select-selector {
          border-color: #3B82F6 !important;
        }
        .ant-select-focused .ant-select-selector {
          border-color: #3B82F6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        .ant-input {
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
          border: 1px solid #E2E8F0 !important;
        }
        .ant-input:hover {
          border-color: #3B82F6 !important;
        }
        .ant-input:focus {
          border-color: #3B82F6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
      `}</style>

      {/* Header Section */}
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          borderBottom: '1px solid #E2E8F0',
          position: 'relative',
          overflow: 'hidden'
        }}>
        {/* Decorative background elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          left: '100px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        <div className="page-content" style={{ animationDelay: '0s', position: 'relative', zIndex: 1 }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                <div style={{
                  width: '4px',
                  height: '24px',
                  background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)',
                  borderRadius: '2px'
                }} />
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    Patients
                  </h1>
                  {user?.role === 'Doctor' && (
                    <Text className="text-xs sm:text-sm" style={{ color: '#64748B', marginLeft: '8px' }}>
                      ({getUserFullName()}'s Patients)
                    </Text>
                  )}
                </div>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm" style={{ marginLeft: '7px' }}>
                {user?.role === 'Administrator'
                  ? 'Manage all patient records and information'
                  : `View and manage your ${accessiblePatients.length} assigned patient${accessiblePatients.length !== 1 ? 's' : ''}`
                }
              </p>
              {user?.role === 'Doctor' && (
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  background: departmentColors?.bg || 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                  borderRadius: '8px',
                  border: `1px solid ${departmentColors?.border || '#BFDBFE'}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <WarningOutlined style={{ color: departmentColors?.text || '#1D4ED8', fontSize: '14px' }} />
                  <Text className="text-xs sm:text-sm" style={{ color: departmentColors?.text || '#1E40AF', fontWeight: 500 }}>
                    You can only view patients assigned to you in {user.department}
                  </Text>
                </div>
              )}
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push('/patients/new')}
              className="w-full sm:w-auto"
              style={{
                height: '42px',
                borderRadius: '10px',
                fontWeight: 600,
                padding: '0 20px',
              }}
            >
              Add Patient
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {[
              { label: 'Total Patients', value: animatedStats.total, color: '#3B82F6', bg: '#EFF6FF', border: '#DBEAFE' },
              { label: 'Active', value: animatedStats.active, color: '#10B981', bg: '#D1FAE5', border: '#A7F3D0' },
              { label: 'New This Month', value: animatedStats.newThisMonth, color: '#F59E0B', bg: '#FEF3C7', border: '#FDE68A' },
              { label: 'With Allergies', value: animatedStats.withAllergies, color: '#EF4444', bg: '#FEE2E2', border: '#FECACA' },
            ].map((stat, index) => (
              <div
                key={index}
                className="stat-card"
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${stat.bg} 0%, rgba(255,255,255,0.8) 100%)`,
                  border: `1px solid ${stat.border}`,
                  cursor: 'default',
                }}
              >
                <div className="text-sm font-medium" style={{ color: '#64748B', marginBottom: '6px' }}>
                  {stat.label}
                </div>
                <div className="stat-number" style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: stat.color,
                  lineHeight: 1,
                }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-6 page-content" style={{ animationDelay: '0.1s' }}>
        {/* Search and Filter Bar */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 p-4"
          style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className="w-full sm:flex-1">
            <Search
              placeholder="Search patients..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ borderRadius: '8px' }}
            />
          </div>
          <Select
            placeholder="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            className="w-full sm:w-auto"
            style={{ width: undefined }}
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="transferred">Transferred</Option>
          </Select>
          <div
            className="w-full sm:w-auto flex items-center justify-center"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
              border: '1px solid #BFDBFE',
            }}
          >
            <span className="text-sm font-medium" style={{ color: '#1D4ED8' }}>
              {filteredPatients.length} patients
            </span>
          </div>
        </div>

        {/* Table */}
        <div
          className="overflow-x-auto"
          style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Table
            dataSource={filteredPatients}
            columns={columns}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={{
              defaultPageSize: 20,
              showSizeChanger: false,
              showTotal: (total) => `${total} patients`,
              pageSizeOptions: ['10', '20', '50'],
            }}
            rowClassName={(record) =>
              record.id === selectedPatient?.id ? 'bg-blue-50' : ''
            }
          />
        </div>
      </div>

      {/* Patient Detail Drawer */}
      <Drawer
        title={null}
        placement="right"
        size="large"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        className="sm-drawer-large"
      >
        {selectedPatient && (
          <div className="drawer-content h-full flex flex-col">
            {/* Header */}
            <div
              className="px-4 py-4 sm:px-6 sm:py-6"
              style={{
                borderBottom: '1px solid #E2E8F0',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
              }}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <Avatar
                  size={48}
                  icon={<UserOutlined />}
                  className="sm:hidden"
                  style={{
                    backgroundColor: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  }}
                />
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  className="hidden sm:block"
                  style={{
                    backgroundColor: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 truncate">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">MRN: {selectedPatient.mrn}</p>
                  <Tag
                    style={{
                      backgroundColor: getStatusConfig(selectedPatient.status).bg,
                      color: getStatusConfig(selectedPatient.status).color,
                      border: 'none',
                      fontWeight: 500,
                      borderRadius: '6px',
                    }}
                  >
                    {getStatusConfig(selectedPatient.status).text}
                  </Tag>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
              {/* Quick Info */}
              <div
                className="drawer-section grid grid-cols-3 gap-3 mb-6"
                style={{
                  padding: '12px 16px',
                  background: 'white',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                }}
              >
                {[
                  { label: 'Age', value: `${calculateAge(selectedPatient.dateOfBirth)}y`, color: '#3B82F6' },
                  { label: 'Gender', value: selectedPatient.gender.toUpperCase(), color: '#10B981' },
                  { label: 'Blood', value: selectedPatient.bloodGroup || 'N/A', color: '#F59E0B' },
                ].map((item, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: `${item.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px',
                      }}
                    >
                      <span style={{ fontSize: '14px', fontWeight: 600, color: item.color }}>
                        {item.value.charAt(0)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                    <div className="text-sm font-semibold text-gray-900">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Information Sections */}
              <div className="space-y-4">
                <div
                  className="drawer-section"
                  style={{
                    padding: '16px',
                    background: 'white',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span style={{
                      width: '4px',
                      height: '16px',
                      background: '#3B82F6',
                      borderRadius: '2px',
                    }} />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Date of Birth</span>
                      <span className="font-medium text-gray-900">{formatDate(selectedPatient.dateOfBirth)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Registration Date</span>
                      <span className="font-medium text-gray-900">{formatDate(selectedPatient.registeredDate)}</span>
                    </div>
                  </div>
                </div>

                <div
                  className="drawer-section"
                  style={{
                    padding: '16px',
                    background: 'white',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span style={{
                      width: '4px',
                      height: '16px',
                      background: '#10B981',
                      borderRadius: '2px',
                    }} />
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-900">{selectedPatient.contactNumber}</div>
                    {selectedPatient.email && (
                      <div className="text-sm text-gray-900">{selectedPatient.email}</div>
                    )}
                    <div className="text-sm text-gray-600">
                      {selectedPatient.address.street}
                      <br />
                      {selectedPatient.address.city}, {selectedPatient.address.state}
                    </div>
                  </div>
                </div>

                <div
                  className="drawer-section"
                  style={{
                    padding: '16px',
                    background: 'white',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span style={{
                      width: '4px',
                      height: '16px',
                      background: '#F59E0B',
                      borderRadius: '2px',
                    }} />
                    Emergency Contact
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Name</span>
                      <span className="font-medium text-gray-900">{selectedPatient.emergencyContact.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Relationship</span>
                      <span className="font-medium text-gray-900">{selectedPatient.emergencyContact.relationship}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Phone</span>
                      <span className="font-medium text-gray-900">{selectedPatient.emergencyContact.contactNumber}</span>
                    </div>
                  </div>
                </div>

                {selectedPatient.allergies.length > 0 && (
                  <div
                    className="drawer-section"
                    style={{
                      padding: '16px',
                      background: 'linear-gradient(135deg, #FEF2F2 0%, #FFFFFF 100%)',
                      borderRadius: '10px',
                      border: '1px solid #FECACA',
                    }}
                  >
                    <h3 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                      <span style={{
                        width: '4px',
                        height: '16px',
                        background: '#EF4444',
                        borderRadius: '2px',
                      }} />
                      Known Allergies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.allergies.map((allergy, index) => (
                        <Tag
                          key={index}
                          style={{
                            background: '#FEE2E2',
                            color: '#DC2626',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 10px',
                          }}
                        >
                          {allergy}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPatient.chronicConditions.length > 0 && (
                  <div
                    className="drawer-section"
                    style={{
                      padding: '16px',
                      background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)',
                      borderRadius: '10px',
                      border: '1px solid #FED7AA',
                    }}
                  >
                    <h3 className="text-sm font-semibold text-orange-700 mb-3 flex items-center gap-2">
                      <span style={{
                        width: '4px',
                        height: '16px',
                        background: '#F59E0B',
                        borderRadius: '2px',
                      }} />
                      Chronic Conditions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.chronicConditions.map((condition, index) => (
                        <Tag
                          key={index}
                          style={{
                            background: '#FEF3C7',
                            color: '#D97706',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 10px',
                          }}
                        >
                          {condition}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div
              className="flex flex-col sm:flex-row gap-3"
              style={{
                padding: '12px 16px sm:16px 24px',
                borderTop: '1px solid #E2E8F0',
                background: 'white',
              }}
            >
              <Button
                type="primary"
                onClick={() => router.push(`/patients/${selectedPatient.id}`)}
                style={{
                  flex: 1,
                  borderRadius: '8px',
                  fontWeight: 600,
                  height: '40px',
                }}
              >
                View Profile
              </Button>
              <Button
                onClick={() => router.push(`/patients/${selectedPatient.id}/edit`)}
                style={{
                  flex: 1,
                  borderRadius: '8px',
                  fontWeight: 600,
                  height: '40px',
                  border: '1px solid #D1D5DB',
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
