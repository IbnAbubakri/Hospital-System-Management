'use client';

import React, { useState } from 'react';
import { Card, Form, Input, Button, Checkbox, App, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text, Link } = Typography;

export default function PortalLoginPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { [key: string]: string | number }) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Login successful');
      router.push('/portal/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.2)', boxShadow: '0 8px 25px 0 rgba(0,0,0,0.2)' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="2.5" fill="white"/>
            </svg>
          </div>
          <Title level={1} className="!text-white !mb-1 !text-3xl font-bold" style={{ letterSpacing: '-0.02em' }}>MedCore</Title>
          <Text className="text-white/80 text-sm">Patient Portal</Text>
        </div>

        {/* Login Card */}
        <Card 
          className="shadow-2xl border-0 rounded-2xl"
          styles={{ body: { padding: '32px' } }}
        >
          <Form onFinish={handleLogin} size="large" layout="vertical">
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please enter your email' }]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Email address"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                className="rounded-lg"
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-6">
              <Checkbox className="text-gray-600">Remember me</Checkbox>
              <Link href="#" className="text-purple-600 hover:text-purple-700 font-medium text-sm">
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
                  background: '#7c3aed',
                  border: 'none',
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider>
            <Text type="secondary" className="text-sm">New to our portal?</Text>
          </Divider>

          <Button
            block
            onClick={() => router.push('/portal/register')}
            className="h-11 rounded-lg font-medium border-purple-500 text-purple-600 hover:text-purple-700 hover:border-purple-600"
          >
            Create Account
          </Button>

          <div className="text-center mt-6">
            <Link onClick={() => router.push('/login')} className="text-gray-500 hover:text-gray-600 text-sm">
              ← Back to Staff Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}