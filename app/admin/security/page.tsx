'use client';

import React from 'react';
import { Form, Switch, Select, Table, Space, App, Button, Input } from 'antd';
import { LockOutlined, KeyOutlined, SafetyOutlined, StopOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PageShell, StatCard, ModernTable, InfoCard, StatusTag, GradientButton } from '@/components/design-system';
import { Alert } from 'antd';

export default function SecurityPage() {
  const { user, hasPermission } = useAuth();
  const { message } = App.useApp();
  const [securityForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // CRITICAL SECURITY: Restrict access to administrators only
  if (!hasPermission('admin:security:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '16px' }}>
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access security settings. This area is restricted to administrators only."
          type="error"
          showIcon
          icon={<StopOutlined />}
          style={{ marginTop: '24px', borderRadius: '12px' }}
        />
      </div>
    );
  }

  const securitySettings = {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      passwordExpiry: 90
    },
    sessionSettings: {
      sessionTimeout: 30,
      maxConcurrentSessions: 2
    },
    twoFactorAuth: true,
    ipWhitelist: false
  };

  const activeSessions = [
    { id: 1, user: 'admin@hospital.com', loginTime: '2024-02-05 09:30', lastActivity: '2024-02-05 14:25', ip: '192.168.1.100', device: 'Chrome / Windows', status: 'active' },
    { id: 2, user: 'dr.okonkwo@hospital.com', loginTime: '2024-02-05 08:15', lastActivity: '2024-02-05 14:20', ip: '192.168.1.105', device: 'Safari / MacOS', status: 'active' },
    { id: 3, user: 'nurse.chioma@hospital.com', loginTime: '2024-02-05 10:00', lastActivity: '2024-02-05 14:18', ip: '192.168.1.110', device: 'Chrome / Android', status: 'active' },
  ];

  const failedAttempts = [
    { id: 1, user: 'unknown', time: '2024-02-05 14:20', ip: '192.168.1.200', attempts: 3, status: 'blocked' },
    { id: 2, user: 'unknown', time: '2024-02-05 12:45', ip: '192.168.1.201', attempts: 5, status: 'blocked' },
    { id: 3, user: 'admin@hospital.com', time: '2024-02-05 09:25', ip: '192.168.1.100', attempts: 2, status: 'allowed' },
  ];

  const sessionColumns = [
    { title: 'User', dataIndex: 'user', key: 'user' },
    { title: 'Login Time', dataIndex: 'loginTime', key: 'loginTime' },
    { title: 'Last Activity', dataIndex: 'lastActivity', key: 'lastActivity' },
    { title: 'IP Address', dataIndex: 'ip', key: 'ip' },
    { title: 'Device', dataIndex: 'device', key: 'device' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="patient" showIcon />
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button type="link" size="small" danger>
          Terminate
        </Button>
      )
    },
  ];

  const failedColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'User', dataIndex: 'user', key: 'user' },
    { title: 'Time', dataIndex: 'time', key: 'time' },
    { title: 'IP Address', dataIndex: 'ip', key: 'ip' },
    { title: 'Attempts', dataIndex: 'attempts', key: 'attempts' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="patient" showIcon />
    },
  ];

  const handleSecuritySave = () => {
    message.success('Security settings updated successfully');
  };

  const handlePasswordChange = () => {
    passwordForm.validateFields().then((values) => {
      message.success('Password changed successfully');
      passwordForm.resetFields();
    });
  };

  return (
    <PageShell
      title="Security Settings"
      subtitle="Manage password policies, sessions, and access control"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Active Sessions"
          value={activeSessions.length}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Failed Attempts (24h)"
          value={failedAttempts.length}
          color="#EF4444"
          bg="linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCA5A5"
          index={1}
        />
        <StatCard
          label="2FA Usage Rate"
          value={85}
          suffix="%"
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={2}
        />
        <StatCard
          label="Avg Password Score"
          value={92}
          suffix="%"
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={3}
        />
      </div>

      {/* Password Policy Section */}
      <div style={{ marginBottom: '24px' }}>
        <InfoCard
          title="Password Policy"
          icon={<KeyOutlined style={{ color: '#3B82F6' }} />}
        >
          <Form
            form={securityForm}
            layout="vertical"
            initialValues={securitySettings.passwordPolicy}
          >
            <Form.Item name="minLength" label="Minimum Password Length">
              <Select style={{ borderRadius: '8px' }}>
                <Select.Option value={6}>6 characters</Select.Option>
                <Select.Option value={8}>8 characters</Select.Option>
                <Select.Option value={10}>10 characters</Select.Option>
                <Select.Option value={12}>12 characters</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="requireUppercase" valuePropName="checked">
              <div className="flex items-center gap-2">
                <Switch />
                <span>Require Uppercase Letters</span>
              </div>
            </Form.Item>
            <Form.Item name="requireLowercase" valuePropName="checked">
              <div className="flex items-center gap-2">
                <Switch />
                <span>Require Lowercase Letters</span>
              </div>
            </Form.Item>
            <Form.Item name="requireNumbers" valuePropName="checked">
              <div className="flex items-center gap-2">
                <Switch />
                <span>Require Numbers</span>
              </div>
            </Form.Item>
            <Form.Item name="requireSpecialChars" valuePropName="checked">
              <div className="flex items-center gap-2">
                <Switch />
                <span>Require Special Characters</span>
              </div>
            </Form.Item>
            <Form.Item name="passwordExpiry" label="Password Expiry (Days)">
              <Select style={{ borderRadius: '8px' }}>
                <Select.Option value={30}>30 days</Select.Option>
                <Select.Option value={60}>60 days</Select.Option>
                <Select.Option value={90}>90 days</Select.Option>
                <Select.Option value={0}>Never</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <GradientButton
                icon={<SafetyOutlined />}
                onClick={handleSecuritySave}
              >
                Save Password Policy
              </GradientButton>
            </Form.Item>
          </Form>
        </InfoCard>
      </div>

      {/* Session Settings Section */}
      <div style={{ marginBottom: '24px' }}>
        <InfoCard
          title="Session Settings"
          icon={<LockOutlined style={{ color: '#10B981' }} />}
        >
          <Form layout="vertical" initialValues={securitySettings.sessionSettings}>
            <Form.Item name="sessionTimeout" label="Session Timeout (Minutes)">
              <Select style={{ borderRadius: '8px' }}>
                <Select.Option value={15}>15 minutes</Select.Option>
                <Select.Option value={30}>30 minutes</Select.Option>
                <Select.Option value={60}>60 minutes</Select.Option>
                <Select.Option value={120}>2 hours</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="maxConcurrentSessions" label="Max Concurrent Sessions">
              <Select style={{ borderRadius: '8px' }}>
                <Select.Option value={1}>1 session</Select.Option>
                <Select.Option value={2}>2 sessions</Select.Option>
                <Select.Option value={3}>3 sessions</Select.Option>
                <Select.Option value={0}>Unlimited</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="twoFactorAuth" valuePropName="checked">
              <div className="flex items-center gap-2">
                <Switch />
                <span>Enable Two-Factor Authentication</span>
              </div>
            </Form.Item>
            <Form.Item name="ipWhitelist" valuePropName="checked">
              <div className="flex items-center gap-2">
                <Switch />
                <span>Enable IP Whitelist</span>
              </div>
            </Form.Item>
            <Form.Item>
              <GradientButton
                icon={<SafetyOutlined />}
                onClick={handleSecuritySave}
              >
                Save Session Settings
              </GradientButton>
            </Form.Item>
          </Form>
        </InfoCard>
      </div>

      {/* Active Sessions Section */}
      <div style={{ marginBottom: '24px' }}>
        <InfoCard
          title="Active Sessions"
          icon={<SafetyOutlined style={{ color: '#8B5CF6' }} />}
        >
          <ModernTable
            dataSource={activeSessions}
            columns={sessionColumns}
            rowKey="id"
            pagination={false}
          />
        </InfoCard>
      </div>

      {/* Failed Login Attempts Section */}
      <InfoCard
        title="Failed Login Attempts"
        icon={<SafetyOutlined style={{ color: '#EF4444' }} />}
      >
        <ModernTable
          dataSource={failedAttempts}
          columns={failedColumns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </InfoCard>
    </PageShell>
  );
}
