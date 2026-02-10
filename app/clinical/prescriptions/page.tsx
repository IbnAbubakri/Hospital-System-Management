'use client';

import React, { useState } from 'react';
import { Modal, Form, Select, Input, Space } from 'antd';
import { PlusOutlined, MedicineBoxOutlined, EyeOutlined, CheckOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';
import { useAuth } from '@/lib/contexts/AuthContext';

interface Prescription {
  id: string;
  patient: string;
  mrn: string;
  medications: string;
  doctor: string;
  date: string;
  status: 'dispensed' | 'pending' | 'partially_dispensed' | 'cancelled';
  notes?: string;
}

const mockPrescriptions: Prescription[] = [
  {
    id: 'RX-2024-0892',
    patient: 'Ngozi Eze',
    mrn: 'MRN-2024-0005',
    medications: 'Amoxicillin 500mg, Ibuprofen 400mg',
    doctor: 'Dr. Okonkwo',
    date: '2024-02-05',
    status: 'pending',
    notes: 'Take with food',
  },
  {
    id: 'RX-2024-0891',
    patient: 'Chukwuemeka Okonkwo',
    mrn: 'MRN-2024-0001',
    medications: 'Paracetamol 500mg, Cough syrup',
    doctor: 'Dr. Nnamdi',
    date: '2024-02-05',
    status: 'dispensed',
    notes: 'Complete course',
  },
  {
    id: 'RX-2024-0890',
    patient: 'Tobi Okafor',
    mrn: 'MRN-2024-0007',
    medications: 'Metformin 500mg, Lisinopril 10mg',
    doctor: 'Dr. Eze',
    date: '2024-02-04',
    status: 'dispensed',
    notes: 'Monitor blood sugar',
  },
  {
    id: 'RX-2024-0889',
    patient: 'Adaobi Nwosu',
    mrn: 'MRN-2024-0003',
    medications: 'Omeprazole 20mg',
    doctor: 'Dr. Okafor',
    date: '2024-02-04',
    status: 'partially_dispensed',
    notes: 'Take before breakfast',
  },
  {
    id: 'RX-2024-0888',
    patient: 'Emeka Okafor',
    mrn: 'MRN-2024-0002',
    medications: 'Amlodipine 10mg, Aspirin 75mg',
    doctor: 'Dr. Okonkwo',
    date: '2024-02-03',
    status: 'dispensed',
  },
];

export default function PrescriptionsPage() {
  const { hasPermission } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [form] = Form.useForm();

  // CRITICAL SECURITY: Restrict access to clinical staff
  if (!hasPermission('clinical:write_prescription') && !hasPermission('pharmacy:dispense')) {
    return (
      <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)' }}>
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200" style={{ border: '1px solid #E2E8F0', borderRadius: '12px' }}>
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <MedicineBoxOutlined style={{ color: '#DC2626', fontSize: '20px' }} />
            <div>
              <h3 className="font-semibold text-red-900">Access Denied</h3>
              <p className="text-sm text-red-700">You don&apos;tt have permission to access prescriptions. This area is restricted to clinical staff and pharmacists.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredPrescriptions = mockPrescriptions.filter((rx) => {
    const matchesSearch =
      rx.patient.toLowerCase().includes(searchText.toLowerCase()) ||
      rx.id.toLowerCase().includes(searchText.toLowerCase()) ||
      rx.medications.toLowerCase().includes(searchText.toLowerCase()) ||
      rx.doctor.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || rx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Prescription ID',
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
      render: (_: any, record: Prescription) => (
        <div>
          <div className="font-medium text-gray-900">{record.patient}</div>
          <div className="text-xs text-gray-500">{record.mrn}</div>
        </div>
      ),
    },
    {
      title: 'Medications',
      dataIndex: 'medications',
      key: 'medications',
      ellipsis: true,
      render: (medications: string) => (
        <div className="text-sm" style={{ maxWidth: '250px' }}>
          {medications}
        </div>
      ),
    },
    { title: 'Prescribing Doctor', dataIndex: 'doctor', key: 'doctor' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="prescription" showIcon />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Prescription) => (
        <Space wrap>
          <GradientButton variant="secondary" size="small" icon={<EyeOutlined />} className="w-full sm:w-auto">
            View
          </GradientButton>
          {record.status === 'pending' && hasPermission('pharmacy:dispense') && (
            <GradientButton variant="primary" size="small" icon={<CheckOutlined />} className="w-full sm:w-auto">
              Mark Dispensed
            </GradientButton>
          )}
        </Space>
      ),
    },
  ];

  const stats = {
    total: mockPrescriptions.length,
    pending: mockPrescriptions.filter((p: any) => p.status === 'pending').length,
    dispensed: mockPrescriptions.filter((p: any) => p.status === 'dispensed').length,
    partially: mockPrescriptions.filter((p: any) => p.status === 'partially_dispensed').length,
  };

  return (
    <PageShell
      title="Prescriptions Management"
      subtitle="Manage and track patient prescriptions and medication dispensing"
      action={
        hasPermission('clinical:write_prescription') && (
          <GradientButton icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} className="w-full sm:w-auto">
            Write Prescription
          </GradientButton>
        )
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Total Prescriptions"
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
          label="Dispensed"
          value={stats.dispensed}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={2}
        />
        <StatCard
          label="Partially Dispensed"
          value={stats.partially}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={3}
        />
      </div>

      {/* Prescriptions Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6 overflow-x-auto" style={{ border: '1px solid #E2E8F0', borderRadius: '12px' }}>
        <SearchFilterBar
          searchPlaceholder="Search prescriptions by patient, ID, medication, or doctor..."
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
                { label: 'Dispensed', value: 'dispensed' },
                { label: 'Partially Dispensed', value: 'partially_dispensed' },
                { label: 'Cancelled', value: 'cancelled' },
              ],
              onChange: (value) => setStatusFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredPrescriptions.length}
          totalCount={mockPrescriptions.length}
          filterLabel="prescriptions"
        />

        <ModernTable
          dataSource={filteredPrescriptions}
          columns={columns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </div>

      {/* Write Prescription Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MedicineBoxOutlined style={{ color: '#3B82F6' }} />
            <span>Write Prescription</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        okText="Submit Prescription"
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
