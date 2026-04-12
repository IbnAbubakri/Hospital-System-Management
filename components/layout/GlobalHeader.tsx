'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Dropdown, Avatar, Typography, List, Tag, Divider } from 'antd';
import type { MenuProps } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/lib/contexts/AuthContext';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { mockPatients } from '@/lib/mockData';

const { Text } = Typography;

interface GlobalHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function GlobalHeader({ onMenuClick, showMenuButton = false }: GlobalHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <div className="py-2 px-1">
          <Text strong className="block text-white text-base">{user?.firstName} {user?.lastName}</Text>
          <Text className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{user?.email}</Text>
          <div className="mt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
              {user?.role}
            </span>
          </div>
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

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase();
    const results: Array<{ type: string; title: string; description: string; action: () => void }> = [];

    // Search patients
    mockPatients
      .filter(p => (p.name || '').toLowerCase().includes(query) || (p.mrn || '').toLowerCase().includes(query))
      .slice(0, 5)
      .forEach(p => {
        results.push({
          type: 'Patient',
          title: p.name || 'Unknown',
          description: `MRN: ${p.mrn || 'N/A'} • ${p.department || 'General'}`,
          action: () => router.push(`/patients/${p.id}`),
        });
      });

    // Add quick links based on search
    const quickLinks = [
      { type: 'Module', title: 'Patients', description: 'Go to Patients', action: () => router.push('/patients') },
      { type: 'Module', title: 'Staff', description: 'Go to Staff', action: () => router.push('/staff') },
      { type: 'Module', title: 'Appointments', description: 'View Appointments', action: () => router.push('/scheduling') },
      { type: 'Module', title: 'Billing', description: 'Go to Billing', action: () => router.push('/billing') },
      { type: 'Module', title: 'EMR', description: 'Medical Records', action: () => router.push('/clinical/emr') },
      { type: 'Module', title: 'Pharmacy', description: 'Go to Pharmacy', action: () => router.push('/pharmacy') },
      { type: 'Module', title: 'Laboratory', description: 'Go to Laboratory', action: () => router.push('/laboratory') },
      { type: 'Module', title: 'Reports', description: 'View Reports', action: () => router.push('/reports') },
    ];

    quickLinks
      .filter(l => l.title.toLowerCase().includes(query) || l.description.toLowerCase().includes(query))
      .slice(0, 4)
      .forEach(l => results.push(l));

    return results;
  }, [searchQuery, router]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Patient': return <UserOutlined style={{ color: '#0EA5E9' }} />;
      case 'Module': return <MedicineBoxOutlined style={{ color: '#8B5CF6' }} />;
      default: return <FileTextOutlined />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Patient': return '#0EA5E9';
      case 'Module': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50"
      style={{ 
        boxShadow: '0 4px 20px 0 rgba(14, 165, 233, 0.15)',
        background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 50%, #0369A1 100%)',
        height: '64px',
      }}
    >
      <div className="flex items-center justify-between px-8 lg:px-10 h-16">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2.5 rounded-xl hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle menu"
            >
              <MenuOutlined className="text-lg text-white" />
            </button>
          )}
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => router.push('/')}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 50%, #0369A1 100%)',
                boxShadow: '0 4px 14px 0 rgba(14, 165, 233, 0.35)',
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="2" fill="white"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <Text strong className="text-white text-lg leading-tight block" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                MedCore
              </Text>
              <Text className="text-xs tracking-wide" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Hospital Management</Text>
            </div>
          </div>
        </div>

        {/* Center section - Search with Autocomplete */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <Input
            placeholder="Search patients, records, appointments..."
            prefix={<SearchOutlined className="text-white" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            className="rounded-xl"
            style={{ 
              borderRadius: '12px',
              height: '42px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
            }}
          />
          
          {/* Search Results Dropdown */}
          {(searchFocused || searchQuery.length > 0) && searchResults.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '8px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                maxHeight: '400px',
                overflow: 'auto',
                zIndex: 1000,
              }}
            >
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                <Text strong style={{ color: '#6B7280', fontSize: '12px' }}>
                  {searchResults.length} results found
                </Text>
              </div>
              <List
                dataSource={searchResults}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => {
                      item.action();
                      setSearchQuery('');
                    }}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <List.Item.Meta
                      avatar={
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '8px', 
                          background: `${getTypeColor(item.type)}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {getTypeIcon(item.type)}
                        </div>
                      }
                      title={<Text strong style={{ color: '#1F2937' }}>{item.title}</Text>}
                      description={<Text style={{ color: '#6B7280', fontSize: '13px' }}>{item.description}</Text>}
                    />
                  </List.Item>
                )}
              />
            </div>
          )}
          
          {/* No results message */}
          {(searchFocused || searchQuery.length > 0) && searchQuery.length >= 2 && searchResults.length === 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '8px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                padding: '24px',
                textAlign: 'center',
                zIndex: 1000,
              }}
            >
              <SearchOutlined style={{ fontSize: '32px', color: '#D1D5DB', marginBottom: '8px' }} />
              <Text type="secondary">No results found for "{searchQuery}"</Text>
              <div style={{ marginTop: '12px' }}>
                <Text style={{ fontSize: '12px', color: '#9CA3AF' }}>Try searching for patient name, MRN, or module</Text>
              </div>
            </div>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <NotificationBell />

          {/* Divider */}
          <div className="h-8 w-px bg-white/30 mx-2 hidden sm:block" />

          {/* User Dropdown */}
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
            <button 
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              <Avatar
                size={38}
                style={{ 
                  backgroundColor: 'white',
                  color: '#0284C7',
                  fontWeight: 600,
                  fontSize: '16px'
                }}
                icon={<UserOutlined />}
              />
              <div className="hidden md:block text-left">
                <Text className="text-sm font-semibold text-white block leading-tight">
                  {user?.firstName}
                </Text>
                <Text className="text-xs block leading-tight text-white/80">
                  {user?.role}
                </Text>
              </div>
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}