'use client';

import React from 'react';
import { Form, Select, Input, Button, Card, Space, Table, Tag, Row, Col } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

interface PrescriptionFormProps {
  onSubmit?: (values: { [key: string]: string | number }) => void;
}

const mockMedications = [
  { id: '1', name: 'Amoxicillin 500mg', category: 'Antibiotic' },
  { id: '2', name: 'Ibuprofen 400mg', category: 'Analgesic' },
  { id: '3', name: 'Omeprazole 20mg', category: 'Antacid' },
  { id: '4', name: 'Metformin 500mg', category: 'Antidiabetic' },
  { id: '5', name: 'Lisinopril 10mg', category: 'Antihypertensive' },
  { id: '6', name: 'Atorvastatin 20mg', category: 'Lipid lowering' },
];

export function PrescriptionForm({ onSubmit }: PrescriptionFormProps) {
  const [form] = Form.useForm();
  const [medications, setMedications] = React.useState<any[]>([]);

  const handleAddMedication = () => {
    const values = form.getFieldsValue();
    if (values.medication && values.dosage && values.frequency && values.duration) {
      const medication = {
        key: Date.now(),
        name: mockMedications.find((m) => m.id === values.medication)?.name || values.medication,
        dosage: values.dosage,
        frequency: values.frequency,
        route: values.route || 'oral',
        duration: `${values.duration} ${values.durationUnit || 'days'}`,
        instructions: values.instructions || '-',
      };
      setMedications([...medications, medication]);
      form.resetFields(['medication', 'dosage', 'frequency', 'route', 'duration', 'durationUnit', 'instructions']);
    }
  };

  const handleRemoveMedication = (key: number) => {
    setMedications(medications.filter((m) => m.key !== key));
  };

  const handleSubmit = () => {
    if (medications.length === 0) {
      return;
    }
    if (onSubmit) {
      onSubmit({ medications });
    }
  };

  const columns = [
    { title: 'Medication', dataIndex: 'name', key: 'name' },
    { title: 'Dosage', dataIndex: 'dosage', key: 'dosage' },
    { title: 'Frequency', dataIndex: 'frequency', key: 'frequency' },
    { title: 'Route', dataIndex: 'route', key: 'route', render: (r: string) => <Tag>{r}</Tag> },
    { title: 'Duration', dataIndex: 'duration', key: 'duration' },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: unknown) => (
        <Button type="link" danger onClick={() => handleRemoveMedication(record.key)}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <Space orientation="vertical" className="w-full" size="large">
      {/* Medication Selection */}
      <Card title="Add Medication" size="small">
        <Form form={form} layout="vertical">
          <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Medication" name="medication">
              <Select placeholder="Search medication" showSearch optionFilterProp="children">
                {mockMedications.map((med) => (
                  <Option key={med.id} value={med.id}>
                    {med.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Form.Item label="Dosage" name="dosage">
              <Select placeholder="Select">
                <Option value="500mg">500mg</Option>
                <Option value="250mg">250mg</Option>
                <Option value="1 tablet">1 tablet</Option>
                <Option value="2 tablets">2 tablets</Option>
                <Option value="5ml">5ml</Option>
                <Option value="10ml">10ml</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Form.Item label="Frequency" name="frequency">
              <Select placeholder="Select">
                <Option value="Once daily">Once daily</Option>
                <Option value="Twice daily">Twice daily</Option>
                <Option value="Three times daily">Three times daily</Option>
                <Option value="Four times daily">Four times daily</Option>
                <Option value="Every 8 hours">Every 8 hours</Option>
                <Option value="Every 6 hours">Every 6 hours</Option>
                <Option value="SOS">SOS (As needed)</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={12} sm={6} md={4}>
            <Form.Item label="Route" name="route" initialValue="oral">
              <Select>
                <Option value="oral">Oral</Option>
                <Option value="iv">IV</Option>
                <Option value="im">IM</Option>
                <Option value="topical">Topical</Option>
                <Option value="inhaled">Inhaled</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Form.Item label="Duration" name="duration">
              <Input type="number" placeholder="5" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Form.Item label=" " name="durationUnit" initialValue="days">
              <Select>
                <Option value="days">Days</Option>
                <Option value="weeks">Weeks</Option>
                <Option value="months">Months</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Special Instructions" name="instructions">
              <Input placeholder="e.g., Take after meals" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={9}>
            <Form.Item label=" ">
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMedication}>
                Add to Prescription
              </Button>
            </Form.Item>
          </Col>
        </Row>
        </Form>
      </Card>

      {/* Medications List */}
      {medications.length > 0 && (
        <Card title="Prescribed Medications" size="small">
          <Table
            dataSource={medications}
            columns={columns}
            pagination={false}
            size="small"
          />
          <div className="mt-4">
            <Button type="primary" size="large" block onClick={handleSubmit}>
              Save & Send to Pharmacy
            </Button>
          </div>
        </Card>
      )}
    </Space>
  );
}
