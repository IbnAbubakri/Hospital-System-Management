'use client';

import React, { useState, useMemo } from 'react';
import { Form, Button, Row, Col, Select, DatePicker, Input, App, Alert } from 'antd';
import { useRouter } from 'next/navigation';
import { mockPatients, mockDoctors } from '@/lib/mockData';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser } from '@/lib/dataFilters';
import { getDepartmentColors } from '@/lib/departmentColors';
import { PageShell } from '@/components/design-system/PageShell';
import { InfoCard } from '@/components/design-system/InfoCard';
import { GradientButton } from '@/components/design-system/GradientButton';

const { Option } = Select;
const { TextArea } = Input;

export default function AdmissionPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const { user, getUserFullName } = useAuth();
  const [loading, setLoading] = useState(false);

  // Get accessible patients based on logged-in user
  const accessiblePatients = useMemo(() => {
    if (!user) return [];
    return filterPatientsByUser(user);
  }, [user]);

  // Get accessible doctors (all for admin, only logged-in doctor for doctors)
  const accessibleDoctors = useMemo(() => {
    if (!user) return [];
    if (user.role === 'Administrator') {
      return mockDoctors;
    }
    // Doctors can only select themselves
    return mockDoctors.filter(d => d.id === user.id);
  }, [user]);

  // Get department options based on user role
  const departmentOptions = useMemo(() => {
    if (user?.role === 'Administrator') {
      return [
        { value: 'Cardiology', label: 'Cardiology' },
        { value: 'General Medicine', label: 'General Medicine' },
        { value: 'Orthopedics', label: 'Orthopedics' },
        { value: 'Neurology', label: 'Neurology' },
        { value: 'Pediatrics', label: 'Pediatrics' },
        { value: 'ICU', label: 'ICU' },
      ];
    }
    // Doctors can only select their own department
    return user ? [{ value: user.department, label: user.department }] : [];
  }, [user]);

  // Get department colors
  const departmentColors = user?.department ? getDepartmentColors(user.department) : null;

  const handleAdmit = async (values: { [key: string]: string | number }) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success('Patient admitted successfully!');
      router.push('/clinical/inpatients');
    } catch (error) {
      message.error('Failed to admit patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Patient Admission"
      subtitle={user?.role === 'Doctor' ? `Admitting to ${user.department} Department` : 'Admit a patient to the hospital'}
    >
      {user?.role === 'Doctor' && accessiblePatients.length === 0 && (
        <Alert
          title="No Patients Available"
          description="You don&apos;tt have any patients assigned to you yet. Please contact administration to get patients assigned before admitting patients."
          type="warning"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      {user?.role === 'Doctor' && accessiblePatients.length > 0 && (
        <Alert
          title={`You are admitting as ${getUserFullName()}`}
          description="The admission will be created under your name and assigned to your department."
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      <InfoCard title="Admission Details">
        <Form layout="vertical" onFinish={handleAdmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Patient"
                name="patientId"
                rules={[{ required: true, message: 'Please select a patient' }]}
              >
                <Select placeholder="Select patient" showSearch optionFilterProp="children" size="large">
                  {accessiblePatients.map((patient: any) => (
                    <Option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} ({patient.mrn})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Admission Type"
                name="admissionType"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select admission type" size="large">
                  <Option value="routine">Routine Admission</Option>
                  <Option value="emergency">Emergency Admission</Option>
                  <Option value="transfer">Transfer from another facility</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Department" name="department" initialValue={user?.role === 'Doctor' ? user.department : undefined} rules={[{ required: true }]}>
                <Select placeholder="Select department" disabled={user?.role === 'Doctor'}>
                  {departmentOptions.map((dept) => (
                    <Option key={dept.value} value={dept.value}>{dept.label}</Option>
                  ))}
                </Select>
              </Form.Item>
              {user?.role === 'Doctor' && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748B' }}>
                  Your department is pre-selected
                </div>
              )}
            </Col>
            <Col span={8}>
              <Form.Item label="Ward" name="ward" rules={[{ required: true }]}>
                <Select placeholder="Select ward">
                  <Option value="Ward A">Ward A</Option>
                  <Option value="Ward B">Ward B</Option>
                  <Option value="Ward C">Ward C</Option>
                  <Option value="ICU">ICU</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Bed" name="bed" rules={[{ required: true }]}>
                <Select placeholder="Select bed">
                  <Option value="A-101">A-101</Option>
                  <Option value="A-102">A-102</Option>
                  <Option value="A-103">A-103</Option>
                  <Option value="B-201">B-201</Option>
                  <Option value="B-202">B-202</Option>
                  <Option value="ICU-01">ICU-01</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Attending Doctor"
                name="doctorId"
                initialValue={user?.role === 'Doctor' ? user.id : undefined}
                rules={[{ required: true }]}
              >
                <Select placeholder="Select doctor" size="large" disabled={user?.role === 'Doctor'}>
                  {accessibleDoctors.map((doctor) => (
                    <Option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {user?.role === 'Doctor' && (
                <div style={{
                  marginTop: '8px',
                  padding: '8px 12px',
                  background: departmentColors?.bg || 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                  borderRadius: '6px',
                  border: `1px solid ${departmentColors?.border || '#BFDBFE'}`
                }}>
                  <span style={{ color: departmentColors?.text || '#1E40AF', fontSize: '12px' }}>
                    ✓ You are pre-selected as the attending doctor
                  </span>
                </div>
              )}
            </Col>
            <Col span={12}>
              <Form.Item label="Expected Discharge" name="expectedDischarge">
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Admission Diagnosis"
            name="diagnosis"
            rules={[{ required: true, message: 'Please enter diagnosis' }]}
          >
            <TextArea rows={3} placeholder="Enter primary diagnosis" />
          </Form.Item>

          <Form.Item label="Additional Notes" name="notes">
            <TextArea rows={3} placeholder="Any additional notes about the admission" />
          </Form.Item>

          <Form.Item>
            <div className="flex gap-3">
              <GradientButton
                htmlType="submit"
                loading={loading}
                size="large"
              >
                Admit Patient
              </GradientButton>
              <Button
                onClick={() => router.back()}
                size="large"
              >
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </InfoCard>
    </PageShell>
  );
}
