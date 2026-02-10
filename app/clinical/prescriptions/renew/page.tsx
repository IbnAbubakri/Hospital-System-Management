'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Modal, Form, Select, InputNumber, DatePicker, App, Input } from 'antd';
import { MedicineBoxOutlined, CheckOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function PrescriptionRenewPage() {
  const [isRenewModalVisible, setIsRenewModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [selectedPrescription, setSelectedPrescription] = React.useState<any>(null);
  const [form] = Form.useForm();

  const prescriptions = [
    {
      id: 'RX-2024-0892',
      patient: 'Ngozi Eze',
      mrn: 'MRN-2024-0005',
      medication: 'Amlodipine 10mg',
      dosage: '1 tablet daily',
      prescribedBy: 'Dr. Okonkwo',
      prescribedDate: '2024-01-15',
      expires: '2024-02-15',
      refillsRemaining: 0,
      status: 'Expiring Soon',
      department: 'Cardiology'},
    {
      id: 'RX-2024-0891',
      patient: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-2024-0001',
      medication: 'Metformin 500mg',
      dosage: '2 tablets daily',
      prescribedBy: 'Dr. Nnamdi',
      prescribedDate: '2024-01-20',
      expires: '2024-02-20',
      refillsRemaining: 1,
      status: 'Active',
      department: 'General Medicine'},
    {
      id: 'RX-2024-0890',
      patient: 'Tobi Okafor',
      mrn: 'MRN-2024-0007',
      medication: 'Lisinopril 20mg',
      dosage: '1 tablet daily',
      prescribedBy: 'Dr. Okonkwo',
      prescribedDate: '2024-01-10',
      expires: '2024-02-10',
      refillsRemaining: 0,
      status: 'Expiring Soon',
      department: 'Cardiology'},
    {
      id: 'RX-2024-0889',
      patient: 'Adaobi Nwosu',
      mrn: 'MRN-2024-0003',
      medication: 'Atorvastatin 20mg',
      dosage: '1 tablet at night',
      prescribedBy: 'Dr. Eze',
      prescribedDate: '2024-01-25',
      expires: '2024-02-25',
      refillsRemaining: 2,
      status: 'Active',
      department: 'Cardiology'},
    {
      id: 'RX-2024-0888',
      patient: 'Emeka Okafor',
      mrn: 'MRN-2024-0002',
      medication: 'Omeprazole 20mg',
      dosage: '1 tablet before meals',
      prescribedBy: 'Dr. Nnamdi',
      prescribedDate: '2024-01-05',
      expires: '2024-02-05',
      refillsRemaining: 0,
      status: 'Expired',
      department: 'Gastroenterology'},
  ];

  const columns = [
    { title: 'Rx ID', dataIndex: 'id', key: 'id' },
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'MRN', dataIndex: 'mrn', key: 'mrn', render: (mrn: string) => <Tag color="blue">{mrn}</Tag> },
    { title: 'Medication', dataIndex: 'medication', key: 'medication' },
    { title: 'Dosage', dataIndex: 'dosage', key: 'dosage' },
    { title: 'Prescribed By', dataIndex: 'prescribedBy', key: 'prescribedBy' },
    { title: 'Expires', dataIndex: 'expires', key: 'expires' },
    {
      title: 'Refills Left',
      dataIndex: 'refillsRemaining',
      key: 'refillsRemaining',
      render: (count: number) => <Tag color={count > 0 ? 'success' : 'error'}>{count}</Tag>},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Active' ? 'success' : status === 'Expiring Soon' ? 'warning' : 'error';
        return <Tag color={color}>{status}</Tag>;
      }},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: any) => (
        <Button
          type="primary"
          size="small"
          icon={<CheckOutlined />}
          onClick={() => {
            setSelectedPrescription(record);
            setIsRenewModalVisible(true);
            form.setFieldsValue({
              medication: record.medication,
              dosage: record.dosage});
          }}
        >
          Renew
        </Button>
      )},
  ];

  const handleRenew = () => {
    form.validateFields().then((values) => {
      message.success(`Prescription for ${selectedPrescription.medication} renewed successfully`);
      setIsRenewModalVisible(false);
      form.resetFields();
      setSelectedPrescription(null);
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-6">
        <Title level={3}>Prescription Renewals</Title>
      </div>

      <Card title="Prescriptions Requiring Renewal">
        <Table
          dataSource={prescriptions}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={`Renew Prescription: ${selectedPrescription?.medication}`}
        open={isRenewModalVisible}
        onOk={handleRenew}
        onCancel={() => {
          setIsRenewModalVisible(false);
          setSelectedPrescription(null);
          form.resetFields();
        }}
        width={600}
      >
        {selectedPrescription && (
          <div>
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p><strong>Patient:</strong> {selectedPrescription.patient} ({selectedPrescription.mrn})</p>
              <p><strong>Current Dosage:</strong> {selectedPrescription.dosage}</p>
              <p><strong>Original Prescriber:</strong> {selectedPrescription.prescribedBy}</p>
              <p><strong>Expires:</strong> {selectedPrescription.expires}</p>
            </div>

            <Form form={form} layout="vertical">
              <Form.Item name="medication" label="Medication">
                <Input disabled />
              </Form.Item>

              <Form.Item name="dosage" label="Dosage Instructions" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="1 tablet daily">1 tablet daily</Select.Option>
                  <Select.Option value="2 tablets daily">2 tablets daily</Select.Option>
                  <Select.Option value="1 tablet twice daily">1 tablet twice daily</Select.Option>
                  <Select.Option value="1 tablet at night">1 tablet at night</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                <InputNumber min={1} max={365} style={{ width: '100%' }} placeholder="Enter quantity" />
              </Form.Item>

              <Form.Item name="refills" label="Number of Refills" rules={[{ required: true }]}>
                <InputNumber min={0} max={12} style={{ width: '100%' }} placeholder="Enter refills" />
              </Form.Item>

              <Form.Item name="expires" label="New Expiration Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item name="notes" label="Notes">
                <Input.TextArea rows={3} placeholder="Enter any notes" />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
}
