'use client';

import React from 'react';
import { Result, Button, Card, Typography, Space } from 'antd';
import { LockOutlined, HomeOutlined, LoginOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: '100vh',
      display: '',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px',
    }}>
      <Card
        style={{
          maxWidth: 500,
          width: '100%',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
        styles={{ body: { padding: '40px' } }}
      >
        <Result
          status="403"
          icon={<LockOutlined style={{ color: '#EF4444', fontSize: 64 }} />}
          title={
            <Title level={2} style={{ marginBottom: 8 }}>
              Access Denied
            </Title>
          }
          subheader={
            <Text type="secondary" style={{ fontSize: '16px' }}>
              You do not have permission to access this page. Please contact your administrator if you believe this is an error.
            </Text>
          }
          extra={
            <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: 24 }}>
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                onClick={() => router.push('/')}
                block
              >
                Go to Dashboard
              </Button>
              <Button
                size="large"
                icon={<LoginOutlined />}
                onClick={() => router.push('/login')}
                block
              >
                Back to Login
              </Button>
            </Space>
          }
        />
      </Card>
    </div>
  );
}
