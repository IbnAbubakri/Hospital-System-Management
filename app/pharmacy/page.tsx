'use client';

import React from 'react';
import { MedicineBoxOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';

interface Prescription {
  key: string;
  prescriptionId: string;
  patient: string;
  medications: string;
  prescribedBy: string;
  prescribedDate: string;
  status: string;
}

export default function PharmacyPage() {
  const [searchText, setSearchText] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string | undefined>();

  const prescriptions: Prescription[] = [
    {
      key: '1',
      prescriptionId: 'RX-2024-0234',
      patient: 'John Smith',
      medications: 'Amoxicillin 500mg',
      prescribedBy: 'Dr. Emily Brown',
      prescribedDate: '2024-02-01',
      status: 'pending',
    },
    {
      key: '2',
      prescriptionId: 'RX-2024-0235',
      patient: 'Sarah Johnson',
      medications: 'Ibuprofen 400mg, Paracetamol 500mg',
      prescribedBy: 'Dr. Michael Chen',
      prescribedDate: '2024-02-01',
      status: 'dispensed',
    },
    {
      key: '3',
      prescriptionId: 'RX-2024-0236',
      patient: 'Robert Williams',
      medications: 'Metformin 500mg, Lisinopril 10mg',
      prescribedBy: 'Dr. Emily Brown',
      prescribedDate: '2024-02-01',
      status: 'partially_dispensed',
    },
  ];

  const filteredPrescriptions = prescriptions.filter((p: any) => {
    const matchesSearch =
      p.patient.toLowerCase().includes(searchText.toLowerCase()) ||
      p.prescriptionId.toLowerCase().includes(searchText.toLowerCase()) ||
      p.medications.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Rx #',
      dataIndex: 'prescriptionId',
      key: 'prescriptionId',
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
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    {
      title: 'Medications',
      dataIndex: 'medications',
      key: 'medications',
      ellipsis: true,
      render: (meds: string) => (
        <span style={{ fontSize: '13px' }}>{meds}</span>
      ),
    },
    { title: 'Prescribed By', dataIndex: 'prescribedBy', key: 'prescribedBy' },
    { title: 'Date', dataIndex: 'prescribedDate', key: 'prescribedDate' },
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
        record.status === 'pending' || record.status === 'partially_dispensed' ? (
          <GradientButton variant="primary" size="small">
            Dispense
          </GradientButton>
        ) : (
          <GradientButton variant="secondary" size="small">
            View Details
          </GradientButton>
        )
      )
    },
  ];

  const stats = {
    pending: 23,
    dispensedToday: 47,
    lowStock: 8,
    expiringSoon: 5,
  };

  return (
    <PageShell
      title="Pharmacy Dashboard"
      subtitle="Manage prescriptions, medication dispensing, and inventory"
      action={
        <GradientButton icon={<MedicineBoxOutlined />}>
          Process Prescription
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Pending Prescriptions"
          value={stats.pending}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={0}
        />
        <StatCard
          label="Dispensed Today"
          value={stats.dispensedToday}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="Low Stock Items"
          value={stats.lowStock}
          color="#EF4444"
          bg="linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCA5A5"
          index={2}
        />
        <StatCard
          label="Expiring Soon"
          value={stats.expiringSoon}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={3}
        />
      </div>

      {/* Prescription Queue Section */}
      <div className="p-4 sm:p-6" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <div className="flex items-center gap-2 mb-4">
          <MedicineBoxOutlined style={{ color: '#6366F1', fontSize: '20px' }} />
          <h2 className="text-lg font-semibold text-gray-900">Prescription Queue</h2>
        </div>

        <SearchFilterBar
          searchPlaceholder="Search prescriptions by patient, Rx #, or medication..."
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
          totalCount={prescriptions.length}
          filterLabel="prescriptions"
        />

        <ModernTable
          dataSource={filteredPrescriptions}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </PageShell>
  );
}
