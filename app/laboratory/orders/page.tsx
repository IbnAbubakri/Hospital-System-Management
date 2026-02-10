'use client';

import React, { useMemo } from 'react';
import { Form, Select, Alert } from 'antd';
import { PlusOutlined, ExperimentOutlined, WarningOutlined } from '@ant-design/icons';
import { mockPatients, mockDoctors, mockLabOrders } from '@/lib/mockData';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser } from '@/lib/dataFilters';
import { getDepartmentColors } from '@/lib/departmentColors';
import { PageShell, StatCard, ModernTable, GradientButton, StatusTag } from '@/components/design-system';

const { Option } = Select;

export default function LabOrdersPage() {
  const { user, hasPermission, getUserFullName } = useAuth();
  const [form] = Form.useForm();
  const accessiblePatients = useMemo(() => {
    if (!user) return [];
    return filterPatientsByUser(user);
  }, [user]);

  // Get accessible doctors (all for admin, only logged-in doctor for doctors)
  const accessibleDoctors = useMemo(() => {
    if (!user) return [];
    if (user.role === 'Administrator') {
      return mockDoctors;
    }
    // Doctors can only select themselves
    return mockDoctors.filter(d => d.id === user.id);
  }, [user]);

  // CRITICAL SECURITY: Filter lab orders by user role
  const roleFilteredOrders = useMemo(() => {
    if (!user) return [];
    if (user.role === 'Administrator') {
      return mockLabOrders;
    }
    return mockLabOrders.filter(order => order.doctorId === user.id);
  }, [user]);

  // Get department colors
  const departmentColors = user?.department ? getDepartmentColors(user.department) : null;

  // Generate demo orders using real patient data from mockData
  const orders = useMemo(() => {
    // Return only orders for accessible patients
    return roleFilteredOrders
      .filter((order: any) => accessiblePatients.some((p: any) => p.id === order.patientId))
      .map((order: any) => ({
        key: order.id,
        id: order.id,
        orderNumber: order.orderNumber,
        patient: order.patientName,
        patientId: order.patientId,
        tests: order.tests.map(t => t.testName).join(', '),
        priority: order.priority,
        status: order.status,
        orderedDate: order.orderDate,
        doctorId: order.doctorId,
        doctorName: order.doctorName,
      }));
  }, [accessiblePatients, roleFilteredOrders]);

  // CRITICAL SECURITY: Restrict access to lab orders
  if (!hasPermission('laboratory:orders:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '24px' }}>
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access lab orders. This area is restricted to clinical staff."
          type="error"
          showIcon
          style={{ marginTop: '24px', borderRadius: '12px' }}
        />
      </div>
    );
  }

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
    { title: 'Tests', dataIndex: 'tests', key: 'tests' },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const color = priority === 'urgent' || priority === 'emergency' ? '#EF4444' : '#64748B';
        const bg = priority === 'urgent' || priority === 'emergency' ? '#FEE2E2' : '#F1F5F9';
        return (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 500,
              background: bg,
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
          View
        </GradientButton>
      ),
    },
  ];

  const stats = {
    total: orders.length,
    pending: orders.filter((o: any) => o.status === 'pending').length,
    inProgress: orders.filter((o: any) => o.status === 'in_progress' || o.status === 'sample_collected').length,
    completed: orders.filter((o: any) => o.status === 'completed').length,
  };

  return (
    <PageShell
      title="Lab Test Orders"
      subtitle={
        user?.role === 'Doctor'
          ? `Showing orders you created (${orders.length} orders)`
          : 'Manage laboratory test orders'
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Total Orders"
          value={stats.total}
          color="#6366F1"
          bg="linear-gradient(135deg, #E0E7FF 0%, rgba(255,255,255,0.8) 100%)"
          border="#A5B4FC"
          index={0}
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={1}
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={2}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={3}
        />
      </div>

      {/* New Lab Order Form */}
      {hasPermission('laboratory:orders:create') && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
          <div className="flex items-center gap-2 mb-4">
            <ExperimentOutlined style={{ color: '#6366F1', fontSize: '20px' }} />
            <h2 className="text-lg font-semibold text-gray-900">New Lab Order</h2>
          </div>

          <Form layout="vertical">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                <Select placeholder="Select patient" showSearch size="large">
                  {accessiblePatients.map((p: any) => (
                    <Option key={p.id} value={p.id}>{p.firstName} {p.lastName}</Option>
                  ))}
                </Select>
                {accessiblePatients.length === 0 && user?.role === 'Doctor' && (
                  <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '8px' }}>
                    No patients assigned to you
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordering Doctor</label>
                <Select
                  placeholder="Select doctor"
                  disabled={user?.role === 'Doctor'}
                  size="large"
                >
                  {accessibleDoctors.map((d) => (
                    <Option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</Option>
                  ))}
                </Select>
                {user?.role === 'Doctor' && (
                  <div
                    style={{
                      marginTop: '8px',
                      padding: '8px 12px',
                      background: departmentColors?.bg || 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                      borderRadius: '6px',
                      border: `1px solid ${departmentColors?.border || '#BFDBFE'}`
                    }}
                  >
                    <p style={{ color: departmentColors?.text || '#1E40AF', fontSize: '12px', margin: 0 }}>
                      <WarningOutlined style={{ marginRight: '4px' }} />
                      Orders will be created under your name
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <Select size="large">
                  <Option value="routine">Routine</Option>
                  <Option value="urgent">Urgent</Option>
                  <Option value="emergency">Emergency</Option>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tests</label>
              <Select mode="multiple" placeholder="Select tests" size="large">
                <Option value="cbc">Complete Blood Count (CBC)</Option>
                <Option value="bmp">Basic Metabolic Panel (BMP)</Option>
                <Option value="lipid">Lipid Panel</Option>
                <Option value="thyroid">Thyroid Function</Option>
                <Option value="hba1c">HbA1c</Option>
                <Option value="urinalysis">Urinalysis</Option>
              </Select>
            </div>
            <div className="mt-4">
              <GradientButton icon={<PlusOutlined />} htmlType="submit">
                Submit Order
              </GradientButton>
            </div>
          </Form>
        </div>
      )}

      {/* Lab Orders Table */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Lab Orders ({orders.length})</h3>
        <ModernTable
          dataSource={orders}
          columns={columns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </div>
    </PageShell>
  );
}
