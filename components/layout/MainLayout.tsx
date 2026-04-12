'use client';

import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { GlobalHeader } from './GlobalHeader';
import { useBreakpoint } from '@/lib/utils/responsive';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getMenuItemsForRole } from '@/lib/constants/roleNavigation';

const { Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDesktop } = useBreakpoint();
  const isSmallScreen = !isDesktop;
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = user ? getMenuItemsForRole(user.role) : [];

  const flattenMenu = (items: any[], key = 'key', path = 'path'): { key: string; path: string }[] => {
    return items.reduce((acc: any[], item: any) => {
      if (item[path]) acc.push({ key: item[key], path: item[path] });
      if (item.children) acc.push(...flattenMenu(item.children, key, path));
      return acc;
    }, []);
  };

  const pathMap = flattenMenu(menuItems);
  const currentKey = pathMap.find(m => m.path === pathname)?.key || 'dashboard';

  const menuProps: MenuProps = {
    selectedKeys: [currentKey],
    items: menuItems,
    onClick: ({ key }) => {
      const item = pathMap.find(m => m.key === key);
      if (item?.path) router.push(item.path);
    },
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Top Header - Horizontal */}
      <GlobalHeader
        showMenuButton
        onMenuClick={() => setMobileOpen(true)}
      />

      <Layout hasSider style={{ marginTop: '64px' }}>
        {/* Sidebar - Vertical */}
        {!isSmallScreen && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            trigger={null}
            width={280}
            collapsedWidth={70}
            style={{
              position: 'fixed',
              left: 0,
              top: 64,
              bottom: 0,
              background: 'linear-gradient(180deg, #0EA5E9 0%, #0284C7 50%, #0369A1 100%)',
              boxShadow: '4px 0 20px 0 rgba(14, 165, 233, 0.25)',
              overflow: 'auto',
              zIndex: 40,
            }}
          >
            <Menu
              mode="inline"
              {...menuProps}
              style={{ border: 'none', marginTop: 8, background: 'transparent' }}
            />
          </Sider>
        )}

        {/* Mobile Menu Drawer */}
        {isSmallScreen && mobileOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(0,0,0,0.5)',
            }}
            onClick={() => setMobileOpen(false)}
          >
            <div
              style={{
                width: 280,
                height: '100%',
                background: '#fff',
                padding: 16,
              }}
              onClick={e => e.stopPropagation()}
            >
              <Menu
                mode="inline"
                {...menuProps}
                onClick={() => setMobileOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <Content
          style={{
            marginLeft: isSmallScreen ? 0 : collapsed ? 70 : 280,
            marginTop: 0,
            padding: isSmallScreen ? 12 : 16,
            minHeight: 'calc(100vh - 64px)',
            background: '#f8fafc',
            transition: 'margin-left 0.2s',
            position: 'relative',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
