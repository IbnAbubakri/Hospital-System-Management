'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Typography, Checkbox, App } from 'antd';
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
    <div className="login-page">
      {/* Animated Background */}
      <div className="login-bg">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
      </div>

      <div className="login-container">
        {/* Logo Section */}
        <div className="login-header">
          <div className="logo-wrapper">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="logo-text">
              <Title level={2} className="!mb-0 !text-white">MedCore</Title>
              <Text className="!text-white/70">Hospital Management System</Text>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div className="card-header">
            <Title level={3} className="!mb-1">Welcome back</Title>
            <Text type="secondary">Enter your credentials to access the dashboard</Text>
          </div>

          <Form
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email address"
                className="login-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                className="login-input"
              />
            </Form.Item>

            <div className="card-footer">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link href="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="login-btn"
            >
              Sign In
            </Button>
          </Form>

          <div className="help-text">
            <Text type="secondary">
              Need help? Contact your system administrator
            </Text>
          </div>
        </div>

        {/* Footer */}
        <Text className="login-footer">
          © 2024 MedCore Hospital Management. All rights reserved.
        </Text>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        .login-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .bg-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
        }

        .bg-shape-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          top: -100px;
          right: -100px;
          animation: float 8s ease-in-out infinite;
        }

        .bg-shape-2 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
          bottom: -50px;
          left: -50px;
          animation: float 10s ease-in-out infinite reverse;
        }

        .bg-shape-3 {
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.1); }
        }

        .login-container {
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 10;
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .logo-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
        }

        .logo-text {
          text-align: left;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .card-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .forgot-link {
          color: #3b82f6;
          font-size: 14px;
          transition: color 0.2s;
        }

        .forgot-link:hover {
          color: #2563eb;
        }

        .login-btn {
          height: 48px;
          font-size: 16px;
          font-weight: 600;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border: none;
          border-radius: 12px;
          transition: all 0.3s;
          box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
        }

        .help-text {
          margin-top: 24px;
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .login-footer {
          display: block;
          text-align: center;
          margin-top: 24px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
        }

        :global(.login-input) {
          height: 48px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          transition: all 0.2s;
        }

        :global(.login-input:hover) {
          border-color: #3b82f6;
          background: #fff;
        }

        :global(.login-input:focus) {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background: #fff;
        }

        :global(.login-input .ant-input-prefix) {
          color: #9ca3af;
          margin-right: 12px;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 32px 24px;
          }

          .logo-wrapper {
            flex-direction: column;
            gap: 8px;
          }

          .logo-text {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}