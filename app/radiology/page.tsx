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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 ">
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access radiology services. This area is restricted to radiology staff and authorized clinical personnel."
          type="error"
          showIcon
          className=" -xl"
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
        <span className=".5  -md  font-medium bg-blue-100 ">
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
        <span className=".5  -md  font-medium bg-purple-100 text-purple-700 uppercase">
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
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4  sm: ">
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
      <div className="bg-white -xl  border border-gray-200">
        <div className="   ">
          <ScanOutlined className="text-indigo-500 text-xl" />
          <h2 className=" font-semibold ">Imaging Orders</h2>
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
