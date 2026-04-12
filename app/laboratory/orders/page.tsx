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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 ">
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access lab orders. This area is restricted to clinical staff."
          type="error"
          showIcon
          className=" -xl"
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
        <span className=".5  -md  font-medium bg-blue-100 ">
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
        const isCritical = priority === 'urgent' || priority === 'emergency';
        return (
          <span className={`.5  -md  font-medium ${isCritical ? 'bg-red-100 ' : 'bg-slate-100 text-slate-600'}`}>
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
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4  sm: ">
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
        <div className="bg-white -xl  border border-gray-200 ">
          <div className="   ">
            <ExperimentOutlined className="text-xl text-indigo-500" />
            <h2 className=" font-semibold ">New Lab Order</h2>
          </div>

          <Form layout="vertical">
            <div className="grid grid-cols-3 ">
              <div>
                <label className="block  font-medium  ">Patient</label>
                <Select placeholder="Select patient" showSearch size="large">
                  {accessiblePatients.map((p: any) => (
                    <Option key={p.id} value={p.id}>{p.firstName} {p.lastName}</Option>
                  ))}
                </Select>
                {accessiblePatients.length === 0 && user?.role === 'Doctor' && (
                  <p className=" color: '#EF4444' ">
                    No patients assigned to you
                  </p>
                )}
              </div>
              <div>
                <label className="block  font-medium  ">Ordering Doctor</label>
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
                  <div className="  bg-blue-50 -md border border-blue-200">
                    <p className="  m-0">
                      <WarningOutlined className="" />
                      Orders will be created under your name
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block  font-medium  ">Priority</label>
                <Select size="large">
                  <Option value="routine">Routine</Option>
                  <Option value="urgent">Urgent</Option>
                  <Option value="emergency">Emergency</Option>
                </Select>
              </div>
            </div>
            <div className="">
              <label className="block  font-medium  ">Tests</label>
              <Select mode="multiple" placeholder="Select tests" size="large">
                <Option value="cbc">Complete Blood Count (CBC)</Option>
                <Option value="bmp">Basic Metabolic Panel (BMP)</Option>
                <Option value="lipid">Lipid Panel</Option>
                <Option value="thyroid">Thyroid Function</Option>
                <Option value="hba1c">HbA1c</Option>
                <Option value="urinalysis">Urinalysis</Option>
              </Select>
            </div>
            <div className="">
              <GradientButton icon={<PlusOutlined />} htmlType="submit">
                Submit Order
              </GradientButton>
            </div>
          </Form>
        </div>
      )}

      {/* Lab Orders Table */}
      <div className="bg-white -xl  border border-gray-200">
        <h3 className="text-base font-semibold  ">Lab Orders ({orders.length})</h3>
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
