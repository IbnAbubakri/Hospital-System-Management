'use client';

import React, { useState, useMemo } from 'react';
import { Layout, Typography, Tooltip } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { MenuItem } from '@/lib/constants/navigation';
import { getMenuItemsForRole } from '@/lib/constants/roleNavigation';
import { useAuth } from '@/lib/contexts/AuthContext';

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  /**
   * Mobile-specific: Whether the sidebar drawer is open on mobile
   */
  mobileOpen?: boolean;
  /**
   * Mobile-specific: Callback to close the mobile drawer
   */
  onMobileClose?: () => void;
}

// Section groupings for better organization
const SECTION_GROUPS: Record<string, string> = {
  dashboard: 'Main',
  patients: 'Patient Management',
  clinical: 'Clinical Services',
  laboratory: 'Laboratory',
  radiology: 'Radiology',
  pharmacy: 'Pharmacy',
  billing: 'Billing & Finance',
  inventory: 'Inventory',
  staff: 'Staff Management',
  reports: 'Reports',
  admin: 'Administration',
};

export function Sidebar({
  collapsed = false,
  onCollapse,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  // Get menu items based on user role
  const menuItems = useMemo(() => {
    return user ? getMenuItemsForRole(user.role) : [];
  }, [user]);

  // Create a flat map for navigation
  const createPathMap = (items: MenuItem[], map: Record<string, string> = {}): Record<string, string> => {
    items.forEach((item) => {
      if (item.path) {
        map[item.key] = item.path;
      }
      if (item.children) {
        createPathMap(item.children, map);
      }
    });
    return map;
  };

  const pathMap = useMemo(() => createPathMap(menuItems), []);

  // Find the selected key based on current path
  const getSelectedKey = (path: string): string => {
    const entries = Object.entries(pathMap);
    for (const [key, value] of entries) {
      if (value === path) return key;
    }
    return 'dashboard';
  };

  const selectedKey = getSelectedKey(pathname);

  // Toggle submenu expansion
  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Handle navigation
  const handleItemClick = (item: MenuItem) => {
    if (item.path) {
      router.push(item.path);
    } else if (item.children) {
      toggleExpand(item.key);
    }
  };

  // Check if item is active (selected or has selected child)
  const isActive = (item: MenuItem): boolean => {
    if (item.key === selectedKey) return true;
    if (item.children) {
      return item.children.some((child) => child.key === selectedKey);
    }
    return false;
  };

  // Render menu item
  const renderMenuItem = (item: MenuItem, level: number = 0): React.ReactNode => {
    const isExpanded = expandedKeys.has(item.key);
    const active = isActive(item);
    const hasChildren = item.children && item.children.length > 0;

    // When collapsed, only show level 0 items with centered icons
    if (collapsed && level === 0) {
      return (
        <Tooltip key={item.key} title={item.label} placement="right" zIndex={100}>
          <div
            className="relative transition-all duration-200 ease-in-out cursor-pointer mx-auto mb-2"
            onClick={() => handleItemClick(item)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            <div
              className={`
                flex items-center justify-center rounded-lg transition-all duration-200 w-full h-full
                ${active ? 'bg-blue-500/30 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'}
              `}
              style={{
                background: active ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.1) 100%)' : undefined,
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
            </div>
          </div>
        </Tooltip>
      );
    }

    // Expanded state menu item
    return (
      <div
        key={item.key}
        className={`
          relative transition-all duration-200 ease-in-out cursor-pointer
          ${level === 0 ? 'mx-3 mb-1' : 'mx-3 mb-0.5'}
        `}
        onClick={() => handleItemClick(item)}
        style={{
          borderRadius: level === 0 ? '10px' : '8px',
          overflow: 'hidden',
        }}
      >
        {/* Active indicator bar */}
        {active && (
          <div
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{
              background: 'linear-gradient(180deg, #60A5FA 0%, #3B82F6 100%)',
              boxShadow: '0 0 8px rgba(96, 165, 250, 0.6)',
            }}
          />
        )}

        <div
          className={`
            flex items-center relative overflow-hidden
            transition-all duration-200 ease-in-out
            ${active ? 'text-white' : 'text-gray-300 hover:text-white'}
            ${level === 0 ? 'py-3 px-3' : 'py-2.5 px-3'}
          `}
          style={{
            background: active
              ? level === 0
                ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.1) 100%)'
                : 'rgba(59, 130, 246, 0.15)'
              : 'transparent',
            borderLeft: active ? 'none' : '2px solid transparent',
          }}
        >
          {/* Icon */}
          <div
            className={`
              flex items-center justify-center rounded-lg transition-all duration-200 flex-shrink-0
              ${active ? 'bg-blue-500/30' : 'bg-white/5 hover:bg-white/10'}
            `}
            style={{
              width: level === 0 ? '36px' : '32px',
              height: level === 0 ? '36px' : '32px',
              fontSize: level === 0 ? '16px' : '14px',
            }}
          >
            {item.icon}
          </div>

          {/* Label */}
          <span
            className="font-medium transition-all duration-200 flex-1"
            style={{
              fontSize: level === 0 ? '14px' : '13px',
              fontWeight: active ? 600 : 500,
              letterSpacing: '0.1px',
              marginLeft: '12px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item.label}
          </span>

          {/* Expand/Collapse arrow */}
          {hasChildren && (
            <div
              className="flex-shrink-0 transition-transform duration-200"
              style={{
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                marginLeft: '8px',
              }}
            >
              <LeftOutlined style={{ fontSize: '10px', opacity: 0.7 }} />
            </div>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div
            className="mt-1 space-y-0.5"
            style={{
              paddingLeft: '12px',
              animation: 'slideDown 0.2s ease-out',
            }}
          >
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onMobileClose}
          style={{
            animation: 'fadeIn 0.2s ease-out',
          }}
        />
      )}

      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={`min-h-screen fixed left-0 top-0 bottom-0 z-50 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        width={280}
        collapsedWidth={70}
        style={{
          overflow: 'hidden',
          height: '100vh',
          position: 'fixed',
          left: 0,
          background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: mobileOpen ? '8px 0 32px rgba(0, 0, 0, 0.3)' : '4px 0 24px rgba(0, 0, 0, 0.15)',
        }}
      >
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div
          className="flex items-center justify-center relative overflow-hidden"
          style={{
            height: '72px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.08) 0%, transparent 100%)',
          }}
        >
          {collapsed ? (
            <div
              className="flex items-center justify-center rounded-xl relative overflow-hidden"
              style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <span
                style={{
                  color: 'white',
                  fontSize: '22px',
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                LM
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-6 w-full">
              {/* Logo */}
              <div
                className="flex items-center justify-center rounded-xl relative overflow-hidden flex-shrink-0"
                style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <span
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  LM
                </span>
              </div>

              {/* Hospital Name */}
              <div className="flex flex-col">
                <Text
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: '20px',
                    letterSpacing: '-0.2px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  Lagos Medical
                </Text>
                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '11px',
                    fontWeight: 500,
                    lineHeight: '14px',
                    letterSpacing: '0.2px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  Specialist Hospital
                </Text>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll"
          style={{
            padding: collapsed ? '12px 0' : '16px 0',
          }}
        >
          {menuItems.map((item) => renderMenuItem(item))}
        </div>

        {/* Collapse Button - Desktop Only */}
        <div
          className="relative overflow-hidden hidden lg:block"
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '16px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.2) 100%)',
          }}
        >
          <div
            className={`
              flex items-center justify-center gap-2 cursor-pointer
              transition-all duration-200 ease-in-out
              hover:bg-blue-500/20
              rounded-lg
            `}
            onClick={() => onCollapse?.(!collapsed)}
            style={{
              padding: collapsed ? '10px' : '12px 16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.04)',
            }}
          >
            {collapsed ? (
              <RightOutlined
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '12px',
                }}
              />
            ) : (
              <>
                <LeftOutlined
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '12px',
                  }}
                />
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.2px',
                  }}
                >
                  Collapse Menu
                </span>
              </>
            )}
          </div>
        </div>

        {/* Mobile Close Button */}
        <div
          className="lg:hidden relative overflow-hidden"
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '12px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.2) 100%)',
          }}
        >
          <div
            className={`
              flex items-center justify-center gap-2 cursor-pointer
              transition-all duration-200 ease-in-out
              hover:bg-red-500/20
              rounded-lg
            `}
            onClick={onMobileClose}
            style={{
              padding: '12px 16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(239, 68, 68, 0.1)',
            }}
          >
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Close Menu
            </span>
          </div>
        </div>

        {/* User Info Section (bottom) */}
        {!collapsed && user && (
          <div
            className="relative overflow-hidden"
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '16px',
              background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.06) 0%, transparent 100%)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{
                  width: '36px',
                  height: '36px',
                  background: user.role === 'AuxiliaryNurse'
                    ? 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)'
                    : user.role === 'Doctor'
                    ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                    : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <span style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <Text
                  style={{
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 600,
                    lineHeight: '18px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.role === 'Doctor' ? 'Dr. ' : ''}{user.firstName} {user.lastName}
                </Text>
                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '11px',
                    fontWeight: 400,
                    lineHeight: '14px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.role}{user.department && ` • ${user.department}`}
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>
    </Sider>
    </>
  );
}
