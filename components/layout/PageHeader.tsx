'use client';

import React from 'react';
import { Row, Col, Card, Typography, Badge } from 'antd';
import { useAuth } from '@/lib/contexts/AuthContext';

const { Title, Text } = Typography;

interface StatItem {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  stats?: StatItem[];
  action?: React.ReactNode;
  badge?: string;
}

export function PageHeader({ title, subtitle, stats, action, badge }: PageHeaderProps) {
  const { user } = useAuth();

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: stats ? 16 : 0 }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 600 }}>
            {title}
            {subtitle && (
              <Text type="secondary" style={{ fontSize: 14, fontWeight: 400, marginLeft: 8 }}>
                {subtitle}
              </Text>
            )}
          </Title>
          {badge && (
            <Badge status="processing" text={<Text type="secondary" style={{ fontSize: 12 }}>{badge}</Text>} />
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      {stats && stats.length > 0 && (
        <Row gutter={[16, 16]}>
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                style={{
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
                styles={{ body: { padding: 20 } }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>{stat.title}</Text>
                    <Title level={2} style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>{stat.value}</Title>
                    <Text style={{ fontSize: 12, color: stat.change.startsWith('+') || stat.change === '0' || !stat.change.startsWith('-') ? '#10B981' : '#EF4444' }}>
                      {stat.change}
                    </Text>
                  </div>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: stat.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ color: stat.color, fontSize: 20 }}>{stat.icon}</span>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
