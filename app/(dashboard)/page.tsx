'use client';

import React, { useMemo } from 'react';
import { Row, Col, Space, Typography, Divider, Button, Avatar, Select, Badge, Tabs } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  HomeOutlined,
  DollarOutlined,
  ExperimentOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  FileTextOutlined,
  SearchOutlined,
  BellOutlined,
  HeartOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ResponsiveContainer, ResponsiveGrid } from '@/components/design-system/ResponsiveContainer';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { DoctorDashboard } from '@/components/dashboard/DoctorDashboard';
import { NurseDashboard } from '@/components/dashboard/NurseDashboard';
import { ScopeIndicator } from '@/components/dashboard/ScopeIndicator';
import { mockStats, dashboardChartData, mockAppointments, mockPatients } from '@/lib/mockData';
import { formatCurrency, calculateAge } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser, filterAppointmentsByUser } from '@/lib/dataFilters';
import { getDepartmentColors } from '@/lib/departmentColors';
import {
  getDashboardStatsForUser,
  filterPatientVisitsByUser,
  filterRevenueByUser,
  filterDepartmentDistribution,
  filterActivityFeedByUser,
  ActivityItem,
} from '@/lib/dashboardFilters';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const router = useRouter();
  const { user, getUserFullName, getPatientStats } = useAuth();
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Get filtered dashboard statistics
  const dashboardStats = useMemo(() => getDashboardStatsForUser(user), [user]);

  // Get filtered chart data
  const patientVisitsData = useMemo(() => filterPatientVisitsByUser(user), [user]);
  const revenueData = useMemo(() => filterRevenueByUser(user), [user]);
  const departmentData = useMemo(() => filterDepartmentDistribution(user), [user]);

  // Get filtered activity feed
  const filteredActivities = useMemo(() => filterActivityFeedByUser(user), [user]);

  // Get filtered data based on logged-in user
  const filteredPatients = useMemo(() => filterPatientsByUser(user), [user]);
  const filteredAppointments = useMemo(() => filterAppointmentsByUser(user, mockAppointments), [user]);
  const patientStats = useMemo(() => getPatientStats(), [user]);

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get department colors for personalization
  const departmentColors = user?.department ? getDepartmentColors(user.department) : null;

  // Role-based quick actions
  const getQuickActions = () => {
    const baseActions = [
      { icon: <FileTextOutlined />, label: 'Reports', color: '#8B5CF6', action: () => router.push('/reports') },
      { icon: <SettingOutlined />, label: 'Settings', color: '#6B7280', action: () => router.push('/settings') },
    ];

    if (user?.role === 'AuxiliaryNurse') {
      return [
        { icon: <MedicineBoxOutlined />, label: 'Triage Center', color: '#EC4899', action: () => router.push('/triage') },
        { icon: <CalendarOutlined />, label: 'Appointments', color: '#10B981', action: () => router.push('/patients/appointments') },
        ...baseActions,
      ];
    }

    return [
      { icon: <PlusOutlined />, label: 'New Patient', color: '#0077B6', action: () => router.push('/patients/new') },
      { icon: <CalendarOutlined />, label: 'Schedule', color: '#10B981', action: () => router.push('/patients/appointments') },
      ...baseActions,
    ];
  };

  const quickActions = getQuickActions();

  // Calculate personalized stats
  const todayAppointments = filteredAppointments.filter((apt: any) => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    return aptDate.getDate() === today.getDate() &&
           aptDate.getMonth() === today.getMonth() &&
           aptDate.getFullYear() === today.getFullYear();
  }).length;

  // Role-based stats
  const displayStats = user?.role === 'Administrator' ? {
    appointments: { value: mockStats.todayAppointments.toString(), subtext: 'Today', color: '#0077B6', icon: <CalendarOutlined />, trend: '+12%' },
    patients: { value: mockStats.totalPatients.toString(), subtext: 'Total', color: '#10B981', icon: <UserOutlined />, trend: '+5%' },
    admitted: { value: mockStats.admittedPatients.toString(), subtext: 'Admitted', color: '#F59E0B', icon: <HomeOutlined />, trend: '-3%' },
    revenue: { value: formatCurrency(mockStats.totalRevenue), subtext: 'Monthly', color: '#6366F1', icon: <DollarOutlined />, trend: '+15%' },
  } : user?.role === 'AuxiliaryNurse' ? {
    appointments: { value: todayAppointments.toString(), subtext: 'Today', color: '#0077B6', icon: <CalendarOutlined />, trend: '+8%' },
    patients: { value: filteredPatients.length.toString(), subtext: 'Total Patients', color: '#10B981', icon: <UserOutlined />, trend: '+3%' },
    triage: { value: '5', subtext: 'Doctors', color: '#EC4899', icon: <MedicineBoxOutlined />, trend: 'Active' },
    admitted: { value: filteredPatients.filter((p: any) => p.status === 'active').length.toString(), subtext: 'Active', color: '#F59E0B', icon: <HomeOutlined />, trend: '' },
  } : {
    appointments: { value: todayAppointments.toString(), subtext: 'Today', color: '#0077B6', icon: <CalendarOutlined />, trend: '+8%' },
    patients: { value: patientStats.total.toString(), subtext: 'Your Patients', color: '#10B981', icon: <UserOutlined />, trend: '+3%' },
    admitted: { value: filteredPatients.filter((p: any) => p.status === 'active').length.toString(), subtext: 'Active', color: '#F59E0B', icon: <HomeOutlined />, trend: '-2%' },
    pendingTasks: { value: '12', subtext: 'Pending', color: '#EF4444', icon: <FileTextOutlined />, trend: '' },
  };

  return (
    <ResponsiveContainer maxWidth="none" padding="none">
      {/* Data Scope Indicator */}
      {(user?.role !== 'Administrator') && (
        <ScopeIndicator user={user} dataType="dashboard" />
      )}

      {/* Role-Specific Dashboard */}
      {user?.role === 'Administrator' && <AdminDashboard />}
      {user?.role === 'Doctor' && <DoctorDashboard />}
      {user?.role === 'AuxiliaryNurse' && <NurseDashboard />}

      {/* Stats Grid */}
      <Row gutter={[12, 12]} className="mb-4 sm:mb-6">
        <Col xs={12} sm={12} lg={6}>
          <StatCard
            title="Total Patients"
            value={dashboardStats.totalPatients}
            icon={<UserOutlined />}
            color="#0077B6"
            trend={{ value: 12, isPositive: true }}
          />
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <StatCard
            title="Today's Appointments"
            value={dashboardStats.todayAppointments}
            icon={<CalendarOutlined />}
            color="#00B4D8"
            trend={{ value: 8, isPositive: true }}
          />
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <StatCard
            title="Admitted Patients"
            value={dashboardStats.admittedPatients}
            icon={<HomeOutlined />}
            color="#10B981"
            trend={{ value: -3, isPositive: false }}
          />
        </Col>
        {user?.role !== 'AuxiliaryNurse' && (
          <Col xs={12} sm={12} lg={6}>
            <StatCard
              title="Monthly Revenue"
              value={dashboardStats.monthlyRevenue ? formatCurrency(dashboardStats.monthlyRevenue) : 'N/A'}
              icon={<DollarOutlined />}
              color="#F59E0B"
              trend={{ value: 15, isPositive: true }}
            />
          </Col>
        )}
      </Row>

      {/* Secondary Stats */}
      <div className="mb-4 sm:mb-6">
        <Title
          level={4}
          className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4"
        >
          Department Overview
        </Title>
        <Row gutter={[12, 12]}>
          <Col xs={12} sm={12} lg={8}>
            <StatCard
              title="Pending Lab Results"
              value={dashboardStats.pendingLabResults}
              icon={<ExperimentOutlined />}
              color="#8B5CF6"
            />
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <StatCard
              title="Radiology Reports"
              value={dashboardStats.pendingRadiologyReports}
              icon={<BarChartOutlined />}
              color="#EC4899"
            />
          </Col>
          {user?.role === 'Administrator' && (
            <Col xs={12} sm={12} lg={8}>
              <StatCard
                title="Occupancy Rate"
                value={`${dashboardStats.occupancyRate}%`}
                icon={<HomeOutlined />}
                color="#6366F1"
              />
            </Col>
          )}
        </Row>
      </div>

      {/* Charts Row */}
      <div className="mb-4 sm:mb-6">
        <Title
          level={4}
          className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4"
        >
          Analytics & Insights
        </Title>
        <Row gutter={[12, 12]} className="mb-4 sm:mb-6">
          <Col xs={24} lg={16}>
            <ChartCard
              title="Patient Visits Trend"
              type="line"
              data={patientVisitsData}
              color="#0077B6"
              height={300}
            />
          </Col>
          <Col xs={24} lg={8}>
            <ChartCard
              title="Department Distribution"
              type="pie"
              data={departmentData}
              height={300}
            />
          </Col>
        </Row>
      </div>

      {/* Revenue Chart & Activity Feed */}
      {user?.role !== 'AuxiliaryNurse' && (
        <div>
          <Title
            level={4}
            className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4"
          >
            Performance & Activity
          </Title>
          <Row gutter={[12, 12]}>
            <Col xs={24} lg={16}>
              <ChartCard
                title="Revenue Trend"
                type="bar"
                data={revenueData}
                color="#10B981"
                height={350}
              />
            </Col>
            <Col xs={24} lg={8}>
              <ActivityFeed activities={filteredActivities as any} maxItems={5} />
            </Col>
          </Row>
        </div>
      )}

      {/* Activity Feed for Nurses */}
      {user?.role === 'AuxiliaryNurse' && (
        <div>
          <Title
            level={4}
            className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4"
          >
            Recent Activity
          </Title>
          <Row gutter={[12, 12]}>
            <Col xs={24}>
              <ActivityFeed activities={filteredActivities as any} maxItems={8} />
            </Col>
          </Row>
        </div>
      )}
    </ResponsiveContainer>
  );
}
