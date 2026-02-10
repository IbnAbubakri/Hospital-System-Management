'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Row, Col, Statistic, Progress } from 'antd';
import { CloudServerOutlined, SyncOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function RadiologyPACSPage() {
  const studies = [
    { id: 'PACS-001', studyId: 'RAD-2024-0892', patient: 'Ngozi Eze', mrn: 'MRN-2024-0005', modality: 'X-Ray', images: 2, size: '45 MB', date: '2024-02-05', status: 'Available', accessCount: 5 },
    { id: 'PACS-002', studyId: 'RAD-2024-0891', patient: 'Chukwuemeka Okonkwo', mrn: 'MRN-2024-0001', modality: 'CT', images: 145, size: '1.2 GB', date: '2024-02-04', status: 'Available', accessCount: 12 },
    { id: 'PACS-003', studyId: 'RAD-2024-0890', patient: 'Tobi Okafor', mrn: 'MRN-2024-0007', modality: 'MRI', images: 280, size: '2.8 GB', date: '2024-02-03', status: 'Archived', accessCount: 3 },
    { id: 'PACS-004', studyId: 'RAD-2024-0889', patient: 'Adaobi Nwosu', mrn: 'MRN-2024-0003', modality: 'Ultrasound', images: 24, size: '180 MB', date: '2024-02-02', status: 'Available', accessCount: 8 },
    { id: 'PACS-005', studyId: 'RAD-2024-0888', patient: 'Emeka Okafor', mrn: 'MRN-2024-0002', modality: 'X-Ray', images: 3, size: '52 MB', date: '2024-02-01', status: 'Available', accessCount: 6 },
  ];

  const columns = [
    { title: 'PACS ID', dataIndex: 'id', key: 'id' },
    { title: 'Study ID', dataIndex: 'studyId', key: 'studyId' },
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'MRN', dataIndex: 'mrn', key: 'mrn', render: (mrn: string) => <Tag color="blue">{mrn}</Tag> },
    { title: 'Modality', dataIndex: 'modality', key: 'modality', render: (mod: string) => <Tag color="purple">{mod}</Tag> },
    { title: 'Images', dataIndex: 'images', key: 'images' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Available' ? 'success' : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: 'Access Count', dataIndex: 'accessCount', key: 'accessCount' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">View</Button>
          <Button type="link" size="small" icon={<DownloadOutlined />}>Export</Button>
        </Space>
      ),
    },
  ];

  const storageUsed = 450;
  const storageTotal = 1000;
  const storagePercentage = (storageUsed / storageTotal) * 100;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>PACS (Picture Archiving & Communication System)</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Studies"
              value={2456}
              prefix={<CloudServerOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Storage Used"
              value={storageUsed}
              suffix="GB"
            />
            <Progress percent={storagePercentage} size="small" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Available"
              value={1980}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Archived"
              value={476}
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={studies}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
        </div>
      </Card>
    </div>
  );
}
