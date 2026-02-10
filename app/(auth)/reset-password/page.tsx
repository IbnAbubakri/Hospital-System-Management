'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (values: { [key: string]: string | number }) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          {success ? (
            <div className="text-center py-6">
              <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
              <Title level={3} className="!mb-2">
                Password Reset Successful
              </Title>
              <Text type="secondary" className="block mb-6">
                Your password has been successfully reset. You can now sign in
                with your new password.
              </Text>
              <Button
                type="primary"
                size="large"
                onClick={() => router.push('/login')}
                className="w-full"
                style={{ height: '44px' }}
              >
                Go to Sign In
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <Title level={3} className="!mb-2">
                  Reset Password
                </Title>
                <Text type="secondary">
                  Enter your new password below.
                </Text>
              </div>

              <Form
                name="reset-password"
                onFinish={handleSubmit}
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Please enter your new password!' },
                    { min: 8, message: 'Password must be at least 8 characters!' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="New Password"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('The two passwords do not match!')
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Confirm New Password"
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
                    Reset Password
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
