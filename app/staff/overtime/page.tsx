'use client';

import React, { useState } from 'react';
import { Card, Typography, Table, Button, Space, Tag, Row, Col, Select, Statistic, Badge, Modal } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, DollarOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface OvertimeRequest {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  date: string;
  hours: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
  approvedBy?: string;
  amount?: number;
}

export default function OvertimePage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOvertime, setSelectedOvertime] = useState<OvertimeRequest | null>(null);

  const [overtimeRequests] = useState<OvertimeRequest[]>([
    {
      id: '1',
      staffId: 'EMP-001',
      staffName: 'Dr. Emeka Adeleke',
      department: 'Cardiology',
      date: '2024-02-03',
      hours: 4,
      reason: 'Emergency cardiac surgery that extended beyond regular hours',
      status: 'Approved',
      appliedOn: '2024-02-03',
      approvedBy: 'Medical Director',
      amount: 48000,
    },
    {
      id: '2',
      staffId: 'EMP-007',
      staffName: 'Nurse Amaka Okafor',
      department: 'Nursing',
      date: '2024-02-04',
      hours: 3,
      reason: 'Covering for sick colleague during night shift',
      status: 'Approved',
      appliedOn: '2024-02-04',
      approvedBy: 'Head of Nursing',
      amount: 13500,
    },
    {
      id: '3',
      staffId: 'EMP-002',
      staffName: 'Dr. Ibrahim Musa',
      department: 'General Medicine',
      date: '2024-02-05',
      hours: 5,
      reason: 'Attending to multiple emergency cases during weekend',
      status: 'Pending',
      appliedOn: '2024-02-05',
    },
    {
      id: '4',
      staffId: 'EMP-009',
      staffName: 'Nurse Chinedu Eze',
      department: 'Nursing',
      date: '2024-02-05',
      hours: 2,
      reason: 'Extended shift to complete patient documentation',
      status: 'Pending',
      appliedOn: '2024-02-05',
    },
  ]);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: any }> = {
      'Approved': { color: 'success', icon: <CheckCircleOutlined /> },
      'Pending': { color: 'processing', icon: <ClockCircleOutlined /> },
      'Rejected': { color: 'error', icon: <ClockCircleOutlined /> },
    };
    return configs[status] || configs.Pending;
  };

  const filteredOvertime = overtimeRequests.filter((request) => {
    const matchesStatus = !statusFilter || request.status === statusFilter;
    const matchesDept = !departmentFilter || request.department === departmentFilter;
    return matchesStatus && matchesDept;
  });

  const columns = [
    {
      title: 'Staff',
      dataIndex: 'staffName',
      key: 'staffName',
      render: (name: string, record: OvertimeRequest) => (
        <Space>
          <div>
            <div className="font-medium">{name}</div>
            <Text type="secondary" className="text-xs">{record.staffId}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => <Tag>{dept}</Tag>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Hours',
      dataIndex: 'hours',
      key: 'hours',
      render: (hours: number) => <span className="font-medium">{hours}h</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount?: number) => amount ? <span>₦{amount.toLocaleString()}</span> : <Text type="secondary">--</Text>,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getStatusConfig(status);
        return <Badge status={config.color as any} text={status} />;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: OvertimeRequest) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOvertime(record);
              setIsModalVisible(true);
            }}
          >
            View
          </Button>
          {record.status === 'Pending' && (
            <>
              <Button type="link" size="small" style={{ color: '#52c41a' }}>Approve</Button>
              <Button type="link" size="small" danger>Reject</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const stats = {
    total: overtimeRequests.length,
    pending: overtimeRequests.filter((o: any) => o.status === 'Pending').length,
    approved: overtimeRequests.filter((o: any) => o.status === 'Approved').length,
    totalHours: overtimeRequests.filter((o: any) => o.status === 'Approved').reduce((sum, o) => sum + o.hours, 0),
    totalAmount: overtimeRequests.filter((o: any) => o.status === 'Approved').reduce((sum, o) => sum + (o.amount || 0), 0),
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Overtime Management</Title>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Requests" value={stats.total} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Pending" value={stats.pending} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Hours" value={stats.totalHours} suffix="h" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Amount" value={stats.totalAmount} prefix="₦" />
          </Card>
        </Col>
      </Row>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Select
            placeholder="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            style={{ width: 150 }}
          >
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="Approved">Approved</Select.Option>
            <Select.Option value="Rejected">Rejected</Select.Option>
          </Select>
          <Select
            placeholder="Department"
            value={departmentFilter}
            onChange={setDepartmentFilter}
            allowClear
            style={{ width: 150 }}
          >
            <Select.Option value="Cardiology">Cardiology</Select.Option>
            <Select.Option value="General Medicine">General Medicine</Select.Option>
            <Select.Option value="Nursing">Nursing</Select.Option>
          </Select>
        </Space>

        <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredOvertime}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
        </div>
      </Card>

      <Modal
        title="Overtime Request Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          selectedOvertime?.status === 'Pending' ? (
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Close</Button>
              <Button type="primary" onClick={() => setIsModalVisible(false)}>Approve</Button>
              <Button danger onClick={() => setIsModalVisible(false)}>Reject</Button>
            </Space>
          ) : (
            <Button type="primary" onClick={() => setIsModalVisible(false)}>Close</Button>
          )
        }
        width={700}
      >
        {selectedOvertime && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Staff Member:</Text>
                <br />
                <Text>{selectedOvertime.staffName}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Department:</Text>
                <br />
                <Tag>{selectedOvertime.department}</Tag>
              </Col>
              <Col span={12}>
                <Text strong>Date:</Text>
                <br />
                <Text>{dayjs(selectedOvertime.date).format('MMMM DD, YYYY')}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Hours:</Text>
                <br />
                <Text>{selectedOvertime.hours} hours</Text>
              </Col>
              {selectedOvertime.amount && (
                <Col span={12}>
                  <Text strong>Overtime Pay:</Text>
                  <br />
                  <Text style={{ fontSize: '16px', color: '#3f8600', fontWeight: 'bold' }}>
                    ₦{selectedOvertime.amount.toLocaleString()}
                  </Text>
                </Col>
              )}
              {selectedOvertime.approvedBy && (
                <Col span={12}>
                  <Text strong>Approved By:</Text>
                  <br />
                  <Text>{selectedOvertime.approvedBy}</Text>
                </Col>
              )}
              <Col span={24}>
                <Text strong>Reason:</Text>
                <br />
                <Text>{selectedOvertime.reason}</Text>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}
