'use client';

import React, { useState } from 'react';
import { Badge, Dropdown, Typography, Button, Divider } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Appointment',
      message: 'Sarah Johnson has booked an appointment for today',
      time: '5 minutes ago',
      read: false,
      type: 'info',
    },
    {
      id: '2',
      title: 'Lab Result Ready',
      message: 'Lab results for John Smith are ready for review',
      time: '15 minutes ago',
      read: false,
      type: 'success',
    },
    {
      id: '3',
      title: 'Payment Overdue',
      message: 'Invoice INV-2024-0001 is overdue',
      time: '1 hour ago',
      read: true,
      type: 'warning',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const notificationContent = (
    <div
      className="notification-dropdown"
      style={{
        width: '380px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
      }}
    >
      <div
        className="flex items-center justify-between p-4"
        style={{
          background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
          color: 'white',
        }}
      >
        <Text strong style={{ color: 'white', fontSize: '16px' }}>
          Notifications
        </Text>
        {unreadCount > 0 && (
          <Badge count={unreadCount} style={{ backgroundColor: 'white', color: '#0077B6' }} />
        )}
      </div>
      {unreadCount > 0 && (
        <div className="px-3 py-2 border-b" style={{ background: '#F0F9FF' }}>
          <Button
            type="link"
            size="small"
            onClick={handleMarkAllAsRead}
            style={{ color: '#0077B6', padding: 0 }}
          >
            Mark all as read
          </Button>
        </div>
      )}
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`cursor-pointer p-4 border-b last:border-0 transition-all duration-200 ${
              !item.read ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
            }`}
            onClick={() => handleMarkAsRead(item.id)}
            style={{ position: 'relative' }}
          >
            {!item.read && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: 'linear-gradient(180deg, #0077B6 0%, #00B4D8 100%)',
                }}
              />
            )}
            <div className="flex gap-3">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                style={{
                  backgroundColor: !item.read ? '#0077B6' : 'transparent',
                }}
              />
              <div className="flex-1 min-w-0">
                <Text
                  strong={!item.read}
                  className="block mb-1"
                  style={{ fontSize: '14px' }}
                >
                  {item.title}
                </Text>
                <Text
                  type="secondary"
                  className="block text-sm mb-2"
                  style={{ display: 'block', fontSize: '13px' }}
                >
                  {item.message}
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {item.time}
                </Text>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Divider className="my-0" />
      <div className="p-3 text-center">
        <Button type="link" size="small" style={{ color: '#0077B6' }}>
          View all notifications
        </Button>
      </div>
    </div>
  );

  return (
    <Dropdown
      menu={{ items: [] }}
      dropdownRender={() => notificationContent}
      trigger={['click']}
      placement="bottomRight"
    >
      <Badge count={unreadCount} size="small" offset={[-5, 5]}>
        <Button
          type="text"
          icon={<BellOutlined className="text-xl" />}
          className="flex items-center justify-center"
          style={{
            borderRadius: '8px',
            transition: 'all 0.2s',
          }}
        />
      </Badge>
    </Dropdown>
  );
}
