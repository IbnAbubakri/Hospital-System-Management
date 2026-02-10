'use client';

import React, { useState } from 'react';
import { Space, Alert } from 'antd';
import { ScanOutlined, ClockCircleOutlined, CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';
import { RADIOLOGY_STATUS } from '@/lib/constants/statuses';
import { useAuth } from '@/lib/contexts/AuthContext';

interface ImagingOrder {
  key: string;
  orderNumber: string;
  patient: string;
  procedure: string;
  modality: string;
  scheduled: string;
  radiologist: string;
  status: string;
}

export default function RadiologyPage() {
  const { hasPermission } = useAuth();
  const [modalityFilter, setModalityFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  // CRITICAL SECURITY: Restrict access to radiology staff
  if (!hasPermission('radiology:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '16px' }}>
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access radiology services. This area is restricted to radiology staff and authorized clinical personnel."
          type="error"
          showIcon
          style={{ marginTop: '24px', borderRadius: '12px' }}
        />
      </div>
    );
  }

  const imagingOrders: ImagingOrder[] = [
    {
      key: '1',
      orderNumber: 'RAD-2024-0089',
      patient: 'John Smith',
      procedure: 'Chest X-Ray',
      modality: 'xray',
      scheduled: '2024-02-02 14:00',
      radiologist: 'Dr. Sarah Miller',
      status: 'scheduled',
    },
    {
      key: '2',
      orderNumber: 'RAD-2024-0090',
      patient: 'Sarah Johnson',
      procedure: 'CT Abdomen',
      modality: 'ct',
      scheduled: '2024-02-02 15:30',
      radiologist: 'Dr. James Wilson',
      status: 'completed',
    },
    {
      key: '3',
      orderNumber: 'RAD-2024-0091',
      patient: 'Robert Williams',
      procedure: 'MRI Brain',
      modality: 'mri',
      scheduled: '2024-02-03 09:00',
      radiologist: 'Dr. Sarah Miller',
      status: 'scheduled',
    },
  ];

  const columns = [
    {
      title: 'Order #',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (num: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: '#DBEAFE',
            color: '#1E40AF',
          }}
        >
          {num}
        </span>
      ),
    },
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'Procedure', dataIndex: 'procedure', key: 'procedure' },
    {
      title: 'Modality',
      dataIndex: 'modality',
      key: 'modality',
      render: (m: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: '#F3E8FF',
            color: '#7C3AED',
            textTransform: 'uppercase',
          }}
        >
          {m}
        </span>
      ),
    },
    { title: 'Scheduled', dataIndex: 'scheduled', key: 'scheduled' },
    { title: 'Radiologist', dataIndex: 'radiologist', key: 'radiologist' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="radiology" showIcon />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <GradientButton variant="secondary" size="small">
          View Details
        </GradientButton>
      ),
    },
  ];

  const stats = {
    pending: 12,
    inProgress: 5,
    completedToday: 18,
    pendingReports: 8,
  };

  return (
    <PageShell
      title="Radiology Dashboard"
      subtitle="Manage imaging orders, scans, and radiology reports"
      action={
        <GradientButton icon={<PlusOutlined />}>
          New Order
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Pending Scans"
          value={stats.pending}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={0}
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={1}
        />
        <StatCard
          label="Completed Today"
          value={stats.completedToday}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={2}
        />
        <StatCard
          label="Pending Reports"
          value={stats.pendingReports}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={3}
        />
      </div>

      {/* Imaging Orders Section */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
        <div className="flex items-center gap-2 mb-4">
          <ScanOutlined style={{ color: '#6366F1', fontSize: '20px' }} />
          <h2 className="text-lg font-semibold text-gray-900">Imaging Orders</h2>
        </div>

        <SearchFilterBar
          filters={[
            {
              key: 'modality',
              label: 'Modality',
              value: modalityFilter,
              options: [
                { label: 'All Modalities', value: '' },
                { label: 'X-Ray', value: 'xray' },
                { label: 'CT', value: 'ct' },
                { label: 'MRI', value: 'mri' },
                { label: 'Ultrasound', value: 'ultrasound' },
              ],
              onChange: (value) => setModalityFilter(value as string | undefined),
            },
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { label: 'All Status', value: '' },
                ...Object.entries(RADIOLOGY_STATUS).map(([key, value]) => ({
                  label: value.replace('_', ' '),
                  value: value,
                })),
              ],
              onChange: (value) => setStatusFilter(value as string | undefined),
            },
          ]}
          resultCount={imagingOrders.length}
          totalCount={imagingOrders.length}
          filterLabel="orders"
        />

        <ModernTable
          dataSource={imagingOrders}
          columns={columns}
          pagination={{ defaultPageSize: 10 }}
        />
      </div>
    </PageShell>
  );
}
