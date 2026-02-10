'use client';

import React from 'react';
import { Layout, Space, Select, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { SearchBar } from '@/components/shared/SearchBar';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { UserMenu } from '@/components/shared/UserMenu';

const { Header } = Layout;

export function Topbar() {
  return (
    <Header
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        width: '100%',
        height: '64px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Space size="large">
        <SearchBar />
      </Space>

      <Space size="middle">
        <Select
          defaultValue="en"
          style={{ width: 100 }}
          options={[
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
          ]}
        />
        <NotificationBell />
        <UserMenu />
      </Space>
    </Header>
  );
}
