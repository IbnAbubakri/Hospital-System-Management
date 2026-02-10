'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography, Space, Alert } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (values: { [key: string]: string | number }) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/login')}
          className="mb-4"
        >
          Back to Login
        </Button>

        {/* Card */}
        <Card className="shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <MailOutlined className="text-3xl text-[#0077B6]" />
            </div>
            <Title level={3} className="!mb-2">
              Forgot Password?
            </Title>
            <Text type="secondary">
              Enter your email address and we'll send you a link to reset your
              password.
            </Text>
          </div>

          {submitted ? (
            <Alert
              title="Email Sent"
              description="We've sent a password reset link to your email address. Please check your inbox."
              type="success"
              showIcon
              className="mb-4"
            />
          ) : (
            <Form
              name="forgot-password"
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email!' },
                  { type: 'email', message: 'Please enter a valid email!' },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Email address"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full"
                  style={{ height: '44px' }}
                >
                  Send Reset Link
                </Button>
              </Form.Item>
            </Form>
          )}

          <div className="text-center mt-4">
            <Link href="/login" className="text-[#0077B6]">
              Back to Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
