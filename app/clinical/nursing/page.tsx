'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Form, Select, Input, DatePicker, Tabs, Space } from 'antd';
import { PlusOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';
import { useAuth } from '@/lib/contexts/AuthContext';

const { TextArea } = Input;

interface NursingNote {
  id: string;
  date: string;
  nurse: string;
  patient: string;
  mrn: string;
  note: string;
  vitalSigns: string;
  assessment: string;
  interventions: string[];
  response: string;
  status: 'draft' | 'submitted' | 'reviewed';
}

const mockNursingNotes: NursingNote[] = [
  {
    id: 'NUR-2024-0892',
    date: '2024-02-05 10:30',
    nurse: 'Nurse Sarah Johnson',
    patient: 'Chukwuemeka Okonkwo',
    mrn: 'MRN-2024-0001',
    note: 'Patient vital signs stable. BP 120/80, Pulse 72, Temp 37°C',
    vitalSigns: 'BP: 120/80 mmHg, Pulse: 72 bpm, Temp: 37°C, SpO2: 98%',
    assessment: 'Patient is stable, vital signs within normal range. No distress reported.',
    interventions: ['Vital signs monitoring', 'Medication administration'],
    response: 'Patient tolerated interventions well. Reports feeling comfortable.',
    status: 'submitted',
  },
  {
    id: 'NUR-2024-0891',
    date: '2024-02-05 08:00',
    nurse: 'Nurse Mary Williams',
    patient: 'Ngozi Eze',
    mrn: 'MRN-2024-0005',
    note: 'Patient reported mild discomfort. Administered prescribed analgesic',
    vitalSigns: 'BP: 135/85 mmHg, Pulse: 78 bpm, Temp: 37.2°C, SpO2: 97%',
    assessment: 'Patient experiencing mild pain at surgical site. Pain level 4/10.',
    interventions: ['Pain management', 'Patient comfort', 'Wound assessment'],
    response: 'Pain reduced to 2/10 after medication. Patient resting comfortably.',
    status: 'reviewed',
  },
  {
    id: 'NUR-2024-0890',
    date: '2024-02-04 22:00',
    nurse: 'Nurse Grace Adebayo',
    patient: 'Tobi Okafor',
    mrn: 'MRN-2024-0007',
    note: 'Evening assessment completed. Patient sleeping well',
    vitalSigns: 'BP: 110/70 mmHg, Pulse: 68 bpm, Temp: 36.8°C, SpO2: 99%',
    assessment: 'Pediatric patient stable. Sleeping peacefully. No respiratory distress.',
    interventions: ['Night care', 'Vital signs monitoring'],
    response: 'Patient responded well to care. Mother present at bedside.',
    status: 'submitted',
  },
  {
    id: 'NUR-2024-0889',
    date: '2024-02-04 14:30',
    nurse: 'Nurse Amaka Okafor',
    patient: 'Amaka Okafor',
    mrn: 'MRN-2024-0002',
    note: 'Post-operative care and mobility assistance',
    vitalSigns: 'BP: 128/82 mmHg, Pulse: 75 bpm, Temp: 37°C, SpO2: 98%',
    assessment: 'Post-operative day 2. Surgical site clean, no signs of infection.',
    interventions: ['Wound care', 'Mobility assistance', 'Patient education'],
    response: 'Patient ambulated with assistance. Demonstrated understanding of discharge instructions.',
    status: 'reviewed',
  },
];

export default function NursingPage() {
  const { hasPermission } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [form] = Form.useForm();

  const filteredNotes = useMemo(() => {
    return mockNursingNotes.filter((note) => {
      const matchesSearch =
        note.patient.toLowerCase().includes(searchText.toLowerCase()) ||
        note.id.toLowerCase().includes(searchText.toLowerCase()) ||
        note.nurse.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = !statusFilter || note.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter]);

  // CRITICAL SECURITY: Restrict access to clinical staff
  if (!hasPermission('clinical:nursing:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-3 p-4" style={{ background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' }}>
            <UserOutlined style={{ color: '#DC2626', fontSize: '20px' }} />
            <div>
              <h3 className="font-semibold text-red-900">Access Denied</h3>
              <p className="text-sm text-red-700">You don&apos;tt have permission to access nursing documentation. This area is restricted to clinical staff.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const columns = [
    {
      title: 'Note ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, background: '#DBEAFE', color: '#1E40AF' }}>
          {id}
        </span>
      ),
    },
    {
      title: 'Date/Time',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => <span className="text-sm">{date}</span>,
    },
    {
      title: 'Patient',
      key: 'patient',
      render: (_: any, record: NursingNote) => (
        <div>
          <div className="font-medium text-gray-900">{record.patient}</div>
          <div className="text-xs text-gray-500">{record.mrn}</div>
        </div>
      ),
    },
    { title: 'Nurse', dataIndex: 'nurse', key: 'nurse' },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
      render: (note: string) => <span className="text-sm text-gray-600">{note}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="patient" showIcon />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <GradientButton variant="secondary" size="small">
            View Details
          </GradientButton>
        </Space>
      ),
    },
  ];

  const stats = {
    total: mockNursingNotes.length,
    today: mockNursingNotes.filter((n: any) => n.date.startsWith('2024-02-05')).length,
    submitted: mockNursingNotes.filter((n: any) => n.status === 'submitted').length,
    reviewed: mockNursingNotes.filter((n: any) => n.status === 'reviewed').length,
  };

  return (
    <PageShell
      title="Nursing Documentation"
      subtitle="Record and manage nursing care notes and patient assessments"
      action={
        <GradientButton icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Add Nursing Note
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Total Notes"
          value={stats.total}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Today's Notes"
          value={stats.today}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={1}
        />
        <StatCard
          label="Submitted"
          value={stats.submitted}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={2}
        />
        <StatCard
          label="Reviewed"
          value={stats.reviewed}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={3}
        />
      </div>

      {/* Nursing Notes Section */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
        <SearchFilterBar
          searchPlaceholder="Search notes by patient, ID, or nurse..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { label: 'All Status', value: '' },
                { label: 'Draft', value: 'draft' },
                { label: 'Submitted', value: 'submitted' },
                { label: 'Reviewed', value: 'reviewed' },
              ],
              onChange: (value) => setStatusFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredNotes.length}
          totalCount={mockNursingNotes.length}
          filterLabel="notes"
        />

        <ModernTable dataSource={filteredNotes} columns={columns} rowKey="id" pagination={{ defaultPageSize: 10 }} />
      </div>

      {/* Add Nursing Note Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined style={{ color: '#3B82F6' }} />
            <span>Add Nursing Note</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        okText="Save Note"
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
