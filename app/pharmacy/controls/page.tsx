'use client';

import React, { useState } from 'react';
import { Card, Typography, Table, Button, Space, Row, Col, Select, Tag, Statistic, Input, Progress } from 'antd';
import { SearchOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ControlRecord {
  id: string;
  itemName: string;
  category: string;
  schedule: string;
  lastCheck: string;
  nextCheck: string;
  status: 'Compliant' | 'Non-Compliant' | 'Pending Review';
  score: number;
  checkedBy: string;
}

export default function PharmacyControlsPage() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const [records] = useState<ControlRecord[]>([
    {
      id: '1',
      itemName: 'Controlled Substances - Schedule 2',
      category: 'Drug Control',
      schedule: 'Daily',
      lastCheck: '2024-02-05',
      nextCheck: '2024-02-06',
      status: 'Compliant',
      score: 100,
      checkedBy: 'Dr. Adaobi',
    },
    {
      id: '2',
      itemName: 'Refrigeration Temperature',
      category: 'Storage',
      schedule: 'Twice Daily',
      lastCheck: '2024-02-05',
      nextCheck: '2024-02-05',
      status: 'Compliant',
      score: 98,
      checkedBy: 'Nurse Grace',
    },
    {
      id: '3',
      itemName: 'Controlled Substances - Schedule 5',
      category: 'Drug Control',
      schedule: 'Weekly',
      lastCheck: '2024-02-01',
      nextCheck: '2024-02-08',
      status: 'Non-Compliant',
      score: 72,
      checkedBy: 'Dr. Emeka',
    },
    {
      id: '4',
      itemName: 'Emergency Kit Inventory',
      category: 'Emergency',
      schedule: 'Monthly',
      lastCheck: '2024-02-01',
      nextCheck: '2024-03-01',
      status: 'Pending Review',
      score: 0,
      checkedBy: 'Dr. Ibrahim',
    },
  ]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Compliant': 'success',
      'Non-Compliant': 'error',
      'Pending Review': 'warning',
    };
    return colors[status] || 'default';
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch = !searchText ||
      record.itemName.toLowerCase().includes(searchText.toLowerCase()) ||
      record.category.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { title: 'Item Name', dataIndex: 'itemName', key: 'itemName' },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat: string) => <Tag>{cat}</Tag> },
    { title: 'Schedule', dataIndex: 'schedule', key: 'schedule' },
    { title: 'Last Check', dataIndex: 'lastCheck', key: 'lastCheck' },
    { title: 'Next Check', dataIndex: 'nextCheck', key: 'nextCheck' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={getStatusColor(status)} icon={status === 'Compliant' ? <CheckCircleOutlined /> : status === 'Non-Compliant' ? <WarningOutlined /> : null}>{status}</Tag>,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score: number, record: ControlRecord) => {
        if (record.status === 'Pending Review') return <Text type="secondary">Pending</Text>;
        return (
          <div>
            <Progress percent={score} size="small" status={score >= 90 ? 'success' : score >= 70 ? 'normal' : 'exception'} />
            <Text type="secondary" className="text-xs">{score}%</Text>
          </div>
        );
      },
    },
    { title: 'Checked By', dataIndex: 'checkedBy', key: 'checkedBy' },
  ];

  const stats = {
    compliant: records.filter((r: any) => r.status === 'Compliant').length,
    nonCompliant: records.filter((r: any) => r.status === 'Non-Compliant').length,
    pending: records.filter((r: any) => r.status === 'Pending Review').length,
    avgScore: Math.round(records.filter((r: any) => r.score > 0).reduce((sum, r) => sum + r.score, 0) / records.filter((r: any) => r.score > 0).length),
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Pharmacy Controls & Compliance</Title>
      <Text type="secondary">Monitor regulatory compliance and quality controls</Text>

      <Row gutter={[24, 24]} style={{ marginTop: '24px', marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Compliant" value={stats.compliant} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Non-Compliant" value={stats.nonCompliant} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Pending Review" value={stats.pending} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Avg Score" value={stats.avgScore} suffix="%" />
          </Card>
        </Col>
      </Row>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search controls..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            style={{ width: 150 }}
          >
            <Select.Option value="Compliant">Compliant</Select.Option>
            <Select.Option value="Non-Compliant">Non-Compliant</Select.Option>
            <Select.Option value="Pending Review">Pending Review</Select.Option>
          </Select>
          <Button type="primary">New Check</Button>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredRecords}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </Card>
    </div>
  );
}
