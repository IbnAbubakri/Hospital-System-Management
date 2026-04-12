'use client';

import React, { useMemo } from 'react';
import { Row, Col, Typography, Button, Tag, Card, List, Avatar, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MonitorOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  VideoCameraOutlined,
  HeartOutlined,
  DashboardOutlined,
  RiseOutlined,
  SwapOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterAppointmentsByUser, filterPatientsByUser } from '@/lib/dataFilters';
import { mockAppointments, mockPatients, mockLabOrders } from '@/lib/mockData';
import { getDepartmentColors } from '@/lib/departmentColors';
import { getDashboardStatsForUser } from '@/lib/dashboardFilters';
import { ScopeTag } from './ScopeIndicator';

const { Title, Text } = Typography;

export function DoctorDashboard() {
  const router = useRouter();
  const { user, getUserFullName, getPatientStats } = useAuth();

  const departmentColors = user?.department ? getDepartmentColors(user.department) : null;
  const dashboardStats = useMemo(() => getDashboardStatsForUser(user), [user]);
  
  const filteredAppointments = useMemo(() => filterAppointmentsByUser(user, mockAppointments), [user]);
  const filteredPatients = useMemo(() => filterPatientsByUser(user, mockPatients), [user]);
  
  const patientStats = useMemo(() => getPatientStats(), [user, getPatientStats]);
  
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const todayAppointments = useMemo(() => 
    filteredAppointments.filter(apt => apt.date === todayStr), [filteredAppointments, todayStr]);
  
  const upcomingAppointments = useMemo(() => 
    todayAppointments.filter(apt => apt.status === 'confirmed').slice(0, 5), [todayAppointments]);
  
  const criticalPatients = useMemo(() => 
    filteredPatients.filter(p => p.condition === 'critical'), [filteredPatients]);
  
  // Filter lab orders for doctor's patients only
  const filteredLabOrders = useMemo(() => {
    const patientIds = filteredPatients.map(p => p.id);
    return mockLabOrders.filter(l => patientIds.includes(l.patientId));
  }, [filteredPatients]);
  
  const pendingLabResults = useMemo(() => 
    filteredLabOrders.filter(l => l.status === 'pending' || l.status === 'processing').slice(0, 5), [filteredLabOrders]);

  // Patient by condition (use filtered patients - only doctor's assigned patients)
  const patientsByCondition = useMemo(() => {
    return {
      critical: filteredPatients.filter(p => p.condition === 'critical'),
      stable: filteredPatients.filter(p => p.condition === 'stable'),
      improving: filteredPatients.filter(p => p.condition === 'improving'),
    };
  }, [filteredPatients]);

  // Lab results pending summary (filtered for doctor's patients)
  const labPendingSummary = useMemo(() => {
    const pending = filteredLabOrders.filter(l => l.status === 'pending' || l.status === 'processing');
    return {
      total: pending.length,
      urgent: pending.filter(l => l.priority === 'urgent').length,
      routine: pending.filter(l => l.priority !== 'urgent').length,
    };
  }, [filteredLabOrders]);

  // Recent consultations (filtered for doctor's patients)
  const recentConsultations = useMemo(() => {
    return filteredPatients.slice(0, 4).map((p, idx) => ({
      id: p.id,
      patient: p.name,
      time: idx === 0 ? '10:30 AM' : idx === 1 ? '09:15 AM' : idx === 2 ? 'Yesterday 2:00 PM' : 'Yesterday 11:30 AM',
      diagnosis: p.condition === 'critical' ? 'Critical care review' : p.condition === 'stable' ? 'Follow-up consultation' : 'Recovery checkup',
      status: 'completed',
    }));
  }, [filteredPatients]);

  // Quick patient stats (use filtered patients - doctor's department only)
  const quickPatientStats = useMemo(() => {
    return {
      admitted: filteredPatients.filter(i => i.status === 'admitted' || i.status === 'active').length,
      discharged: Math.floor(filteredPatients.length * 0.15),
      transferred: Math.floor(filteredPatients.length * 0.05),
      todayNew: Math.floor(filteredPatients.length * 0.08),
    };
  }, [filteredPatients]);

  const quickActions = [
    { icon: <MonitorOutlined />, label: 'Start Consultation', color: departmentColors?.primary || '#0077B6', path: '/clinical/consultation' },
    { icon: <UserOutlined />, label: 'My Patients', color: '#10B981', path: '/patients' },
    { icon: <FileTextOutlined />, label: 'EMR Records', color: '#8B5CF6', path: '/clinical/emr' },
    { icon: <MedicineBoxOutlined />, label: 'Prescriptions', color: '#F59E0B', path: '/clinical/prescriptions' },
    { icon: <ExperimentOutlined />, label: 'Lab Results', color: '#6366F1', path: '/laboratory/results' },
    { icon: <VideoCameraOutlined />, label: 'Telemedicine', color: '#EC4899', path: '/telemedicine' },
  ];

  const stats = [
    {
      label: 'My Patients',
      value: patientStats.total,
      subtext: `${criticalPatients.length} critical`,
      color: departmentColors?.primary || '#0077B6',
      icon: <UserOutlined />,
      trend: '+2',
      bg: departmentColors?.light || '#EFF6FF',
      border: departmentColors?.border || '#DBEAFE',
    },
    {
      label: "Today's Appointments",
      value: todayAppointments.length,
      subtext: `${upcomingAppointments.length} confirmed`,
      color: '#10B981',
      icon: <CalendarOutlined />,
      trend: `${todayAppointments.filter(a => a.status === 'pending').length} pending`,
      bg: '#D1FAE5',
      border: '#A7F3D0',
    },
    {
      label: 'Pending Lab Results',
      value: pendingLabResults.length,
      subtext: 'Awaiting results',
      color: '#8B5CF6',
      icon: <ExperimentOutlined />,
      trend: 'Review',
      bg: '#EDE9FE',
      border: '#DDD6FE',
    },
    {
      label: 'Critical Cases',
      value: criticalPatients.length,
      subtext: 'Require attention',
      color: '#EF4444',
      icon: <ExclamationCircleOutlined />,
      trend: 'Urgent',
      bg: '#FEE2E2',
      border: '#FECACA',
    },
  ];

  return (
    <>
      {/* Scope Indicator */}
      <div style={{ marginBottom: '12px', marginTop: '-8px' }}>
        <ScopeTag user={user} />
      </div>

      {/* Welcome Banner - Doctor Theme */}
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
          <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
            {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          <Tag style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', marginBottom: '12px' }}>
            {user?.department} Department
          </Tag>
          <Title level={2} style={{ color: 'white', margin: 0, fontSize: '36px', fontWeight: 700, marginBottom: '12px' }}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, Dr. {getUserFullName()}!
          </Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '15px', display: 'block', marginBottom: '24px' }}>
            You have <strong>{patientStats.total}</strong> patients under your care • <strong>{todayAppointments.length}</strong> appointments today
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
                  background: stat.trend === 'Urgent' ? '#FEE2E2' : stat.trend === 'Review' ? '#FEF3C7' : '#D1FAE5',
                  color: stat.trend === 'Urgent' ? '#991B1B' : stat.trend === 'Review' ? '#92400E' : '#065F46',
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

      {/* Today's Schedule & Critical Patients */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* Today's Schedule */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                <CalendarOutlined style={{ marginRight: '8px', color: '#10B981' }} />
                Today's Schedule
              </span>
            }
            extra={<Tag color="blue">{todayAppointments.length} appointments</Tag>}
            style={{ borderRadius: '16px' }}
          >
            {todayAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <CalendarOutlined style={{ fontSize: '40px', color: '#D1D5DB', marginBottom: '12px' }} />
                <Text type="secondary">No appointments scheduled for today</Text>
              </div>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={todayAppointments}
                renderItem={(item, index) => (
                  <List.Item style={{ padding: '12px', background: index % 2 === 0 ? '#F9FAFB' : 'white', borderRadius: '8px', marginBottom: '8px' }}>
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ backgroundColor: item.status === 'confirmed' ? '#10B981' : '#F59E0B' }}>
                          {index + 1}
                        </Avatar>
                      }
                      title={<a onClick={() => router.push(`/patients/${item.patientId}`)}>{item.patientName}</a>}
                      description={
                        <div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>{item.type} • {item.notes || 'General consultation'}</Text>
                          <br />
                          <Tag color={item.status === 'confirmed' ? 'success' : item.status === 'pending' ? 'warning' : 'default'} style={{ fontSize: '11px' }}>
                            {item.status}
                          </Tag>
                        </div>
                      }
                    />
                    <div style={{ textAlign: 'right' }}>
                      <Text strong style={{ fontSize: '16px' }}>{item.time}</Text>
                      <br />
                      <Button type="primary" size="small" style={{ marginTop: '4px', background: departmentColors?.primary }} onClick={() => router.push(`/clinical/consultation?patient=${item.patientId}`)}>
                        Start
                      </Button>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* Critical Patients Alert */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                <ExclamationCircleOutlined style={{ marginRight: '8px', color: '#EF4444' }} />
                Critical Patients
              </span>
            }
            style={{ borderRadius: '16px', marginBottom: '16px' }}
          >
            {criticalPatients.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <CheckCircleOutlined style={{ fontSize: '32px', color: '#10B981', marginBottom: '8px' }} />
                <Text type="secondary">No critical patients</Text>
              </div>
            ) : (
              <List
                size="small"
                dataSource={criticalPatients.slice(0, 4)}
                renderItem={(item) => (
                  <List.Item style={{ padding: '10px' }}>
                    <List.Item.Meta
                      avatar={<Avatar size="small" style={{ backgroundColor: '#EF4444' }} icon={<HeartOutlined />} />}
                      title={<a onClick={() => router.push(`/patients/${item.id}`)}>{item.name}</a>}
                      description={<Text type="secondary" style={{ fontSize: '12px' }}>{item.mrn}</Text>}
                    />
                    <Tag color="error">Critical</Tag>
                  </List.Item>
                )}
              />
            )}
          </Card>

          {/* Pending Lab Results */}
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                <ExperimentOutlined style={{ marginRight: '8px', color: '#8B5CF6' }} />
                Pending Lab Results
              </span>
            }
            style={{ borderRadius: '16px' }}
          >
            {pendingLabResults.length === 0 ? (
              <Text type="secondary">No pending results</Text>
            ) : (
              <List
                size="small"
                dataSource={pendingLabResults}
                renderItem={(item) => (
                  <List.Item style={{ padding: '8px' }}>
                    <List.Item.Meta
                      title={item.test}
                      description={<Text type="secondary" style={{ fontSize: '11px' }}>{item.patientName} • {item.date}</Text>}
                    />
                    <Tag color="processing">{item.status}</Tag>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Patient List by Condition */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={8}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                <HeartOutlined style={{ marginRight: '8px', color: '#EF4444' }} />
                Critical
              </span>
            }
            extra={<Tag color="error">{patientsByCondition.critical.length}</Tag>}
            style={{ borderRadius: '16px', border: '1px solid #FECACA' }}
            styles={{ header: { background: '#FEF2F2' } }}
          >
            <div style={{ maxHeight: '200px', overflow: 'auto' }}>
              {patientsByCondition.critical.map((item, idx) => (
                <div key={idx} style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
                  <Text strong style={{ fontSize: '13px' }}>{item.name}</Text>
                </div>
              ))}
            </div>
            {patientsByCondition.critical.length === 0 && <Text type="secondary">No critical patients</Text>}
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                <CheckCircleOutlined style={{ marginRight: '8px', color: '#10B981' }} />
                Stable
              </span>
            }
            extra={<Tag color="success">{patientsByCondition.stable.length}</Tag>}
            style={{ borderRadius: '16px', border: '1px solid #A7F3D0' }}
            styles={{ header: { background: '#D1FAE5' } }}
          >
            <div style={{ maxHeight: '200px', overflow: 'auto' }}>
              {patientsByCondition.stable.map((item, idx) => (
                <div key={idx} style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
                  <Text strong style={{ fontSize: '13px' }}>{item.name}</Text>
                </div>
              ))}
            </div>
            {patientsByCondition.stable.length === 0 && <Text type="secondary">No stable patients</Text>}
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                <RiseOutlined style={{ marginRight: '8px', color: '#0077B6' }} />
                Improving
              </span>
            }
            extra={<Tag color="blue">{patientsByCondition.improving.length}</Tag>}
            style={{ borderRadius: '16px', border: '1px solid #DBEAFE' }}
            styles={{ header: { background: '#EFF6FF' } }}
          >
            <div style={{ maxHeight: '200px', overflow: 'auto' }}>
              {patientsByCondition.improving.map((item, idx) => (
                <div key={idx} style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
                  <Text strong style={{ fontSize: '13px' }}>{item.name}</Text>
                </div>
              ))}
            </div>
            {patientsByCondition.improving.length === 0 && <Text type="secondary">No improving patients</Text>}
          </Card>
        </Col>
      </Row>

      {/* Lab Results Summary & Quick Stats */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* Lab Results Pending Summary */}
        <Col xs={24} md={12}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                <ExperimentOutlined style={{ marginRight: '8px', color: '#8B5CF6' }} />
                Lab Results Pending Summary
              </span>
            }
            style={{ borderRadius: '16px' }}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '16px', background: '#F5F3FF', borderRadius: '12px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#8B5CF6' }}>{labPendingSummary.total}</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Total Pending</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '16px', background: '#FEF2F2', borderRadius: '12px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#EF4444' }}>{labPendingSummary.urgent}</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Urgent</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '16px', background: '#FEF3C7', borderRadius: '12px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#D97706' }}>{labPendingSummary.routine}</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Routine</Text>
                </div>
              </Col>
            </Row>
            <Button type="link" style={{ marginTop: '12px', padding: 0 }} onClick={() => router.push('/laboratory/results')}>
              View All Lab Results →
            </Button>
          </Card>
        </Col>

        {/* Quick Patient Stats */}
        <Col xs={24} md={12}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                <DashboardOutlined style={{ marginRight: '8px', color: '#6366F1' }} />
                Quick Patient Stats
              </span>
            }
            style={{ borderRadius: '16px' }}
          >
            <Row gutter={[12, 12]}>
              <Col xs={12} md={6}>
                <div style={{ textAlign: 'center', padding: '12px', background: '#F0FDF4', borderRadius: '10px' }}>
                  <UserOutlined style={{ fontSize: '20px', color: '#16A34A' }} />
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#16A34A' }}>{quickPatientStats.admitted}</div>
                  <Text type="secondary" style={{ fontSize: '10px' }}>Admitted</Text>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div style={{ textAlign: 'center', padding: '12px', background: '#FEE2E2', borderRadius: '10px' }}>
                  <UserOutlined style={{ fontSize: '20px', color: '#DC2626' }} />
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#DC2626' }}>{quickPatientStats.discharged}</div>
                  <Text type="secondary" style={{ fontSize: '10px' }}>Discharged</Text>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div style={{ textAlign: 'center', padding: '12px', background: '#FEF3C7', borderRadius: '10px' }}>
                  <SwapOutlined style={{ fontSize: '20px', color: '#D97706' }} />
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#D97706' }}>{quickPatientStats.transferred}</div>
                  <Text type="secondary" style={{ fontSize: '10px' }}>Transferred</Text>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div style={{ textAlign: 'center', padding: '12px', background: '#EFF6FF', borderRadius: '10px' }}>
                  <PlusOutlined style={{ fontSize: '20px', color: '#0077B6' }} />
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#0077B6' }}>{quickPatientStats.todayNew}</div>
                  <Text type="secondary" style={{ fontSize: '10px' }}>New Today</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Recent Consultations */}
      <Card
        title={
          <span style={{ fontSize: '16px', fontWeight: 600 }}>
            <FileTextOutlined style={{ marginRight: '8px', color: '#10B981' }} />
            Recent Consultations
          </span>
        }
        style={{ borderRadius: '16px', marginBottom: '24px' }}
      >
        <Table
          dataSource={recentConsultations}
          rowKey="id"
          columns={[
            { title: 'Time', dataIndex: 'time', key: 'time', width: 120 },
            { title: 'Patient', dataIndex: 'patient', key: 'patient', render: (text) => <Text strong>{text}</Text> },
            { title: 'Diagnosis', dataIndex: 'diagnosis', key: 'diagnosis' },
            { 
              title: 'Status', 
              dataIndex: 'status', 
              key: 'status',
              render: (status) => <Tag color={status === 'completed' ? 'success' : 'processing'}>{status}</Tag>,
            },
            {
              title: 'Action',
              key: 'action',
              render: (_, record) => (
                <Button type="link" size="small" onClick={() => router.push(`/clinical/emr/${record.id}`)}>
                  View EMR
                </Button>
              ),
            },
          ]}
          pagination={false}
          size="small"
        />
      </Card>

      {/* Quick Stats & Department Info */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={12}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                <DashboardOutlined style={{ marginRight: '8px' }} />
                Quick Stats
              </span>
            }
            style={{ borderRadius: '16px' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '12px', background: '#F0FDF4', borderRadius: '10px', textAlign: 'center' }}>
                <HeartOutlined style={{ fontSize: '24px', color: '#16A34A' }} />
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#16A34A' }}>{patientStats.total}</div>
                <Text type="secondary" style={{ fontSize: '11px' }}>Total Patients</Text>
              </div>
              <div style={{ padding: '12px', background: '#FEF3C7', borderRadius: '10px', textAlign: 'center' }}>
                <CalendarOutlined style={{ fontSize: '24px', color: '#D97706' }} />
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#D97706' }}>{todayAppointments.length}</div>
                <Text type="secondary" style={{ fontSize: '11px' }}>Today's Appts</Text>
              </div>
              <div style={{ padding: '12px', background: '#EEF2FF', borderRadius: '10px', textAlign: 'center' }}>
                <FileTextOutlined style={{ fontSize: '24px', color: '#4F46E5' }} />
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#4F46E5' }}>{dashboardStats.pendingEMRs || 0}</div>
                <Text type="secondary" style={{ fontSize: '11px' }}>Pending EMRs</Text>
              </div>
              <div style={{ padding: '12px', background: '#FCE7F3', borderRadius: '10px', textAlign: 'center' }}>
                <ExperimentOutlined style={{ fontSize: '24px', color: '#DB2777' }} />
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#DB2777' }}>{pendingLabResults.length}</div>
                <Text type="secondary" style={{ fontSize: '11px' }}>Lab Pending</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                Department Info
              </span>
            }
            style={{ borderRadius: '16px' }}
          >
            <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text>Department</Text>
                <Text strong>{user?.department || 'General Medicine'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text>Patients in Dept</Text>
                <Text strong>{patientStats.total}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Today's Load</Text>
                <Tag color={todayAppointments.length > 10 ? 'error' : todayAppointments.length > 5 ? 'warning' : 'success'}>
                  {todayAppointments.length} appointments
                </Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

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