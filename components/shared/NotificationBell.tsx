'use client';

import React from 'react';
import { Badge, Dropdown, Typography, Button, Divider } from 'antd';
import { BellOutlined, CalendarOutlined, MedicineBoxOutlined, FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useAuth, Notification } from '@/lib/contexts/AuthContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Text } = Typography;

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'appointment':
      return <CalendarOutlined style={{ color: '#0077B6' }} />;
    case 'lab_result':
      return <FileTextOutlined style={{ color: '#10B981' }} />;
    case 'prescription':
      return <MedicineBoxOutlined style={{ color: '#F59E0B' }} />;
    case 'alert':
      return <InfoCircleOutlined style={{ color: '#EF4444' }} />;
    default:
      return <BellOutlined style={{ color: '#0077B6' }} />;
  }
};

export function NotificationBell() {
  const { user, getNotifications, getNotificationCount, markNotificationAsRead, markAllNotificationsAsRead } = useAuth();
  
  const notifications = getNotifications();
  const unreadCount = getNotificationCount();

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const notificationContent = (
    <div
      className="notification-dropdown"
      style={{
        width: 'clamp(280px, 90vw, 380px)',
        maxWidth: '90vw',
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
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <BellOutlined style={{ fontSize: '32px', color: '#CBD5E1' }} />
            <Text type="secondary" className="block mt-2">
              No notifications yet
            </Text>
          </div>
        ) : (
          notifications.map((item) => (
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
                  className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.read ? '#F1F5F9' : '#DBEAFE' }}
                >
                  {getNotificationIcon(item.type)}
                </div>
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
                  {item.patientName && (
                    <div className="mb-1">
                      <Text className="text-xs" style={{ color: '#64748B' }}>
                        Patient: {item.patientName}
                        {item.mrn && ` (${item.mrn})`}
                      </Text>
                    </div>
                  )}
                  {item.appointmentTime && (
                    <div className="mb-1">
                      <Text className="text-xs" style={{ color: '#64748B' }}>
                        Time: {item.appointmentTime}
                      </Text>
                    </div>
                  )}
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {dayjs(item.createdAt).fromNow()}
                  </Text>
                </div>
              </div>
            </div>
          ))
        )}
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
      popupRender={() => notificationContent}
      trigger={['click']}
      placement="bottomRight"
      overlayStyle={{ 
        maxWidth: '90vw',
      }}
    >
      <Badge count={unreadCount} size="small" offset={[-5, 5]} style={{ backgroundColor: '#EF4444' }}>
        <Button
          type="text"
          icon={<BellOutlined className="text-xl" style={{ color: 'white' }} />}
          className="flex items-center justify-center"
          style={{
            borderRadius: '8px',
            transition: 'all 0.2s',
            color: 'white',
          }}
        />
      </Badge>
    </Dropdown>
  );
}
