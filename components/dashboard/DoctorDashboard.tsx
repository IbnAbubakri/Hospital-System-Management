'use client';

import React, { useMemo } from 'react';
import { Row, Col, Typography, Button, Badge, Tag } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MonitorOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterAppointmentsByUser } from '@/lib/dataFilters';
import { mockAppointments, mockStats } from '@/lib/mockData';
import { getDepartmentColors } from '@/lib/departmentColors';
import { getDashboardStatsForUser } from '@/lib/dashboardFilters';
import { ScopeTag } from './ScopeIndicator';

const { Title, Text } = Typography;

export function DoctorDashboard() {
  const router = useRouter();
  const { user, getUserFullName, getPatientStats } = useAuth();

  // Get department colors for personalization
  const departmentColors = user?.department ? getDepartmentColors(user.department) : null;

  // Get filtered dashboard statistics
  const dashboardStats = useMemo(() => getDashboardStatsForUser(user), [user]);

  // Get filtered data
  const filteredAppointments = useMemo(() => filterAppointmentsByUser(user, mockAppointments), [user]);
  const patientStats = useMemo(() => getPatientStats(), [user, getPatientStats]);

  // Calculate today's appointments
  const todayAppointments = useMemo(() => {
    return filteredAppointments.filter(apt => {
      const aptDate = new Date(apt.date);
      const today = new Date();
      return aptDate.getDate() === today.getDate() &&
             aptDate.getMonth() === today.getMonth() &&
             aptDate.getFullYear() === today.getFullYear();
    }).length;
  }, [filteredAppointments]);

  const quickActions = [
    { icon: <MonitorOutlined />, label: 'Start Consultation', color: departmentColors?.primary || '#0077B6', path: '/clinical/consultation' },
    { icon: <UserOutlined />, label: 'View My Patients', color: '#10B981', path: '/patients' },
    { icon: <FileTextOutlined />, label: 'Create EMR', color: '#8B5CF6', path: '/clinical/emr' },
    { icon: <MedicineBoxOutlined />, label: 'Prescriptions', color: '#F59E0B', path: '/clinical/prescriptions' },
  ];

  const stats = [
    {
      label: 'My Patients',
      value: dashboardStats.myPatients || patientStats.total,
      subtext: 'Under my care',
      color: departmentColors?.primary || '#0077B6',
      icon: <UserOutlined />,
      trend: '+3%',
      bg: departmentColors?.light || '#EFF6FF',
      border: departmentColors?.border || '#DBEAFE',
    },
    {
      label: "Today's Appointments",
      value: todayAppointments,
      subtext: 'Scheduled',
      color: '#10B981',
      icon: <CalendarOutlined />,
      trend: '+8%',
      bg: '#D1FAE5',
      border: '#A7F3D0',
    },
    {
      label: 'Pending EMRs',
      value: dashboardStats.pendingEMRs?.toString() || '8',
      subtext: 'To complete',
      color: '#F59E0B',
      icon: <FileTextOutlined />,
      trend: 'Action',
      bg: '#FEF3C7',
      border: '#FDE68A',
    },
    {
      label: 'Lab Orders',
      value: dashboardStats.labOrders?.toString() || '12',
      subtext: 'Pending results',
      color: '#8B5CF6',
      icon: <ExperimentOutlined />,
      trend: '-2',
      bg: '#EDE9FE',
      border: '#DDD6FE',
    },
  ];

  return (
    <>
      {/* Scope Indicator */}
      <div style={{ marginBottom: '24px' }}>
        <ScopeTag user={user} />
      </div>

      {/* Welcome Banner - Department-Colored */}
      <div
        style={{
          background: departmentColors?.gradient || 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                Dr. Dashboard • {user?.department || 'General Medicine'}
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
                {user?.department} Department View
              </Tag>
              <Title level={2} style={{ color: 'white', margin: 0, fontSize: '36px', fontWeight: 700, marginBottom: '12px' }}>
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {getUserFullName()}!
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '15px', display: 'block', marginBottom: '24px' }}>
                You have {patientStats.total} patient{patientStats.total !== 1 ? 's' : ''} under your care and {todayAppointments} appointment{todayAppointments !== 1 ? 's' : ''} today.
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

            {/* Notification Bell for Doctors */}
            <Badge count={todayAppointments} size="default" offset={[0, 0]}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => router.push('/patients/appointments')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <CalendarOutlined style={{ color: 'white', fontSize: '24px' }} />
              </div>
            </Badge>
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
