'use client';

import React, { useState } from 'react';
import { Modal, Form, Select, Input, Space } from 'antd';
import { PlusOutlined, FileTextOutlined, EyeOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';
import { useAuth } from '@/lib/contexts/AuthContext';

interface Order {
  id: string;
  patient: string;
  mrn: string;
  type: 'Laboratory' | 'Radiology' | 'Medication' | 'Procedure';
  test: string;
  orderedBy: string;
  date: string;
  time: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Routine' | 'Urgent' | 'STAT';
}

const mockOrders: Order[] = [
  {
    id: 'ORD-2024-0892',
    patient: 'Ngozi Eze',
    mrn: 'MRN-2024-0005',
    type: 'Laboratory',
    test: 'Complete Blood Count',
    orderedBy: 'Dr. Okonkwo',
    date: '2024-02-05',
    time: '10:30',
    status: 'Pending',
    priority: 'Routine',
  },
  {
    id: 'ORD-2024-0891',
    patient: 'Chukwuemeka Okonkwo',
    mrn: 'MRN-2024-0001',
    type: 'Radiology',
    test: 'Chest X-Ray',
    orderedBy: 'Dr. Eze',
    date: '2024-02-05',
    time: '09:15',
    status: 'Completed',
    priority: 'Routine',
  },
  {
    id: 'ORD-2024-0890',
    patient: 'Tobi Okafor',
    mrn: 'MRN-2024-0007',
    type: 'Laboratory',
    test: 'Malaria Parasite',
    orderedBy: 'Dr. Nnamdi',
    date: '2024-02-05',
    time: '14:00',
    status: 'In Progress',
    priority: 'Urgent',
  },
  {
    id: 'ORD-2024-0889',
    patient: 'Adaobi Nwosu',
    mrn: 'MRN-2024-0003',
    type: 'Medication',
    test: 'IV Antibiotics',
    orderedBy: 'Dr. Okafor',
    date: '2024-02-05',
    time: '11:45',
    status: 'Pending',
    priority: 'Routine',
  },
  {
    id: 'ORD-2024-0888',
    patient: 'Emeka Okafor',
    mrn: 'MRN-2024-0002',
    type: 'Procedure',
    test: 'Wound Dressing',
    orderedBy: 'Nurse Chioma',
    date: '2024-02-05',
    time: '08:30',
    status: 'Completed',
    priority: 'Routine',
  },
];

export default function ClinicalOrdersPage() {
  const { hasPermission } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [orderType, setOrderType] = useState<string>('lab');
  const [form] = Form.useForm();

  // CRITICAL SECURITY: Restrict access to clinical staff
  if (!hasPermission('lab:order') && !hasPermission('radiology:order') && !hasPermission('pharmacy:prescribe')) {
    return (
      <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)' }}>
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200" style={{ border: '1px solid #E2E8F0', borderRadius: '12px' }}>
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <FileTextOutlined style={{ color: '#DC2626', fontSize: '20px' }} />
            <div>
              <h3 className="font-semibold text-red-900">Access Denied</h3>
              <p className="text-sm text-red-700">You don&apos;tt have permission to access clinical orders. This area is restricted to clinical staff.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.patient.toLowerCase().includes(searchText.toLowerCase()) ||
      order.id.toLowerCase().includes(searchText.toLowerCase()) ||
      order.test.toLowerCase().includes(searchText.toLowerCase()) ||
      order.orderedBy.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesType = !typeFilter || order.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
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
          {id}
        </span>
      ),
    },
    {
      title: 'Patient',
      key: 'patient',
      render: (_: any, record: Order) => (
        <div>
          <div className="font-medium text-gray-900">{record.patient}</div>
          <div className="text-xs text-gray-500">{record.mrn}</div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: '#F3E8FF',
            color: '#7C3AED',
          }}
        >
          {type}
        </span>
      ),
    },
    { title: 'Test/Procedure', dataIndex: 'test', key: 'test' },
    { title: 'Ordered By', dataIndex: 'orderedBy', key: 'orderedBy' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Time', dataIndex: 'time', key: 'time' },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <StatusTag
          status={priority.toLowerCase()}
          type="patient"
          customConfig={{
            routine: { color: '#6B7280', bg: '#F3F4F6' },
            urgent: { color: '#EF4444', bg: '#FEE2E2' },
            stat: { color: '#DC2626', bg: '#FECACA' },
          }}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status.toLowerCase().replace(' ', '_')} type="lab" showIcon />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Order) => (
        <Space wrap>
          <GradientButton variant="secondary" size="small" icon={<EyeOutlined />} className="w-full sm:w-auto">
            View
          </GradientButton>
          {record.status === 'Pending' && (
            <GradientButton variant="danger" size="small" className="w-full sm:w-auto">
              Cancel
            </GradientButton>
          )}
        </Space>
      ),
    },
  ];

  const stats = {
    total: mockOrders.length,
    pending: mockOrders.filter((o: any) => o.status === 'Pending').length,
    inProgress: mockOrders.filter((o: any) => o.status === 'In Progress').length,
    completed: mockOrders.filter((o: any) => o.status === 'Completed').length,
  };

  return (
    <PageShell
      title="Clinical Orders"
      subtitle="Manage laboratory tests, radiology exams, medications, and procedures"
      action={
        <Space wrap>
          <Select
            value={orderType}
            onChange={setOrderType}
            style={{ width: 150 }}
            size="large"
            className="w-full sm:w-auto"
          >
            <Select.Option value="lab">Laboratory</Select.Option>
            <Select.Option value="radiology">Radiology</Select.Option>
            <Select.Option value="medication">Medication</Select.Option>
            <Select.Option value="procedure">Procedure</Select.Option>
          </Select>
          {hasPermission('lab:order') || hasPermission('radiology:order') ? (
            <GradientButton icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} className="w-full sm:w-auto">
              New Order
            </GradientButton>
          ) : null}
        </Space>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Total Orders"
          value={stats.total}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
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

      {/* Orders Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6 overflow-x-auto" style={{ border: '1px solid #E2E8F0', borderRadius: '12px' }}>
        <SearchFilterBar
          searchPlaceholder="Search orders by patient, ID, test, or provider..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'type',
              label: 'Type',
              value: typeFilter,
              options: [
                { label: 'All Types', value: '' },
                { label: 'Laboratory', value: 'Laboratory' },
                { label: 'Radiology', value: 'Radiology' },
                { label: 'Medication', value: 'Medication' },
                { label: 'Procedure', value: 'Procedure' },
              ],
              onChange: (value) => setTypeFilter(value as string | undefined),
            },
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { label: 'All Status', value: '' },
                { label: 'Pending', value: 'Pending' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Cancelled', value: 'Cancelled' },
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

      {/* New Order Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined style={{ color: '#3B82F6' }} />
            <span>
              New {orderType === 'lab' ? 'Lab Test' : orderType === 'radiology' ? 'Radiology' : orderType === 'medication' ? 'Medication' : 'Procedure'} Order
            </span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        okText="Submit Order"
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" style={{ marginTop: "24px" }}>
          <Form.Item name="note" label="Notes">
            <Input.TextArea rows={3} placeholder="Enter details..." />
          </Form.Item>
        </Form>
      </Modal>
    </PageShell>
  );
}
