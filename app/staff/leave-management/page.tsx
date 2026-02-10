'use client';

import React, { useState } from 'react';
import { Card, Typography, Table, Button, Space, Tag, Row, Col, Select, Statistic, Badge, Modal } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, UserOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  leaveType: 'Annual' | 'Sick' | 'Maternity' | 'Paternity' | 'Unpaid' | 'Emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  appliedOn: string;
  approvedBy?: string;
}

export default function LeaveManagementPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);

  const [leaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      staffId: 'EMP-001',
      staffName: 'Dr. Emeka Adeleke',
      department: 'Cardiology',
      leaveType: 'Annual',
      startDate: '2024-02-10',
      endDate: '2024-02-17',
      days: 6,
      reason: 'Family vacation to travel home for traditional ceremony',
      status: 'Approved',
      appliedOn: '2024-01-25',
      approvedBy: 'Dr. Ibrahim Musa',
    },
    {
      id: '2',
      staffId: 'EMP-002',
      staffName: 'Dr. Ibrahim Musa',
      department: 'General Medicine',
      leaveType: 'Sick',
      startDate: '2024-02-05',
      endDate: '2024-02-07',
      days: 3,
      reason: 'Medical procedure and recovery',
      status: 'Approved',
      appliedOn: '2024-02-04',
      approvedBy: 'Dr. Emeka Adeleke',
    },
    {
      id: '3',
      staffId: 'EMP-005',
      staffName: 'Dr. Aisha Yusuf',
      department: 'Pediatrics',
      leaveType: 'Maternity',
      startDate: '2024-03-01',
      endDate: '2024-06-30',
      days: 122,
      reason: 'Maternity leave for childbirth',
      status: 'Approved',
      appliedOn: '2024-01-15',
      approvedBy: 'Medical Director',
    },
    {
      id: '4',
      staffId: 'EMP-007',
      staffName: 'Nurse Amaka Okafor',
      department: 'Nursing',
      leaveType: 'Annual',
      startDate: '2024-02-20',
      endDate: '2024-02-23',
      days: 4,
      reason: 'Personal family matter',
      status: 'Pending',
      appliedOn: '2024-02-01',
    },
    {
      id: '5',
      staffId: 'EMP-008',
      staffName: 'Nurse Grace Adebayo',
      department: 'Nursing',
      leaveType: 'Emergency',
      startDate: '2024-02-08',
      endDate: '2024-02-08',
      days: 1,
      reason: 'Family emergency - mother hospitalized',
      status: 'Approved',
      appliedOn: '2024-02-08',
      approvedBy: 'Head of Nursing',
    },
    {
      id: '6',
      staffId: 'EMP-003',
      staffName: 'Dr. Chinedu Okonkwo',
      department: 'Orthopedics',
      leaveType: 'Annual',
      startDate: '2024-02-25',
      endDate: '2024-03-01',
      days: 5,
      reason: 'Attend professional conference in Dubai',
      status: 'Pending',
      appliedOn: '2024-02-02',
    },
  ]);

  const getLeaveTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Annual': 'blue',
      'Sick': 'orange',
      'Maternity': 'purple',
      'Paternity': 'cyan',
      'Unpaid': 'default',
      'Emergency': 'red',
    };
    return colors[type] || 'default';
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: any }> = {
      'Approved': { color: 'success', icon: <CheckCircleOutlined /> },
      'Pending': { color: 'processing', icon: <ClockCircleOutlined /> },
      'Rejected': { color: 'error', icon: <ClockCircleOutlined /> },
      'Cancelled': { color: 'default', icon: <CalendarOutlined /> },
    };
    return configs[status] || configs.Pending;
  };

  const filteredLeave = leaveRequests.filter((request) => {
    const matchesStatus = !statusFilter || request.status === statusFilter;
    const matchesDept = !departmentFilter || request.department === departmentFilter;
    return matchesStatus && matchesDept;
  });

  const columns = [
    {
      title: 'Staff',
      dataIndex: 'staffName',
      key: 'staffName',
      render: (name: string, record: LeaveRequest) => (
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
      title: 'Leave Type',
      dataIndex: 'leaveType',
      key: 'leaveType',
      render: (type: string) => <Tag color={getLeaveTypeColor(type)}>{type}</Tag>,
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_: any, record: LeaveRequest) => (
        <div>
          <div className="font-medium">{record.days} day(s)</div>
          <Text type="secondary" className="text-xs">
            {dayjs(record.startDate).format('MMM DD')} - {dayjs(record.endDate).format('MMM DD')}
          </Text>
        </div>
      ),
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
      title: 'Applied On',
      dataIndex: 'appliedOn',
      key: 'appliedOn',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: LeaveRequest) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedLeave(record);
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
    total: leaveRequests.length,
    pending: leaveRequests.filter((l: any) => l.status === 'Pending').length,
    approved: leaveRequests.filter((l: any) => l.status === 'Approved').length,
    onLeave: leaveRequests.filter((l: any) => {
      const today = dayjs();
      return l.status === 'Approved' &&
        today.isAfter(dayjs(l.startDate)) &&
        today.isBefore(dayjs(l.endDate).add(1, 'day'));
    }).length,
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Leave Management</Title>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Requests" value={stats.total} prefix={<CalendarOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Pending" value={stats.pending} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Approved" value={stats.approved} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="On Leave" value={stats.onLeave} valueStyle={{ color: '#1890ff' }} />
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
            <Select.Option value="Pediatrics">Pediatrics</Select.Option>
            <Select.Option value="Orthopedics">Orthopedics</Select.Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />}>New Request</Button>
        </Space>

        <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredLeave}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
        </div>
      </Card>

      <Modal
        title="Leave Request Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          selectedLeave?.status === 'Pending' ? (
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
        {selectedLeave && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Staff Member:</Text>
                <br />
                <Text>{selectedLeave.staffName}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Department:</Text>
                <br />
                <Tag>{selectedLeave.department}</Tag>
              </Col>
              <Col span={12}>
                <Text strong>Leave Type:</Text>
                <br />
                <Tag color={getLeaveTypeColor(selectedLeave.leaveType)}>{selectedLeave.leaveType}</Tag>
              </Col>
              <Col span={12}>
                <Text strong>Duration:</Text>
                <br />
                <Text>{selectedLeave.days} day(s)</Text>
              </Col>
              <Col span={12}>
                <Text strong>Start Date:</Text>
                <br />
                <Text>{dayjs(selectedLeave.startDate).format('MMMM DD, YYYY')}</Text>
              </Col>
              <Col span={12}>
                <Text strong>End Date:</Text>
                <br />
                <Text>{dayjs(selectedLeave.endDate).format('MMMM DD, YYYY')}</Text>
              </Col>
              <Col span={24}>
                <Text strong>Reason:</Text>
                <br />
                <Text>{selectedLeave.reason}</Text>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}
