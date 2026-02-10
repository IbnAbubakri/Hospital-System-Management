'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Select, Space, Row, Col, Alert, App, Divider } from 'antd';
import { SaveOutlined, BuildOutlined, MailOutlined, PhoneOutlined, GlobalOutlined, SafetyOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PageShell, StatCard, InfoCard, GradientButton } from '@/components/design-system';

const { TextArea } = Input;

export default function OrganizationSettingsPage() {
  const { user, hasPermission } = useAuth();
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  // CRITICAL SECURITY: Restrict access to administrators only
  if (!hasPermission('admin:settings:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '16px' }}>
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access organization settings. This area is restricted to administrators only."
          type="error"
          showIcon
          icon={<SafetyOutlined />}
          style={{ marginTop: '24px', borderRadius: '12px' }}
        />
      </div>
    );
  }

  const handleSave = (values: { [key: string]: string | number }) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Organization settings saved successfully');
    }, 1000);
  };

  return (
    <PageShell
      title="Organization Settings"
      subtitle="Configure your hospital's basic information and operational settings"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Departments"
          value={12}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Facilities"
          value={5}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="Active Users"
          value={47}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={2}
        />
        <StatCard
          label="System Uptime"
          value={99.9}
          suffix="%"
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={3}
        />
      </div>

      <Alert
        title="Organization Details"
        description="Keep your hospital information up to date for accurate billing and reporting"
        type="info"
        showIcon
        icon={<BuildOutlined />}
        style={{ marginBottom: '24px', borderRadius: '12px' }}
      />

      {/* Basic Information Section */}
      <div style={{ marginBottom: '24px' }}>
        <InfoCard
          title="Basic Information"
          icon={<BuildOutlined style={{ color: '#3B82F6' }} />}
        >
          <Form form={form} layout="vertical" onFinish={handleSave} initialValues={{
          hospitalName: 'MediCore Hospital',
          code: 'MED-001',
          type: 'General',
          ownership: 'Private',
          licenseNumber: 'LIC-2020-1234',
          email: 'info@medicore.com',
          phone: '+234 1 234 5678'
        }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="hospitalName" label="Hospital Name" rules={[{ required: true }]}>
                <Input placeholder="Enter hospital name" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="code" label="Hospital Code" rules={[{ required: true }]}>
                <Input placeholder="e.g., MED-001" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Hospital Type" rules={[{ required: true }]}>
                <Select style={{ borderRadius: '8px' }}>
                  <Select.Option value="General">General Hospital</Select.Option>
                  <Select.Option value="Specialty">Specialty Hospital</Select.Option>
                  <Select.Option value="Clinic">Clinic</Select.Option>
                  <Select.Option value="Medical Center">Medical Center</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ownership" label="Ownership" rules={[{ required: true }]}>
                <Select style={{ borderRadius: '8px' }}>
                  <Select.Option value="Private">Private</Select.Option>
                  <Select.Option value="Public">Public</Select.Option>
                  <Select.Option value="NGO">Non-Profit/NGO</Select.Option>
                  <Select.Option value="Government">Government</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="licenseNumber" label="License Number" rules={[{ required: true }]}>
            <Input placeholder="Medical license number" style={{ borderRadius: '8px' }} />
          </Form.Item>
        </Form>
        </InfoCard>
      </div>

      {/* Contact Information Section */}
      <div style={{ marginBottom: '24px' }}>
        <InfoCard
          title="Contact Information"
          icon={<PhoneOutlined style={{ color: '#10B981' }} />}
        >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="hospital@email.com" prefix={<MailOutlined />} style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                <Input placeholder="+234 XXX XXX XXXX" prefix={<PhoneOutlined />} style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="website" label="Website">
                <Input placeholder="https://www.hospital.com" prefix={<GlobalOutlined />} style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="emergencyContact" label="Emergency Contact">
                <Input placeholder="Emergency phone number" prefix={<PhoneOutlined />} style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <TextArea rows={2} placeholder="Full hospital address" style={{ borderRadius: '8px' }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="city" label="City" rules={[{ required: true }]}>
                <Input placeholder="City" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="state" label="State" rules={[{ required: true }]}>
                <Input placeholder="State" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="zipCode" label="ZIP Code" rules={[{ required: true }]}>
                <Input placeholder="ZIP code" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        </InfoCard>
      </div>

      {/* Operational Settings Section */}
      <div style={{ marginBottom: '24px' }}>
        <InfoCard
          title="Operational Settings"
          icon={<SafetyOutlined style={{ color: '#8B5CF6' }} />}
        >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="timezone" label="Timezone">
                <Select style={{ borderRadius: '8px' }}>
                  <Select.Option value="Africa/Lagos">Africa/Lagos (WAT)</Select.Option>
                  <Select.Option value="Africa/Nairobi">Africa/Nairobi (EAT)</Select.Option>
                  <Select.Option value="Africa/Cairo">Africa/Cairo (EET)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="currency" label="Default Currency">
                <Select style={{ borderRadius: '8px' }}>
                  <Select.Option value="₦">₦ (Naira)</Select.Option>
                  <Select.Option value="$">$ (USD)</Select.Option>
                  <Select.Option value="€">€ (Euro)</Select.Option>
                  <Select.Option value="£">£ (GBP)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="taxRate" label="Tax Rate (%)">
                <Input type="number" placeholder="10" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="financialYear" label="Financial Year Start">
                <Select style={{ borderRadius: '8px' }}>
                  <Select.Option value="1">January</Select.Option>
                  <Select.Option value="4">April</Select.Option>
                  <Select.Option value="7">July</Select.Option>
                  <Select.Option value="10">October</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        </InfoCard>
      </div>

      {/* Save Button */}
      <div style={{ textAlign: 'right' }}>
        <GradientButton
          icon={<SaveOutlined />}
          onClick={() => form.submit()}
          loading={loading}
        >
          Save Settings
        </GradientButton>
      </div>
    </PageShell>
  );
}
