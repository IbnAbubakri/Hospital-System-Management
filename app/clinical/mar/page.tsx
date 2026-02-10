'use client';

import React, { useState } from 'react';
import { Modal, Form, Select, Input, Space } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser } from '@/lib/dataFilters';

const { TextArea } = Input;

interface MedicationAdministration {
  id: string;
  patientId: string;
  patientName: string;
  medication: string;
  dosage: string;
  route: 'Oral' | 'IV' | 'IM' | 'SC' | 'Topical' | 'Other';
  frequency: string;
  prescribedBy: string;
  scheduledTime: string;
  administeredTime?: string;
  administeredBy?: string;
  status: 'Scheduled' | 'Administered' | 'Missed' | 'Refused' | 'Held';
  notes?: string;
}

const mockMedications: MedicationAdministration[] = [
  {
    id: 'MAR-2024-0892',
    patientId: '1',
    patientName: 'Chukwuemeka Okonkwo',
    medication: 'Amlodipine',
    dosage: '10mg',
    route: 'Oral',
    frequency: 'Daily',
    prescribedBy: 'Dr. Emeka Adeleke',
    scheduledTime: '2024-02-05 08:00',
    administeredTime: '2024-02-05 08:15',
    administeredBy: 'Nurse Amaka Okafor',
    status: 'Administered',
    notes: 'Taken with water, no adverse effects',
  },
  {
    id: 'MAR-2024-0891',
    patientId: '1',
    patientName: 'Chukwuemeka Okonkwo',
    medication: 'Lisinopril',
    dosage: '20mg',
    route: 'Oral',
    frequency: 'Twice Daily',
    prescribedBy: 'Dr. Emeka Adeleke',
    scheduledTime: '2024-02-05 20:00',
    status: 'Scheduled',
  },
  {
    id: 'MAR-2024-0890',
    patientId: '2',
    patientName: 'Amaka Okafor',
    medication: 'Metformin',
    dosage: '500mg',
    route: 'Oral',
    frequency: 'Twice Daily',
    prescribedBy: 'Dr. Ibrahim Musa',
    scheduledTime: '2024-02-05 08:00',
    administeredTime: '2024-02-05 08:10',
    administeredBy: 'Nurse Grace Adebayo',
    status: 'Administered',
  },
  {
    id: 'MAR-2024-0889',
    patientId: '7',
    patientName: 'Tobi Okafor',
    medication: 'Albuterol',
    dosage: '2.5mg',
    route: 'SC',
    frequency: 'PRN',
    prescribedBy: 'Dr. Aisha Yusuf',
    scheduledTime: '2024-02-05 14:00',
    status: 'Scheduled',
  },
  {
    id: 'MAR-2024-0888',
    patientId: '5',
    patientName: 'Ngozi Eze',
    medication: 'Ibuprofen',
    dosage: '400mg',
    route: 'Oral',
    frequency: 'TID',
    prescribedBy: 'Dr. Chinedu Okonkwo',
    scheduledTime: '2024-02-04 18:00',
    status: 'Missed',
    notes: 'Patient refused due to drowsiness',
  },
  {
    id: 'MAR-2024-0887',
    patientId: '2',
    patientName: 'Amaka Okafor',
    medication: 'Insulin Glargine',
    dosage: '20 units',
    route: 'SC',
    frequency: 'Daily',
    prescribedBy: 'Dr. Ibrahim Musa',
    scheduledTime: '2024-02-05 22:00',
    status: 'Held',
    notes: 'Held pending blood glucose results',
  },
];

