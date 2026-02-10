'use client';

import React from 'react';
import { PlusOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
import { Modal, Form, App } from 'antd';
import { PageShell, StatCard, ModernTable, StatusTag, GradientButton } from '@/components/design-system';

interface Prescription {
  id: string;
  patient: string;
  mrn: string;
  medication: string;
  dosage: string;
  quantity: number;
  refills: number;
  prescribedBy: string;
  date: string;
  status: string;
  dispensed: number;
}

export default function PharmacyPrescriptionsPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const prescriptions: Prescription[] = [
    {
      id: 'RX-2024-0892',
      patient: 'Ngozi Eze',
      mrn: 'MRN-2024-0005',
      medication: 'Amlodipine 10mg',
      dosage: '1 tablet daily',
      quantity: 30,
      refills: 3,
      prescribedBy: 'Dr. Okonkwo',
      date: '2024-02-05',
      status: 'active',
      dispensed: 0,
    },
    {
      id: 'RX-2024-0891',
      patient: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-2024-0001',
      medication: 'Metformin 500mg',
      dosage: '2 tablets daily',
      quantity: 60,
      refills: 2,
      prescribedBy: 'Dr. Eze',
      date: '2024-02-04',
      status: 'active',
      dispensed: 1,
    },
    {
      id: 'RX-2024-0890',
      patient: 'Tobi Okafor',
      mrn: 'MRN-2024-0007',
      medication: 'Paracetamol Syrup 120mg/5ml',
      dosage: '10ml every 6 hours',
      quantity: 120,
      refills: 0,
      prescribedBy: 'Dr. Nnamdi',
      date: '2024-02-03',
      status: 'completed',
      dispensed: 1,
    },
    {
      id: 'RX-2024-0889',
      patient: 'Adaobi Nwosu',
      mrn: 'MRN-2024-0003',
      medication: 'Ibuprofen 400mg',
      dosage: '1 tablet twice daily',
      quantity: 20,
      refills: 1,
      prescribedBy: 'Dr. Okafor',
      date: '2024-02-02',
      status: 'active',
      dispensed: 2,
    },
    {
      id: 'RX-2024-0888',
      patient: 'Emeka Okafor',
      mrn: 'MRN-2024-0002',
      medication: 'Lisinopril 20mg',
      dosage: '1 tablet daily',
      quantity: 30,
      refills: 3,
      prescribedBy: 'Dr. Nnamdi',
      date: '2024-02-01',
      status: 'on_hold',
      dispensed: 1,
    },
  ];

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
    { title: 'Medication', dataIndex: 'medication', key: 'medication' },
    { title: 'Dosage', dataIndex: 'dosage', key: 'dosage' },
    { title: 'Qty', dataIndex: 'quantity', key: 'quantity', render: (qty: number) => <span style={{ fontWeight: 500 }}>{qty}</span> },
    { title: 'Refills', dataIndex: 'refills', key: 'refills' },
    { title: 'Prescribed By', dataIndex: 'prescribedBy', key: 'prescribedBy' },
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
      render: () => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <GradientButton variant="secondary" size="small" icon={<EditOutlined />}>
            Edit
          </GradientButton>
          <GradientButton variant="primary" size="small" icon={<CheckOutlined />}>
            Dispense
          </GradientButton>
        </div>
      ),
    },
  ];

  const handleCreate = () => {
    form.validateFields().then((values) => {
      message.success('Prescription created successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const activePrescriptions = prescriptions.filter(p => p.status === 'active').length;
  const completedPrescriptions = prescriptions.filter(p => p.status === 'completed').length;
  const totalRefillsPending = prescriptions.reduce((sum, p) => sum + (p.refills > 0 ? 1 : 0), 0);

  return (
    <PageShell
      title="Prescription Management"
      subtitle="Create and manage patient prescriptions"
      action={
        <GradientButton icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          New Prescription
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Active Prescriptions"
          value={activePrescriptions}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={0}
        />
        <StatCard
          label="Completed Today"
          value={completedPrescriptions}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={1}
        />
        <StatCard
          label="Pending Refills"
          value={totalRefillsPending}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={2}
        />
        <StatCard
          label="Total Prescriptions"
          value={prescriptions.length}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={3}
        />
      </div>

      {/* All Prescriptions Section */}
      <div className="p-4 sm:p-6" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <div className="flex items-center gap-2 mb-4">
          <EditOutlined style={{ color: '#6366F1', fontSize: '20px' }} />
          <h2 className="text-lg font-semibold text-gray-900">All Prescriptions</h2>
        </div>

        <ModernTable
          dataSource={prescriptions}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Create Prescription Modal */}
      <Modal
        title={<span style={{ fontSize: '18px', fontWeight: 600 }}>Create New Prescription</span>}
        open={isModalVisible}
        onOk={handleCreate}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        okText="Create Prescription"
        okButtonProps={{ style: { height: '42px', borderRadius: '10px' } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="patient" label="Patient" rules={[{ required: true }]}>
            <select
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                fontSize: '14px',
              }}
            >
              <option value="">Select patient</option>
              <option value="MRN-2024-0001">Chukwuemeka Okonkwo (MRN-2024-0001)</option>
              <option value="MRN-2024-0002">Emeka Okafor (MRN-2024-0002)</option>
              <option value="MRN-2024-0003">Adaobi Nwosu (MRN-2024-0003)</option>
            </select>
          </Form.Item>

          <Form.Item name="medication" label="Medication" rules={[{ required: true }]}>
            <select
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                fontSize: '14px',
              }}
            >
              <option value="">Select medication</option>
              <option value="amlodipine">Amlodipine 10mg</option>
              <option value="metformin">Metformin 500mg</option>
              <option value="lisinopril">Lisinopril 20mg</option>
              <option value="paracetamol">Paracetamol Syrup 120mg/5ml</option>
            </select>
          </Form.Item>

          <Form.Item name="dosage" label="Dosage Instructions" rules={[{ required: true }]}>
            <select
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                fontSize: '14px',
              }}
            >
              <option value="">Select dosage</option>
              <option value="1 tablet daily">1 tablet daily</option>
              <option value="2 tablets daily">2 tablets daily</option>
              <option value="1 tablet twice daily">1 tablet twice daily</option>
              <option value="10ml every 6 hours">10ml every 6 hours</option>
            </select>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
              <input
                type="number"
                placeholder="Enter quantity"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '14px',
                }}
              />
            </Form.Item>

            <Form.Item name="refills" label="Number of Refills">
              <input
                type="number"
                placeholder="Enter refills"
                min={0}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '14px',
                }}
              />
            </Form.Item>
          </div>

          <Form.Item name="prescribedBy" label="Prescribing Physician" rules={[{ required: true }]}>
            <select
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                fontSize: '14px',
              }}
            >
              <option value="">Select physician</option>
              <option value="dr-okonkwo">Dr. Okonkwo</option>
              <option value="dr-eze">Dr. Eze</option>
              <option value="dr-nnamdi">Dr. Nnamdi</option>
            </select>
          </Form.Item>

          <Form.Item name="notes" label="Additional Notes">
            <textarea
              rows={3}
              placeholder="Enter any additional instructions"
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
      </Modal>
    </PageShell>
  );
}
