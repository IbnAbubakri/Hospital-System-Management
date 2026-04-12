'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, Menu, Button, Tooltip, Badge } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
  SettingOutlined,
  LineChartOutlined,
  HeartOutlined,
  ExperimentOutlined,
  AuditOutlined,
  AlertOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/lib/contexts/AuthContext';
import { NotificationBell } from '@/components/shared/NotificationBell';

const { Sider, Content, Header } = Layout;

interface MenuItemType {
  key: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
}

const getMenuItems = (role: string): MenuItemType[] => {
  const commonItems: MenuItemType[] = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', path: '/dashboard' },
  ];

  const adminItems: MenuItemType[] = [
    { key: 'staff', icon: <TeamOutlined />, label: 'Staff', path: '/staff' },
    { key: 'patients', icon: <UserOutlined />, label: 'Patients', path: '/patients' },
    { key: 'appointments', icon: <CalendarOutlined />, label: 'Appointments', path: '/patients/appointments' },
    { key: 'emr', icon: <FileTextOutlined />, label: 'Medical Records', path: '/clinical/emr' },
    { key: 'pharmacy', icon: <MedicineBoxOutlined />, label: 'Pharmacy', path: '/pharmacy' },
    { key: 'billing', icon: <DollarOutlined />, label: 'Billing', path: '/billing' },
    { key: 'inventory', icon: <AuditOutlined />, label: 'Inventory', path: '/inventory' },
    { key: 'reports', icon: <LineChartOutlined />, label: 'Reports', path: '/reports' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings', path: '/settings' },
  ];

  const doctorItems: MenuItemType[] = [
    { key: 'patients', icon: <UserOutlined />, label: 'My Patients', path: '/patients' },
    { key: 'appointments', icon: <CalendarOutlined />, label: 'Appointments', path: '/patients/appointments' },
    { key: 'emr', icon: <FileTextOutlined />, label: 'Medical Records', path: '/clinical/emr' },
    { key: 'lab', icon: <ExperimentOutlined />, label: 'Lab Results', path: '/laboratory' },
    { key: 'prescriptions', icon: <MedicineBoxOutlined />, label: 'Prescriptions', path: '/pharmacy/prescriptions' },
  ];

  const nurseItems: MenuItemType[] = [
    { key: 'triage', icon: <HeartOutlined />, label: 'Triage', path: '/triage' },
    { key: 'patients', icon: <UserOutlined />, label: 'Patients', path: '/patients' },
    { key: 'appointments', icon: <CalendarOutlined />, label: 'Appointments', path: '/patients/appointments' },
    { key: 'vitals', icon: <AlertOutlined />, label: 'Vital Signs', path: '/clinical/vitals' },
    { key: 'lab', icon: <ExperimentOutlined />, label: 'Lab Results', path: '/laboratory' },
  ];

  switch (role) {
    case 'Administrator':
      return [...commonItems, ...adminItems];
    case 'Doctor':
      return [...commonItems, ...doctorItems];
    case 'AuxiliaryNurse':
      return [...commonItems, ...nurseItems];
    default:
      return commonItems;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Administrator': return '#722ED1';
    case 'Doctor': return '#1890FF';
    case 'AuxiliaryNurse': return '#52C41A';
    default: return '#8C8C8C';
  }
};

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = user ? getMenuItems(user.role) : [];

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleMenuClick = (e: { key: string }) => {
    const item = menuItems.find(m => m.key === e.key);
    if (item?.path) {
      router.push(item.path);
    }
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getSelectedKey = () => {
    const currentItem = menuItems.find(item => item.path === pathname);
    return currentItem?.key || 'dashboard';
  };

  if (!user) {
    return null;
  }

  return (
    <Layout className="app-layout">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={260}
        collapsedWidth={80}
        className="app-sider"
      >
        <div className="sider-logo" onClick={() => router.push('/dashboard')}>
          <div className="logo-icon">
            <svg width="36" height="36" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#siderLogoGrad)"/>
              <path d="M14 6V22M6 14H22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <defs>
                <linearGradient id="siderLogoGrad" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#0088FE"/>
                  <stop offset="1" stopColor="#00B4D8"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          {!collapsed && (
            <div className="logo-info">
              <span className="logo-title">MediCore</span>
              <span className="logo-subtitle">Hospital System</span>
            </div>
          )}
        </div>

        <div className="sider-menu">
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            onClick={handleMenuClick}
            items={menuItems}
            theme="dark"
          />
        </div>

        <div className="sider-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            {!collapsed && (
              <div className="user-details">
                <span className="user-name">{user.firstName} {user.lastName}</span>
                <span className="user-role-badge" style={{ backgroundColor: getRoleColor(user.role) }}>
                  {user.role}
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="logout-btn"
            />
          )}
        </div>

        <div style={{ 
          position: 'absolute', 
          bottom: 16, 
          left: '50%', 
          transform: 'translateX(-50%)',
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 8,
          cursor: 'pointer',
          transition: 'all 0.3s',
          color: 'white',
          fontSize: 16,
        }} 
        onClick={() => setCollapsed(!collapsed)}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </Sider>

      <Layout className="main-wrapper">
        <Header className="app-header">
          <div className="header-left">
            <Button
              type="text"
              icon={<MenuUnfoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="collapse-trigger-btn"
            />
            <div className="header-breadcrumb">
              <span className="breadcrumb-item">MediCore</span>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-current">
                {menuItems.find(m => m.key === getSelectedKey())?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="header-center">
            <div className="search-box">
              <SearchOutlined className="search-icon" />
              <input type="text" placeholder="Search patients, records..." className="search-input" />
            </div>
          </div>

          <div className="header-right">
            <Button
              type="text"
              icon={<HomeOutlined />}
              onClick={() => router.push('/dashboard')}
              className="header-btn"
            />
            <NotificationBell />
            <div className="header-user">
              <Badge dot status="success" offset={[-2, 2]}>
                <div className="header-avatar">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
              </Badge>
            </div>
          </div>
        </Header>

        <Content className="main-content">
          {children}
        </Content>
      </Layout>

      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-logo">
                <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
                  <rect width="28" height="28" rx="8" fill="url(#drawerLogoGrad)"/>
                  <path d="M14 6V22M6 14H22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="drawerLogoGrad" x1="0" y1="0" x2="28" y2="28">
                      <stop stopColor="#0088FE"/>
                      <stop offset="1" stopColor="#00B4D8"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span>MediCore</span>
              </div>
              <Button type="text" onClick={() => setMobileOpen(false)}>Close</Button>
            </div>
            <Menu
              mode="inline"
              selectedKeys={[getSelectedKey()]}
              onClick={handleMenuClick}
              items={menuItems}
              theme="dark"
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
