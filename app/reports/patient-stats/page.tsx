'use client';

import React, { useMemo } from 'react';
import { Card, Typography, Table, Button, Space, Tag, Progress, Statistic, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientStatsByUser, getPatientStatsSummaryForUser } from '@/lib/reportFilters';
import { ReportDataFilter } from '@/components/reports/ReportDataFilter';
import { PERMISSIONS } from '@/lib/constants/permissions';
import { ReportAccessGuard } from '@/components/reports/ReportAccessGuard';

const { Title, Text } = Typography;

interface PatientStat {
  id: string;
  ageGroup: string;
  count: number;
  percentage: number;
  department?: string;
}

interface GenderStat {
  gender: string;
  count: number;
  percentage: number;
  department?: string;
}

interface DepartmentStat {
  department: string;
  patients: number;
  avgStay: number;
}

export default function PatientStatsPage() {
  const { user } = useAuth();

  // All data (unfiltered)
  const allDemographics: PatientStat[] = [
    { id: '1', ageGroup: '0-18', count: 156, percentage: 12.5, department: 'Pediatrics' },
    { id: '2', ageGroup: '19-35', count: 312, percentage: 25, department: 'Cardiology' },
    { id: '3', ageGroup: '36-50', count: 435, percentage: 35, department: 'General Medicine' },
    { id: '4', ageGroup: '51-65', count: 268, percentage: 21.5, department: 'Cardiology' },
    { id: '5', ageGroup: '65+', count: 76, percentage: 6, department: 'General Medicine' },
  ];

  const allByGender: GenderStat[] = [
    { gender: 'Male', count: 645, percentage: 51.7 },
    { gender: 'Female', count: 602, percentage: 48.3 },
  ];

  const allByDepartment: DepartmentStat[] = [
    { department: 'Cardiology', patients: 245, avgStay: 5.2 },
    { department: 'General Medicine', patients: 456, avgStay: 3.1 },
    { department: 'Orthopedics', patients: 178, avgStay: 7.5 },
    { department: 'Pediatrics', patients: 312, avgStay: 2.8 },
    { department: 'Neurology', patients: 56, avgStay: 6.1 },
  ];

  // Filter data by user role
  const demographics = useMemo(() => {
    return filterPatientStatsByUser(user, allDemographics);
  }, [user, allDemographics]);

  const byGender = useMemo(() => {
    // Gender stats are not department-specific, so nurses see all, doctors see their department's ratio
    if (user?.role === 'Doctor' && user.department) {
      // For doctors, we show the overall gender distribution
      return allByGender;
    }
    return allByGender;
  }, [user, allByGender]);

  const byDepartment = useMemo(() => {
    if (user?.role === 'Doctor' && user.department) {
      return allByDepartment.filter(dept => dept.department === user.department);
    }
    if (user?.role === 'Administrator') {
      return allByDepartment;
    }
    // AuxiliaryNurses see all departments for triage
    return allByDepartment;
  }, [user, allByDepartment]);

  // Calculate summary statistics based on filtered data
  const statsSummary = useMemo(() => {
    return getPatientStatsSummaryForUser(user, demographics);
  }, [user, demographics]);

  const totalPatients = demographics.reduce((sum, item) => sum + item.count, 0);
  const newThisMonth = Math.round(totalPatients * 0.07); // Mock calculation
  const avgLengthOfStay = byDepartment.length > 0
    ? (byDepartment.reduce((sum, dept) => sum + dept.avgStay * dept.patients, 0) /
       byDepartment.reduce((sum, dept) => sum + dept.patients, 0)).toFixed(1)
    : '0.0';

  const columns = [
    { title: 'Age Group', dataIndex: 'ageGroup', key: 'ageGroup' },
    { title: 'Count', dataIndex: 'count', key: 'count' },
    { title: 'Percentage', dataIndex: 'percentage', key: 'percentage', render: (pct: number) => <Progress percent={pct} size="small" /> },
  ];

  const genderColumns = [
    { title: 'Gender', dataIndex: 'gender', key: 'gender' },
    { title: 'Count', dataIndex: 'count', key: 'count' },
    { title: 'Percentage', dataIndex: 'percentage', key: 'percentage', render: (pct: number) => `${pct}%` },
  ];

  const departmentColumns = [
    { title: 'Department', dataIndex: 'department', key: 'department', render: (dept: string) => <Tag>{dept}</Tag> },
    { title: 'Patients', dataIndex: 'patients', key: 'patients' },
    { title: 'Avg Stay (Days)', dataIndex: 'avgStay', key: 'avgStay', render: (days: number) => `${days} days` },
  ];

  return (
    <ReportAccessGuard requiredPermission={PERMISSIONS.VIEW_PATIENT_REPORTS}>
      <ReportDataFilter
        reportType="patient-stats"
        totalCount={allDemographics.length}
        filteredCount={demographics.length}
      >
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }} className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
          <Title level={3}>Patient Statistics & Demographics</Title>

          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={8}>
              <Card className="p-4 sm:p-6">
                <Statistic
                  title="Total Patients"
                  value={totalPatients}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="p-4 sm:p-6">
                <Statistic
                  title="New This Month"
                  value={newThisMonth}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="p-4 sm:p-6">
                <Statistic
                  title="Avg Length of Stay"
                  value={avgLengthOfStay}
                  suffix="days"
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} md={12}>
              <Card title="Age Distribution" className="p-4 sm:p-6">
                <div className="overflow-x-auto">
                  <Table
                    columns={columns}
                    dataSource={demographics}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Gender Distribution" className="p-4 sm:p-6">
                <div className="overflow-x-auto">
                  <Table
                    columns={genderColumns}
                    dataSource={byGender}
                    rowKey="gender"
                    pagination={false}
                    size="small"
                  />
                </div>
              </Card>
            </Col>
          </Row>

          <Card title="Department Statistics" className="p-4 sm:p-6">
            <div className="overflow-x-auto">
              <Table
                columns={departmentColumns}
                dataSource={byDepartment}
                rowKey="department"
                pagination={false}
                size="small"
              />
            </div>
          </Card>
        </div>
      </ReportDataFilter>
    </ReportAccessGuard>
  );
}
