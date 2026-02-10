'use client';

import React, { useState, useMemo } from 'react';
import { Modal, Form, Select, Input, Space } from 'antd';
import { UserOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';
import { useAuth } from '@/lib/contexts/AuthContext';

interface Referral {
  id: string;
  patient: string;
  mrn: string;
  from: string;
  fromDept: string;
  to: string;
  toDept: string;
  reason: string;
  urgency: 'Routine' | 'Urgent' | 'Critical';
  status: 'Pending' | 'Approved' | 'In Progress' | 'Completed';
  date: string;
}

const mockReferrals: Referral[] = [
  {
    id: 'REF-2024-0892',
    patient: 'Chukwuemeka Okonkwo',
    mrn: 'MRN-2024-0001',
    from: 'Dr. Emeka Adeleke',
    fromDept: 'Cardiology',
    to: 'Dr. Ibrahim Musa',
    toDept: 'General Medicine',
    reason: 'Hypertension with diabetes complications',
    urgency: 'Routine',
    status: 'Pending',
    date: '2024-02-05',
  },
  {
    id: 'REF-2024-0891',
    patient: 'Ngozi Eze',
    mrn: 'MRN-2024-0005',
    from: 'Dr. Chinedu Okonkwo',
    fromDept: 'Orthopedics',
    to: 'Dr. Chioma Nnamani',
    toDept: 'Neurology',
    reason: 'Persistent back pain with neurological symptoms',
    urgency: 'Urgent',
    status: 'Approved',
    date: '2024-02-04',
  },
  {
    id: 'REF-2024-0890',
    patient: 'Tobi Okafor',
    mrn: 'MRN-2024-0007',
    from: 'Dr. Aisha Yusuf',
    fromDept: 'Pediatrics',
    to: 'Dr. Emeka Adeleke',
    toDept: 'Cardiology',
    reason: 'Cardiac murmur detected during routine exam',
    urgency: 'Urgent',
    status: 'In Progress',
    date: '2024-02-04',
  },
  {
    id: 'REF-2024-0889',
    patient: 'Amaka Okafor',
    mrn: 'MRN-2024-0002',
    from: 'Dr. Ibrahim Musa',
    fromDept: 'General Medicine',
    to: 'Dr. Chinedu Okonkwo',
    toDept: 'Orthopedics',
    reason: 'Chronic joint pain evaluation',
    urgency: 'Routine',
    status: 'Completed',
    date: '2024-02-03',
  },
  {
    id: 'REF-2024-0888',
    patient: 'Adaobi Nwosu',
    mrn: 'MRN-2024-0003',
    from: 'Dr. Nnamdi Okoro',
    fromDept: 'Emergency',
    to: 'Dr. Chioma Nnamani',
    toDept: 'Neurology',
    reason: 'Acute neurological symptoms - stroke rule out',
    urgency: 'Critical',
    status: 'Approved',
    date: '2024-02-05',
  },
  {
    id: 'REF-2024-0887',
    patient: 'Emeka Okafor',
    mrn: 'MRN-2024-0004',
    from: 'Dr. Grace Amadi',
    fromDept: 'Surgery',
    to: 'Dr. Aisha Yusuf',
    toDept: 'Pediatrics',
    reason: 'Post-operative pediatric consultation',
    urgency: 'Routine',
    status: 'Pending',
    date: '2024-02-02',
  },
];

export default function ReferralsPage() {
  const { hasPermission } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [urgencyFilter, setUrgencyFilter] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filteredReferrals = useMemo(() => {
    return mockReferrals.filter((referral) => {
      const matchesSearch =
        referral.patient.toLowerCase().includes(searchText.toLowerCase()) ||
        referral.id.toLowerCase().includes(searchText.toLowerCase()) ||
        referral.from.toLowerCase().includes(searchText.toLowerCase()) ||
        referral.to.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = !statusFilter || referral.status === statusFilter;
      const matchesUrgency = !urgencyFilter || referral.urgency === urgencyFilter;
      return matchesSearch && matchesStatus && matchesUrgency;
    });
  }, [searchText, statusFilter, urgencyFilter]);

  // CRITICAL SECURITY: Restrict access to clinical staff
  if (!hasPermission('clinical:referrals:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-3 p-4" style={{ background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' }}>
            <TeamOutlined style={{ color: '#DC2626', fontSize: '20px' }} />
            <div>
              <h3 className="font-semibold text-red-900">Access Denied</h3>
              <p className="text-sm text-red-700">You don&apos;tt have permission to access patient referrals. This area is restricted to clinical staff.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const columns = [
    {
      title: 'Referral ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, background: '#DBEAFE', color: '#1E40AF' }}>
          {id}
        </span>
      ),
    },
    {
      title: 'Patient',
      key: 'patient',
      render: (_: any, record: Referral) => (
        <div>
          <div className="font-medium text-gray-900">{record.patient}</div>
          <div className="text-xs text-gray-500">{record.mrn}</div>
        </div>
      ),
    },
    {
      title: 'Referred By',
      key: 'from',
      render: (_: any, record: Referral) => (
        <div>
          <div className="font-medium text-gray-900">{record.from}</div>
          <div className="text-xs text-gray-500">{record.fromDept}</div>
        </div>
      ),
    },
    {
      title: 'Referred To',
      key: 'to',
      render: (_: any, record: Referral) => (
        <div>
          <div className="font-medium text-gray-900">{record.to}</div>
          <div className="text-xs text-gray-500">{record.toDept}</div>
        </div>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
      render: (reason: string) => <span className="text-sm text-gray-600">{reason}</span>,
    },
    {
      title: 'Urgency',
      dataIndex: 'urgency',
      key: 'urgency',
      render: (urgency: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background:
              urgency === 'Critical'
                ? '#FEE2E2'
                : urgency === 'Urgent'
                ? '#FEF3C7'
                : '#DBEAFE',
            color:
              urgency === 'Critical'
                ? '#DC2626'
                : urgency === 'Urgent'
                ? '#D97706'
                : '#1E40AF',
          }}
        >
          {urgency}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status.toLowerCase()} type="patient" showIcon />,
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <GradientButton variant="secondary" size="small">
            View Details
          </GradientButton>
          <GradientButton size="small">
            Process
          </GradientButton>
        </Space>
      ),
    },
  ];

  const stats = {
    total: mockReferrals.length,
    pending: mockReferrals.filter((r: any) => r.status === 'Pending').length,
    approved: mockReferrals.filter((r: any) => r.status === 'Approved').length,
    urgent: mockReferrals.filter((r: any) => r.urgency === 'Urgent' || r.urgency === 'Critical').length,
  };

  return (
    <PageShell
      title="Patient Referrals"
      subtitle="Manage inter-departmental and external patient referrals"
      action={
        <GradientButton icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Create Referral
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Total Referrals"
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
          label="Approved"
          value={stats.approved}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={2}
        />
        <StatCard
          label="Urgent/Critical"
          value={stats.urgent}
          color="#EF4444"
          bg="linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCA5A5"
          index={3}
        />
      </div>

      {/* Referrals Section */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
        <SearchFilterBar
          searchPlaceholder="Search referrals by patient, ID, or doctor..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { label: 'All Status', value: '' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Approved', value: 'Approved' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Completed', value: 'Completed' },
              ],
              onChange: (value) => setStatusFilter(value as string | undefined),
            },
            {
              key: 'urgency',
              label: 'Urgency',
              value: urgencyFilter,
              options: [
                { label: 'All Urgency', value: '' },
                { label: 'Routine', value: 'Routine' },
                { label: 'Urgent', value: 'Urgent' },
                { label: 'Critical', value: 'Critical' },
              ],
              onChange: (value) => setUrgencyFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredReferrals.length}
          totalCount={mockReferrals.length}
          filterLabel="referrals"
        />

        <ModernTable dataSource={filteredReferrals} columns={columns} rowKey="id" pagination={{ defaultPageSize: 15 }} />
      </div>

      {/* Create Referral Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <UserOutlined style={{ color: '#3B82F6' }} />
            <span>Create Patient Referral</span>
          </div>
        }
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        okText="Submit Referral"
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
