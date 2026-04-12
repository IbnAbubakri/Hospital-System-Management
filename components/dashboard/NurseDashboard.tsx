'use client';

import React, { useMemo } from 'react';
import { Row, Col, Typography, Button, Tag, Card, List, Avatar, Checkbox, Progress } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  HeartOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  BellOutlined,
  ExclamationCircleOutlined,
  OrderedListOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser, filterAppointmentsByUser } from '@/lib/dataFilters';
import { mockPatients, mockAppointments, mockTriageQueue } from '@/lib/mockData';
import { getAvailableDoctors, getTriageStats, getDashboardStatsForUser } from '@/lib/dashboardFilters';
import { ScopeTag } from './ScopeIndicator';

const { Title, Text } = Typography;

export function NurseDashboard() {
  const router = useRouter();
  const { user, getUserFullName } = useAuth();

  const NURSE_PINK = '#EC4899';
  const NURSE_PINK_DARK = '#DB2777';
  const NURSE_PINK_LIGHT = '#FCE7F3';
  const NURSE_PINK_BORDER = '#FBCFE8';

  const dashboardStats = useMemo(() => getDashboardStatsForUser(user), [user]);
  const availableDoctors = useMemo(() => getAvailableDoctors(), []);
  const triageStats = useMemo(() => getTriageStats(), []);
  const filteredPatients = useMemo(() => filterPatientsByUser(user, mockPatients), [user]);
  const allAppointments = useMemo(() => filterAppointmentsByUser(user, mockAppointments), [user]);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const todayAppointments = useMemo(() => 
    allAppointments.filter(apt => apt.date === todayStr), [allAppointments, todayStr]);
  
  const pendingAppointments = useMemo(() => 
    todayAppointments.filter(apt => apt.status === 'pending'), [todayAppointments]);
  
  const criticalPatients = useMemo(() => 
    filteredPatients.filter(p => p.condition === 'critical').slice(0, 5), [filteredPatients]);
  
  const pendingTriage = useMemo(() => 
    mockTriageQueue.filter(t => t.status === 'waiting').slice(0, 5), []);

  // Patient rounds schedule
  const patientRounds = useMemo(() => [
    { id: '1', patient: 'Chukwuemeka Okonkwo', room: 'ICU-01', time: '08:00 AM', status: 'pending', priority: 'high' },
    { id: '2', patient: 'Adanna Okafor', room: 'Ward A-205', time: '08:30 AM', status: 'pending', priority: 'medium' },
    { id: '3', patient: 'Olufemi Adebayo', room: 'ICU-02', time: '09:00 AM', status: 'completed', priority: 'high' },
    { id: '4', patient: 'Chioma Eze', room: 'Ward B-102', time: '09:30 AM', status: 'pending', priority: 'low' },
    { id: '5', patient: 'Ibrahim Musah', room: 'Ward A-301', time: '10:00 AM', status: 'pending', priority: 'medium' },
  ], []);

  // Medication administration summary
  const medicationSummary = useMemo(() => ({
    pending: 8,
    administered: 15,
    missed: 2,
    upcoming: 5,
  }), []);

  // Pending tasks checklist
  const pendingTasks = useMemo(() => [
    { id: '1', task: 'Record vital signs for ICU patients', priority: 'high', completed: false },
    { id: '2', task: 'Administer morning medications', priority: 'high', completed: true },
    { id: '3', task: 'Update patient charts', priority: 'medium', completed: false },
    { id: '4', task: 'Assist with patient breakfast', priority: 'low', completed: true },
    { id: '5', task: 'Prepare discharge paperwork for Ward B', priority: 'medium', completed: false },
    { id: '6', task: 'Check inventory supplies', priority: 'low', completed: false },
  ], []);

  // Ward occupancy details
  const wardOccupancy = useMemo(() => [
    { ward: 'ICU', total: 20, occupied: 18, available: 2, critical: 8 },
    { ward: 'Emergency', total: 25, occupied: 23, available: 2, critical: 5 },
    { ward: 'General Ward A', total: 40, occupied: 32, available: 8, critical: 3 },
    { ward: 'General Ward B', total: 40, occupied: 26, available: 14, critical: 2 },
    { ward: 'Pediatrics', total: 30, occupied: 22, available: 8, critical: 1 },
  ], []);

  // Vital signs recording status
  const vitalSignsStatus = useMemo(() => ({
    recorded: 45,
    pending: 12,
    overdue: 3,
  }), []);

  const quickActions = [
    { icon: <WarningOutlined />, label: 'Triage', color: NURSE_PINK, path: '/triage' },
    { icon: <UserOutlined />, label: 'Patients', color: '#10B981', path: '/patients' },
    { icon: <TeamOutlined />, label: 'Doctors', color: '#0077B6', path: '/staff/directory' },
    { icon: <CalendarOutlined />, label: 'Schedule', color: '#F59E0B', path: '/patients/appointments' },
    { icon: <ExperimentOutlined />, label: 'MAR', color: '#8B5CF6', path: '/clinical/mar' },
    { icon: <FileTextOutlined />, label: 'Vitals', color: '#6366F1', path: '/clinical/vitals' },
  ];

  const stats = [
    {
      label: 'Triage Today',
      value: triageStats.totalTriageToday,
      subtext: `${triageStats.completedTriage} completed`,
      color: NURSE_PINK,
      icon: <WarningOutlined />,
      trend: `${triageStats.pendingTriage} pending`,
      bg: NURSE_PINK_LIGHT,
      border: NURSE_PINK_BORDER,
    },
    {
      label: 'Appointments',
      value: todayAppointments.length,
      subtext: `${pendingAppointments.length} pending`,
      color: '#10B981',
      icon: <CalendarOutlined />,
      trend: 'Today',
      bg: '#D1FAE5',
      border: '#A7F3D0',
    },
    {
      label: 'Available Doctors',
      value: availableDoctors.length,
      subtext: 'On duty now',
      color: '#0077B6',
      icon: <TeamOutlined />,
      trend: 'Active',
      bg: '#DBEAFE',
      border: '#BFDBFE',
    },
    {
      label: 'Total Patients',
      value: filteredPatients.length,
      subtext: `${criticalPatients.length} critical`,
      color: '#6366F1',
      icon: <UserOutlined />,
      trend: 'In system',
      bg: '#E0E7FF',
      border: '#C7D2FE',
    },
  ];

  return (
    <>
      {/* Scope Indicator */}
      <div style={{ marginBottom: '12px', marginTop: '-8px' }}>
        <ScopeTag user={user} />
      </div>

      {/* Welcome Banner - Nurse Theme */}
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
            {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          <Title level={2} style={{ color: 'white', margin: 0, fontSize: '36px', fontWeight: 700, marginBottom: '12px' }}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {getUserFullName()}!
          </Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '15px', display: 'block', marginBottom: '24px' }}>
            <strong>{triageStats.totalTriageToday}</strong> triaged today • <strong>{todayAppointments.length}</strong> appointments • <strong>{availableDoctors.length}</strong> doctors available
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
                  background: stat.trend === 'Active' ? '#D1FAE5' : stat.trend.includes('pending') ? '#FEF3C7' : '#E0E7FF',
                  color: stat.trend === 'Active' ? '#065F46' : stat.trend.includes('pending') ? '#92400E' : '#4F46E5',
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

      {/* Triage Queue & Appointments */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* Pending Triage Queue */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                <WarningOutlined style={{ marginRight: '8px', color: '#F59E0B' }} />
                Triage Queue
              </span>
            }
            extra={<Tag color="warning">{pendingTriage.length} waiting</Tag>}
            style={{ borderRadius: '16px' }}
          >
            {pendingTriage.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px' }}>
                <CheckCircleOutlined style={{ fontSize: '36px', color: '#10B981', marginBottom: '8px' }} />
                <Text type="secondary">No patients waiting for triage</Text>
              </div>
            ) : (
              <List
                dataSource={pendingTriage}
                renderItem={(item, index) => (
                  <List.Item style={{ padding: '12px', background: '#FEF3C7', borderRadius: '8px', marginBottom: '8px' }}>
                    <List.Item.Meta
                      avatar={<Avatar style={{ backgroundColor: item.priority === 'Emergency' ? '#EF4444' : item.priority === 'Urgent' ? '#F59E0B' : '#10B981' }}>{index + 1}</Avatar>}
                      title={<a onClick={() => router.push(`/triage`)}>{item.patientName}</a>}
                      description={
                        <div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>{item.complaint}</Text>
                          <br />
                          <Tag color={item.priority === 'Emergency' ? 'error' : item.priority === 'Urgent' ? 'warning' : 'success'} style={{ fontSize: '10px' }}>
                            {item.priority}
                          </Tag>
                        </div>
                      }
                    />
                    <Button type="primary" size="small" style={{ background: NURSE_PINK }} onClick={() => router.push(`/triage?patient=${item.patientId}`)}>
                      Assess
                    </Button>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* Today's Appointments */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                <CalendarOutlined style={{ marginRight: '8px', color: '#10B981' }} />
                Today's Appointments
              </span>
            }
            extra={<Tag color="blue">{todayAppointments.length}</Tag>}
            style={{ borderRadius: '16px' }}
          >
            {todayAppointments.length === 0 ? (
              <Text type="secondary">No appointments scheduled</Text>
            ) : (
              <List
                dataSource={todayAppointments.slice(0, 5)}
                renderItem={(item) => (
                  <List.Item style={{ padding: '10px', borderRadius: '8px', marginBottom: '6px' }}>
                    <List.Item.Meta
                      avatar={<Avatar style={{ backgroundColor: '#10B981' }} icon={<CalendarOutlined />} />}
                      title={item.patientName}
                      description={<Text type="secondary" style={{ fontSize: '12px' }}>{item.type} • Dr. {item.doctor}</Text>}
                    />
                    <div style={{ textAlign: 'right' }}>
                      <Text strong>{item.time}</Text>
                      <br />
                      <Tag color={item.status === 'confirmed' ? 'success' : 'warning'} style={{ fontSize: '10px' }}>{item.status}</Tag>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Patient Rounds & Medication Summary */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* Patient Rounds Schedule */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                <ClockCircleOutlined style={{ marginRight: '8px', color: NURSE_PINK }} />
                Patient Rounds Schedule
              </span>
            }
            style={{ borderRadius: '16px' }}
          >
            <List
              dataSource={patientRounds}
              renderItem={(item) => (
                <List.Item
                  style={{
                    padding: '12px',
                    background: item.status === 'completed' ? '#F0FDF4' : item.priority === 'high' ? '#FEF2F2' : '#F9FAFB',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    border: `1px solid ${item.status === 'completed' ? '#A7F3D0' : item.priority === 'high' ? '#FECACA' : '#E5E7EB'}`,
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '8px', 
                        background: item.status === 'completed' ? '#D1FAE5' : '#FEE2E2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {item.status === 'completed' ? 
                          <CheckCircleOutlined style={{ color: '#10B981' }} /> : 
                          <ClockCircleOutlined style={{ color: item.priority === 'high' ? '#EF4444' : '#6B7280' }} />
                        }
                      </div>
                    }
                    title={<Text strong>{item.patient}</Text>}
                    description={
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Room: {item.room}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '11px' }}>{item.time}</Text>
                      </div>
                    }
                  />
                  <Tag color={item.status === 'completed' ? 'success' : item.priority === 'high' ? 'error' : item.priority === 'medium' ? 'warning' : 'default'}>
                    {item.status === 'completed' ? 'Done' : item.priority}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Medication Administration Summary */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                <MedicineBoxOutlined style={{ marginRight: '8px', color: '#8B5CF6' }} />
                Medication Administration Summary
              </span>
            }
            style={{ borderRadius: '16px' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={12} md={6}>
                <div style={{ textAlign: 'center', padding: '16px', background: '#FEF3C7', borderRadius: '12px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#D97706' }}>{medicationSummary.pending}</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Pending</Text>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div style={{ textAlign: 'center', padding: '16px', background: '#D1FAE5', borderRadius: '12px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#10B981' }}>{medicationSummary.administered}</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Given</Text>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div style={{ textAlign: 'center', padding: '16px', background: '#FEE2E2', borderRadius: '12px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#EF4444' }}>{medicationSummary.missed}</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Missed</Text>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div style={{ textAlign: 'center', padding: '16px', background: '#E0E7FF', borderRadius: '12px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#6366F1' }}>{medicationSummary.upcoming}</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Upcoming</Text>
                </div>
              </Col>
            </Row>
            <Button type="link" style={{ marginTop: '12px', padding: 0 }} onClick={() => router.push('/clinical/mar')}>
              View Medication Record →
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Vital Signs & Pending Tasks */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* Vital Signs Recording Status */}
        <Col xs={24} md={12}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                <HeartOutlined style={{ marginRight: '8px', color: '#EF4444' }} />
                Vital Signs Recording Status
              </span>
            }
            style={{ borderRadius: '16px' }}
          >
            <Row gutter={[12, 12]}>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '16px', background: '#D1FAE5', borderRadius: '12px' }}>
                  <CheckCircleOutlined style={{ fontSize: '24px', color: '#10B981' }} />
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#10B981' }}>{vitalSignsStatus.recorded}</div>
                  <Text type="secondary" style={{ fontSize: '11px' }}>Recorded</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '16px', background: '#FEF3C7', borderRadius: '12px' }}>
                  <ClockCircleOutlined style={{ fontSize: '24px', color: '#D97706' }} />
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#D97706' }}>{vitalSignsStatus.pending}</div>
                  <Text type="secondary" style={{ fontSize: '11px' }}>Pending</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '16px', background: '#FEE2E2', borderRadius: '12px' }}>
                  <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#EF4444' }} />
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#EF4444' }}>{vitalSignsStatus.overdue}</div>
                  <Text type="secondary" style={{ fontSize: '11px' }}>Overdue</Text>
                </div>
              </Col>
            </Row>
            <Button type="link" style={{ marginTop: '12px', padding: 0 }} onClick={() => router.push('/clinical/vitals')}>
              Record Vitals →
            </Button>
          </Card>
        </Col>

        {/* Pending Tasks Checklist */}
        <Col xs={24} md={12}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                <OrderedListOutlined style={{ marginRight: '8px', color: '#6366F1' }} />
                Pending Tasks
              </span>
            }
            extra={<Tag color="processing">{pendingTasks.filter(t => !t.completed).length} remaining</Tag>}
            style={{ borderRadius: '16px' }}
          >
            <List
              dataSource={pendingTasks}
              renderItem={(item) => (
                <List.Item style={{ padding: '8px 0' }}>
                  <Checkbox checked={item.completed} style={{ marginRight: '12px' }}>
                    <Text style={{ textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? '#9CA3AF' : '#374151' }}>
                      {item.task}
                    </Text>
                  </Checkbox>
                  <Tag 
                    color={item.priority === 'high' ? 'error' : item.priority === 'medium' ? 'warning' : 'default'} 
                    style={{ marginLeft: 'auto', fontSize: '10px' }}
                  >
                    {item.priority}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Ward Occupancy Details */}
      <Card
        title={
          <span style={{ fontSize: '16px', fontWeight: 600 }}>
            <TeamOutlined style={{ marginRight: '8px', color: '#0077B6' }} />
            Ward Occupancy Details
          </span>
        }
        style={{ borderRadius: '16px', marginBottom: '24px' }}
      >
        <Row gutter={[16, 16]}>
          {wardOccupancy.map((ward, index) => (
            <Col xs={24} sm={12} md={8} lg={4} key={index}>
              <div
                style={{
                  padding: '16px',
                  background: '#F9FAFB',
                  borderRadius: '12px',
                  border: `1px solid ${ward.critical > 0 ? '#FEE2E2' : '#D1FAE5'}`,
                }}
              >
                <Text strong style={{ display: 'block', marginBottom: '8px', color: '#374151' }}>
                  {ward.ward}
                </Text>
                <div style={{ fontSize: '20px', fontWeight: 700, color: ward.occupied >= ward.total * 0.9 ? '#EF4444' : '#10B981' }}>
                  {ward.occupied}/{ward.total}
                </div>
                <Progress
                  percent={(ward.occupied / ward.total) * 100}
                  showInfo={false}
                  strokeColor={ward.occupied >= ward.total * 0.9 ? '#EF4444' : '#10B981'}
                  railColor="#E5E7EB"
                  size="small"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <Text type="secondary" style={{ fontSize: '10px' }}>{ward.available} available</Text>
                  {ward.critical > 0 && (
                    <Tag color="error" style={{ fontSize: '10px', padding: '0 4px' }}>{ward.critical} critical</Tag>
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Critical Patients & Ward Overview */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={12}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                <HeartOutlined style={{ marginRight: '8px', color: '#EF4444' }} />
                Critical Patients
              </span>
            }
            style={{ borderRadius: '16px' }}
          >
            {criticalPatients.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <CheckCircleOutlined style={{ fontSize: '28px', color: '#10B981' }} />
                <div><Text type="secondary">No critical patients</Text></div>
              </div>
            ) : (
              <List
                size="small"
                dataSource={criticalPatients}
                renderItem={(item) => (
                  <List.Item style={{ padding: '8px' }}>
                    <List.Item.Meta
                      avatar={<Avatar size="small" style={{ backgroundColor: '#EF4444' }} icon={<HeartOutlined />} />}
                      title={<a onClick={() => router.push(`/patients/${item.id}`)}>{item.name}</a>}
                      description={<Text type="secondary" style={{ fontSize: '11px' }}>{item.mrn} • {item.department}</Text>}
                    />
                    <Tag color="error">Critical</Tag>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                Ward Overview
              </span>
            }
            style={{ borderRadius: '16px' }}
          >
            <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '12px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <Text>Emergency Ward</Text>
                  <Text strong>23/25 patients</Text>
                </div>
                <Progress percent={92} strokeColor="#EF4444" showInfo={false} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <Text>General Ward</Text>
                  <Text strong>45/60 patients</Text>
                </div>
                <Progress percent={75} strokeColor="#10B981" showInfo={false} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <Text>Pediatrics</Text>
                  <Text strong>18/20 patients</Text>
                </div>
                <Progress percent={90} strokeColor="#8B5CF6" showInfo={false} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Available Doctors */}
      <Card
        title={
          <span style={{ fontSize: '16px', fontWeight: 600 }}>
            <TeamOutlined style={{ marginRight: '8px', color: '#0077B6' }} />
            Available Doctors
          </span>
        }
        style={{ borderRadius: '16px', marginBottom: '24px' }}
      >
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
          {availableDoctors.slice(0, 6).map((doctor, index) => (
            <div key={index} style={{ minWidth: '160px', padding: '12px', background: '#F0F9FF', borderRadius: '12px', border: '1px solid #BAE6FD', textAlign: 'center' }}>
              <Avatar size={40} style={{ backgroundColor: '#0077B6', marginBottom: '8px' }} icon={<UserOutlined />} />
              <Text strong style={{ display: 'block', fontSize: '13px' }}>Dr. {doctor.name}</Text>
              <Text type="secondary" style={{ fontSize: '11px' }}>{doctor.specialty}</Text>
              <br />
              <Tag color="success" style={{ fontSize: '10px', marginTop: '4px' }}>Available</Tag>
            </div>
          ))}
        </div>
      </Card>

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