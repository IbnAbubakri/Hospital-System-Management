'use client';

import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Form, Input, Select, DatePicker, TimePicker, Table, Space, Tag, Modal, App, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined, CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ShiftSchedule {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  date: string;
  shiftType: 'Morning' | 'Afternoon' | 'Night' | 'On-Call';
  startTime: string;
  endTime: string;
  status: 'Scheduled' | 'Completed' | 'Missed' | 'Cancelled';
}

export default function ShiftSchedulingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState<string>('');

  const [shifts, setShifts] = useState<ShiftSchedule[]>([
    {
      id: '1',
      staffId: 'EMP-001',
      staffName: 'Dr. Ngozi Adeleke',
      department: 'Cardiology',
      date: '2024-02-02',
      shiftType: 'Morning',
      startTime: '08:00',
      endTime: '16:00',
      status: 'Completed'},
    {
      id: '2',
      staffId: 'EMP-002',
      staffName: 'Dr. Emeka Okoro',
      department: 'General Medicine',
      date: '2024-02-02',
      shiftType: 'Afternoon',
      startTime: '14:00',
      endTime: '22:00',
      status: 'Completed'},
    {
      id: '3',
      staffId: 'EMP-003',
      staffName: 'Nurse Amaka Okafor',
      department: 'Nursing',
      date: '2024-02-02',
      shiftType: 'Night',
      startTime: '22:00',
      endTime: '06:00',
      status: 'Scheduled'},
    {
      id: '4',
      staffId: 'EMP-001',
      staffName: 'Dr. Ngozi Adeleke',
      department: 'Cardiology',
      date: '2024-02-03',
      shiftType: 'Morning',
      startTime: '08:00',
      endTime: '16:00',
      status: 'Scheduled'},
  ]);

  const handleSubmit = (values: { [key: string]: string | number }) => {
    const newShift: ShiftSchedule = {
      id: Date.now().toString(),
      staffId: values.staffId,
      staffName: values.staffName,
      department: values.department,
      date: values.date,
      shiftType: values.shiftType,
      startTime: values.startTime.format('HH:mm'),
      endTime: values.endTime.format('HH:mm'),
      status: 'Scheduled'};

    setShifts([...shifts, newShift]);
    message.success('Shift scheduled successfully');
    setIsModalOpen(false);
    form.resetFields();
  };

  const getShiftConfig = (type: string) => {
    const configs: Record<string, { color: string; icon: React.ReactNode; hours: string }> = {
      'Morning': { color: 'blue', icon: 'Morning', hours: '08:00 - 16:00' },
      'Afternoon': { color: 'orange', icon: 'Afternoon', hours: '14:00 - 22:00' },
      'Night': { color: 'purple', icon: 'Night', hours: '22:00 - 06:00' },
      'On-Call': { color: 'green', icon: 'On-Call', hours: '24 Hours' }};
    return configs[type] || configs.Morning;
  };

  const columns = [
    {
      title: 'Staff Member',
      dataIndex: 'staffName',
      key: 'staffName',
      render: (name: string, record: ShiftSchedule) => (
        <div>
          <div className="font-medium">{name}</div>
          <Text type="secondary" className="">{record.staffId}</Text>
        </div>
      )},
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => <Tag>{dept}</Tag>},
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date'},
    {
      title: 'Shift',
      dataIndex: 'shiftType',
      key: 'shiftType',
      render: (type: string) => {
        const config = getShiftConfig(type);
        return (
          <Tag color={config.color}>
            {config.icon} ({config.hours})
          </Tag>
        );
      }},
    {
      title: 'Time',
      key: 'time',
      render: (_: any, record: ShiftSchedule) => (
        <Space>
          <ClockCircleOutlined />
          <span>{record.startTime} - {record.endTime}</span>
        </Space>
      )},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          'Scheduled': 'default',
          'Completed': 'success',
          'Missed': 'error',
          'Cancelled': 'warning'};
        return <Tag color={colors[status]}>{status}</Tag>;
      }},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ShiftSchedule) => (
        <Space>
          {record.status === 'Scheduled' && (
            <>
              <Button type="link" size="small">Edit</Button>
              <Button type="link" danger size="small">Cancel</Button>
            </>
          )}
          <Button type="link" size="small">Details</Button>
        </Space>
      )},
  ];

  const stats = {
    total: shifts.length,
    scheduled: shifts.filter((s: any) => s.status === 'Scheduled').length,
    completed: shifts.filter((s: any) => s.status === 'Completed').length,
    missed: shifts.filter((s: any) => s.status === 'Missed').length};

  const staffList = [
    { id: 'EMP-001', name: 'Dr. Ngozi Adeleke', dept: 'Cardiology' },
    { id: 'EMP-002', name: 'Dr. Emeka Okoro', dept: 'General Medicine' },
    { id: 'EMP-003', name: 'Nurse Amaka Okafor', dept: 'Nursing' },
    { id: 'EMP-004', name: 'Nurse Grace Adebayo', dept: 'Nursing' },
    { id: 'EMP-005', name: 'Dr. Tunde Bakare', dept: 'Orthopedics' },
  ];

  return (
    <div className="  sm: sm: lg: lg: max-w-7xl mx-auto">
      <div className=" -col sm:-row items-start sm:   ">
        <div>
          <Title level={3} className="!">Shift Scheduling</Title>
          <Text type="secondary">Manage staff shifts and duty rosters</Text>
        </div>
        <Space>
          <DatePicker onChange={(date) => setSelectedDate(date?.format('YYYY-MM-DD') || '')} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Schedule Shift
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="">
        <Col xs={12} sm={6}>
          <Card>
            <div className="text-center">
              <CalendarOutlined className="text-3xl " />
              <div className="text-2xl font-bold  ">{stats.total}</div>
              <div className=" ">Total Shifts</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <div className="text-center">
              <ClockCircleOutlined className="text-3xl " />
              <div className="text-2xl font-bold  ">{stats.scheduled}</div>
              <div className=" ">Scheduled</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <div className="text-center">
              <CheckCircleOutlined className="text-3xl " />
              <div className="text-2xl font-bold color: '#059669' ">{stats.completed}</div>
              <div className=" ">Completed</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <div className="text-center">
              <CloseCircleOutlined className="text-3xl " />
              <div className="text-2xl font-bold color: '#DC2626' ">{stats.missed}</div>
              <div className=" ">Missed</div>
            </div>
          </Card>
        </Col>
      </Row>

      {stats.missed > 0 && (
        <Alert
          title={`${stats.missed} missed shift${stats.missed > 1 ? 's' : ''} detected`}
          description="Please review missed shifts and follow up with affected staff."
          type="error"
          showIcon
          closable
          className=""
        />
      )}

      <Card title="Shift Schedule">
        <div className="overflow-x-auto">
        <Table
          dataSource={shifts}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 20 }}
          scroll={{ x: 900 }}
        />
        </div>
      </Card>

      <Modal
        title="Schedule New Shift"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="staffId" label="Staff Member" rules={[{ required: true }]}>
            <Select placeholder="Select staff member">
              {staffList.map((staff) => (
                <Select.Option key={staff.id} value={staff.id}>
                  {staff.name} - {staff.dept}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="staffName" hidden>
            <Input />
          </Form.Item>

          <Form.Item name="department" label="Department" rules={[{ required: true }]}>
            <Select placeholder="Select department">
              <Select.Option value="Cardiology">Cardiology</Select.Option>
              <Select.Option value="General Medicine">General Medicine</Select.Option>
              <Select.Option value="Orthopedics">Orthopedics</Select.Option>
              <Select.Option value="Pediatrics">Pediatrics</Select.Option>
              <Select.Option value="Nursing">Nursing</Select.Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="shiftType" label="Shift Type" rules={[{ required: true }]}>
                <Select placeholder="Select shift">
                  <Select.Option value="Morning">Morning</Select.Option>
                  <Select.Option value="Afternoon">Afternoon</Select.Option>
                  <Select.Option value="Night">Night</Select.Option>
                  <Select.Option value="On-Call">On-Call</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startTime" label="Start Time" rules={[{ required: true }]}>
                <TimePicker className="w-full" format="HH:mm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="End Time" rules={[{ required: true }]}>
                <TimePicker className="w-full" format="HH:mm" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
