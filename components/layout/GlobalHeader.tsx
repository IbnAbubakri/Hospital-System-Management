'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Input, Dropdown, Avatar, Badge, Space, Divider, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/lib/contexts/AuthContext';
import { NotificationBell } from '@/components/shared/NotificationBell';

const { Text } = Typography;

interface GlobalHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function GlobalHeader({ onMenuClick, showMenuButton = false }: GlobalHeaderProps) {
  const router = useRouter();
  const { user, logout, getUserFullName } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <div className="py-1">
          <Text strong className="block">{user?.firstName} {user?.lastName}</Text>
          <Text type="secondary" className="text-xs">{user?.email}</Text>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'profile-link',
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
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <MenuOutlined className="text-lg text-gray-600" />
            </button>
          )}
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #0088FE 0%, #00B4D8 100%)',
              }}
            >
              <span className="text-white font-bold text-sm">LM</span>
            </div>
            <div className="hidden sm:block">
              <Text strong className="text-gray-900 text-base leading-tight block">Lagos Medical</Text>
              <Text type="secondary" className="text-xs">Hospital System</Text>
            </div>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <Input
            placeholder="Search patients, records..."
            prefix={<SearchOutlined className="text-gray-400" />}
            className="rounded-lg"
            style={{ borderRadius: '8px' }}
          />
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Quick Home Link */}
          <button
            onClick={() => router.push('/')}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            <HomeOutlined />
            <span className="text-sm">Home</span>
          </button>

          {/* Notifications */}
          <NotificationBell />

          {/* User Dropdown */}
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <Avatar
                size="small"
                style={{ backgroundColor: '#0088FE' }}
                icon={<UserOutlined />}
              />
              <div className="hidden sm:block text-left">
                <Text className="text-sm font-medium text-gray-700 block leading-tight">
                  {user?.firstName}
                </Text>
                <Text type="secondary" className="text-xs block leading-tight">
                  {user?.role}
                </Text>
              </div>
            </button>
          </Dropdown>
        </div>
      </div>

      {/* Mobile Search - Always visible */}
      <div className="md:hidden px-4 pb-3">
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined className="text-gray-400" />}
          className="rounded-lg"
        />
      </div>
    </header>
  );
}
