'use client';

import React, { useState } from 'react';
import { Card, Typography, Table, Button, Space, Row, Col, Select, DatePicker, Tree, Statistic } from 'antd';
import { BarChartOutlined, DownloadOutlined, FileTextOutlined, DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface DrillDownNode {
  key: string;
  title: string;
  value?: number;
  children?: DrillDownNode[];
}

interface ReportData {
  id: string;
  category: string;
  subCategory: string;
  metric: string;
  value: number;
  change: number;
}

export default function DrillDownReportPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('clinical');
  const [dateRange, setDateRange] = useState<any>([dayjs().subtract(30, 'days'), dayjs()]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['clinical', 'revenue']);

  const treeData: DrillDownNode[] = [
    {
      key: 'clinical',
      title: 'Clinical Operations',
      children: [
        {
          key: 'clinical-patients',
          title: 'Patient Statistics',
          value: 1250,
          children: [
            { key: 'clinical-patients-new', title: 'New Registrations', value: 320 },
            { key: 'clinical-patients-returning', title: 'Returning Patients', value: 580 },
            { key: 'clinical-patients-emergency', title: 'Emergency Cases', value: 350 },
          ],
        },
        {
          key: 'clinical-departments',
          title: 'Department Performance',
          value: 8,
          children: [
            { key: 'dept-cardiology', title: 'Cardiology', value: 245 },
            { key: 'dept-general', title: 'General Medicine', value: 412 },
            { key: 'dept-ortho', title: 'Orthopedics', value: 189 },
            { key: 'dept-pediatrics', title: 'Pediatrics', value: 287 },
            { key: 'dept-neurology', title: 'Neurology', value: 117 },
          ],
        },
      ],
    },
    {
      key: 'revenue',
      title: 'Financial Performance',
      children: [
        {
          key: 'revenue-sources',
          title: 'Revenue Sources',
          value: 45000000,
          children: [
            { key: 'revenue-consultations', title: 'Consultations', value: 15000000 },
            { key: 'revenue-procedures', title: 'Procedures', value: 18500000 },
            { key: 'revenue-lab', title: 'Laboratory', value: 6800000 },
            { key: 'revenue-pharmacy', title: 'Pharmacy', value: 3200000 },
          ],
        },
      ],
    },
    {
      key: 'operational',
      title: 'Operational Metrics',
      children: [
        {
          key: 'ops-resources',
          title: 'Resource Utilization',
          value: 87,
          children: [
            { key: 'ops-beds', title: 'Bed Occupancy', value: 85 },
            { key: 'ops-equipment', title: 'Equipment Usage', value: 78 },
            { key: 'ops-staff', title: 'Staff Utilization', value: 92 },
          ],
        },
      ],
    },
  ];

  const [drillDownData] = useState<ReportData[]>([
    { id: '1', category: 'Patient Statistics', subCategory: 'New Registrations', metric: 'Count', value: 320, change: 12.5 },
    { id: '2', category: 'Patient Statistics', subCategory: 'Returning Patients', metric: 'Count', value: 580, change: 8.3 },
    { id: '3', category: 'Patient Statistics', subCategory: 'Emergency Cases', metric: 'Count', value: 350, change: -5.2 },
    { id: '4', category: 'Department Performance', subCategory: 'Cardiology', metric: 'Patients', value: 245, change: 15.7 },
    { id: '5', category: 'Department Performance', subCategory: 'General Medicine', metric: 'Patients', value: 412, change: 6.4 },
    { id: '6', category: 'Revenue Sources', subCategory: 'Consultations', metric: 'Revenue (₦)', value: 15000000, change: 18.2 },
    { id: '7', category: 'Revenue Sources', subCategory: 'Procedures', metric: 'Revenue (₦)', value: 18500000, change: 22.1 },
    { id: '8', category: 'Resource Utilization', subCategory: 'Bed Occupancy', metric: 'Rate (%)', value: 85, change: 3.5 },
  ]);

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Sub-Category',
      dataIndex: 'subCategory',
      key: 'subCategory',
    },
    {
      title: 'Metric',
      dataIndex: 'metric',
      key: 'metric',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value: number, record: ReportData) => (
        <span className="font-medium">
          {record.metric.includes('₦') ? '₦' + value.toLocaleString() : value.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Change',
      dataIndex: 'change',
      key: 'change',
      render: (change: number) => (
        <span style={{ color: change >= 0 ? '#3f8600' : '#cf1322' }}>
          {change >= 0 ? '+' : ''}{change}%
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }} className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
      <Title level={3}>Drill-Down Reports</Title>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={8}>
          <Card className="p-4 sm:p-6">
            <Statistic
              title="Total Data Points"
              value={drillDownData.length}
              prefix={<FileTextOutlined />}
              suffix="categories"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="p-4 sm:p-6">
            <Statistic
              title="Drill-Down Levels"
              value={3}
              prefix={<BarChartOutlined />}
              suffix="levels deep"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="p-4 sm:p-6">
            <Statistic
              title="Active Period"
              value={dayjs(dateRange[1]).diff(dayjs(dateRange[0]), 'days')}
              suffix="days"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} lg={8}>
          <Card title="Report Hierarchy" style={{ height: '600px', overflow: 'auto' }} className="p-4 sm:p-6">
            <Tree
              showLine
              switcherIcon={<DownOutlined />}
              defaultExpandedKeys={['clinical', 'revenue']}
              expandedKeys={expandedKeys}
              onExpand={(keys) => setExpandedKeys(keys as string[])}
              treeData={treeData.map((node) => ({
                ...node,
                title: (
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>{node.title}</span>
                    {node.value !== undefined && (
                      <Text type="secondary" className="text-sm">
                        {typeof node.value === 'number' && node.value > 1000
                          ? node.value.toLocaleString()
                          : node.value}
                      </Text>
                    )}
                  </div>
                ),
              }))}
              onSelect={(keys) => {
                if (keys.length > 0) {
                  setSelectedCategory(keys[0] as string);
                }
              }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card
            title="Detailed Breakdown"
            className="p-4 sm:p-6"
            extra={
              <Space wrap>
                <DatePicker.RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  allowClear={false}
                />
                <Button icon={<DownloadOutlined />} className="w-full sm:w-auto">Export</Button>
              </Space>
            }
          >
            <div className="overflow-x-auto">
              <Table
                dataSource={drillDownData}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                size="small"
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
