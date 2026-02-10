'use client';

import React from 'react';
import { Avatar, Dropdown, Button, Typography, Space, Badge, List, Tag } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  MedicineBoxFilled,
  HeartOutlined,
  BellOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { DEPARTMENT_COLORS } from '@/lib/departmentColors';

const { Text } = Typography;

export function UserHeader() {
  const router = useRouter();
  const { user, logout, getUserFullName, getFilteredPatients, getFilteredEMRs, getPendingAppointments, getNotificationCount, clearNotifications } = useAuth();

  if (!user) return null;

  const departmentColor = DEPARTMENT_COLORS[user.department || 'General Medicine'] || DEPARTMENT_COLORS['General Medicine'];
  const colorStyle = {
    backgroundColor: departmentColor.light,
    color: departmentColor.text,
    border: `1px solid ${departmentColor.border}`,
  };
  const userInitials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  const patientCount = getFilteredPatients().length;
  const emrCount = getFilteredEMRs().length;
  const notificationCount = getNotificationCount();
  const pendingAppointments = getPendingAppointments();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Notification menu content for doctors
  const notificationContent = (
    <div style={{ width: '350px', maxHeight: '400px', overflow: 'auto' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
        <Text strong>Upcoming Appointments</Text>
        <Text type="secondary" style={{ float: 'right', fontSize: '12px' }}>
          {notificationCount} pending
        </Text>
      </div>
      {pendingAppointments.length > 0 ? (
        <List
          size="small"
          dataSource={pendingAppointments}
          renderItem={(item: any) => (
            <List.Item
              style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #F3F4F6' }}
              onClick={() => router.push('/patients/appointments')}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<CalendarOutlined />} style={{ background: '#10B981' }} />}
                title={
                  <Text style={{ fontSize: '13px' }}>
                    {item.patientName}
                  </Text>
                }
                description={
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                      {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {item.startTime}
                    </div>
                    <Tag color="blue" style={{ fontSize: '11px', marginTop: '4px' }}>
                      {item.type}
                    </Tag>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <Text type="secondary">No upcoming appointments</Text>
        </div>
      )}
      {pendingAppointments.length > 0 && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid #E5E7EB', textAlign: 'center' }}>
          <Button type="link" size="small" onClick={() => router.push('/patients/appointments')}>
            View All Appointments
          </Button>
        </div>
      )}
    </div>
  );

  const menuItems = [
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
      onClick: () => router.push('/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      {/* Notification Bell for Doctors */}
      {user.role === 'Doctor' && (
        <Dropdown menu={{ items: [], }} dropdownRender={() => notificationContent} trigger={['click']} placement="bottomRight">
          <Badge count={notificationCount} size="small" offset={[-5, 5]}>
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: '18px', color: '#6B7280' }} />}
              style={{ borderRadius: '8px' }}
            />
          </Badge>
        </Dropdown>
      )}

      {/* User Dropdown */}
      <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '6px 12px',
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          border: '1px solid #E5E7EB',
          background: 'white',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#F9FAFB';
          e.currentTarget.style.borderColor = '#D1D5DB';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.borderColor = '#E5E7EB';
        }}
      >
        {/* User Avatar */}
        <Avatar
          size={40}
          style={{
            background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
            color: 'white',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          {userInitials}
        </Avatar>

        {/* User Info */}
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>
              {getUserFullName()}
            </Text>
            <Badge
              count={user.role}
              style={{
                ...colorStyle,
                fontSize: '11px',
                fontWeight: 500,
                padding: '0 6px',
                borderRadius: '4px',
              }}
            />
          </div>
          <Text style={{ fontSize: '12px', color: '#6B7280' }}>
            {user.department}
          </Text>
        </div>

        {/* Stats for Doctors */}
        {user.role === 'Doctor' && (
          <div
            style={{
              display: 'flex',
              gap: '16px',
              paddingLeft: '12px',
              borderLeft: '1px solid #E5E7EB',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#0077B6' }}>
                {patientCount}
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>
                Patients
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#10B981' }}>
                {emrCount}
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>
                EMRs
              </div>
            </div>
          </div>
        )}

        {/* Down arrow indicator */}
        <div
          style={{
            padding: '4px',
            borderRadius: '4px',
            color: '#9CA3AF',
          }}
        >
          ▼
        </div>
      </div>
    </Dropdown>
    </div>
  );
}
