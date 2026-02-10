'use client';

import React, { useState, useMemo } from 'react';
import { Button, Alert } from 'antd';
import { UploadOutlined, EyeOutlined, ExperimentOutlined } from '@ant-design/icons';
import { formatDate, formatDateTime } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterLabResultsByUser } from '@/lib/dataFilters';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';

interface LabResult {
  id: string;
  orderNumber: string;
  patientName: string;
  test: string;
  sampleId: string;
  collectedDate: Date;
  collectedBy: string;
  status: 'pending' | 'in_progress' | 'completed' | 'approved';
  resultDate?: Date;
  approvedBy?: string;
  patientId?: string;
}

const mockResults: LabResult[] = [
  {
    id: 'res1',
    orderNumber: 'LAB-2024-001',
    patientName: 'Chukwuemeka Okonkwo',
    test: 'Complete Blood Count',
    sampleId: 'SMP-001',
    collectedDate: new Date('2024-02-05T08:00'),
    collectedBy: 'Lab Tech 1',
    status: 'completed',
    resultDate: new Date('2024-02-05T10:30'),
    approvedBy: 'Dr. Pathologist',
    patientId: 'p101',
  },
  {
    id: 'res2',
    orderNumber: 'LAB-2024-002',
    patientName: 'Adanna Okafor',
    test: 'Lipid Profile',
    sampleId: 'SMP-002',
    collectedDate: new Date('2024-02-05T09:00'),
    collectedBy: 'Lab Tech 2',
    status: 'in_progress',
    patientId: 'p102',
  },
  {
    id: 'res3',
    orderNumber: 'LAB-2024-003',
    patientName: 'Tobi Okafor',
    test: 'Malaria Parasite',
    sampleId: 'SMP-003',
    collectedDate: new Date('2024-02-04T14:00'),
    collectedBy: 'Lab Tech 1',
    status: 'pending',
    patientId: 'p103',
  },
];

export default function ResultsPage() {
  const { user, hasPermission } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const roleFilteredResults = useMemo(() => {
    return filterLabResultsByUser(user, mockResults);
  }, [user]);
  const filteredResults = useMemo(() => {
    return roleFilteredResults.filter((result: any) => {
      const matchesSearch =
        result.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
        result.orderNumber.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus = !statusFilter || result.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [roleFilteredResults, searchText, statusFilter]);

  // CRITICAL SECURITY: Restrict access to laboratory staff and doctors
  if (!hasPermission('laboratory:results:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '24px' }}>
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access lab results. This area is restricted to laboratory staff and authorized clinical personnel."
          type="error"
          showIcon
          style={{ marginTop: '24px', borderRadius: '12px' }}
        />
      </div>
    );
  }

  // CRITICAL SECURITY: Filter lab results by user role


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
    { title: 'Test', dataIndex: 'test', key: 'test' },
    { title: 'Sample ID', dataIndex: 'sampleId', key: 'sampleId' },
    { title: 'Collected', dataIndex: 'collectedDate', key: 'collected', render: (d: Date) => formatDateTime(d) },
    { title: 'Collected By', dataIndex: 'collectedBy', key: 'collectedBy' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="lab" showIcon />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <GradientButton variant="secondary" size="small" icon={<EyeOutlined />}>
          View
        </GradientButton>
      ),
    },
  ];

  const stats = {
    pending: mockResults.filter((r: any) => r.status === 'pending').length,
    inProgress: mockResults.filter((r: any) => r.status === 'in_progress').length,
    completed: mockResults.filter((r: any) => r.status === 'completed').length,
    approved: mockResults.filter((r: any) => r.status === 'approved').length,
  };

  return (
    <PageShell
      title="Lab Results Entry"
      subtitle="Enter and manage laboratory test results"
      action={
        <GradientButton icon={<UploadOutlined />}>
          Enter Results
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Pending"
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
          label="Completed"
          value={stats.completed}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={2}
        />
        <StatCard
          label="Approved"
          value={stats.approved}
          color="#059669"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={3}
        />
      </div>

      {/* Lab Results Section */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
        <div className="flex items-center gap-2 mb-4">
          <ExperimentOutlined style={{ color: '#6366F1', fontSize: '20px' }} />
          <h2 className="text-lg font-semibold text-gray-900">Lab Results</h2>
        </div>

        <SearchFilterBar
          searchPlaceholder="Search results by patient or order number..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { label: 'All Status', value: '' },
                { label: 'Pending', value: 'pending' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Completed', value: 'completed' },
                { label: 'Approved', value: 'approved' },
              ],
              onChange: (value) => setStatusFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredResults.length}
          totalCount={roleFilteredResults.length}
          filterLabel="results"
        />

        <ModernTable
          dataSource={filteredResults}
          columns={columns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </div>
    </PageShell>
  );
}
