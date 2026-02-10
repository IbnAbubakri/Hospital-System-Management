'use client';

import React from 'react';
import { Row, Col, Typography, Table, Tag, Progress, Space } from 'antd';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartCard } from '@/components/dashboard/ChartCard';

const { Title } = Typography;

export default function OperationalDashboardPage() {
  const wardStatus = [
    { key: '1', ward: 'Ward A', total: 30, occupied: 25, available: 5, occupancy: 83 },
    { key: '2', ward: 'Ward B', total: 25, occupied: 20, available: 5, occupancy: 80 },
    { key: '3', ward: 'Ward C', total: 20, occupied: 15, available: 5, occupancy: 75 },
    { key: '4', ward: 'ICU', total: 10, occupied: 8, available: 2, occupancy: 80 },
  ];

  const emergencyCases = [
    { key: '1', patient: 'Chukwuemeka Okonkwo', triage: 'critical', condition: 'Chest Pain', time: '10 min ago' },
    { key: '2', patient: 'Adanna Okafor', triage: 'urgent', condition: 'Fracture', time: '25 min ago' },
    { key: '3', patient: 'Emeka Nwosu', triage: 'moderate', condition: 'Laceration', time: '45 min ago' },
    { key: '4', patient: 'Fatima Ahmed', triage: 'critical', condition: 'Stroke Symptoms', time: '5 min ago' },
  ];

  const operationalMetrics = [
    { name: 'Bed Occupancy', value: 78, target: 85, color: '#10B981' },
    { name: 'ER Wait Time', value: 15, target: 30, color: '#F59E0B' },
    { name: 'Lab Turnaround', value: 65, target: 90, color: '#0077B6' },
    { name: 'Staff Attendance', value: 92, target: 95, color: '#10B981' },
  ];

  const dailyAdmissions = [
    { name: 'Mon', admissions: 15, discharges: 12 },
    { name: 'Tue', admissions: 18, discharges: 14 },
    { name: 'Wed', admissions: 12, discharges: 16 },
    { name: 'Thu', admissions: 20, discharges: 15 },
    { name: 'Fri', admissions: 22, discharges: 18 },
    { name: 'Sat', admissions: 10, discharges: 12 },
    { name: 'Sun', admissions: 8, discharges: 10 },
  ];

  const wardColumns = [
    { title: 'Ward', dataIndex: 'ward', key: 'ward' },
    { title: 'Total Beds', dataIndex: 'total', key: 'total' },
    { title: 'Occupied', dataIndex: 'occupied', key: 'occupied' },
    { title: 'Available', dataIndex: 'available', key: 'available' },
    {
      title: 'Occupancy',
      dataIndex: 'occupancy',
      key: 'occupancy',
      render: (occupancy: number) => (
        <Progress percent={occupancy} size="small" status={occupancy > 85 ? 'exception' : 'active'} />
      ),
    },
  ];

  const erColumns = [
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    {
      title: 'Triage',
      dataIndex: 'triage',
      key: 'triage',
      render: (triage: string) => {
        const colorMap: Record<string, string> = {
          critical: 'error',
          urgent: 'warning',
          moderate: 'processing',
          low: 'default',
        };
        return <Tag color={colorMap[triage]}>{triage.toUpperCase()}</Tag>;
      },
    },
    { title: 'Condition', dataIndex: 'condition', key: 'condition' },
    { title: 'Wait Time', dataIndex: 'time', key: 'time' },
  ];

  return (
    <div>
      <Title level={2} className="mb-6">
        Operational Dashboard
      </Title>

      {/* Operational Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Bed Occupancy"
            value="78%"
            color="#0077B6"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="ER Patients"
            value={24}
            color="#EF4444"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pending Lab Tests"
            value={47}
            color="#8B5CF6"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Radiology Queue"
            value={18}
            color="#EC4899"
          />
        </Col>
      </Row>

      {/* Operational Metrics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={16}>
          <ChartCard
            title="Daily Admissions vs Discharges"
            type="line"
            data={dailyAdmissions}
            color="#0077B6"
            height={300}
          />
        </Col>
        <Col xs={24} lg={8}>
          <div className="bg-white p-6 rounded-lg shadow h-full">
            <Title level={4} className="mb-4">
              Operational Metrics
            </Title>
            <Space orientation="vertical" className="w-full" size="large">
              {operationalMetrics.map((metric) => (
                <div key={metric.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{metric.name}</span>
                    <span className="text-gray-500">{metric.value}{metric.name.includes('%') ? '' : '%'}</span>
                  </div>
                  <Progress
                    percent={metric.value}
                    strokeColor={metric.color}
                    showInfo={false}
                  />
                </div>
              ))}
            </Space>
          </div>
        </Col>
      </Row>

      {/* Ward Status and ER */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <div className="bg-white p-6 rounded-lg shadow">
            <Title level={4} className="mb-4">
              Ward Status
            </Title>
            <Table
              dataSource={wardStatus}
              columns={wardColumns}
              pagination={false}
            />
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div className="bg-white p-6 rounded-lg shadow">
            <Title level={4} className="mb-4">
              Emergency Room
            </Title>
            <Table
              dataSource={emergencyCases}
              columns={erColumns}
              pagination={false}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
