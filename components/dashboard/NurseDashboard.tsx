'use client';

import React, { useMemo } from 'react';
import { Row, Col, Typography, Button, Tag } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser, filterAppointmentsByUser } from '@/lib/dataFilters';
import { mockPatients, mockAppointments } from '@/lib/mockData';
import { getDashboardStatsForUser, getAvailableDoctors, getTriageStats } from '@/lib/dashboardFilters';
import { ScopeTag } from './ScopeIndicator';

const { Title, Text } = Typography;

export function NurseDashboard() {
  const router = useRouter();
  const { user, getUserFullName } = useAuth();

  // PINK gradient theme for Auxiliary Nurses
  const NURSE_PINK = '#EC4899';
  const NURSE_PINK_DARK = '#DB2777';
  const NURSE_PINK_LIGHT = '#FCE7F3';
  const NURSE_PINK_BORDER = '#FBCFE8';

  // Get filtered dashboard statistics
  const dashboardStats = useMemo(() => getDashboardStatsForUser(user), [user]);

  // Get available doctors for scheduling
  const availableDoctors = useMemo(() => getAvailableDoctors(), []);

  // Get triage statistics
  const triageStats = useMemo(() => getTriageStats(), []);

  // Get filtered data - nurses see ALL patients and ALL appointments
  const filteredPatients = useMemo(() => filterPatientsByUser(user), [user]);
  const allAppointments = mockAppointments; // All appointments visible for scheduling

  // Calculate statistics
  const todayAppointments = useMemo(() => {
    return allAppointments.filter(apt => {
      const aptDate = new Date(apt.date);
      const today = new Date();
      return aptDate.getDate() === today.getDate() &&
             aptDate.getMonth() === today.getMonth() &&
             aptDate.getFullYear() === today.getFullYear();
    }).length;
  }, [allAppointments]);

  const quickActions = [
    { icon: <WarningOutlined />, label: 'Go to Triage', color: NURSE_PINK, path: '/triage' },
    { icon: <UserOutlined />, label: 'View All Patients', color: '#10B981', path: '/patients' },
    { icon: <TeamOutlined />, label: 'Check Doctor Availability', color: '#0077B6', path: '/staff/schedule' },
    { icon: <CalendarOutlined />, label: 'Schedule Appointment', color: '#F59E0B', path: '/patients/appointments' },
  ];

  const stats = [
    {
      label: 'Patients Triage Today',
      value: triageStats.totalTriageToday.toString(),
      subtext: 'Completed',
      color: NURSE_PINK,
      icon: <WarningOutlined />,
      trend: '+12%',
      bg: NURSE_PINK_LIGHT,
      border: NURSE_PINK_BORDER,
    },
    {
      label: 'Appointments Scheduled',
      value: todayAppointments.toString(),
      subtext: 'For today',
      color: '#10B981',
      icon: <CalendarOutlined />,
      trend: '+8%',
      bg: '#D1FAE5',
      border: '#A7F3D0',
    },
    {
      label: 'Available Doctors',
      value: availableDoctors.length.toString(),
      subtext: 'On duty today',
      color: '#0077B6',
      icon: <TeamOutlined />,
      trend: 'Active',
      bg: '#DBEAFE',
      border: '#BFDBFE',
    },
    {
      label: 'Pending Triage',
      value: triageStats.pendingTriage.toString(),
      subtext: 'In queue',
      color: '#F59E0B',
      icon: <ClockCircleOutlined />,
      trend: 'Action',
      bg: '#FEF3C7',
      border: '#FDE68A',
    },
  ];

  return (
    <>
      {/* Scope Indicator */}
      <div style={{ marginBottom: '24px' }}>
        <ScopeTag user={user} />
      </div>

      {/* Welcome Banner - PINK Gradient Theme */}
      <div
        style={{
          background: `linear-gradient(135deg, ${NURSE_PINK} 0%, ${NURSE_PINK_DARK} 100%)`,
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
            Auxiliary Nurse Dashboard • Triage Center
          </Text>
          <Tag
            icon={<FilterOutlined />}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              marginBottom: '12px',
              fontSize: '12px',
            }}
          >
            Triage & Scheduling View
          </Tag>
          <Title level={2} style={{ color: 'white', margin: 0, fontSize: '36px', fontWeight: 700, marginBottom: '12px' }}>
            Welcome, {getUserFullName()}!
          </Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '15px', display: 'block', marginBottom: '24px' }}>
            Triage patients and schedule appointments with appropriate doctors based on availability and department needs.
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
              {stat.trend && (
                <div
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: stat.trend.startsWith('+') ? '#D1FAE5' : stat.trend === 'Action' ? '#FEE2E2' : '#F3F4F6',
                    color: stat.trend.startsWith('+') ? '#065F46' : stat.trend === 'Action' ? '#991B1B' : '#374151',
                  }}
                >
                  {stat.trend}
                </div>
              )}
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
