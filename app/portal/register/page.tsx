'use client';

import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Space, Alert, Row, Col, Checkbox, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, HomeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function PortalRegisterPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: { [key: string]: string | number }) => {
    setLoading(true);
    // Simulate registration
    setTimeout(() => {
      setLoading(false);
      router.push('/portal/login?registered=true');
    }, 1500);
  };

  return (
    <div
      className="px-4 py-6 sm:px-6 sm:py-8"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '500px',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#667eea', marginBottom: '8px' }}>
            Patient Portal Registration
          </Title>
          <Text type="secondary">Create your account to access medical records</Text>
        </div>

        <Alert
          title="Self-Registration"
          description="Fill in your details to create a patient portal account. You will need your MRN to complete registration."
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Form form={form} layout="vertical" onFinish={handleRegister}>
          <Form.Item
            name="mrn"
            label="Medical Record Number (MRN)"
            rules={[{ required: true, message: 'Please enter your MRN' }]}
          >
            <Input
              prefix={<HomeOutlined />}
              placeholder="MRN-XXXX"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please enter your first name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="First name" size="large" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please enter your last name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Last name" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Invalid email format' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="email@example.com" size="large" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="+234 XXX XXX XXXX" size="large" />
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            label="Date of Birth"
            rules={[{ required: true, message: 'Please enter your date of birth' }]}
          >
            <Input type="date" prefix={<CalendarOutlined />} size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Create password" size="large" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                }
              })
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm password" size="large" />
          </Form.Item>

          <Form.Item
            name="agreed"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('You must agree to the terms'))
              }
            ]}
          >
            <Checkbox>
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
              style={{
                height: '48px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                fontSize: '16px',
                fontWeight: 600
              }}
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">Already have an account?</Text>
        </Divider>

        <Button
          size="large"
          block
          onClick={() => router.push('/portal/login')}
        >
          Sign In
        </Button>
      </Card>
    </div>
  );
}
