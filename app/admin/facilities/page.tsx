'use client';

import React from 'react';
import { Table, Button, Space, Progress, App } from 'antd';
import { BuildOutlined, EditOutlined, StopOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';
import { Alert } from 'antd';

export default function FacilitiesPage() {
  const { user, hasPermission } = useAuth();
  const { message } = App.useApp();
  const [searchText, setSearchText] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string | undefined>();

  // CRITICAL SECURITY: Restrict access to administrators only
  if (!hasPermission('admin:facilities:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '16px' }}>
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access facilities management. This area is restricted to administrators only."
          type="error"
          showIcon
          icon={<StopOutlined />}
          style={{ marginTop: '24px', borderRadius: '12px' }}
        />
      </div>
    );
  }

  const facilities = [
    { id: 1, name: 'Main Building', type: 'Inpatient', floors: 4, rooms: 80, status: 'operational', condition: 'good', lastInspection: '2024-01-15' },
    { id: 2, name: 'Outpatient Center', type: 'Outpatient', floors: 2, rooms: 25, status: 'operational', condition: 'excellent', lastInspection: '2024-01-20' },
    { id: 3, name: 'Emergency Wing', type: 'Emergency', floors: 1, rooms: 15, status: 'operational', condition: 'good', lastInspection: '2024-02-01' },
    { id: 4, name: 'Diagnostic Center', type: 'Diagnostic', floors: 2, rooms: 20, status: 'operational', condition: 'excellent', lastInspection: '2024-01-25' },
    { id: 5, name: 'Old Ward Block', type: 'Inpatient', floors: 3, rooms: 45, status: 'maintenance', condition: 'fair', lastInspection: '2024-01-10' },
  ];

  const equipment = [
    { id: 1, name: 'CT Scanner', location: 'Diagnostic Center', status: 'operational', uptime: 98, lastService: '2024-01-20' },
    { id: 2, name: 'MRI Machine', location: 'Diagnostic Center', status: 'operational', uptime: 95, lastService: '2024-01-25' },
    { id: 3, name: 'X-Ray Unit', location: 'Radiology', status: 'maintenance', uptime: 85, lastService: '2023-12-15' },
    { id: 4, name: 'Ultrasound', location: 'OB-GYN', status: 'operational', uptime: 99, lastService: '2024-01-28' },
    { id: 5, name: 'Ventilator 1', location: 'ICU', status: 'operational', uptime: 100, lastService: '2024-02-01' },
  ];

  // Filter facilities
  const filteredFacilities = facilities.filter((facility) => {
    const matchesSearch =
      facility.name.toLowerCase().includes(searchText.toLowerCase()) ||
      facility.type.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter ? facility.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const facilityColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Facility Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <StatusTag status={type} type="appointment" />
    },
    { title: 'Floors', dataIndex: 'floors', key: 'floors' },
    { title: 'Rooms', dataIndex: 'rooms', key: 'rooms' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="patient" showIcon />
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      key: 'condition',
      render: (condition: string) => <StatusTag status={condition} type="patient" showIcon />
    },
    { title: 'Last Inspection', dataIndex: 'lastInspection', key: 'lastInspection' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>Edit</Button>
          <Button type="link" size="small">Schedule Maintenance</Button>
        </Space>
      ),
    },
  ];

  const equipmentColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Equipment Name', dataIndex: 'name', key: 'name' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="patient" showIcon />
    },
    {
      title: 'Uptime',
      dataIndex: 'uptime',
      key: 'uptime',
      render: (uptime: number) => (
        <Progress
          percent={uptime}
          size="small"
          strokeColor={uptime >= 95 ? '#10B981' : uptime >= 85 ? '#F59E0B' : '#EF4444'}
        />
      ),
    },
    { title: 'Last Service', dataIndex: 'lastService', key: 'lastService' },
  ];

  const avgUptime = Math.round(equipment.reduce((sum, eq) => sum + eq.uptime, 0) / equipment.length);

  return (
    <PageShell
      title="Facilities Management"
      subtitle="Manage hospital buildings, facilities, and medical equipment"
      action={
        <GradientButton icon={<PlusOutlined />} className="w-full sm:w-auto">
          Add Facility
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Total Facilities"
          value={facilities.length}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Operational"
          value={facilities.filter(f => f.status === 'operational').length}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="Equipment"
          value={equipment.length}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={2}
        />
        <StatCard
          label="Avg Uptime"
          value={avgUptime}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={3}
          suffix="%"
        />
      </div>

      {/* Buildings & Facilities Section */}
      <div className="p-4 sm:p-6 overflow-x-auto" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <BuildOutlined style={{ color: '#6366F1', fontSize: '20px' }} />
            <h2 className="text-lg font-semibold text-gray-900">Buildings & Facilities</h2>
          </div>
        </div>

        <SearchFilterBar
          searchPlaceholder="Search facilities by name or type..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { label: 'All Status', value: '' },
                { label: 'Operational', value: 'operational' },
                { label: 'Under Maintenance', value: 'maintenance' },
              ],
              onChange: (value) => setStatusFilter(value ? String(value) : undefined),
            },
          ]}
          resultCount={filteredFacilities.length}
          totalCount={facilities.length}
          filterLabel="facilities"
        />

        <ModernTable
          dataSource={filteredFacilities}
          columns={facilityColumns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </div>

      {/* Medical Equipment Section */}
      <div className="p-4 sm:p-6 overflow-x-auto" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <BuildOutlined style={{ color: '#8B5CF6', fontSize: '20px' }} />
            <h2 className="text-lg font-semibold text-gray-900">Medical Equipment</h2>
          </div>
          <GradientButton variant="secondary" icon={<PlusOutlined />} className="w-full sm:w-auto">
            Add Equipment
          </GradientButton>
        </div>

        <ModernTable
          dataSource={equipment}
          columns={equipmentColumns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </div>
    </PageShell>
  );
}
