'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Typography, Checkbox, Card, App } from 'antd';
import { MailOutlined, LockOutlined, MedicineBoxOutlined } from '@ant-design/icons';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 shadow-lg" style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 50%, #0369A1 100%)', boxShadow: '0 8px 25px 0 rgba(14, 165, 233, 0.4)' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="2.5" fill="white"/>
            </svg>
          </div>
          <Title level={1} className="!text-gray-900 !mb-1 !text-3xl font-bold" style={{ letterSpacing: '-0.02em' }}>MedCore</Title>
          <Text className="text-gray-500 text-sm">Hospital Management System</Text>
        </div>

        {/* Login Card */}
        <Card 
          className="shadow-xl border-0 rounded-2xl"
          styles={{ body: { padding: '32px' } }}
        >
          <Form
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            requiredMark={false}
            size="large"
          >
            <Form.Item
              label={<span className="text-gray-700 font-medium">Email</span>}
              name="email"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="name@example.com"
                className="rounded-lg"
                style={{ borderColor: '#e5e7eb' }}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Password</span>}
              name="password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter your password"
                className="rounded-lg"
                style={{ borderColor: '#e5e7eb' }}
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-600">Remember me</Checkbox>
              </Form.Item>
              <Link href="/forgot-password" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                Forgot password?
              </Link>
            </div>

            <Form.Item className="!mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-12 rounded-lg font-semibold text-base"
                style={{
                  background: '#4f46e5',
                  border: 'none',
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Text className="text-gray-500 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Contact your administrator
            </Link>
          </Text>
        </div>

        {/* Help Text */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Text className="block text-center text-gray-400 text-xs">
            For login credentials, please contact your system administrator
          </Text>
        </div>
      </div>
    </div>
  );
}