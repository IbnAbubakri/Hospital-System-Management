'use client';

import React, { useState } from 'react';
import { Card, Typography, Table, Button, Space, Tag, Row, Col, Select, Statistic, Modal, Descriptions, Progress, DatePicker } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface TimesheetEntry {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  weekStart: string;
  weekEnd: string;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  submittedOn?: string;
  approvedBy?: string;
}

interface DailyEntry {
  day: string;
  date: string;
  clockIn: string;
  clockOut: string;
  hours: number;
  project: string;
}

export default function TimesheetsPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<TimesheetEntry | null>(null);

  const [timesheets] = useState<TimesheetEntry[]>([
    {
      id: '1',
      staffId: 'EMP-001',
      staffName: 'Dr. Emeka Adeleke',
      department: 'Cardiology',
      weekStart: '2024-01-29',
      weekEnd: '2024-02-04',
      regularHours: 40,
      overtimeHours: 6,
      totalHours: 46,
      status: 'Approved',
      submittedOn: '2024-02-04',
      approvedBy: 'Dr. Ibrahim Musa',
    },
    {
      id: '2',
      staffId: 'EMP-002',
      staffName: 'Dr. Ibrahim Musa',
      department: 'General Medicine',
      weekStart: '2024-01-29',
      weekEnd: '2024-02-04',
      regularHours: 42,
      overtimeHours: 4,
      totalHours: 46,
      status: 'Approved',
      submittedOn: '2024-02-04',
      approvedBy: 'Dr. Emeka Adeleke',
    },
    {
      id: '3',
      staffId: 'EMP-007',
      staffName: 'Nurse Amaka Okafor',
      department: 'Nursing',
      weekStart: '2024-01-29',
      weekEnd: '2024-02-04',
      regularHours: 40,
      overtimeHours: 8,
      totalHours: 48,
      status: 'Approved',
      submittedOn: '2024-02-04',
      approvedBy: 'Head of Nursing',
    },
    {
      id: '4',
      staffId: 'EMP-003',
      staffName: 'Dr. Chinedu Okonkwo',
      department: 'Orthopedics',
      weekStart: '2024-01-29',
      weekEnd: '2024-02-04',
      regularHours: 38,
      overtimeHours: 0,
      totalHours: 38,
      status: 'Submitted',
      submittedOn: '2024-02-05',
    },
    {
      id: '5',
      staffId: 'EMP-008',
      staffName: 'Nurse Grace Adebayo',
      department: 'Nursing',
      weekStart: '2024-01-29',
      weekEnd: '2024-02-04',
      regularHours: 40,
      overtimeHours: 5,
      totalHours: 45,
      status: 'Submitted',
      submittedOn: '2024-02-05',
    },
    {
      id: '6',
      staffId: 'EMP-009',
      staffName: 'Nurse Chinedu Eze',
      department: 'Nursing',
      weekStart: '2024-01-29',
      weekEnd: '2024-02-04',
      regularHours: 44,
      overtimeHours: 4,
      totalHours: 48,
      status: 'Draft',
    },
  ]);

  const dailyEntries: DailyEntry[] = [
    { day: 'Monday', date: '2024-01-29', clockIn: '08:00', clockOut: '17:00', hours: 9, project: 'Patient Rounds' },
    { day: 'Tuesday', date: '2024-01-30', clockIn: '08:00', clockOut: '17:00', hours: 9, project: 'Surgeries' },
    { day: 'Wednesday', date: '2024-01-31', clockIn: '08:00', clockOut: '16:00', hours: 8, project: 'OPD' },
    { day: 'Thursday', date: '2024-02-01', clockIn: '08:00', clockOut: '18:00', hours: 10, project: 'Emergency' },
    { day: 'Friday', date: '2024-02-02', clockIn: '08:00', clockOut: '17:00', hours: 9, project: 'Ward Rounds' },
    { day: 'Saturday', date: '2024-02-03', clockIn: '09:00', clockOut: '14:00', hours: 5, project: 'On Call' },
    { day: 'Sunday', date: '2024-02-04', clockIn: '00:00', clockOut: '00:00', hours: 0, project: 'Off' },
  ];

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: any }> = {
      'Approved': { color: 'success', icon: <CheckCircleOutlined /> },
      'Submitted': { color: 'processing', icon: <ClockCircleOutlined /> },
      'Draft': { color: 'default', icon: <ClockCircleOutlined /> },
      'Rejected': { color: 'error', icon: <ClockCircleOutlined /> },
    };
    return configs[status] || configs.Draft;
  };

  const filteredTimesheets = timesheets.filter((timesheet) => {
    const matchesStatus = !statusFilter || timesheet.status === statusFilter;
    const matchesDept = !departmentFilter || timesheet.department === departmentFilter;
    return matchesStatus && matchesDept;
  });

  const columns = [
    {
      title: 'Staff',
      dataIndex: 'staffName',
      key: 'staffName',
      render: (name: string, record: TimesheetEntry) => (
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
      title: 'Week Period',
      key: 'weekPeriod',
      render: (_: any, record: TimesheetEntry) => (
        <div>
          <div className="text-sm">{dayjs(record.weekStart).format('MMM DD')}</div>
          <Text type="secondary" className="text-xs">to {dayjs(record.weekEnd).format('MMM DD')}</Text>
        </div>
      ),
    },
    {
      title: 'Regular Hours',
      dataIndex: 'regularHours',
      key: 'regularHours',
      render: (hours: number) => <span className="font-medium">{hours}h</span>,
    },
    {
      title: 'Overtime',
      dataIndex: 'overtimeHours',
      key: 'overtimeHours',
      render: (hours: number) => <span style={{ color: '#faad14' }}>{hours}h</span>,
    },
    {
      title: 'Total Hours',
      dataIndex: 'totalHours',
      key: 'totalHours',
      render: (hours: number) => (
        <span className="font-medium" style={{ color: hours > 40 ? '#3f8600' : '#1890ff' }}>{hours}h</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getStatusConfig(status);
        return <Tag icon={config.icon} color={config.color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: TimesheetEntry) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedTimesheet(record);
              setIsModalVisible(true);
            }}
          >
            View Details
          </Button>
          {record.status === 'Draft' && <Button type="link" size="small">Submit</Button>}
        </Space>
      ),
    },
  ];

  const dailyColumns = [
    { title: 'Day', dataIndex: 'day', key: 'day' },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (date: string) => dayjs(date).format('MMM DD') },
    { title: 'Clock In', dataIndex: 'clockIn', key: 'clockIn' },
    { title: 'Clock Out', dataIndex: 'clockOut', key: 'clockOut' },
    {
      title: 'Hours',
      dataIndex: 'hours',
      key: 'hours',
      render: (hours: number) => (
        <Tag color={hours > 0 ? 'blue' : 'default'}>{hours}h</Tag>
      ),
    },
    { title: 'Project/Activity', dataIndex: 'project', key: 'project' },
  ];

  const stats = {
    total: timesheets.length,
    draft: timesheets.filter((t: any) => t.status === 'Draft').length,
    submitted: timesheets.filter((t: any) => t.status === 'Submitted').length,
    approved: timesheets.filter((t: any) => t.status === 'Approved').length,
    totalHours: timesheets.reduce((sum, t) => sum + t.totalHours, 0),
    avgHours: Math.round(timesheets.reduce((sum, t) => sum + t.totalHours, 0) / timesheets.length),
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Timesheet Management</Title>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic title="Total Timesheets" value={stats.total} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic title="Draft" value={stats.draft} valueStyle={{ color: '#8c8c8c' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic title="Submitted" value={stats.submitted} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic title="Approved" value={stats.approved} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic title="Total Hours" value={stats.totalHours} suffix="h" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic title="Avg Hours" value={stats.avgHours} suffix="h" />
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
            <Select.Option value="Draft">Draft</Select.Option>
            <Select.Option value="Submitted">Submitted</Select.Option>
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
            <Select.Option value="Orthopedics">Orthopedics</Select.Option>
          </Select>
        </Space>

        <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredTimesheets}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
        </div>
      </Card>

      <Modal
        title="Timesheet Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          <Button type="primary" onClick={() => setIsModalVisible(false)}>Close</Button>
        }
        width={1000}
      >
        {selectedTimesheet && (
          <div>
            <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Staff Name">{selectedTimesheet.staffName}</Descriptions.Item>
              <Descriptions.Item label="Staff ID">{selectedTimesheet.staffId}</Descriptions.Item>
              <Descriptions.Item label="Department">{selectedTimesheet.department}</Descriptions.Item>
              <Descriptions.Item label="Status">
                {(() => {
                  const config = getStatusConfig(selectedTimesheet.status);
                  return <Tag icon={config.icon} color={config.color}>{selectedTimesheet.status}</Tag>;
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Week Start">
                {dayjs(selectedTimesheet.weekStart).format('MMMM DD, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Week End">
                {dayjs(selectedTimesheet.weekEnd).format('MMMM DD, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Regular Hours">{selectedTimesheet.regularHours}h</Descriptions.Item>
              <Descriptions.Item label="Overtime Hours">{selectedTimesheet.overtimeHours}h</Descriptions.Item>
              <Descriptions.Item label="Total Hours">
                <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{selectedTimesheet.totalHours}h</span>
              </Descriptions.Item>
              {selectedTimesheet.submittedOn && (
                <Descriptions.Item label="Submitted On">
                  {dayjs(selectedTimesheet.submittedOn).format('MMMM DD, YYYY')}
                </Descriptions.Item>
              )}
              {selectedTimesheet.approvedBy && (
                <Descriptions.Item label="Approved By">{selectedTimesheet.approvedBy}</Descriptions.Item>
              )}
            </Descriptions>

            <Title level={5}>Daily Breakdown</Title>
            <div className="overflow-x-auto">
        <Table
              dataSource={dailyEntries}
              columns={dailyColumns}
              rowKey="day"
              pagination={false}
              size="small"
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4} align="right">
                      <strong>Weekly Total:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4}>
                      <strong>{dailyEntries.reduce((sum, entry) => sum + entry.hours, 0)}h</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={5} />
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />

            <div style={{ marginTop: 16 }}>
              <Text strong>Hours Distribution:</Text>
              <Progress
                percent={Math.round((selectedTimesheet.regularHours / 40) * 100)}
                status="active"
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
              <div className="text-xs text-gray-500 mt-1">
                Regular: {selectedTimesheet.regularHours}h | Overtime: {selectedTimesheet.overtimeHours}h
              </div>
            </div>
          </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
