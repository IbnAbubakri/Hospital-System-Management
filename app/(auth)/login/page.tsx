'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Typography, Divider, Checkbox, Card, App } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const success = await login(values.email, values.password);

      if (success) {
        message.success('Welcome back!');
        router.push('/');
      } else {
        message.error('Invalid email or password.');
      }
    } catch (error) {
      message.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-lg mb-4">
            <span className="text-white font-semibold text-xl">LM</span>
          </div>
          <Title level={2} className="!mb-2 !text-gray-900">
            Lagos Medical
          </Title>
          <Text className="text-gray-500">Sign in to your account to continue</Text>
        </div>

        {/* Login Card */}
        <Card
          className="shadow-sm border-0"
          styles={{
            body: { padding: '32px' },
          }}
        >
          <Form
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            requiredMark={false}
            size="large"
          >
            <Form.Item
              label={<span className="text-sm font-medium text-gray-700">Email</span>}
              name="email"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="name@example.com"
                className="rounded-md"
                style={{
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                }}
              />
            </Form.Item>

            <div className="flex items-center justify-between mb-4">
              <Form.Item
                label={<span className="text-sm font-medium text-gray-700">Password</span>}
                name="password"
                rules={[{ required: true, message: 'Please enter your password!' }]}
                className="!mb-0 flex-1"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="••••••••"
                  className="rounded-md"
                  style={{
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                  }}
                />
              </Form.Item>
            </div>

            <div className="flex items-center justify-between mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-sm text-gray-600">Remember me</Checkbox>
              </Form.Item>
              <Link
                href="/forgot-password"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Forgot password?
              </Link>
            </div>

            <Form.Item className="!mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-10 rounded-md text-sm font-medium"
                style={{
                  background: '#111827',
                  border: 'none',
                  borderRadius: '6px',
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Text className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/register" className="text-gray-900 hover:text-gray-700 font-medium">
              Contact your administrator
            </Link>
          </Text>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <Text className="text-xs text-gray-400 block text-center">
            For login credentials, please contact your system administrator
          </Text>
        </div>
      </div>
    </div>
  );
}
