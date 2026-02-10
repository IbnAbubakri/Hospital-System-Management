'use client';

import React from 'react';
import { Card, Tag, Avatar, Space, Typography } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  AlertOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

interface ActivityItem {
  id: string;
  type: 'appointment' | 'admission' | 'payment' | 'lab' | 'patient' | 'triage' | 'scheduling';
  title: string;
  description: string;
  user: string;
  timeString: string;
  status?: string;
  department?: string;
  doctorId?: string;
}

interface ActivityFeedProps {
  activities?: ActivityItem[];
  title?: string;
  maxItems?: number;
}

const defaultActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'New Appointment Scheduled',
    description: 'John Smith scheduled an appointment with Dr. Emily Brown',
    user: 'System',
    timeString: '5 minutes ago',
    status: 'confirmed',
  },
  {
    id: '2',
    type: 'admission',
    title: 'Patient Admitted',
    description: 'Sarah Johnson was admitted to Ward B - Bed 205',
    user: 'Dr. Michael Chen',
    timeString: '15 minutes ago',
    status: 'admitted',
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Received',
    description: '₦200,000 payment received for invoice INV-2024-0002',
    user: 'Reception',
    timeString: '30 minutes ago',
    status: 'completed',
  },
  {
    id: '4',
    type: 'lab',
    title: 'Lab Results Completed',
    description: 'Complete Blood Count results for Robert Williams',
    user: 'Lab Technician',
    timeString: '45 minutes ago',
    status: 'approved',
  },
  {
    id: '5',
    type: 'patient',
    title: 'New Patient Registered',
    description: 'Emily Davis registered in the system',
    user: 'Reception',
    timeString: '1 hour ago',
  },
];

const iconConfig = {
  appointment: { icon: <CalendarOutlined />, color: '#3B82F6', bg: '#DBEAFE' },
  admission: { icon: <CheckCircleOutlined />, color: '#10B981', bg: '#D1FAE5' },
  payment: { icon: <DollarOutlined />, color: '#F59E0B', bg: '#FEF3C7' },
  lab: { icon: <ExperimentOutlined />, color: '#8B5CF6', bg: '#EDE9FE' },
  patient: { icon: <UserOutlined />, color: '#06B6D4', bg: '#CFFAFE' },
  triage: { icon: <AlertOutlined />, color: '#EF4444', bg: '#FEE2E2' },
  scheduling: { icon: <ClockCircleOutlined />, color: '#F59E0B', bg: '#FEF3C7' },
};

const statusColors: Record<string, { color: string; bg: string }> = {
  confirmed: { color: '#1E40AF', bg: '#DBEAFE' },
  admitted: { color: '#065F46', bg: '#D1FAE5' },
  completed: { color: '#065F46', bg: '#D1FAE5' },
  approved: { color: '#065F46', bg: '#D1FAE5' },
  pending: { color: '#92400E', bg: '#FEF3C7' },
};

export function ActivityFeed({
  activities = defaultActivities,
  title = 'Recent Activity',
  maxItems = 5,
}: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <Card
      title={<span className="text-gray-800 font-semibold">{title}</span>}
      className="hover:shadow-xl transition-all duration-300"
      style={{
        borderRadius: '16px',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        height: '100%',
      }}
    >
      <div className="space-y-3">
        {displayActivities.map((activity) => {
          const config = iconConfig[activity.type];
          return (
            <div
              key={activity.id}
              className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <Avatar
                icon={config.icon}
                className="flex-shrink-0"
                style={{
                  backgroundColor: config.bg,
                  color: config.color,
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1 gap-2">
                  <Text strong className="block text-sm text-gray-800">
                    {activity.title}
                  </Text>
                  {activity.status && (
                    <Tag
                      className="flex-shrink-0 m-0"
                      style={{
                        backgroundColor: statusColors[activity.status]?.bg,
                        color: statusColors[activity.status]?.color,
                        border: 'none',
                        borderRadius: '6px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      {activity.status}
                    </Tag>
                  )}
                </div>
                <Text
                  type="secondary"
                  className="block text-xs mb-1 line-clamp-2"
                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {activity.description}
                </Text>
                <Text type="secondary" className="text-xs" style={{ color: '#9CA3AF' }}>
                  {activity.user} • {activity.timeString}
                </Text>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
