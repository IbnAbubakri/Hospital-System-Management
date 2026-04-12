'use client';

import React from 'react';
import { Layout, Dropdown, Avatar, Badge, Typography, Button, Tooltip, Input } from 'antd';
import type { MenuProps } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

const { Header, Content } = Layout;
const { Text } = Typography;

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile-header',
      label: (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', marginBottom: 8 }}>
          <Text strong style={{ fontSize: '15px', display: 'block', color: '#1f2937' }}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={{ fontSize: '13px', color: '#6b7280' }}>
            {user?.email}
          </Text>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => router.push('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => router.push('/settings'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      danger: true,
      onClick: handleLogout,
    },
  ];

  const notificationItems: MenuProps['items'] = [
    {
      key: 'notif-header',
      label: (
        <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', marginBottom: 4 }}>
          <Text strong style={{ fontSize: '14px' }}>Notifications</Text>
        </div>
      ),
      disabled: true,
    },
    {
      key: 'notif-1',
      label: (
        <div style={{ padding: '8px 0' }}>
          <Text style={{ fontSize: '13px', display: 'block' }}>New appointment scheduled</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>2 minutes ago</Text>
        </div>
      ),
    },
    {
      key: 'notif-2',
      label: (
        <div style={{ padding: '8px 0' }}>
          <Text style={{ fontSize: '13px', display: 'block' }}>Lab results ready</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>15 minutes ago</Text>
        </div>
      ),
    },
    { type: 'divider' },
    {
      key: 'view-all',
      label: <Text style={{ fontSize: '13px', color: '#3b82f6' }}>View all notifications</Text>,
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrator': return '#10b981';
      case 'Doctor': return '#3b82f6';
      case 'AuxiliaryNurse': return '#ec4899';
      default: return '#6b7280';
    }
  };

  const roleColor = getRoleColor(user?.role || '');

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: 64,
          lineHeight: '64px',
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Left: Spacer */}
        <div style={{ flex: 1 }}>
          {title && (
            <Text style={{ fontSize: 16, color: '#374151', font-medium }}>
              {title}
            </Text>
          )}
        </div>

        {/* Center: Search */}
        <div style={{ flex: 1, maxWidth: 480 }}>
          <Input
            size="large"
            placeholder="Search patients, records, appointments..."
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
            style={{
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#f9fafb',
            }}
          />
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tooltip title="Notifications">
            <Dropdown menu={{ items: notificationItems }} trigger={['click']} placement="bottomRight">
              <Button
                type="text"
                shape="circle"
                icon={<BellOutlined style={{ fontSize: 18, color: '#6b7280' }} />}
                style={{ width: 40, height: 40 }}
              />
            </Dropdown>
          </Tooltip>

          <div style={{ width: 1, height: 24, background: '#e5e7eb', margin: '0 8px' }} />

          <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 12px 6px 6px',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              className="user-trigger"
            >
              <Avatar
                size={32}
                style={{
                  background: roleColor,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Avatar>
              <div style={{ lineHeight: 1.3 }}>
                <Text style={{ fontSize: 13, fontWeight: 500, color: '#111827', display: 'block' }}>
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text style={{ fontSize: 11, color: '#9ca3af' }}>
                  {user?.role}
                </Text>
              </div>
            </div>
          </Dropdown>
        </div>
      </Header>

      <Content style={{ padding: 24, minHeight: 'calc(100vh - 64px)' }}>
        {children}
      </Content>

      <style jsx global>{`
        .user-trigger:hover {
          background: #f9fafb;
        }
        
        .ant-dropdown-menu {
          border-radius: 12px !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12) !important;
          padding: 8px !important;
          min-width: 260px !important;
        }
        
        .ant-dropdown-menu-item {
          border-radius: 8px !important;
          padding: 10px 14px !important;
        }
        
        .ant-input-lg {
          height: 40px !important;
        }
        
        .ant-input-lg::placeholder {
          color: #9ca3af !important;
        }
      `}</style>
    </Layout>
  );
}
