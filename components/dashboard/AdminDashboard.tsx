'use client';

import React, { useMemo } from 'react';
import { Row, Col, Typography, Button, Card, Tag, Progress, Timeline, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
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
  RiseOutlined,
  FallOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  HomeOutlined,
  CarOutlined,
  UserDeleteOutlined,
  SwapOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { mockStats, mockStatsByDepartment, dashboardChartData, mockPatients, mockAppointments } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

const { Title, Text } = Typography;

const COLORS = ['#0077B6', '#10B981', '#F59E0B', '#8B5CF6', '#6366F1', '#EC4899', '#14B8A6'];

export function AdminDashboard() {
  const router = useRouter();
  const { getUserFullName } = useAuth();

  // Revenue breakdown by department
  const revenueByDepartment = useMemo(() => {
    return Object.entries(mockStatsByDepartment).map(([dept, data]) => ({
      name: dept,
      revenue: data.revenue,
      patients: data.patients,
    }));
  }, []);

  // Staff distribution data
  const staffDistribution = useMemo(() => [
    { name: 'Cardiology', doctors: 12, nurses: 24, support: 8 },
    { name: 'General Medicine', doctors: 18, nurses: 36, support: 12 },
    { name: 'Orthopedics', doctors: 10, nurses: 20, support: 6 },
    { name: 'Pediatrics', doctors: 14, nurses: 28, support: 10 },
    { name: 'Neurology', doctors: 8, nurses: 16, support: 5 },
    { name: 'Emergency', doctors: 15, nurses: 30, support: 10 },
  ], []);

  // Patient admission/discharge trends (mock data)
  const admissionTrends = useMemo(() => [
    { month: 'Jan', admissions: 145, discharges: 138 },
    { month: 'Feb', admissions: 156, discharges: 142 },
    { month: 'Mar', admissions: 168, discharges: 155 },
    { month: 'Apr', admissions: 172, discharges: 165 },
    { month: 'May', admissions: 158, discharges: 160 },
    { month: 'Jun', admissions: 175, discharges: 168 },
  ], []);

  // Inventory alerts
  const inventoryAlerts = useMemo(() => [
    { id: 1, item: 'Surgical Gloves (Large)', current: 150, min: 500, status: 'critical', category: 'PPE' },
    { id: 2, item: 'Paracetamol 500mg', current: 800, min: 1000, status: 'low', category: 'Medications' },
    { id: 3, item: 'IV Saline Bags', current: 45, min: 100, status: 'critical', category: 'Supplies' },
    { id: 4, item: 'Bandages (Sterile)', current: 200, min: 300, status: 'low', category: 'Supplies' },
    { id: 5, item: 'Morphine Injection', current: 25, min: 50, status: 'low', category: 'Medications' },
  ], []);

  // Recent activities timeline
  const recentActivities = useMemo(() => [
    { time: '2 mins ago', action: 'New patient registered', user: 'Front Desk', type: 'registration' },
    { time: '15 mins ago', action: 'Lab results completed', user: 'Lab Department', type: 'lab' },
    { time: '30 mins ago', action: 'Patient discharged', user: 'Dr. Ngozi Adeleke', type: 'discharge' },
    { time: '1 hour ago', action: 'New appointment scheduled', user: 'Reception', type: 'appointment' },
    { time: '2 hours ago', action: 'Pharmacy restock completed', user: 'Pharmacy', type: 'inventory' },
    { time: '3 hours ago', action: 'Staff shift updated', user: 'HR Admin', type: 'staff' },
  ], []);

  // Hospital capacity data
  const hospitalCapacity = useMemo(() => [
    { ward: 'ICU', total: 20, occupied: 18, available: 2, color: '#EF4444' },
    { ward: 'Emergency', total: 25, occupied: 23, available: 2, color: '#F59E0B' },
    { ward: 'General Ward', total: 80, occupied: 58, available: 22, color: '#10B981' },
    { ward: 'Pediatrics', total: 30, occupied: 22, available: 8, color: '#8B5CF6' },
    { ward: 'Maternity', total: 20, occupied: 14, available: 6, color: '#EC4899' },
    { ward: 'Surgery', total: 15, occupied: 12, available: 3, color: '#0077B6' },
  ], []);

  // Calculate department staff totals
  const staffTotals = useMemo(() => {
    return staffDistribution.reduce(
      (acc, dept) => ({
        doctors: acc.doctors + dept.doctors,
        nurses: acc.nurses + dept.nurses,
        support: acc.support + dept.support,
      }),
      { doctors: 0, nurses: 0, support: 0 }
    );
  }, [staffDistribution]);

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
      path: '/patients',
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
      path: '/staff',
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
      path: '/scheduling/appointments',
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
      path: '/billing/revenue-cycle/analytics',
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
            Welcome back, Engr Faaruq (Head ADMINISTRATOR)!
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
            onClick={() => stat.path && router.push(stat.path)}
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

      {/* Hospital Capacity Indicator */}
      <Card
        title={
          <span style={{ fontSize: '16px', fontWeight: 600 }}>
            <HomeOutlined style={{ marginRight: '8px', color: '#0077B6' }} />
            Hospital Capacity Overview
          </span>
        }
        extra={
          <Tag color="blue">{hospitalCapacity.reduce((a, b) => a + b.occupied, 0)} / {hospitalCapacity.reduce((a, b) => a + b.total, 0)} Total</Tag>
        }
        style={{ borderRadius: '16px', marginBottom: '24px' }}
      >
        <Row gutter={[16, 16]}>
          {hospitalCapacity.map((ward, index) => (
            <Col xs={24} sm={12} md={8} lg={4} key={index}>
              <div
                style={{
                  padding: '16px',
                  background: '#F9FAFB',
                  borderRadius: '12px',
                  border: `1px solid ${ward.color}30`,
                }}
              >
                <Text strong style={{ display: 'block', marginBottom: '8px', color: ward.color }}>
                  {ward.ward}
                </Text>
                <div style={{ fontSize: '24px', fontWeight: 700, color: ward.color }}>
                  {ward.occupied}/{ward.total}
                </div>
                <Progress
                  percent={(ward.occupied / ward.total) * 100}
                  showInfo={false}
                  strokeColor={ward.color}
                  railColor="#E5E7EB"
                  size="small"
                />
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  {ward.available} available
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Revenue Breakdown & Staff Distribution */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* Revenue Breakdown Chart */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <DollarOutlined style={{ marginRight: '8px', color: '#10B981' }} />
                Revenue by Department
              </span>
            }
            style={{ borderRadius: '16px', height: '100%' }}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueByDepartment} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `₦${value / 1000000}M`} />
                <Tooltip
                  formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Staff Distribution */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <TeamOutlined style={{ marginRight: '8px', color: '#0077B6' }} />
                Staff Distribution by Department
              </span>
            }
            style={{ borderRadius: '16px', height: '100%' }}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={staffDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                <Legend />
                <Bar dataKey="doctors" name="Doctors" fill="#0077B6" stackId="a" />
                <Bar dataKey="nurses" name="Nurses" fill="#10B981" stackId="a" />
                <Bar dataKey="support" name="Support" fill="#F59E0B" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Patient Admission/Discharge Trends */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <Card
            title={
              <span>
                <BarChartOutlined style={{ marginRight: '8px', color: '#6366F1' }} />
                Patient Admission & Discharge Trends
              </span>
            }
            style={{ borderRadius: '16px' }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={admissionTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                <Legend />
                <Line type="monotone" dataKey="admissions" name="Admissions" stroke="#0077B6" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="discharges" name="Discharges" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Inventory Alerts & Recent Activities */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* Inventory Alerts */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <WarningOutlined style={{ marginRight: '8px', color: '#EF4444' }} />
                Inventory Alerts
              </span>
            }
            extra={<Tag color="error">{inventoryAlerts.filter(i => i.status === 'critical').length} Critical</Tag>}
            style={{ borderRadius: '16px' }}
          >
            <div style={{ maxHeight: '300px', overflow: 'auto' }}>
              {inventoryAlerts.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    background: item.status === 'critical' ? '#FEF2F2' : '#FFFBEB',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    border: `1px solid ${item.status === 'critical' ? '#FECACA' : '#FDE68A'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: item.status === 'critical' ? '#FEE2E2' : '#FEF3C7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MedicineBoxOutlined style={{ color: item.status === 'critical' ? '#EF4444' : '#D97706', fontSize: '18px' }} />
                    </div>
                    <div>
                      <Text strong>{item.item}</Text>
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{item.category}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          Current: <Text strong>{item.current}</Text> / Min: {item.min}
                        </Text>
                      </div>
                    </div>
                  </div>
                  <Tag color={item.status === 'critical' ? 'error' : 'warning'}>
                    {item.status === 'critical' ? 'Critical' : 'Low Stock'}
                  </Tag>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Recent Activities Timeline */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <ClockCircleOutlined style={{ marginRight: '8px', color: '#8B5CF6' }} />
                Recent Activities
              </span>
            }
            style={{ borderRadius: '16px' }}
          >
            <Timeline
              items={recentActivities.map((activity) => ({
                color: activity.type === 'registration' ? '#0077B6' :
                       activity.type === 'lab' ? '#10B981' :
                       activity.type === 'discharge' ? '#F59E0B' :
                       activity.type === 'appointment' ? '#8B5CF6' :
                       activity.type === 'inventory' ? '#EF4444' : '#6366F1',
                content: (
                  <div style={{ padding: '4px 0' }}>
                    <Text strong style={{ display: 'block' }}>{activity.action}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {activity.user} • {activity.time}
                    </Text>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* Department Stats Summary */}
      <Card
        title={
          <span>
            <BarChartOutlined style={{ marginRight: '8px', color: '#F59E0B' }} />
            Department Performance Summary
          </span>
        }
        style={{ borderRadius: '16px', marginBottom: '24px' }}
      >
        <Table
          dataSource={Object.entries(mockStatsByDepartment).map(([dept, data]) => ({
            key: dept,
            department: dept,
            patients: data.patients,
            revenue: data.revenue,
            admitted: data.admitted,
            appointments: data.todayAppointments,
            occupancy: data.occupancyRate,
          }))}
          columns={[
            { title: 'Department', dataIndex: 'department', key: 'department', render: (text) => <Text strong>{text}</Text> },
            { title: 'Patients', dataIndex: 'patients', key: 'patients', render: (val) => val.toLocaleString() },
            { title: 'Admitted', dataIndex: 'admitted', key: 'admitted' },
            { title: 'Appointments', dataIndex: 'appointments', key: 'appointments' },
            { 
              title: 'Revenue', 
              dataIndex: 'revenue', 
              key: 'revenue', 
              render: (val) => formatCurrency(val) 
            },
            { 
              title: 'Occupancy', 
              dataIndex: 'occupancy', 
              key: 'occupancy',
              render: (val) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Progress percent={val} size="small" style={{ width: '60px' }} />
                  <Text>{val}%</Text>
                </div>
              ),
            },
          ]}
          pagination={false}
          size="small"
        />
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
