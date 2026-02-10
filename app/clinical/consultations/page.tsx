'use client';

import React, { useState } from 'react';
import { Modal, Form, Select, Input, Space } from 'antd';
import { PlusOutlined, UserOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';
import { useAuth } from '@/lib/contexts/AuthContext';

interface Consultation {
  id: string;
  patient: string;
  mrn: string;
  consultingDoctor: string;
  specialist: string;
  type: 'Intra-departmental' | 'Inter-departmental' | 'External';
  reason: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
}

const mockConsultations: Consultation[] = [
  {
    id: 'CON-2024-0892',
    patient: 'Ngozi Eze',
    mrn: 'MRN-2024-0005',
    consultingDoctor: 'Dr. Okonkwo',
    specialist: 'Dr. Eze (Endocrinology)',
    type: 'Intra-departmental',
    reason: 'Diabetes management optimization',
    date: '2024-02-05',
    time: '10:00',
    status: 'scheduled',
    notes: 'Patient has uncontrolled blood sugar levels',
  },
  {
    id: 'CON-2024-0891',
    patient: 'Chukwuemeka Okonkwo',
    mrn: 'MRN-2024-0001',
    consultingDoctor: 'Dr. Nnamdi',
    specialist: 'Dr. Okafor (Orthopedics)',
    type: 'Inter-departmental',
    reason: 'Chronic knee pain evaluation',
    date: '2024-02-04',
    time: '14:30',
    status: 'completed',
    notes: 'Referred for orthopedic evaluation',
  },
  {
    id: 'CON-2024-0890',
    patient: 'Tobi Okafor',
    mrn: 'MRN-2024-0007',
    consultingDoctor: 'Dr. Eze',
    specialist: 'Dr. Okonkwo (Cardiology)',
    type: 'External',
    reason: 'Cardiac murmur evaluation',
    date: '2024-02-03',
    time: '09:00',
    status: 'completed',
    notes: 'Pediatric cardiology consultation',
  },
];

export default function ClinicalConsultationsPage() {
  const { hasPermission } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [form] = Form.useForm();

  // CRITICAL SECURITY: Restrict access to clinical staff
  if (!hasPermission('clinical:consultations:view')) {
    return (
      <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)' }}>
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200" style={{ border: '1px solid #E2E8F0', borderRadius: '12px' }}>
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <MedicineBoxOutlined style={{ color: '#DC2626', fontSize: '20px' }} />
            <div>
              <h3 className="font-semibold text-red-900">Access Denied</h3>
              <p className="text-sm text-red-700">You don&apos;tt have permission to access consultation management. This area is restricted to clinical staff.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredConsultations = mockConsultations.filter((cons) => {
    const matchesSearch =
      cons.patient.toLowerCase().includes(searchText.toLowerCase()) ||
      cons.id.toLowerCase().includes(searchText.toLowerCase()) ||
      cons.specialist.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || cons.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Consultation ID',
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
      render: (_: any, record: Consultation) => (
        <div>
          <div className="font-medium text-gray-900">{record.patient}</div>
          <div className="text-xs text-gray-500">{record.mrn}</div>
        </div>
      ),
    },
    { title: 'Requesting Doctor', dataIndex: 'consultingDoctor', key: 'consultingDoctor' },
    { title: 'Specialist', dataIndex: 'specialist', key: 'specialist' },
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
    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Time', dataIndex: 'time', key: 'time' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="appointment" showIcon />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space wrap>
          <GradientButton variant="secondary" size="small" className="w-full sm:w-auto">
            View Details
          </GradientButton>
        </Space>
      ),
    },
  ];

  const stats = {
    total: mockConsultations.length,
    scheduled: mockConsultations.filter((c: any) => c.status === 'scheduled').length,
    completed: mockConsultations.filter((c: any) => c.status === 'completed').length,
    today: mockConsultations.filter((c: any) => c.date === '2024-02-05').length,
  };

  return (
    <PageShell
      title="Medical Consultations"
      subtitle="Manage specialist consultation requests and referrals"
      action={
        <GradientButton icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} className="w-full sm:w-auto">
          Request Consultation
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Total Consultations"
          value={stats.total}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Scheduled"
          value={stats.scheduled}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
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
          label="Today's Consultations"
          value={stats.today}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={3}
        />
      </div>

      {/* Consultations Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6 overflow-x-auto" style={{ border: '1px solid #E2E8F0', borderRadius: '12px' }}>
        <SearchFilterBar
          searchPlaceholder="Search consultations by patient, ID, or specialist..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { label: 'All Status', value: '' },
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'Completed', value: 'completed' },
                { label: 'Cancelled', value: 'cancelled' },
              ],
              onChange: (value) => setStatusFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredConsultations.length}
          totalCount={mockConsultations.length}
          filterLabel="consultations"
        />

        <ModernTable
          dataSource={filteredConsultations}
          columns={columns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </div>

      {/* Request Consultation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MedicineBoxOutlined style={{ color: '#3B82F6' }} />
            <span>Request Consultation</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        okText="Submit Request"
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
