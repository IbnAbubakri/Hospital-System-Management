'use client';

import React from 'react';
import { Card, Typography, List, Tag, Button, Space } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function StaffBenefitsPage() {
  const benefits = [
    { id: '1', name: 'Health Insurance', coverage: 'Full cover for employee + dependents', status: 'Active' },
    { id: '2', name: 'Annual Leave', coverage: '21 days per year', status: 'Active' },
    { id: '3', name: 'Sick Leave', coverage: '14 days per year', status: 'Active' },
    { id: '4', name: 'Pension Scheme', coverage: '10% employer contribution', status: 'Active' },
    { id: '5', name: 'Life Insurance', coverage: '2x annual salary', status: 'Active' },
    { id: '6', name: 'Training Allowance', coverage: '₦100,000 annually', status: 'Active' },
  ];

  return (
    <div className="  sm: sm: lg: lg: max-w-5xl mx-auto">
      <Title level={3}>Staff Benefits Administration</Title>
      <Card title="Available Benefits">
        <List
          dataSource={benefits}
          renderItem={(benefit) => (
            <List.Item
              actions={[
                <Tag color={benefit.status === 'Active' ? 'success' : 'default'}>{benefit.status}</Tag>,
                <Button type="link" size="small">Edit</Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<CheckCircleOutlined className="text-xl " />}
                title={<span className="font-medium">{benefit.name}</span>}
                description={benefit.coverage}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
