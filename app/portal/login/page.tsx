'use client';

import React, { useState } from 'react';
import { Card, Form, Input, Button, Checkbox, App, Typography, Divider, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';

const { Title, Text, Link } = Typography;

export default function PortalLoginPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { [key: string]: string | number }) => {
    setLoading(true);
    // Simulate patient login
    setTimeout(() => {
      setLoading(false);
      message.success('Login successful');
      router.push('/portal/dashboard');
    }, 1000);
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Card
        className="w-full"
        style={{
          maxWidth: '400px',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#667eea', marginBottom: '8px' }}>
            Patient Portal
          </Title>
          <Text type="secondary">Sign in to access your health records</Text>
        </div>

        <Form onFinish={handleLogin} size="large">
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input
              prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <Checkbox>Remember me</Checkbox>
              <Link href="#">Forgot password?</Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: '44px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">New to our portal?</Text>
        </Divider>

        <Button
          block
          onClick={() => router.push('/portal/register')}
          style={{ height: '44px' }}
        >
          Create Account
        </Button>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link onClick={() => router.push('/login')} style={{ fontSize: '14px' }}>
            ← Back to Staff Login
          </Link>
        </div>
      </Card>
    </div>
  );
}
