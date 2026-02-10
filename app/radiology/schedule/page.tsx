'use client';

import React, { useState } from 'react';
import { PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import { formatDate } from '@/lib/utils';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';

interface ImagingOrder {
  id: string;
  orderNumber: string;
  patientName: string;
  study: string;
  modality: 'X-Ray' | 'CT' | 'MRI' | 'Ultrasound';
  scheduledDate: Date;
  radiologist: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'reported';
}

const mockOrders: ImagingOrder[] = [
  {
    id: '1',
    orderNumber: 'RAD-2024-001',
    patientName: 'Chukwuemeka Okonkwo',
    study: 'Chest X-Ray PA View',
    modality: 'X-Ray',
    scheduledDate: new Date('2024-02-05T10:00'),
    radiologist: 'Dr. Radiologist 1',
    status: 'completed',
  },
  {
    id: '2',
    orderNumber: 'RAD-2024-002',
    patientName: 'Adanna Okafor',
    study: 'CT Scan Head',
    modality: 'CT',
    scheduledDate: new Date('2024-02-05T11:00'),
    radiologist: 'Dr. Radiologist 2',
    status: 'in_progress',
  },
  {
    id: '3',
    orderNumber: 'RAD-2024-003',
    patientName: 'Tobi Okafor',
    study: 'MRI Brain',
    modality: 'MRI',
    scheduledDate: new Date('2024-02-05T14:00'),
    radiologist: 'Dr. Radiologist 1',
    status: 'scheduled',
  },
  {
    id: '4',
    orderNumber: 'RAD-2024-004',
    patientName: 'Olufemi Adebayo',
    study: 'Abdominal Ultrasound',
    modality: 'Ultrasound',
    scheduledDate: new Date('2024-02-04T16:00'),
    radiologist: 'Dr. Radiologist 2',
    status: 'reported',
  },
  {
    id: '5',
    orderNumber: 'RAD-2024-005',
    patientName: 'Ngozi Eze',
    study: 'X-Ray Spine',
    modality: 'X-Ray',
    scheduledDate: new Date('2024-02-06T09:00'),
    radiologist: 'Dr. Radiologist 3',
    status: 'scheduled',
  },
];

export default function RadiologySchedulePage() {
  const [searchText, setSearchText] = useState('');
  const [modalityFilter, setModalityFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchText.toLowerCase());
    const matchesModality = !modalityFilter || order.modality === modalityFilter;
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesModality && matchesStatus;
  });

  const columns = [
    {
      title: 'Order Number',
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
    { title: 'Patient', dataIndex: 'patientName', key: 'patient' },
    {
      title: 'Study',
      dataIndex: 'study',
      key: 'study',
      ellipsis: true,
      render: (study: string) => <span style={{ fontSize: '13px' }}>{study}</span>,
    },
    {
      title: 'Modality',
      dataIndex: 'modality',
      key: 'modality',
      render: (modality: string) => (
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
          {modality}
        </span>
      ),
    },
    {
      title: 'Scheduled Date',
      dataIndex: 'scheduledDate',
      key: 'date',
      render: (d: Date) => formatDate(d),
    },
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

  const scheduledCount = mockOrders.filter(o => o.status === 'scheduled').length;
  const inProgressCount = mockOrders.filter(o => o.status === 'in_progress').length;
  const completedCount = mockOrders.filter(o => o.status === 'completed').length;
  const reportedCount = mockOrders.filter(o => o.status === 'reported').length;

  return (
    <PageShell
      title="Scan Scheduling"
      subtitle="Radiology scan scheduling and management"
      action={
        <GradientButton icon={<PlusOutlined />}>
          New Order
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Scheduled"
          value={scheduledCount}
          color="#6B7280"
          bg="linear-gradient(135deg, #F3F4F6 0%, rgba(255,255,255,0.8) 100%)"
          border="#D1D5DB"
          index={0}
        />
        <StatCard
          label="In Progress"
          value={inProgressCount}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={1}
        />
        <StatCard
          label="Completed Today"
          value={completedCount}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={2}
        />
        <StatCard
          label="Reports Pending"
          value={reportedCount}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={3}
        />
      </div>

      {/* Imaging Orders Section */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
        <div className="flex items-center gap-2 mb-4">
          <CalendarOutlined style={{ color: '#6366F1', fontSize: '20px' }} />
          <h2 className="text-lg font-semibold text-gray-900">Imaging Orders</h2>
        </div>

        <SearchFilterBar
          searchPlaceholder="Search orders by patient name or order number..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'modality',
              label: 'Modality',
              value: modalityFilter,
              options: [
                { label: 'All Modalities', value: '' },
                { label: 'X-Ray', value: 'X-Ray' },
                { label: 'CT', value: 'CT' },
                { label: 'MRI', value: 'MRI' },
                { label: 'Ultrasound', value: 'Ultrasound' },
              ],
              onChange: (value) => setModalityFilter(value as string | undefined),
            },
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { label: 'All Status', value: '' },
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Completed', value: 'completed' },
                { label: 'Reported', value: 'reported' },
              ],
              onChange: (value) => setStatusFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredOrders.length}
          totalCount={mockOrders.length}
          filterLabel="orders"
        />

        <ModernTable
          dataSource={filteredOrders}
          columns={columns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </div>
    </PageShell>
  );
}
