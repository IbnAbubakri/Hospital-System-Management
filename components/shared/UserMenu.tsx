'use client';

import React from 'react';
import {
  Dropdown,
  Avatar,
  Space,
  Typography,
  Divider,
  Button,
  MenuProps,
} from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Text } = Typography;

export function UserMenu() {
  const router = useRouter();

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => router.push('/portal/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => router.push('/admin'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: () => {
        // Handle logout
        localStorage.removeItem('token');
        router.push('/login');
      },
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
      placement="bottomRight"
    >
      <Space
        className="cursor-pointer transition-all duration-200"
        style={{
          padding: '8px 16px',
          borderRadius: '12px',
          background: 'white',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <Avatar
          size="default"
          icon={<UserOutlined />}
          style={{
            background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
          }}
        />
        <div className="hidden md:block">
          <Text
            className="block text-sm font-medium"
            style={{ color: '#111827', lineHeight: '1.2' }}
          >
            Dr. Ngozi Adeleke
          </Text>
          <Text
            className="block text-xs"
            style={{ color: '#9CA3AF', lineHeight: '1.2' }}
          >
            Cardiologist
          </Text>
        </div>
      </Space>
    </Dropdown>
  );
}
