'use client';

import React, { useMemo } from 'react';
import { Row, Col, Typography, Table, Tag, Progress, Space } from 'antd';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getDashboardStatsForUser, filterDepartmentDistribution, filterActivityFeedByUser } from '@/lib/dashboardFilters';
import { filterConsultationsByUser } from '@/lib/dataFilters';

const { Title } = Typography;

export default function ClinicalDashboardPage() {
  const { user } = useAuth();

  // Mock consultations data with Nigerian names
  const allConsultations = [
    {
      key: '1',
      patient: 'Chukwuemeka Okonkwo',
      doctor: 'Dr. Ngozi Adeleke',
      department: 'Cardiology',
      diagnosis: 'Hypertension',
      time: '10:30 AM',
      status: 'completed',
      doctorId: 'd1',
    },
    {
      key: '2',
      patient: 'Adanna Okafor',
      doctor: 'Dr. Ibrahim Musa',
      department: 'General Medicine',
      diagnosis: 'Viral Infection',
      time: '11:00 AM',
      status: 'in_progress',
      doctorId: 'd2',
    },
    {
      key: '3',
      patient: 'Emeka Nwosu',
      doctor: 'Dr. Ngozi Adeleke',
      department: 'Cardiology',
      diagnosis: 'Arrhythmia',
      time: '11:30 AM',
      status: 'pending',
      doctorId: 'd1',
    },
  ];

  // Filter consultations based on user role
  const recentConsultations = useMemo(() => {
    return filterConsultationsByUser(user, allConsultations);
  }, [user]);

  // Filter department stats based on user role
  const allDepartmentStats = [
    { name: 'Cardiology', patients: 45, percentage: 75 },
    { name: 'Orthopedics', patients: 38, percentage: 63 },
    { name: 'Neurology', patients: 28, percentage: 47 },
    { name: 'Pediatrics', patients: 52, percentage: 87 },
  ];

  const departmentStats = useMemo(() => {
    const filteredDepts = filterDepartmentDistribution(user);
    if (filteredDepts.length === 0) return [];
    // Map filtered departments back to stats format
    return allDepartmentStats.filter(dept =>
      filteredDepts.some(fd => fd.name === dept.name)
    );
  }, [user]);

  // Get dashboard stats
  const dashboardStats = useMemo(() => getDashboardStatsForUser(user), [user]);

  // Filter activity feed by user role
  const filteredActivities = useMemo(() => filterActivityFeedByUser(user), [user]);

  const consultationTrend = [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 52 },
    { name: 'Wed', value: 48 },
    { name: 'Thu', value: 58 },
    { name: 'Fri', value: 62 },
    { name: 'Sat', value: 35 },
    { name: 'Sun', value: 28 },
  ];

  const columns = [
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'Doctor', dataIndex: 'doctor', key: 'doctor' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Diagnosis', dataIndex: 'diagnosis', key: 'diagnosis' },
    { title: 'Time', dataIndex: 'time', key: 'time' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          completed: 'success',
          in_progress: 'processing',
          pending: 'warning',
        };
        return <Tag color={colorMap[status]}>{status.replace('_', ' ')}</Tag>;
      },
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
      <Title level={2} className="mb-6">
        Clinical Dashboard
      </Title>

      {/* Clinical Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Today's Consultations"
            value={dashboardStats.myPatients || dashboardStats.totalPatients}
            color="#0077B6"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pending EMRs"
            value={dashboardStats.pendingEMRs || 0}
            color="#F59E0B"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Prescriptions"
            value={user?.role === 'Doctor' ? 89 : dashboardStats.labOrders || 0}
            color="#10B981"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Active Inpatients"
            value={dashboardStats.admittedPatients || 0}
            color="#8B5CF6"
          />
        </Col>
      </Row>

      {/* Charts and Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={16}>
          <ChartCard
            title="Consultation Trend"
            type="area"
            data={consultationTrend}
            color="#0077B6"
            height={300}
          />
        </Col>
        <Col xs={24} lg={8}>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <Title level={4} className="mb-4">
              Department Load
            </Title>
            <Space orientation="vertical" className="w-full" size="large">
              {departmentStats.map((dept) => (
                <div key={dept.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{dept.name}</span>
                    <span className="text-gray-500">{dept.patients} patients</span>
                  </div>
                  <Progress percent={dept.percentage} showInfo={false} />
                </div>
              ))}
            </Space>
          </div>
        </Col>
      </Row>

      {/* Recent Consultations */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow overflow-x-auto">
            <Title level={4} className="mb-4">
              Recent Consultations
            </Title>
            <Table
              dataSource={recentConsultations}
              columns={columns}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          </div>
        </Col>
        <Col xs={24} lg={8}>
          <ActivityFeed title="Clinical Updates" maxItems={5} activities={filteredActivities} />
        </Col>
      </Row>
    </div>
  );
}
