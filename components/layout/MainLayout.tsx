'use client';

import React, { useState } from 'react';
import { Layout } from 'antd';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { useBreakpoint } from '@/lib/utils/responsive';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
  /**
   * Optional page title to show in mobile header
   */
  title?: string;
  /**
   * Optional actions for mobile header (notifications, profile, etc.)
   */
  headerActions?: React.ReactNode;
}

export function MainLayout({
  children,
  title,
  headerActions,
}: MainLayoutProps) {
  // Desktop sidebar collapse state
  const [collapsed, setCollapsed] = useState(false);

  // Mobile sidebar drawer state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Get current breakpoint for responsive behavior
  const { isDesktop } = useBreakpoint();

  // Auto-collapse sidebar on smaller screens (everything below desktop)
  const isSmallScreen = !isDesktop;

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
      }}
    >
      {/* Sidebar with mobile overlay support */}
      <Sidebar
        collapsed={isSmallScreen ? true : collapsed}
        onCollapse={setCollapsed}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Mobile Header */}
      <MobileHeader
        title={title}
        onMenuClick={() => setMobileSidebarOpen(true)}
        actions={headerActions}
      />

      {/* Main Content Area */}
      <Layout
        className="transition-all duration-300"
        style={{
          background: 'transparent',
          marginLeft: isSmallScreen ? '0px' : collapsed ? '70px' : '280px',
        }}
      >
        <Content
          className="main-content"
          style={{
            paddingTop: isSmallScreen ? '60px' : '0', // Space for mobile header
            padding: isSmallScreen ? '16px' : '24px', // Responsive padding
            background: 'transparent',
            overflow: 'auto',
            minHeight: '100vh',
          }}
        >
          <div
            style={{
              maxWidth: '100%',
              overflow: 'hidden',
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
