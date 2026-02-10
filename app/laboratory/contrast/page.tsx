'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Form, Input, Select, InputNumber, App } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function LabContrastPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const allergies = [
    { id: 1, patient: 'Chukwuemeka Okonkwo', mrn: 'MRN-2024-0050', allergen: 'Iodine Contrast', severity: 'Severe', reaction: 'Anaphylaxis', dateRecorded: '2024-01-15', status: 'Active' },
    { id: 2, patient: 'Adanna Okafor', mrn: 'MRN-2024-0051', allergen: 'Gadolinium', severity: 'Moderate', reaction: 'Rash, Itching', dateRecorded: '2024-01-20', status: 'Active' },
    { id: 3, patient: 'Baby Ibrahim', mrn: 'MRN-2024-0075', allergen: 'Iodine Contrast', severity: 'Mild', reaction: 'Nausea', dateRecorded: '2024-01-25', status: 'Active' },
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'MRN', dataIndex: 'mrn', key: 'mrn', render: (mrn: string) => <Tag color="blue">{mrn}</Tag> },
    { title: 'Allergen', dataIndex: 'allergen', key: 'allergen' },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => {
        const color = severity === 'Severe' ? 'error' : severity === 'Moderate' ? 'warning' : 'default';
        return <Tag color={color}>{severity}</Tag>;
      }},
    { title: 'Reaction', dataIndex: 'reaction', key: 'reaction' },
    { title: 'Date Recorded', dataIndex: 'dateRecorded', key: 'dateRecorded' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color="success">{status}</Tag> },
  ];

  const handleAdd = () => {
    form.validateFields().then((values) => {
      message.success('Contrast allergy recorded successfully');
      form.resetFields();
    });
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Contrast Media Allergies</Title>

      <Card title={<><WarningOutlined style={{ color: '#F59E0B' }} /> Warning: Critical Allergy Information</>} className="p-4 sm:p-6" style={{ marginBottom: '24px', backgroundColor: '#FFF7E6', borderColor: '#FFD591' }}>
        <p className="mb-2"><strong>Important:</strong> These patients have documented contrast media allergies. Alternative imaging methods or premedication may be required.</p>
        <p>Always verify allergy status before ordering contrast-enhanced studies.</p>
      </Card>

      <div className="flex flex-col lg:flex-row gap-6">
        <Card title="Record New Allergy" style={{ flex: 1, maxWidth: '400px' }}>
          <Form form={form} layout="vertical">
            <Form.Item name="patient" label="Patient" rules={[{ required: true }]}>
              <Select placeholder="Select patient" showSearch>
                <Select.Option value="MRN-2024-0050">Chukwuemeka Okonkwo (MRN-2024-0050)</Select.Option>
                <Select.Option value="MRN-2024-0051">Adanna Okafor (MRN-2024-0051)</Select.Option>
                <Select.Option value="MRN-2024-0052">Emeka Okafor (MRN-2024-0052)</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="allergen" label="Contrast Agent" rules={[{ required: true }]}>
              <Select placeholder="Select allergen">
                <Select.Option value="iodine">Iodine Contrast</Select.Option>
                <Select.Option value="gadolinium">Gadolinium</Select.Option>
                <Select.Option value="barium">Barium Sulfate</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="severity" label="Severity" rules={[{ required: true }]}>
              <Select placeholder="Select severity">
                <Select.Option value="mild">Mild</Select.Option>
                <Select.Option value="moderate">Moderate</Select.Option>
                <Select.Option value="severe">Severe</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="reaction" label="Reaction Description" rules={[{ required: true }]}>
              <Input.TextArea rows={3} placeholder="Describe the allergic reaction" />
            </Form.Item>
            <Form.Item name="date" label="Date of Reaction" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="notes" label="Additional Notes">
              <Input.TextArea rows={2} placeholder="Enter any additional information" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" block onClick={handleAdd}>
                Record Allergy
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="Documented Allergies" className="flex-1">
          <div className="overflow-x-auto">
            <Table
              dataSource={allergies}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
