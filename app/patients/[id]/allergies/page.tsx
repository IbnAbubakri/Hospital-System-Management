'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Typography, Space, List, Tag, Button, Modal, Form, Input, Select, Row, Col, Alert, Empty, Popconfirm, App, Descriptions } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, WarningOutlined, ExclamationCircleOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/shared/PageHeader';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser } from '@/lib/dataFilters';

const { Title, Text } = Typography;

interface Allergy {
  id: string;
  name: string;
  category: 'Drug' | 'Food' | 'Environmental' | 'Other';
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Life-Threatening';
  reaction: string;
  diagnosedDate: string;
  diagnosedBy: string;
  notes: string;
}

export default function PatientAllergiesPage() {
  const params = useParams();
  const router = useRouter();
  const { message } = App.useApp();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAllergy, setEditingAllergy] = useState<Allergy | null>(null);

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

  const [allergies, setAllergies] = useState<Allergy[]>([
    {
      id: '1',
      name: 'Penicillin',
      category: 'Drug',
      severity: 'Severe',
      reaction: 'Anaphylaxis, difficulty breathing, swelling',
      diagnosedDate: '2020-03-15',
      diagnosedBy: 'Dr. Emeka Adeleke',
      notes: 'Carry epinephrine auto-injector at all times'},
    {
      id: '2',
      name: 'Peanuts',
      category: 'Food',
      severity: 'Moderate',
      reaction: 'Hives, itching, mild swelling',
      diagnosedDate: '2019-08-22',
      diagnosedBy: 'Dr. Aisha Yusuf',
      notes: 'Avoid all peanut products'},
    {
      id: '3',
      name: 'Pollen',
      category: 'Environmental',
      severity: 'Mild',
      reaction: 'Sneezing, runny nose, itchy eyes',
      diagnosedDate: '2018-04-10',
      diagnosedBy: 'Dr. Ibrahim Musa',
      notes: 'Seasonal - worse in spring'},
  ]);

  const handleAdd = () => {
    setEditingAllergy(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (allergy: Allergy) => {
    setEditingAllergy(allergy);
    form.setFieldsValue(allergy);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAllergies(allergies.filter((a: any) => a.id !== id));
    message.success('Allergy record deleted');
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newAllergy: Allergy = {
        id: editingAllergy?.id || Date.now().toString(),
        ...values};

      if (editingAllergy) {
        setAllergies(allergies.map((a) => (a.id === editingAllergy.id ? newAllergy : a)));
        message.success('Allergy updated');
      } else {
        setAllergies([...allergies, newAllergy]);
        message.success('Allergy added');
      }

      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      'Mild': 'green',
      'Moderate': 'orange',
      'Severe': 'red',
      'Life-Threatening': 'purple'};
    return colors[severity] || 'default';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Drug': 'blue',
      'Food': 'orange',
      'Environmental': 'green',
      'Other': 'default'};
    return colors[category] || 'default';
  };

  const hasSevereAllergies = allergies.some((a) => a.severity === 'Severe' || a.severity === 'Life-Threatening');

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <PageHeader
        title={`${patient.firstName} ${patient.lastName} - Allergies`}
        subtitle={`MRN: ${patient.mrn}`}
        extra={
          <Space>
            <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
              Add Allergy
            </Button>
            <Button onClick={() => router.push(`/patients/${patient.id}`)}>Back to Patient</Button>
          </Space>
        }
      />

      {hasSevereAllergies && (
        <Alert
          title="Severe Allergies Detected"
          description="This patient has severe or life-threatening allergies. Exercise extreme caution when prescribing medications or treatments."
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: '24px' }}
        />
      )}

      <Row gutter={[24, 24]}>
        {/* Summary Card */}
        <Col xs={24} lg={8}>
          <Card>
            <Title level={5} className="mb-4">Allergy Summary</Title>
            <div className="space-y-4">
              <div>
                <Text type="secondary">Total Allergies</Text>
                <Title level={3} className="!mb-0">{allergies.length}</Title>
              </div>
              <div>
                <Text type="secondary">Severity Breakdown</Text>
                <div className="space-y-1 mt-2">
                  {['Mild', 'Moderate', 'Severe', 'Life-Threatening'].map((severity) => {
                    const count = allergies.filter((a: any) => a.severity === severity).length;
                    return count > 0 ? (
                      <div key={severity} className="flex justify-between items-center">
                        <Tag color={getSeverityColor(severity)}>{severity}</Tag>
                        <Text strong>{count}</Text>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              <div>
                <Text type="secondary">Categories</Text>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.from(new Set(allergies.map((a) => a.category))).map((category) => (
                    <Tag key={category} color={getCategoryColor(category)}>
                      {category}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Critical Allergies Alert */}
          {hasSevereAllergies && (
            <Card style={{ marginTop: '16px', background: '#FEF2F2', borderColor: '#FECACA' }}>
              <Space>
                <WarningOutlined style={{ color: '#DC2626', fontSize: '20px' }} />
                <div>
                  <Title level={5} className="!mb-1" style={{ color: '#DC2626' }}>
                    Critical Warning
                  </Title>
                  <Text type="secondary" className="text-sm">
                    All medications must be checked against these allergies before administration
                  </Text>
                </div>
              </Space>
            </Card>
          )}
        </Col>

        {/* Allergies List */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <MedicineBoxOutlined style={{ color: '#EF4444' }} />
                <span>Recorded Allergies</span>
              </Space>
            }
          >
            {allergies.length > 0 ? (
              <List
                dataSource={allergies}
                renderItem={(allergy) => (
                  <List.Item
                    style={{
                      borderLeft: `4px solid ${allergy.severity === 'Severe' || allergy.severity === 'Life-Threatening' ? '#DC2626' : '#D1D5DB'}`,
                      paddingLeft: '16px',
                      background: allergy.severity === 'Severe' || allergy.severity === 'Life-Threatening' ? '#FEF2F2' : 'transparent'}}
                    actions={[
                      <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(allergy)} />,
                      <Popconfirm
                        title="Are you sure you want to delete this allergy record?"
                        onConfirm={() => handleDelete(allergy.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <span className="font-medium text-lg">{allergy.name}</span>
                          <Tag color={getCategoryColor(allergy.category)}>{allergy.category}</Tag>
                          <Tag color={getSeverityColor(allergy.severity)}>{allergy.severity}</Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <Descriptions column={1} size="small">
                            <Descriptions.Item label="Reaction">{allergy.reaction}</Descriptions.Item>
                            <Descriptions.Item label="Diagnosed">{allergy.diagnosedDate}</Descriptions.Item>
                            <Descriptions.Item label="Diagnosed By">{allergy.diagnosedBy}</Descriptions.Item>
                          </Descriptions>
                          {allergy.notes && (
                            <Alert
                              title={allergy.notes}
                              type="info"
                              showIcon
                              style={{ marginTop: '8px' }}
                            />
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No allergies recorded" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <Modal
        title={editingAllergy ? 'Edit Allergy' : 'Add Allergy'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Allergen Name"
            rules={[{ required: true, message: 'Please enter the allergen name' }]}
          >
            <Input placeholder="e.g., Penicillin, Peanuts, Pollen" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  <Select.Option value="Drug">Drug</Select.Option>
                  <Select.Option value="Food">Food</Select.Option>
                  <Select.Option value="Environmental">Environmental</Select.Option>
                  <Select.Option value="Other">Other</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="severity"
                label="Severity"
                rules={[{ required: true, message: 'Please select severity' }]}
              >
                <Select placeholder="Select severity">
                  <Select.Option value="Mild">Mild</Select.Option>
                  <Select.Option value="Moderate">Moderate</Select.Option>
                  <Select.Option value="Severe">Severe</Select.Option>
                  <Select.Option value="Life-Threatening">Life-Threatening</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="reaction"
            label="Reaction Symptoms"
            rules={[{ required: true, message: 'Please describe the reaction' }]}
          >
            <Input.TextArea rows={3} placeholder="Describe the allergic reaction symptoms..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="diagnosedDate"
                label="Diagnosed Date"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="diagnosedBy"
                label="Diagnosed By"
                rules={[{ required: true, message: 'Please enter diagnosing doctor' }]}
              >
                <Input placeholder="Doctor's name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="notes" label="Additional Notes">
            <Input.TextArea rows={3} placeholder="Any additional information..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
