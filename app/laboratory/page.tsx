'use client';

import React, { useState, useMemo } from 'react';
import { Alert } from 'antd';
import { ExperimentOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/contexts/AuthContext';
import { mockLabOrders } from '@/lib/mockData';
import { filterLabOrdersByUser } from '@/lib/dataFilters';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';

export default function LaboratoryPage() {
  const { user, hasPermission } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const roleFilteredOrders = useMemo(() => {
    return filterLabOrdersByUser(user, mockLabOrders);
  }, [user]);
  const filteredOrders = useMemo(() => {
    return roleFilteredOrders.filter((order: any) => {
      const matchesSearch =
        order.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        order.tests.some((t: any) => t.testName.toLowerCase().includes(searchText.toLowerCase()));

      const matchesStatus = !statusFilter || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [roleFilteredOrders, searchText, statusFilter]);

  // CRITICAL SECURITY: Restrict access to laboratory module
  if (!hasPermission('laboratory:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '24px' }}>
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access the laboratory module. This area is restricted to laboratory staff and authorized personnel."
          type="error"
          showIcon
          style={{ marginTop: '24px', borderRadius: '12px' }}
        />
      </div>
    );
  }

  // CRITICAL SECURITY: Filter lab orders by user role


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
    { title: 'Patient', dataIndex: 'patientName', key: 'patientName' },
    {
      title: 'Tests',
      dataIndex: 'tests',
      key: 'tests',
      render: (tests: any[]) => (
        <div>
          {tests.map((t, i) => (
            <div key={i} className="text-sm">{t.testName}</div>
          ))}
        </div>
      ),
    },
    { title: 'Ordered By', dataIndex: 'doctorName', key: 'doctorName' },
    { title: 'Date', dataIndex: 'orderDate', key: 'orderDate', render: (d: string) => new Date(d).toLocaleDateString() },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const color = priority === 'urgent' || priority === 'emergency' ? '#EF4444' : '#64748B';
        return (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 500,
              background: priority === 'urgent' || priority === 'emergency' ? '#FEE2E2' : '#F1F5F9',
              color,
            }}
          >
            {priority.toUpperCase()}
          </span>
        );
      },
    },
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
        <GradientButton variant="secondary" size="small">
          View Details
        </GradientButton>
      ),
    },
  ];

  const stats = {
    pending: mockLabOrders.filter((o: any) => o.status === 'pending').length,
    inProgress: mockLabOrders.filter((o: any) => o.status === 'in_progress' || o.status === 'sample_collected').length,
    completed: mockLabOrders.filter((o: any) => o.status === 'completed').length,
    critical: mockLabOrders.filter((o: any) => o.priority === 'urgent' || o.priority === 'emergency').length,
  };

  return (
    <PageShell
      title="Laboratory Dashboard"
      subtitle="Manage laboratory tests, orders, and workflows"
      action={
        hasPermission('laboratory:orders:create') && (
          <GradientButton icon={<PlusOutlined />}>
            New Lab Order
          </GradientButton>
        )
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
          label="Completed Today"
          value={stats.completed}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={2}
        />
        <StatCard
          label="Critical"
          value={stats.critical}
          color="#EF4444"
          bg="linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCA5A5"
          index={3}
        />
      </div>

      {/* Lab Orders Section */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
        <div className="flex items-center gap-2 mb-4">
          <ExperimentOutlined style={{ color: '#6366F1', fontSize: '20px' }} />
          <h2 className="text-lg font-semibold text-gray-900">Recent Lab Orders</h2>
        </div>

        <SearchFilterBar
          searchPlaceholder="Search orders by patient, order number, or test..."
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
                { label: 'Sample Collected', value: 'sample_collected' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Completed', value: 'completed' },
                { label: 'Approved', value: 'approved' },
              ],
              onChange: (value) => setStatusFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredOrders.length}
          totalCount={roleFilteredOrders.length}
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
