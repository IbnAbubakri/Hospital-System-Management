'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Typography, Space, List, Tag, Button, Modal, Form, Input, Select, Row, Col, Alert, Empty, Descriptions, DatePicker, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HeartOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/shared/PageHeader';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser } from '@/lib/dataFilters';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ChronicCondition {
  id: string;
  name: string;
  icdCode: string;
  status: 'Active' | 'Controlled' | 'In Remission';
  diagnosedDate: string;
  diagnosedBy: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  treatment: string;
  lastVisit: string;
  nextFollowUp: string;
  notes: string;
}

export default function PatientConditionsPage() {
  const params = useParams();
  const router = useRouter();
  const { message } = App.useApp();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState<ChronicCondition | null>(null);

  const accessiblePatients = useMemo(() => {
    if (!user) return [];
    return filterPatientsByUser(user);
  }, [user]);

  const patient = accessiblePatients.find((p: any) => p.id === params.id) as any;

  if (!patient) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <Title level={3}>Access Denied</Title>
        <Text>Patient not found or you do not have permission to view this page.</Text>
        <br />
        <Button type="primary" onClick={() => router.back()} style={{ marginTop: '16px' }}>
          Go Back
        </Button>
      </div>
    );
  }

  const [conditions, setConditions] = useState<ChronicCondition[]>([
    {
      id: '1',
      name: 'Hypertension',
      icdCode: 'I10',
      status: 'Active',
      diagnosedDate: '2020-03-15',
      diagnosedBy: 'Dr. Emeka Adeleke',
      severity: 'Moderate',
      treatment: 'Amlodipine 10mg daily, Lisinopril 20mg daily',
      lastVisit: '2024-01-25',
      nextFollowUp: '2024-04-15',
      notes: 'Blood pressure well controlled with current medication'},
    {
      id: '2',
      name: 'Type 2 Diabetes Mellitus',
      icdCode: 'E11.9',
      status: 'Controlled',
      diagnosedDate: '2019-08-22',
      diagnosedBy: 'Dr. Ibrahim Musa',
      severity: 'Mild',
      treatment: 'Metformin 500mg twice daily',
      lastVisit: '2024-01-10',
      nextFollowUp: '2024-03-20',
      notes: 'HbA1c within target range'},
  ]);

  const handleAdd = () => {
    setEditingCondition(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (condition: ChronicCondition) => {
    setEditingCondition(condition);
    form.setFieldsValue({
      ...condition,
      diagnosedDate: dayjs(condition.diagnosedDate),
      lastVisit: dayjs(condition.lastVisit),
      nextFollowUp: dayjs(condition.nextFollowUp)});
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setConditions(conditions.filter((c: any) => c.id !== id));
    message.success('Condition deleted');
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newCondition: ChronicCondition = {
        id: editingCondition?.id || Date.now().toString(),
        ...(values as any),
        diagnosedDate: values.diagnosedDate.format('YYYY-MM-DD'),
        lastVisit: values.lastVisit.format('YYYY-MM-DD'),
        nextFollowUp: values.nextFollowUp.format('YYYY-MM-DD')};

      if (editingCondition) {
        setConditions(conditions.map((c) => (c.id === editingCondition.id ? newCondition : c)));
        message.success('Condition updated');
      } else {
        setConditions([...conditions, newCondition]);
        message.success('Condition added');
      }

      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Active': 'red',
      'Controlled': 'green',
      'In Remission': 'blue'};
    return colors[status] || 'default';
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      'Mild': 'green',
      'Moderate': 'orange',
      'Severe': 'red'};
    return colors[severity] || 'default';
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <PageHeader
        title={`${patient.firstName} ${patient.lastName} - Chronic Conditions`}
        subtitle={`MRN: ${patient.mrn}`}
        extra={
          <Space>
            <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
              Add Condition
            </Button>
            <Button onClick={() => router.push(`/patients/${patient.id}`)}>Back to Patient</Button>
          </Space>
        }
      />

      <Row gutter={[24, 24]}>
        {/* Summary Card */}
        <Col xs={24} lg={6}>
          <Card>
            <Title level={5} className="mb-4">Conditions Overview</Title>
            <div className="space-y-3">
              <div>
                <Text type="secondary">Total Conditions</Text>
                <Title level={3} className="!mb-0">{conditions.length}</Title>
              </div>
              <div>
                <Text type="secondary">Status</Text>
                <div className="space-y-1 mt-2">
                  {['Active', 'Controlled', 'In Remission'].map((status) => {
                    const count = conditions.filter((c: any) => c.status === status).length;
                    return count > 0 ? (
                      <div key={status} className="flex justify-between items-center">
                        <Tag color={getStatusColor(status)}>{status}</Tag>
                        <Text strong>{count}</Text>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Conditions List */}
        <Col xs={24} lg={18}>
          <Space orientation="vertical" size="large" style={{ width: '100%' }}>
            {conditions.map((condition) => (
              <Card
                key={condition.id}
                title={
                  <Space>
                    <HeartOutlined style={{ color: getStatusColor(condition.status) }} />
                    <span>{condition.name}</span>
                    <Tag>{condition.icdCode}</Tag>
                    <Tag color={getStatusColor(condition.status)}>{condition.status}</Tag>
                  </Space>
                }
                extra={
                  <Space>
                    <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(condition)} />
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(condition.id)} />
                  </Space>
                }
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Severity">
                        <Tag color={getSeverityColor(condition.severity)}>{condition.severity}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Diagnosed">{condition.diagnosedDate}</Descriptions.Item>
                      <Descriptions.Item label="Diagnosed By">{condition.diagnosedBy}</Descriptions.Item>
                    </Descriptions>
                  </Col>
                  <Col xs={24} md={12}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Last Visit">{condition.lastVisit}</Descriptions.Item>
                      <Descriptions.Item label="Next Follow-up">{condition.nextFollowUp}</Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>

                <div className="mt-3">
                  <Text strong>Treatment:</Text>
                  <div className="mt-1 p-3 bg-gray-50 rounded">
                    <Text>{condition.treatment}</Text>
                  </div>
                </div>

                {condition.notes && (
                  <Alert
                    title={condition.notes}
                    type="info"
                    showIcon
                    style={{ marginTop: '12px' }}
                  />
                )}
              </Card>
            ))}

            {conditions.length === 0 && (
              <Card>
                <Empty description="No chronic conditions recorded" />
              </Card>
            )}
          </Space>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <Modal
        title={editingCondition ? 'Edit Condition' : 'Add Condition'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="name"
                label="Condition Name"
                rules={[{ required: true, message: 'Please enter condition name' }]}
              >
                <Input placeholder="e.g., Hypertension, Diabetes" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="icdCode"
                label="ICD Code"
                rules={[{ required: true, message: 'Please enter ICD code' }]}
              >
                <Input placeholder="e.g., I10" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Controlled">Controlled</Select.Option>
                  <Select.Option value="In Remission">In Remission</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="severity"
                label="Severity"
                rules={[{ required: true, message: 'Please select severity' }]}
              >
                <Select placeholder="Select severity">
                  <Select.Option value="Mild">Mild</Select.Option>
                  <Select.Option value="Moderate">Moderate</Select.Option>
                  <Select.Option value="Severe">Severe</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="diagnosedBy"
                label="Diagnosed By"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input placeholder="Doctor's name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="diagnosedDate"
                label="Diagnosed Date"
                rules={[{ required: true, message: 'Required' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="lastVisit"
                label="Last Visit"
                rules={[{ required: true, message: 'Required' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="nextFollowUp"
                label="Next Follow-up"
                rules={[{ required: true, message: 'Required' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="treatment"
            label="Treatment Plan"
            rules={[{ required: true, message: 'Please enter treatment' }]}
          >
            <TextArea rows={3} placeholder="Current treatment plan..." />
          </Form.Item>

          <Form.Item name="notes" label="Additional Notes">
            <TextArea rows={2} placeholder="Any additional notes..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
