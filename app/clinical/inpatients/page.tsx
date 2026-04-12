'use client';

import React, { useState } from 'react';
import { Space, Alert } from 'antd';
import { EyeOutlined, UserOutlined, MedicineBoxOutlined, HomeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';
import { mockInpatients } from '@/lib/mockData';
import { ADMISSION_STATUS } from '@/lib/constants/statuses';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function InpatientsPage() {
  const router = useRouter();
  const { hasPermission, user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  if (!hasPermission('view_patients') && user?.role !== 'Administrator') {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '16px' }}>
        <Alert
          title="Access Denied"
          description="You don't have permission to access this page. Please contact your administrator."
          type="error"
          showIcon
          style={{ marginTop: '24px', borderRadius: '12px' }}
        />
      </div>
    );
  }

  // CRITICAL SECURITY: Restrict access to clinical staff
  if (!hasPermission('clinical:inpatients:view')) {
    return (
      <div className="min-h-screen   sm: sm: lg: lg:" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)' }}>
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access inpatient management. This area is restricted to clinical staff."
          type="error"
          showIcon
          className=""
          style={{ borderRadius: '12px' }}
        />
      </div>
    );
  }

  const filteredInpatients = mockInpatients.filter((patient) => {
    const matchesSearch =
      patient.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.ward.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.bed.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Patient',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (name: string, record: any) => (
        <a
          onClick={() => router.push(`/patients/${record.patientId}`)}
          className=" font-medium hover:"
        >
          {name}
        </a>
      ),
    },
    {
      title: 'Ward/Bed',
      key: 'location',
      render: (_: unknown, record: any) => (
        <div>
          <div className="font-medium">{record.ward}</div>
          <div className=" ">Bed {record.bed}</div>
        </div>
      ),
    },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Admitting Doctor', dataIndex: 'admittingDoctor', key: 'admittingDoctor' },
    {
      title: 'Admission Date',
      dataIndex: 'admissionDate',
      key: 'admissionDate',
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Diagnosis',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      ellipsis: true,
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
      render: (_: unknown, record: any) => (
        <Space wrap>
          <GradientButton variant="secondary" size="small" icon={<EyeOutlined />} className="w-full sm:w-auto">
            View Details
          </GradientButton>
        </Space>
      ),
    },
  ];

  const bedData = [
    { ward: 'Ward A', total: 30, occupied: 25, available: 5 },
    { ward: 'Ward B', total: 25, occupied: 20, available: 5 },
    { ward: 'Ward C', total: 20, occupied: 15, available: 5 },
    { ward: 'ICU', total: 10, occupied: 8, available: 2 },
  ];

  const stats = {
    total: 68,
    available: 17,
    occupancy: 78,
    underObservation: 5,
  };

  return (
    <PageShell
      title="Inpatient Management"
      subtitle="Manage inpatient admissions, bed assignments, and ward status"
      action={
        <GradientButton icon={<UserOutlined />} onClick={() => router.push('/clinical/inpatients/admission')}>
          New Admission
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-4  ">
        <StatCard
          label="Total Inpatients"
          value={stats.total}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Available Beds"
          value={stats.available}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="Occupancy Rate"
          value={stats.occupancy}
          suffix="%"
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={2}
        />
        <StatCard
          label="Under Observation"
          value={stats.underObservation}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={3}
        />
      </div>

      {/* Bed Status by Ward */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB', marginBottom: '24px' }}>
        <div className="   ">
          <HomeOutlined style={{ color: '#6366F1', fontSize: '20px' }} />
          <h2 className=" font-semibold ">Bed Status by Ward</h2>
        </div>
        <div className="grid grid-cols-4 ">
          {bedData.map((ward) => (
            <div
              key={ward.ward}
              style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
              }}
            >
              <div className="text-center">
                <h3 className="font-semibold  ">{ward.ward}</h3>
                <div className=" justify-around text-center">
                  <div>
                    <div className="text-2xl font-bold ">{ward.available}</div>
                    <div className=" ">Available</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold ">{ward.occupied}</div>
                    <div className=" ">Occupied</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold ">{ward.total}</div>
                    <div className=" ">Total</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Inpatients */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
        <SearchFilterBar
          searchPlaceholder="Search by patient, ward, or bed..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { label: 'All Status', value: '' },
                ...Object.entries(ADMISSION_STATUS).map(([key, value]) => ({
                  label: value.replace('_', ' ').toUpperCase(),
                  value: value,
                })),
              ],
              onChange: (value) => setStatusFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredInpatients.length}
          totalCount={mockInpatients.length}
          filterLabel="inpatients"
        />

        <ModernTable
          dataSource={filteredInpatients}
          columns={columns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </div>
    </PageShell>
  );
}
