'use client';

import React, { useState } from 'react';
import { Card, Tabs, Form, Input, Switch, Button, Select, Typography, Divider, message, Avatar } from 'antd';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
  UserOutlined,
  LockOutlined,
  BellOutlined,
  GlobalOutlined,
  SafetyOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      messageApi.success('Settings saved successfully');
      setLoading(false);
    }, 1000);
  };

  const items = [
    {
      key: 'profile',
      label: (
        <span>
          <UserOutlined /> Profile
        </span>
      ),
      children: (
        <Card style={{ borderRadius: '12px' }}>
          <Title level={5} style={{ marginBottom: '24px' }}>Profile Settings</Title>
          <Form layout="vertical" initialValues={user ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phoneNumber,
          } : {}}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item label="First Name" name="firstName">
                <Input size="large" placeholder="Enter first name" />
              </Form.Item>
              <Form.Item label="Last Name" name="lastName">
                <Input size="large" placeholder="Enter last name" />
              </Form.Item>
            </div>
            <Form.Item label="Email Address" name="email">
              <Input size="large" type="email" placeholder="Enter email" />
            </Form.Item>
            <Form.Item label="Phone Number" name="phone">
              <Input size="large" placeholder="Enter phone number" />
            </Form.Item>
            <Button type="primary" onClick={handleSave} loading={loading}>
              Save Changes
            </Button>
          </Form>
        </Card>
      ),
    },
    {
      key: 'security',
      label: (
        <span>
          <LockOutlined /> Security
        </span>
      ),
      children: (
        <Card style={{ borderRadius: '12px' }}>
          <Title level={5} style={{ marginBottom: '24px' }}>Security Settings</Title>
          <Form layout="vertical">
            <Form.Item label="Current Password">
              <Input.Password size="large" placeholder="Enter current password" />
            </Form.Item>
            <Form.Item label="New Password">
              <Input.Password size="large" placeholder="Enter new password" />
            </Form.Item>
            <Form.Item label="Confirm New Password">
              <Input.Password size="large" placeholder="Confirm new password" />
            </Form.Item>
            <Divider />
            <Title level={5}>Two-Factor Authentication</Title>
            <div style={{ display: '', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
              <div>
                <Text strong>Enable 2FA</Text>
                <br />
                <Text type="secondary">Add an extra layer of security to your account</Text>
              </div>
              <Switch />
            </div>
            <Button type="primary" onClick={handleSave} loading={loading} style={{ marginTop: 24 }}>
              Update Password
            </Button>
          </Form>
        </Card>
      ),
    },
    {
      key: 'notifications',
      label: (
        <span>
          <BellOutlined /> Notifications
        </span>
      ),
      children: (
        <Card style={{ borderRadius: '12px' }}>
          <Title level={5} style={{ marginBottom: '24px' }}>Notification Preferences</Title>
          <div style={{ display: '', flexDirection: 'column', gap: '16px' }}>
            {[
              { title: 'Email Notifications', desc: 'Receive appointment reminders via email', defaultChecked: true },
              { title: 'SMS Notifications', desc: 'Receive urgent alerts via SMS', defaultChecked: true },
              { title: 'Browser Notifications', desc: 'Get real-time updates in your browser', defaultChecked: false },
              { title: 'Weekly Reports', desc: 'Receive weekly summary reports', defaultChecked: true },
            ].map((item, index) => (
              <div key={index} style={{ display: '', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                <div>
                  <Text strong>{item.title}</Text>
                  <br />
                  <Text type="secondary">{item.desc}</Text>
                </div>
                <Switch defaultChecked={item.defaultChecked} />
              </div>
            ))}
          </div>
          <Button type="primary" onClick={handleSave} loading={loading} style={{ marginTop: 24 }}>
            Save Preferences
          </Button>
        </Card>
      ),
    },
    {
      key: 'appearance',
      label: (
        <span>
          <GlobalOutlined /> Appearance
        </span>
      ),
      children: (
        <Card style={{ borderRadius: '12px' }}>
          <Title level={5} style={{ marginBottom: '24px' }}>Appearance Settings</Title>
          <Form layout="vertical">
            <Form.Item label="Theme">
              <Select
                size="large"
                defaultValue="light"
                options={[
                  { value: 'light', label: 'Light Mode' },
                  { value: 'dark', label: 'Dark Mode' },
                  { value: 'system', label: 'System Default' },
                ]}
              />
            </Form.Item>
            <Form.Item label="Language">
              <Select
                size="large"
                defaultValue="en"
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'yo', label: 'Yoruba' },
                  { value: 'ha', label: 'Hausa' },
                  { value: 'ig', label: 'Igbo' },
                ]}
              />
            </Form.Item>
            <Form.Item label="Timezone">
              <Select
                size="large"
                defaultValue="Africa/Lagos"
                options={[
                  { value: 'Africa/Lagos', label: 'Africa/Lagos (GMT+1)' },
                  { value: 'UTC', label: 'UTC (GMT)' },
                ]}
              />
            </Form.Item>
            <Button type="primary" onClick={handleSave} loading={loading}>
              Save Preferences
            </Button>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <div className="settings-page">
      {contextHolder}
      <Card style={{ borderRadius: '12px' }} styles={{ body: { padding: 0 } }}>
        <Tabs
          tabPosition="left"
          style={{ minHeight: 500 }}
          items={items}
        />
      </Card>
    </div>
  );
}
