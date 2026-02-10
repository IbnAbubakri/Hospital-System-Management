'use client';

import React from 'react';
import { Card, Typography, Row, Col, Statistic, List, Progress, Space, Table, Select } from 'antd';
import { BarChartOutlined, RiseOutlined, DashboardOutlined, TeamOutlined, MedicineBoxOutlined, DollarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function DepartmentalDashboardPage() {
  const departmentalData = [
    {
      department: 'Cardiology',
      patients: 245,
      admissions: 28,
      procedures: 45,
      revenue: 4500000,
      patientSatisfaction: 92,
      avgLengthOfStay: 5.2,
      bedOccupancy: 84,
      doctors: 5,
      nurses: 18,
    },
    {
      department: 'General Medicine',
      patients: 456,
      admissions: 67,
      procedures: 78,
      revenue: 6200000,
      patientSatisfaction: 88,
      avgLengthOfStay: 3.1,
      bedOccupancy: 76,
      doctors: 8,
      nurses: 24,
    },
    {
      department: 'Orthopedics',
      patients: 178,
      admissions: 22,
      procedures: 35,
      revenue: 5100000,
      patientSatisfaction: 90,
      avgLengthOfStay: 7.5,
      bedOccupancy: 73,
      doctors: 4,
      nurses: 15,
    },
    {
      department: 'Pediatrics',
      patients: 312,
      admissions: 34,
      procedures: 28,
      revenue: 3800000,
      patientSatisfaction: 95,
      avgLengthOfStay: 2.8,
      bedOccupancy: 80,
      doctors: 6,
      nurses: 20,
    },
    {
      department: 'Emergency',
      patients: 567,
      admissions: 156,
      procedures: 89,
      revenue: 3200000,
      patientSatisfaction: 85,
      avgLengthOfStay: 1.5,
      bedOccupancy: 93,
      doctors: 7,
      nurses: 25,
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1600px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Title level={3}>Departmental Analytics</Title>
        <Select defaultValue="all" style={{ width: 200 }}>
          <Select.Option value="all">All Departments</Select.Option>
          <Select.Option value="cardiology">Cardiology</Select.Option>
          <Select.Option value="medicine">General Medicine</Select.Option>
        </Select>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card title="Department Overview">
            <div className="overflow-x-auto">
        <Table
              dataSource={departmentalData}
              columns={[
                { title: 'Department', dataIndex: 'department', key: 'department', render: (dept: string) => <span className="font-semibold">{dept}</span> },
                { title: 'Patients', dataIndex: 'patients', key: 'patients' },
                { title: 'Admissions', dataIndex: 'admissions', key: 'admissions' },
                { title: 'Procedures', dataIndex: 'procedures', key: 'procedures' },
                { title: 'Revenue', dataIndex: 'revenue', key: 'revenue', render: (val: number) => <span>₦{(val / 1000000).toFixed(1)}M</span> },
                { title: 'Satisfaction', dataIndex: 'patientSatisfaction', key: 'patientSatisfaction', render: (val: number) => <Progress percent={val} size="small" /> },
                { title: 'Avg Stay (Days)', dataIndex: 'avgLengthOfStay', key: 'avgLengthOfStay' },
                { title: 'Bed Occupancy', dataIndex: 'bedOccupancy', key: 'bedOccupancy', render: (val: number) => <Progress percent={val} size="small" /> },
                { title: 'Doctors', dataIndex: 'doctors', key: 'doctors' },
                { title: 'Nurses', dataIndex: 'nurses', key: 'nurses' },
              ]}
              rowKey="department"
              pagination={false}
              scroll={{ x: 1000 }}
            />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Patients"
              value={departmentalData.reduce((sum, d) => sum + d.patients, 0)}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#6366F1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Admissions"
              value={departmentalData.reduce((sum, d) => sum + d.admissions, 0)}
              prefix={<DashboardOutlined />}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Procedures"
              value={departmentalData.reduce((sum, d) => sum + d.procedures, 0)}
              prefix={<MedicineBoxOutlined />}
              valueStyle={{ color: '#F59E0B' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={departmentalData.reduce((sum, d) => sum + d.revenue, 0) / 1000000}
              prefix={<DollarOutlined />}
              suffix="M"
              precision={1}
              valueStyle={{ color: '#8B5CF6' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card title="Top Performing Departments">
            <List
              dataSource={departmentalData
                .sort((a, b) => b.patientSatisfaction - a.patientSatisfaction)
                .slice(0, 3)}
              renderItem={(dept) => (
                <List.Item>
                  <List.Item.Meta
                    title={dept.department}
                    description={`Patient Satisfaction: ${dept.patientSatisfaction}%`}
                  />
                  <Progress type="circle" percent={dept.patientSatisfaction} width={60} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Revenue Distribution">
            <List
              dataSource={departmentalData.sort((a, b) => b.revenue - a.revenue)}
              renderItem={(dept) => (
                <List.Item>
                  <List.Item.Meta
                    title={dept.department}
                    description={`${dept.patients} patients`}
                  />
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600, color: '#8B5CF6' }}>
                      ₦{(dept.revenue / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
