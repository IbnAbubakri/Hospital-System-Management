'use client';

import React, { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, DatePicker, Space, Typography, Modal, Row, Col, Empty, List, App } from 'antd';
import { PlusOutlined, CheckCircleOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import { PageShell, InfoCard, StatusTag, GradientButton } from '@/components/design-system';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser } from '@/lib/dataFilters';
import dayjs from 'dayjs';

const { Text } = Typography;
const { TextArea } = Input;

interface CarePlanTask {
  id: string;
  task: string;
  frequency: string;
  assignedTo: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: string;
}

interface CarePlan {
  id: string;
  patientId: string;
  title: string;
  diagnosis: string;
  goals: string[];
  interventions: string[];
  tasks: CarePlanTask[];
  startDate: string;
  endDate: string;
  createdBy: string;
  status: 'Active' | 'Completed' | 'On Hold';
}

export default function CarePlansPage() {
  const params = useParams();
  const router = useRouter();
  const { message } = App.useApp();
  const { user, hasPermission } = useAuth();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<CarePlan | null>(null);

  const accessiblePatients = useMemo(() => {
    if (!user) return [];
    return filterPatientsByUser(user);
  }, [user]);

  const patient = accessiblePatients.find((p: any) => p.id === params.id) as any;

  // CRITICAL SECURITY: Check permission and patient access
  if (!hasPermission('clinical:view_emr')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '24px' }}>
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #E2E8F0',
          }}
        >
          <div className="flex items-center gap-3 p-4" style={{ background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' }}>
            <FileTextOutlined style={{ color: '#DC2626', fontSize: '20px' }} />
            <div>
              <h3 className="font-semibold text-red-900">Access Denied</h3>
              <p className="text-sm text-red-700">You don&apos;tt have permission to view care plans. This area is restricted to clinical staff.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '24px' }}>
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #E2E8F0',
          }}
        >
          <div className="flex items-center gap-3 p-4" style={{ background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' }}>
            <UserOutlined style={{ color: '#DC2626', fontSize: '20px' }} />
            <div>
              <h3 className="font-semibold text-red-900">Patient Not Found</h3>
              <p className="text-sm text-red-700">Patient not found or you do not have permission to view this patient.</p>
            </div>
          </div>
          <div className="mt-4">
            <GradientButton onClick={() => router.back()}>
              Go Back
            </GradientButton>
          </div>
        </div>
      </div>
    );
  }

  const [carePlans, setCarePlans] = useState<CarePlan[]>([
    {
      id: '1',
      patientId: patient.id,
      title: 'Hypertension Management Plan',
      diagnosis: 'Essential Hypertension (I10)',
      goals: [
        'Maintain blood pressure below 130/80 mmHg',
        'Patient education on lifestyle modifications',
        'Medication adherence monitoring',
      ],
      interventions: [
        'Daily blood pressure monitoring',
        'Low sodium diet education',
        'Regular exercise recommendations',
        'Medication compliance review',
      ],
      tasks: [
        { id: 't1', task: 'BP Check', frequency: 'Daily', assignedTo: 'Nurse', status: 'Completed', dueDate: '2024-02-01' },
        { id: 't2', task: 'Diet Review', frequency: 'Weekly', assignedTo: 'Dietitian', status: 'In Progress', dueDate: '2024-02-05' },
        { id: 't3', task: 'Medication Review', frequency: 'Monthly', assignedTo: 'Physician', status: 'Pending', dueDate: '2024-02-15' },
      ],
      startDate: '2024-01-25',
      endDate: '2024-04-25',
      createdBy: 'Dr. Emeka Adeleke',
      status: 'Active',
    },
  ]);

  const handleAddPlan = () => {
    setSelectedPlan(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleViewPlan = (plan: CarePlan) => {
    setSelectedPlan(plan);
    form.setFieldsValue({
      ...plan,
      startDate: dayjs(plan.startDate),
      endDate: dayjs(plan.endDate),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newPlan: CarePlan = {
        id: selectedPlan?.id || Date.now().toString(),
        patientId: patient.id,
        ...(values as any),
        tasks: selectedPlan?.tasks || [],
        createdBy: user ? `Dr. ${user.firstName} ${user.lastName}` : 'Doctor',
      };

      if (selectedPlan) {
        setCarePlans(carePlans.map((p: any) => (p.id === selectedPlan.id ? newPlan : p)));
        message.success('Care plan updated');
      } else {
        setCarePlans([...carePlans, newPlan]);
        message.success('Care plan created');
      }

      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const getTaskStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pending': 'default',
      'In Progress': 'processing',
      'Completed': 'success',
    };
    return colors[status] || 'default';
  };

  return (
    <PageShell
      title={`${patient.firstName} ${patient.lastName} - Care Plans`}
      subtitle={`MRN: ${patient.mrn}`}
      action={
        <Space>
          {hasPermission('clinical:create_emr') && (
            <GradientButton icon={<PlusOutlined />} onClick={handleAddPlan}>
              Create Care Plan
            </GradientButton>
          )}
          <GradientButton variant="secondary" onClick={() => router.push(`/patients/${patient.id}`)}>
            Back to Patient
          </GradientButton>
        </Space>
      }
    >
      {carePlans.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <Empty
            description="No care plans found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {carePlans.map((plan) => (
            <Col key={plan.id} xs={24} lg={12}>
              <InfoCard title={plan.title}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Space>
                      <CheckCircleOutlined style={{ color: plan.status === 'Active' ? '#10B981' : '#6B7280' }} />
                      <StatusTag status={plan.status.toLowerCase()} type="patient" />
                    </Space>
                    <GradientButton variant="secondary" size="small" onClick={() => handleViewPlan(plan)}>
                      View Details
                    </GradientButton>
                  </div>
                  <div>
                    <Text type="secondary">Diagnosis:</Text>
                    <br />
                    <Text strong>{plan.diagnosis}</Text>
                  </div>

                  <div>
                    <Text type="secondary">Duration:</Text>
                    <br />
                    <Text>{plan.startDate} to {plan.endDate}</Text>
                  </div>

                  <div>
                    <Text type="secondary">Goals:</Text>
                    <ul style={{ marginTop: '8px', paddingLeft: '20px', marginBottom: '0' }}>
                      {plan.goals.map((goal, idx) => (
                        <li key={idx} className="text-sm">{goal}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <Text type="secondary">Tasks Overview:</Text>
                    <div style={{ marginTop: '8px' }}>
                      {plan.tasks.map((task) => (
                        <span key={task.id} style={{ marginRight: '8px', marginBottom: '8px', display: 'inline-block' }}>
                          <StatusTag
                            status={`${task.task}: ${task.status}`}
                            type="patient"
                            customConfig={{
                              [`${task.task}: ${task.status}`]: {
                                color: task.status === 'Completed' ? '#10B981' : task.status === 'In Progress' ? '#3B82F6' : '#6B7280',
                                bg: task.status === 'Completed' ? '#D1FAE5' : task.status === 'In Progress' ? '#DBEAFE' : '#F3F4F6',
                              }
                            }}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                </Space>
              </InfoCard>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={selectedPlan ? 'Edit Care Plan' : 'Create Care Plan'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        width={800}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
          <Form.Item name="title" label="Plan Title" rules={[{ required: true }]}>
            <Input placeholder="Enter care plan title" />
          </Form.Item>

          <Form.Item name="diagnosis" label="Diagnosis" rules={[{ required: true }]}>
            <Input placeholder="Enter diagnosis" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="goals" label="Goals" rules={[{ required: true }]}>
            <Select mode="tags" placeholder="Add goals" />
          </Form.Item>

          <Form.Item name="interventions" label="Interventions" rules={[{ required: true }]}>
            <Select mode="tags" placeholder="Add interventions" />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="On Hold">On Hold</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageShell>
  );
}
