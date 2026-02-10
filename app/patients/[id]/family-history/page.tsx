'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Form, Input, Button, Typography, Space, List, Tag, Modal, Row, Col, Empty, Popconfirm, App, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, HeartOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/shared/PageHeader';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser } from '@/lib/dataFilters';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age?: number;
  conditions: string[];
  notes: string;
}

export default function PatientFamilyHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const { message } = App.useApp();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

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

  const [familyHistory, setFamilyHistory] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'James Okonkwo',
      relationship: 'Father',
      age: 72,
      conditions: ['Hypertension', 'Type 2 Diabetes'],
      notes: 'Diagnosed at age 55, manages with medication'},
    {
      id: '2',
      name: 'Grace Okonkwo',
      relationship: 'Mother',
      age: 68,
      conditions: ['Breast Cancer'],
      notes: 'In remission since 2015'},
    {
      id: '3',
      name: 'Emeka Okonkwo',
      relationship: 'Brother',
      age: 42,
      conditions: ['Asthma'],
      notes: 'Childhood onset, seasonal triggers'},
  ]);

  const conditionOptions = [
    'Hypertension',
    'Diabetes Type 1',
    'Diabetes Type 2',
    'Heart Disease',
    'Stroke',
    'Cancer',
    'Asthma',
    'Arthritis',
    'Depression',
    'Anxiety',
    'Obesity',
    'Kidney Disease',
    'Liver Disease',
    'Thyroid Disorders',
    'Alzheimer\'s',
    'Other',
  ];

  const handleAdd = () => {
    setEditingMember(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member);
    form.setFieldsValue(member);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setFamilyHistory(familyHistory.filter((m: any) => m.id !== id));
    message.success('Family member record deleted');
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newMember: FamilyMember = {
        id: editingMember?.id || Date.now().toString(),
        ...values};

      if (editingMember) {
        setFamilyHistory(familyHistory.map((m) => (m.id === editingMember.id ? newMember : m)));
        message.success('Family history updated');
      } else {
        setFamilyHistory([...familyHistory, newMember]);
        message.success('Family member added');
      }

      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const getConditionColor = (condition: string) => {
    const colors: Record<string, string> = {
      'Hypertension': 'red',
      'Diabetes Type 1': 'orange',
      'Diabetes Type 2': 'orange',
      'Heart Disease': 'red',
      'Stroke': 'red',
      'Cancer': 'purple',
      'Asthma': 'blue',
      'Arthritis': 'yellow',
      'Depression': 'green',
      'Anxiety': 'green',
      'Obesity': 'orange',
      'Alzheimer\'s': 'purple'};
    return colors[condition] || 'default';
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <PageHeader
        title={`${patient.firstName} ${patient.lastName} - Family History`}
        subtitle={`MRN: ${patient.mrn}`}
        extra={
          <Space>
            <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
              Add Family Member
            </Button>
            <Button onClick={() => router.push(`/patients/${patient.id}`)}>Back to Patient</Button>
          </Space>
        }
      />

      <Row gutter={[24, 24]}>
        {/* Summary Card */}
        <Col xs={24} lg={8}>
          <Card>
            <Title level={5} className="mb-4">Family History Summary</Title>
            <div className="space-y-4">
              <div>
                <Text type="secondary">Total Family Members</Text>
                <Title level={3} className="!mb-0">{familyHistory.length}</Title>
              </div>
              <div>
                <Text type="secondary">Reported Conditions</Text>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.from(new Set(familyHistory.flatMap((m) => m.conditions))).map((condition) => (
                    <Tag key={condition} color={getConditionColor(condition)}>
                      {condition}
                    </Tag>
                  ))}
                </div>
              </div>
              <div>
                <Text type="secondary">Conditions Requiring Monitoring</Text>
                <div className="mt-2">
                  {['Hypertension', 'Diabetes Type 2', 'Heart Disease'].filter((c: any) =>
                    familyHistory.some((m) => m.conditions.includes(c))
                  ).map((condition) => (
                    <Tag key={condition} color="warning" className="mb-1">
                      {condition}
                    </Tag>
                  ))}
                  {familyHistory.every((m) => !['Hypertension', 'Diabetes Type 2', 'Heart Disease'].some((c) => m.conditions.includes(c))) && (
                    <Text type="secondary" className="text-sm">No high-risk conditions identified</Text>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Family Members List */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <UserOutlined style={{ color: '#3B82F6' }} />
                <span>Family Members</span>
              </Space>
            }
          >
            {familyHistory.length > 0 ? (
              <List
                dataSource={familyHistory}
                renderItem={(member) => (
                  <List.Item
                    actions={[
                      <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(member)} />,
                      <Popconfirm
                        title="Are you sure you want to delete this record?"
                        onConfirm={() => handleDelete(member.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 600}}
                        >
                          {member.name.charAt(0)}
                        </div>
                      }
                      title={
                        <Space>
                          <span className="font-medium">{member.name}</span>
                          <Tag color="blue">{member.relationship}</Tag>
                          {member.age && <Text type="secondary">Age {member.age}</Text>}
                        </Space>
                      }
                      description={
                        <div>
                          <div className="mb-1">
                            {member.conditions.map((condition) => (
                              <Tag key={condition} color={getConditionColor(condition)} className="mb-1">
                                {condition}
                              </Tag>
                            ))}
                          </div>
                          {member.notes && (
                            <Text type="secondary" className="text-sm">
                              {member.notes}
                            </Text>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No family history recorded" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <Modal
        title={editingMember ? 'Edit Family Member' : 'Add Family Member'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="relationship"
                label="Relationship"
                rules={[{ required: true, message: 'Please select relationship' }]}
              >
                <Input placeholder="e.g., Father, Mother, Brother" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="age" label="Age (Optional)">
                <Input type="number" placeholder="Age" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="conditions"
            label="Medical Conditions"
            rules={[{ required: true, message: 'Please select at least one condition' }]}
          >
            <Select
              mode="tags"
              placeholder="Select or type conditions"
              options={conditionOptions.map((c) => ({ label: c, value: c }))}
            />
          </Form.Item>

          <Form.Item name="notes" label="Additional Notes">
            <TextArea rows={3} placeholder="Any additional information..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
