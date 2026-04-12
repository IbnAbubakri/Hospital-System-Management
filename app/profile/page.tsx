'use client';

import React from 'react';
import { Card, Avatar, Typography, Descriptions, Button, Tag, Row, Col, Divider } from 'antd';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  LockOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ProfilePage() {
  const { user } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrator': return 'green';
      case 'Doctor': return 'blue';
      case 'AuxiliaryNurse': return 'magenta';
      default: return 'default';
    }
  };

  return (
    <div className="profile-page">
      <Row gutter={24}>
        <Col xs={24} lg={8}>
          <Card
            style={{ borderRadius: '12px' }}
            styles={{ body: { padding: 32, textAlign: 'center' } }}
          >
            <Avatar
              size={100}
              style={{
                background: user?.role === 'AuxiliaryNurse'
                  ? 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)'
                  : user?.role === 'Doctor'
                  ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                  : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                fontSize: 36,
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
            
            <Title level={3} style={{ marginBottom: 4 }}>
              {user?.role === 'Doctor' ? 'Dr. ' : ''}{user?.firstName} {user?.lastName}
            </Title>
            
            <Tag color={getRoleColor(user?.role || '')} style={{ marginBottom: '16px' }}>
              {user?.role}
            </Tag>
            
            <div style={{ marginTop: 24 }}>
              <Button type="primary" icon={<LockOutlined />} style={{ borderRadius: 8 }}>
                Change Password
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: '12px' }} styles={{ body: { padding: 24 } }}>
            <Title level={4} style={{ marginBottom: '24px' }}>Personal Information</Title>
            
            <Descriptions column={{ xs: 1, sm: 2 }} labelStyle={{ fontWeight: 500 }}>
              <Descriptions.Item label="Full Name">
                {user?.firstName} {user?.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Email Address">
                <MailOutlined style={{ marginRight: 8 }} />
                {user?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone Number">
                <PhoneOutlined style={{ marginRight: 8 }} />
                {user?.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color={getRoleColor(user?.role || '')}>{user?.role}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Department">
                <MedicineBoxOutlined style={{ marginRight: 8 }} />
                {user?.department || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={user?.status === 'active' ? 'green' : 'red'}>
                  {user?.status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Username">
                <UserOutlined style={{ marginRight: 8 }} />
                {user?.username}
              </Descriptions.Item>
              <Descriptions.Item label="Last Login">
                <CalendarOutlined style={{ marginRight: 8 }} />
                {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={4} style={{ marginBottom: '16px' }}>Permissions</Title>
            <div style={{ display: '', flexWrap: 'wrap', gap: '8px' }}>
              {user?.permissions?.map((permission, index) => (
                <Tag key={index} color="blue">{permission}</Tag>
              )) || <Text type="secondary">No permissions assigned</Text>}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
