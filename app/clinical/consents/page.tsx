'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Modal, Form, Input, Select, DatePicker, App } from 'antd';
import { FileTextOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function ConsentsPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [selectedConsent, setSelectedConsent] = React.useState<any>(null);
  const [isViewModalVisible, setIsViewModalVisible] = React.useState(false);

  const consents = [
    {
      id: 'CON-2024-0892',
      patient: 'Ngozi Eze',
      mrn: 'MRN-2024-0005',
      type: 'Surgical Consent',
      procedure: 'Appendectomy',
      date: '2024-02-05',
      status: 'Signed',
      witness: 'Nurse Chioma',
      physician: 'Dr. Okonkwo'},
    {
      id: 'CON-2024-0891',
      patient: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-2024-0001',
      type: 'Blood Transfusion',
      procedure: 'Blood Transfusion',
      date: '2024-02-04',
      status: 'Signed',
      witness: 'Nurse Amina',
      physician: 'Dr. Eze'},
    {
      id: 'CON-2024-0890',
      patient: 'Tobi Okafor',
      mrn: 'MRN-2024-0007',
      type: 'Anesthesia Consent',
      procedure: 'General Anesthesia',
      date: '2024-02-03',
      status: 'Signed',
      witness: 'Nurse Grace',
      physician: 'Dr. Nnamdi'},
    {
      id: 'CON-2024-0889',
      patient: 'Adaobi Nwosu',
      mrn: 'MRN-2024-0003',
      type: 'Procedure Consent',
      procedure: 'Lumbar Puncture',
      date: '2024-02-02',
      status: 'Pending',
      witness: '-',
      physician: 'Dr. Okafor'},
    {
      id: 'CON-2024-0888',
      patient: 'Emeka Okafor',
      mrn: 'MRN-2024-0002',
      type: 'Research Consent',
      procedure: 'Clinical Trial Participation',
      date: '2024-02-01',
      status: 'Signed',
      witness: 'Dr. Okonkwo',
      physician: 'Dr. Eze'},
  ];

  const consentTypes = [
    'Surgical Consent',
    'Blood Transfusion',
    'Anesthesia Consent',
    'Procedure Consent',
    'Research Consent',
    'Photography Consent',
    'Telemedicine Consent',
    'Data Sharing Consent',
  ];

  const columns = [
    { title: 'Consent ID', dataIndex: 'id', key: 'id' },
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'MRN', dataIndex: 'mrn', key: 'mrn', render: (mrn: string) => <Tag color="blue">{mrn}</Tag> },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color="purple">{type}</Tag> },
    { title: 'Procedure', dataIndex: 'procedure', key: 'procedure' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Physician', dataIndex: 'physician', key: 'physician' },
    { title: 'Witness', dataIndex: 'witness', key: 'witness' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Signed' ? 'success' : 'warning'}>{status}</Tag>},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: any) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedConsent(record);
              setIsViewModalVisible(true);
            }}
          >
            View
          </Button>
          {record.status === 'Pending' && (
            <Button type="link" size="small">Send for Signature</Button>
          )}
        </Space>
      )},
  ];

  const handleCreate = () => {
    form.validateFields().then((values) => {
      message.success('Consent form created successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-6">
        <Title level={3}>Patient Consents</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Create Consent Form
        </Button>
      </div>

      <Card>
        <Table
          dataSource={consents}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Create Consent Form"
        open={isModalVisible}
        onOk={handleCreate}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="patient" label="Patient" rules={[{ required: true }]}>
            <Select placeholder="Select patient" showSearch>
              <Select.Option value="MRN-2024-0001">Chukwuemeka Okonkwo (MRN-2024-0001)</Select.Option>
              <Select.Option value="MRN-2024-0002">Emeka Okafor (MRN-2024-0002)</Select.Option>
              <Select.Option value="MRN-2024-0003">Adaobi Nwosu (MRN-2024-0003)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="type" label="Consent Type" rules={[{ required: true }]}>
            <Select placeholder="Select consent type">
              {consentTypes.map(type => <Select.Option key={type} value={type}>{type}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="procedure" label="Procedure/Description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Enter procedure details" />
          </Form.Item>
          <Form.Item name="physician" label="Physician" rules={[{ required: true }]}>
            <Select placeholder="Select physician">
              <Select.Option value="dr-okonkwo">Dr. Okonkwo</Select.Option>
              <Select.Option value="dr-eze">Dr. Eze</Select.Option>
              <Select.Option value="dr-nnamdi">Dr. Nnamdi</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Additional Notes">
            <Input.TextArea rows={2} placeholder="Enter any additional notes" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Consent Form Details"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="print" type="primary">Print</Button>,
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>Close</Button>,
        ]}
        width={700}
      >
        {selectedConsent && (
          <div>
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <h3 className="text-lg font-semibold mb-2">CONSENT FORM</h3>
              <p className="mb-2"><strong>Patient:</strong> {selectedConsent.patient} ({selectedConsent.mrn})</p>
              <p className="mb-2"><strong>Type:</strong> {selectedConsent.type}</p>
              <p className="mb-2"><strong>Procedure:</strong> {selectedConsent.procedure}</p>
              <p className="mb-2"><strong>Date:</strong> {selectedConsent.date}</p>
              <p className="mb-2"><strong>Physician:</strong> {selectedConsent.physician}</p>
              <p><strong>Witness:</strong> {selectedConsent.witness}</p>
            </div>
            <div className="p-4 border rounded">
              <p className="font-semibold mb-2">Consent Statement:</p>
              <p className="text-sm">
                I hereby authorize {selectedConsent.phician} to perform the procedure/treatment described above.
                I understand the nature of the procedure, the risks involved, and have had the opportunity to ask questions.
                I consent to the administration of anesthesia, if necessary, and to the performance of any additional procedures
                that may be deemed necessary during the course of the procedure.
              </p>
            </div>
            {selectedConsent.status === 'Signed' && (
              <div className="mt-4 p-4 bg-green-50 rounded border border-green-200">
                <p className="text-green-700 font-semibold">✓ This consent form has been signed</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
