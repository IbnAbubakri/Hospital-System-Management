'use client';

import React from 'react';
import { Typography, Card, Button, Row, Col } from 'antd';
import { BuildOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function PlaceholderPage({ title, description, icon }: PlaceholderPageProps) {
  return (
    <div style={{ padding: '24px' }}>
      <Card
        style={{ 
          borderRadius: 12, 
          textAlign: 'center',
          padding: '48px 24px',
          background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        }}
        styles={{ body: { padding: '48px 24px' } }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
          }}
        >
          {icon || <BuildOutlined style={{ fontSize: 32, color: 'white' }} />}
        </div>
        
        <Title level={3} style={{ marginBottom: 8 }}>
          {title}
        </Title>
        
        <Text type="secondary" style={{ fontSize: 16, display: 'block', marginBottom: 24 }}>
          {description}
        </Text>
        
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button type="primary" size="large">
            Coming Soon
          </Button>
          <Button size="large">
            Contact Support
          </Button>
        </div>
      </Card>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <BuildOutlined style={{ fontSize: 24, color: '#3b82f6', marginBottom: 8 }} />
            <br />
            <Text strong>Module Development</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              This module is under development
            </Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <BuildOutlined style={{ fontSize: 24, color: '#10b981', marginBottom: 8 }} />
            <br />
            <Text strong>API Integration</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Backend endpoints pending
            </Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <BuildOutlined style={{ fontSize: 24, color: '#f59e0b', marginBottom: 8 }} />
            <br />
            <Text strong>UI Components</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Design system ready
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