export default function MARPage() {
  const { hasPermission, user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState<MedicationAdministration | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // CRITICAL SECURITY: Restrict access to clinical staff
  if (!hasPermission('clinical:mar:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-3 p-4" style={{ background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' }}>
            <CheckCircleOutlined style={{ color: '#DC2626', fontSize: '20px' }} />
            <div>
              <h3 className="font-semibold text-red-900">Access Denied</h3>
              <p className="text-sm text-red-700">You don&apos;tt have permission to access medication administration records. This area is restricted to clinical staff.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const accessiblePatients = filterPatientsByUser(user);
  const filteredMedications = mockMedications.filter((med) => {
    const matchesSearch =
      med.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
      med.medication.toLowerCase().includes(searchText.toLowerCase()) ||
      med.id.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || med.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAdminister = (med: MedicationAdministration) => {
    setSelectedMed(med);
    setIsModalOpen(true);
  };

  const handleConfirmAdministration = (notes?: string) => {
    // In real app, update medication status
    setIsModalOpen(false);
    setSelectedMed(null);
  };

  const columns = [
    {
      title: 'MAR ID',
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
      render: (_: any, record: MedicationAdministration) => (
        <div>
          <div className="font-medium text-gray-900">{record.patientName}</div>
        </div>
      ),
    },
    {
      title: 'Medication',
      key: 'medication',
      render: (_: any, record: MedicationAdministration) => (
        <div>
          <div className="font-medium text-gray-900">{record.medication}</div>
          <div className="text-xs text-gray-500">{record.dosage} - {record.route}</div>
        </div>
      ),
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      render: (freq: string) => (
        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, background: '#F3E8FF', color: '#7C3AED' }}>
          {freq}
        </span>
      ),
    },
    { title: 'Prescribed By', dataIndex: 'prescribedBy', key: 'prescribedBy' },
    { title: 'Scheduled Time', dataIndex: 'scheduledTime', key: 'scheduledTime' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status.toLowerCase()} type="patient" showIcon />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: MedicationAdministration) => (
        <Space>
          {record.status === 'Scheduled' && (
            <GradientButton
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleAdminister(record)}
            >
              Administer
            </GradientButton>
          )}
          <GradientButton variant="secondary" size="small">
            View Details
          </GradientButton>
        </Space>
      ),
    },
  ];

  const stats = {
    total: mockMedications.length,
    scheduled: mockMedications.filter((m: any) => m.status === 'Scheduled').length,
    administered: mockMedications.filter((m: any) => m.status === 'Administered').length,
    missed: mockMedications.filter((m: any) => m.status === 'Missed').length,
  };

  return (
    <PageShell
      title="Medication Administration Record (MAR)"
      subtitle="Track and manage patient medication administration"
      action={
        <GradientButton icon={<PlusOutlined />}>
          Add Scheduled Medication
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Total Medications"
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
          label="Administered"
          value={stats.administered}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={2}
        />
        <StatCard
          label="Missed"
          value={stats.missed}
          color="#EF4444"
          bg="linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCA5A5"
          index={3}
        />
      </div>

      {/* Missed Medications Alert */}
      {stats.missed > 0 && (
        <div className="mb-6 p-4 rounded-lg" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <div className="flex items-center gap-3">
            <ClockCircleOutlined style={{ color: '#DC2626', fontSize: '20px' }} />
            <div>
              <h3 className="font-semibold text-red-900">{stats.missed} medication{stats.missed > 1 ? 's were' : ' was'} missed</h3>
              <p className="text-sm text-red-700">Please review and address missed medications as soon as possible.</p>
            </div>
          </div>
        </div>
      )}

      {/* MAR Section */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
        <SearchFilterBar
          searchPlaceholder="Search medications by patient, name, or ID..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { label: 'All Status', value: '' },
                { label: 'Scheduled', value: 'Scheduled' },
                { label: 'Administered', value: 'Administered' },
                { label: 'Missed', value: 'Missed' },
                { label: 'Refused', value: 'Refused' },
                { label: 'Held', value: 'Held' },
              ],
              onChange: (value) => setStatusFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredMedications.length}
          totalCount={mockMedications.length}
          filterLabel="medications"
        />

        <ModernTable
          dataSource={filteredMedications}
          columns={columns}
          rowKey="id"
          pagination={{ defaultPageSize: 20 }}
        />
      </div>

      {/* Confirm Administration Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CheckCircleOutlined style={{ color: '#10B981' }} />
            <span>Confirm Medication Administration</span>
          </div>
        }
        open={isModalOpen}
        onOk={() => handleConfirmAdministration()}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedMed(null);
        }}
        okText="Confirm Administered"
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
