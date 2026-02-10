'use client';

import React, { useMemo } from 'react';
import { Row, Col, Typography, Button } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  TeamOutlined,
  PlusOutlined,
  FileTextOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { mockStats } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';

const { Title, Text } = Typography;

export function AdminDashboard() {
  const router = useRouter();
  const { getUserFullName } = useAuth();

  const quickActions = [
    { icon: <PlusOutlined />, label: 'Add Patient', color: '#0077B6', path: '/patients/new' },
    { icon: <PlusOutlined />, label: 'Add User', color: '#10B981', path: '/staff/registration' },
    { icon: <FileTextOutlined />, label: 'Generate Reports', color: '#8B5CF6', path: '/reports' },
    { icon: <SettingOutlined />, label: 'System Settings', color: '#6B7280', path: '/admin/users' },
  ];

  const stats = [
    {
      label: 'Total Patients',
      value: mockStats.totalPatients,
      subtext: 'Registered',
      color: '#0077B6',
      icon: <UserOutlined />,
      trend: '+5%',
      bg: '#EFF6FF',
      border: '#DBEAFE',
    },
    {
      label: 'Total Staff',
      value: '156',
      subtext: 'Active Employees',
      color: '#10B981',
      icon: <TeamOutlined />,
      trend: '+3%',
      bg: '#D1FAE5',
      border: '#A7F3D0',
    },
    {
      label: "Today's Appointments",
      value: mockStats.todayAppointments,
      subtext: 'Scheduled',
      color: '#F59E0B',
      icon: <CalendarOutlined />,
      trend: '+12%',
      bg: '#FEF3C7',
      border: '#FDE68A',
    },
    {
      label: 'Monthly Revenue',
      value: formatCurrency(mockStats.totalRevenue),
      subtext: 'This Month',
      color: '#6366F1',
      icon: <DollarOutlined />,
      trend: '+15%',
      bg: '#E0E7FF',
      border: '#C7D2FE',
    },
  ];

  return (
    <>
      {/* Welcome Banner - Administrator Theme */}
      <div
        style={{
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          borderRadius: '16px',
          padding: '40px',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '32px',
        }}
      >
        {/* Decorative Elements */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '100px',
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
            Administrator Dashboard
          </Text>
          <Title level={2} style={{ color: 'white', margin: 0, fontSize: '36px', fontWeight: 700, marginBottom: '12px' }}>
            Welcome back, {getUserFullName()}!
          </Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '15px', display: 'block', marginBottom: '24px' }}>
            You have full access to all hospital departments and system management features.
          </Text>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                size="large"
                icon={action.icon}
                onClick={() => router.push(action.path)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  borderRadius: '10px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{
              background: `linear-gradient(135deg, ${stat.bg} 0%, rgba(255,255,255,0.9) 100%)`,
              borderRadius: '16px',
              padding: '24px',
              border: `1px solid ${stat.border}`,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              animation: `fadeInUp 0.5s ease-out forwards`,
              animationDelay: `${index * 0.1}s`,
              opacity: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = `0 12px 28px ${stat.color}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
            }}
          >
            {/* Shimmer effect */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${stat.color} 0%, rgba(255,255,255,0.5) 50%, ${stat.color} 100%)`,
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s infinite',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `${stat.color}15`,
                }}
              >
                <div style={{ color: stat.color, fontSize: '26px' }}>{stat.icon}</div>
              </div>
              <div
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: stat.trend.startsWith('+') ? '#D1FAE5' : '#FEE2E2',
                  color: stat.trend.startsWith('+') ? '#065F46' : '#991B1B',
                }}
              >
                {stat.trend}
              </div>
            </div>
            <Text style={{ color: '#64748B', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
              {stat.label}
            </Text>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <Text className="stat-number" style={{ fontSize: '32px', fontWeight: 700, color: stat.color, lineHeight: 1 }}>
                {stat.value}
              </Text>
              <Text style={{ fontSize: '14px', color: '#64748B' }}>{stat.subtext}</Text>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
}
