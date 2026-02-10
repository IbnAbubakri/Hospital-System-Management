'use client';

import React from 'react';
import { MedicineBoxOutlined, PrinterOutlined } from '@ant-design/icons';
import { Modal, Form, App } from 'antd';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton, InfoCard } from '@/components/design-system';

interface Prescription {
  id: string;
  patient: string;
  mrn: string;
  medications: string;
  prescribedBy: string;
  date: string;
  status: string;
  priority: string;
}

export default function PharmacyDispensingPage() {
  const [selectedPrescription, setSelectedPrescription] = React.useState<Prescription | null>(null);
  const [isDispenseModalVisible, setIsDispenseModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [searchText, setSearchText] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string | undefined>();
  const [priorityFilter, setPriorityFilter] = React.useState<string | undefined>();

  const prescriptions: Prescription[] = [
    { id: 'RX-2024-0892', patient: 'Ngozi Eze', mrn: 'MRN-2024-0005', medications: 'Amlodipine 10mg, Lisinopril 20mg', prescribedBy: 'Dr. Okonkwo', date: '2024-02-05', status: 'pending', priority: 'Routine' },
    { id: 'RX-2024-0891', patient: 'Chukwuemeka Okonkwo', mrn: 'MRN-2024-0001', medications: 'Metformin 500mg, Sitagliptin 50mg', prescribedBy: 'Dr. Eze', date: '2024-02-05', status: 'pending', priority: 'Urgent' },
    { id: 'RX-2024-0890', patient: 'Tobi Okafor', mrn: 'MRN-2024-0007', medications: 'Paracetamol Syrup, Amoxicillin Suspension', prescribedBy: 'Dr. Nnamdi', date: '2024-02-04', status: 'dispensed', priority: 'Routine' },
    { id: 'RX-2024-0889', patient: 'Adaobi Nwosu', mrn: 'MRN-2024-0003', medications: 'Ibuprofen 400mg, Cyclobenzaprine 10mg', prescribedBy: 'Dr. Okafor', date: '2024-02-04', status: 'pending', priority: 'Routine' },
    { id: 'RX-2024-0888', patient: 'Emeka Okafor', mrn: 'MRN-2024-0002', medications: 'Omeprazole 20mg, Antacid Suspension', prescribedBy: 'Dr. Nnamdi', date: '2024-02-03', status: 'dispensed', priority: 'Routine' },
  ];

  const filteredPrescriptions = prescriptions.filter((p: any) => {
    const matchesSearch =
      p.patient.toLowerCase().includes(searchText.toLowerCase()) ||
      p.id.toLowerCase().includes(searchText.toLowerCase()) ||
      p.medications.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || p.status === statusFilter;
    const matchesPriority = !priorityFilter || p.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const columns = [
    {
      title: 'Rx ID',
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
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    {
      title: 'MRN',
      dataIndex: 'mrn',
      key: 'mrn',
      render: (mrn: string) => (
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
          {mrn}
        </span>
      ),
    },
    { title: 'Medications', dataIndex: 'medications', key: 'medications' },
    { title: 'Prescribed By', dataIndex: 'prescribedBy', key: 'prescribedBy' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <StatusTag
          status={priority.toLowerCase()}
          type="patient"
          customConfig={{
            urgent: { color: '#EF4444', bg: '#FEE2E2' },
            routine: { color: '#6B7280', bg: '#F3F4F6' },
          }}
        />
      ),
    },
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
        <div style={{ display: 'flex', gap: '8px' }}>
          <GradientButton variant="secondary" size="small">
            View
          </GradientButton>
          {record.status === 'pending' && (
            <GradientButton
              variant="primary"
              size="small"
              icon={<MedicineBoxOutlined />}
              onClick={() => {
                setSelectedPrescription(record);
                setIsDispenseModalVisible(true);
              }}
            >
              Dispense
            </GradientButton>
          )}
          {record.status === 'dispensed' && (
            <GradientButton
              variant="secondary"
              size="small"
              icon={<PrinterOutlined />}
            >
              Reprint
            </GradientButton>
          )}
        </div>
      ),
    },
  ];

  const handleDispense = () => {
    form.validateFields().then((values) => {
      message.success(`Prescription ${selectedPrescription?.id} dispensed successfully`);
      setIsDispenseModalVisible(false);
      form.resetFields();
    });
  };

  const pendingCount = prescriptions.filter(p => p.status === 'pending').length;
  const dispensedCount = prescriptions.filter(p => p.status === 'dispensed').length;

  return (
    <PageShell
      title="Medication Dispensing"
      subtitle="Process and track prescription dispensing"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Pending"
          value={pendingCount}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={0}
        />
        <StatCard
          label="Dispensed Today"
          value={dispensedCount}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="Total Prescriptions"
          value={prescriptions.length}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={2}
        />
        <StatCard
          label="Fill Rate"
          value={95}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={3}
          suffix="%"
        />
      </div>

      {/* Prescription Queue Section */}
      <div className="p-4 sm:p-6" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <div className="flex items-center gap-2 mb-4">
          <MedicineBoxOutlined style={{ color: '#6366F1', fontSize: '20px' }} />
          <h2 className="text-lg font-semibold text-gray-900">Prescription Queue</h2>
        </div>

        <SearchFilterBar
          searchPlaceholder="Search prescriptions by patient, Rx ID, or medications..."
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
              ],
              onChange: (value) => setStatusFilter(value as string | undefined),
            },
            {
              key: 'priority',
              label: 'Priority',
              value: priorityFilter,
              options: [
                { label: 'All Priority', value: '' },
                { label: 'Urgent', value: 'Urgent' },
                { label: 'Routine', value: 'Routine' },
              ],
              onChange: (value) => setPriorityFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredPrescriptions.length}
          totalCount={prescriptions.length}
          filterLabel="prescriptions"
        />

        <ModernTable
          dataSource={filteredPrescriptions}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Dispense Modal */}
      <Modal
        title={<span style={{ fontSize: '18px', fontWeight: 600 }}>Dispense Prescription: {selectedPrescription?.id}</span>}
        open={isDispenseModalVisible}
        onOk={handleDispense}
        onCancel={() => setIsDispenseModalVisible(false)}
        width={700}
        okText="Confirm Dispense"
        cancelText={<GradientButton variant="secondary">Cancel</GradientButton>}
        okButtonProps={{ style: { height: '42px', borderRadius: '10px' } }}
      >
        {selectedPrescription && (
          <div>
            <InfoCard
              title="Prescription Details"
              icon={<MedicineBoxOutlined />}
              color="#3B82F6"
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Patient</div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B' }}>{selectedPrescription.patient}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>MRN</div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B' }}>{selectedPrescription.mrn}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Medications</div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B' }}>{selectedPrescription.medications}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Prescribed By</div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B' }}>{selectedPrescription.prescribedBy}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Date</div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B' }}>{selectedPrescription.date}</div>
                </div>
              </div>
            </InfoCard>

            <Form form={form} layout="vertical">
              <Form.Item name="dispensedBy" label="Dispensed By" rules={[{ required: true }]}>
                <select
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '14px',
                  }}
                >
                  <option value="">Select pharmacist</option>
                  <option value="pharmacist1">Chukwu Emeka</option>
                  <option value="pharmacist2">Amina Yusuf</option>
                  <option value="pharmacist3">Grace Okafor</option>
                </select>
              </Form.Item>

              <Form.Item name="verified" label="Verified By" rules={[{ required: true }]}>
                <select
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '14px',
                  }}
                >
                  <option value="">Select verifier</option>
                  <option value="verifier1">Dr. Pharmacist Okonkwo</option>
                  <option value="verifier2">Dr. Pharmacist Eze</option>
                </select>
              </Form.Item>

              <Form.Item name="batchNumbers" label="Batch Numbers">
                <textarea
                  rows={2}
                  placeholder="Enter batch numbers for each medication"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />
              </Form.Item>

              <Form.Item name="expiryDates" label="Expiry Dates Checked" rules={[{ required: true }]}>
                <select
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '14px',
                  }}
                >
                  <option value="yes">Yes, all verified</option>
                  <option value="no">No, some issues</option>
                </select>
              </Form.Item>

              <Form.Item name="instructions" label="Special Instructions">
                <textarea
                  rows={2}
                  placeholder="Enter any special instructions for patient"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </PageShell>
  );
}
