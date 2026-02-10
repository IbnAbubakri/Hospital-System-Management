'use client';

import React, { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, DatePicker, Row, Col, Space, List, Checkbox, Typography, Alert } from 'antd';
import { HomeOutlined, PrinterOutlined, CheckCircleOutlined, FileTextOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { PageShell, InfoCard, StatusTag, GradientButton } from '@/components/design-system';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser } from '@/lib/dataFilters';

const { Text } = Typography;
const { TextArea } = Input;

export default function DischargePage() {
  const params = useParams();
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  const [form] = Form.useForm();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const accessiblePatients = useMemo(() => {
    if (!user) return [];
    return filterPatientsByUser(user);
  }, [user]);

  const patient = accessiblePatients.find((p: any) => p.id === params.id) as any;

  // CRITICAL SECURITY: Check permission and patient access
  if (!hasPermission('inpatients:discharge')) {
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
              <p className="text-sm text-red-700">You don&apos;tt have permission to discharge patients. This action requires appropriate privileges.</p>
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

  const handleDischarge = (values: { [key: string]: string | number }) => {
    // Process discharge
    router.push('/patients');
  };

  const handleCheckboxChange = (item: string) => {
    setCheckedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const admissionDetails = {
    admissionDate: 'January 25, 2024',
    admittingDoctor: 'Dr. Emeka Adeleke',
    department: 'Cardiology',
    roomBed: 'Room 301, Bed 2',
    lengthOfStay: '8 days',
  };

  const diagnoses = [
    { code: 'I10', description: 'Essential Hypertension' },
    { code: 'E11.9', description: 'Type 2 Diabetes Mellitus' },
  ];

  const checklistItems = [
    'Final vital signs recorded',
    'Medication reconciliation completed',
    'Discharge summary prepared',
    'Follow-up appointments scheduled',
    'Patient education completed',
    'Personal belongings collected',
    'Bill settled',
    'Medical records updated',
  ];

  return (
    <PageShell
      title={`${patient.firstName} ${patient.lastName} - Discharge`}
      subtitle={`MRN: ${patient.mrn}`}
      action={
        <Space>
          <GradientButton variant="secondary" icon={<PrinterOutlined />}>
            Print Summary
          </GradientButton>
          <GradientButton variant="secondary" onClick={() => router.push(`/patients/${patient.id}`)}>
            Back to Patient
          </GradientButton>
        </Space>
      }
    >
      <div style={{ marginBottom: '24px' }}>
        <Alert
          message="Patient Discharge"
          description="Complete all required fields to process patient discharge. Ensure all medications, follow-up appointments, and discharge instructions are documented."
          type="info"
          showIcon
          style={{ borderRadius: '12px', border: '1px solid #BAE6FD' }}
        />
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div style={{ marginBottom: '24px' }}>
            <InfoCard
              title="Discharge Information"
              icon={<FileTextOutlined />}
              color="#3B82F6"
            >
            <Form form={form} layout="vertical" onFinish={handleDischarge}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="dischargeDate" label="Discharge Date" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="dischargeTime" label="Discharge Time" rules={[{ required: true }]}>
                    <Input type="time" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="dischargeStatus" label="Discharge Status" rules={[{ required: true }]}>
                <Select placeholder="Select discharge status">
                  <Select.Option value="Recovered">Recovered</Select.Option>
                  <Select.Option value="Improved">Improved</Select.Option>
                  <Select.Option value="Stable">Stable</Select.Option>
                  <Select.Option value="Against Medical Advice">Against Medical Advice</Select.Option>
                  <Select.Option value="Transferred">Transferred</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="dischargeSummary" label="Discharge Summary" rules={[{ required: true }]}>
                <TextArea rows={6} placeholder="Enter detailed discharge summary..." />
              </Form.Item>

              <div style={{ marginTop: '24px', marginBottom: '16px' }}>
                <Text strong style={{ fontSize: '15px', color: '#1F2937' }}>Discharge Instructions</Text>
              </div>

              <Form.Item name="medications" label="Medications at Discharge">
                <TextArea rows={4} placeholder="List medications to continue at home..." />
              </Form.Item>

              <Form.Item name="instructions" label="Patient Instructions" rules={[{ required: true }]}>
                <TextArea rows={4} placeholder="Home care instructions, dietary restrictions, activity limitations..." />
              </Form.Item>

              <Form.Item name="followUp" label="Follow-up Instructions">
                <TextArea rows={3} placeholder="Follow-up appointments, tests, consultations..." />
              </Form.Item>

              <Form.Item>
                <GradientButton htmlType="submit" size="large" block>
                  Process Discharge
                </GradientButton>
              </Form.Item>
            </Form>
            </InfoCard>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div style={{ marginBottom: '24px' }}>
            <InfoCard
              title="Admission Details"
              icon={<CalendarOutlined />}
              color="#3B82F6"
            >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">Admission Date:</Text>
                <br />
                <Text strong>{admissionDetails.admissionDate}</Text>
              </div>
              <div>
                <Text type="secondary">Admitting Doctor:</Text>
                <br />
                <Text strong>{admissionDetails.admittingDoctor}</Text>
              </div>
              <div>
                <Text type="secondary">Department:</Text>
                <br />
                <Text strong>{admissionDetails.department}</Text>
              </div>
              <div>
                <Text type="secondary">Room/Bed:</Text>
                <br />
                <Text strong>{admissionDetails.roomBed}</Text>
              </div>
              <div>
                <Text type="secondary">Length of Stay:</Text>
                <br />
                <Text strong>{admissionDetails.lengthOfStay}</Text>
              </div>
            </Space>
            </InfoCard>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <InfoCard
              title="Primary Diagnosis"
              icon={<FileTextOutlined />}
              color="#3B82F6"
            >
            {diagnoses.map((diag, idx) => (
              <div key={idx} style={{ marginBottom: idx < diagnoses.length - 1 ? '12px' : '0' }}>
                <StatusTag
                  status={diag.code}
                  type="patient"
                  customConfig={{
                    [diag.code]: { color: '#3B82F6', bg: '#DBEAFE' }
                  }}
                />
                <Text className="ml-2" strong>{diag.description}</Text>
              </div>
            ))}
            </InfoCard>
          </div>

          <InfoCard
            title="Discharge Checklist"
            icon={<CheckCircleOutlined />}
            color="#10B981"
          >
            <List
              size="small"
              dataSource={checklistItems}
              renderItem={(item) => (
                <List.Item style={{ border: 'none', padding: '4px 0' }}>
                  <div className="flex items-center gap-3" style={{ width: '100%' }}>
                    <Checkbox
                      checked={checkedItems.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                    <Text>{item}</Text>
                  </div>
                </List.Item>
              )}
            />
          </InfoCard>
        </Col>
      </Row>
    </PageShell>
  );
}
