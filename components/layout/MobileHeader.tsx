'use client';

import React from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface MobileHeaderProps {
  /**
   * Callback when menu button is clicked
   */
  onMenuClick: () => void;
  /**
   * Optional title to display
   */
  title?: string;
  /**
   * Optional logo component
   */
  logo?: React.ReactNode;
  /**
   * Optional right side actions
   */
  actions?: React.ReactNode;
}

/**
 * MobileHeader - Header component for mobile devices with hamburger menu
 *
 * This component is only visible on mobile devices (< 1024px)
 * and provides a hamburger menu button to toggle the sidebar drawer.
 *
 * @example
 * <MobileHeader
 *   onMenuClick={() => setMobileSidebarOpen(true)}
 *   title="Dashboard"
 *   actions={<NotificationBadge />}
 * />
 */
export function MobileHeader({
  onMenuClick,
  title,
  logo,
  actions,
}: MobileHeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side: Menu button + Logo/Title */}
        <div className="flex items-center gap-3 flex-1">
          {/* Hamburger Menu Button */}
          <Button
            type="text"
            icon={<MenuOutlined className="text-gray-700" />}
            onClick={onMenuClick}
            className="flex items-center justify-center"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
            }}
            aria-label="Toggle menu"
          />

          {/* Logo or Title */}
          {logo ? (
            <div className="flex items-center">{logo}</div>
          ) : title ? (
            <div>
              <h1 className="text-base font-semibold text-gray-900 truncate">
                {title}
              </h1>
            </div>
          ) : (
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              }}
            >
              <span
                style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                LM
              </span>
            </div>
          )}
        </div>

        {/* Right side: Actions */}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

/**
 * MobileLogo - Small logo component for mobile header
 *
 * @example
 * <MobileLogo />
 */
export function MobileLogo() {
  return (
    <div
      className="flex items-center justify-center rounded-lg"
      style={{
        width: '32px',
        height: '32px',
        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <span
        style={{
          color: 'white',
          fontSize: '14px',
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        LM
      </span>
    </div>
  );
}
