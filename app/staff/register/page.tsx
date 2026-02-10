'use client';

import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Typography, Row, Col, Modal, Form, Input, Select, DatePicker, InputNumber, Upload, App, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, SearchOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;

interface StaffMember {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: 'Doctor' | 'Nurse' | 'Technician' | 'Admin' | 'Support Staff';
  specialization?: string;
  qualification: string;
  joiningDate: string;
  status: 'Active' | 'On Leave' | 'Inactive' | 'Terminated';
  licenseNumber?: string;
  avatar?: string;
}

export default function StaffRegisterPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { message } = App.useApp();
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: '1',
      employeeId: 'EMP-001',
      firstName: 'Emeka',
      lastName: 'Adeleke',
      email: 'e.adeleke@hospital.com',
      phone: '+234 801 234 5678',
      department: 'Cardiology',
      role: 'Doctor',
      specialization: 'Interventional Cardiology',
      qualification: 'MBBS, MD (Cardiology)',
      joiningDate: '2020-01-15',
      status: 'Active',
      licenseNumber: 'MDC/12345/2020'},
    {
      id: '2',
      employeeId: 'EMP-002',
      firstName: 'Ibrahim',
      lastName: 'Musa',
      email: 'i.musa@hospital.com',
      phone: '+234 802 345 6789',
      department: 'General Medicine',
      role: 'Doctor',
      specialization: 'Internal Medicine',
      qualification: 'MBBS, MD (General Medicine)',
      joiningDate: '2019-06-01',
      status: 'Active',
      licenseNumber: 'MDC/12346/2019'},
    {
      id: '3',
      employeeId: 'EMP-003',
      firstName: 'Amaka',
      lastName: 'Okafor',
      email: 'a.okafor@hospital.com',
      phone: '+234 803 456 7890',
      department: 'Nursing',
      role: 'Nurse',
      qualification: 'BSc Nursing, RN, RM',
      joiningDate: '2021-03-10',
      status: 'Active',
      licenseNumber: 'NMC/789012/2021'},
  ]);

  const handleSubmit = (values: { [key: string]: string | number }) => {
    const newStaff: StaffMember = {
      id: editingStaff?.id || Date.now().toString(),
      employeeId: editingStaff?.employeeId || `EMP-${String(staff.length + 1).padStart(3, '0')}`,
      ...(values as any),
      status: 'Active'};

    if (editingStaff) {
      setStaff(staff.map((s) => (s.id === editingStaff.id ? newStaff : s)));
      message.success('Staff member updated successfully');
    } else {
      setStaff([...staff, newStaff]);
      message.success('Staff member registered successfully');
    }

    setIsModalOpen(false);
    form.resetFields();
    setEditingStaff(null);
  };

  const handleEdit = (staffMember: StaffMember) => {
    setEditingStaff(staffMember);
    form.setFieldsValue(staffMember);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setStaff(staff.filter((s: any) => s.id !== id));
    message.success('Staff member deleted');
  };

  const filteredStaff = staff.filter((s: any) => {
    const searchLower = searchText.toLowerCase();
    return (
      s.firstName.toLowerCase().includes(searchLower) ||
      s.lastName.toLowerCase().includes(searchLower) ||
      s.employeeId.toLowerCase().includes(searchLower) ||
      s.email.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      title: 'Employee',
      key: 'employee',
      render: (_: any, record: StaffMember) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ background: '#3B82F6' }}>
            {record.firstName.charAt(0)}{record.lastName.charAt(0)}
          </Avatar>
          <div>
            <div className="font-medium">{record.firstName} {record.lastName}</div>
            <Text type="secondary" className="text-xs">{record.employeeId}</Text>
          </div>
        </Space>
      ),
      sorter: (a: StaffMember, b: StaffMember) =>
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)},
    {
      title: 'Role',
      key: 'role',
      render: (_: any, record: StaffMember) => (
        <div>
          <div><Tag color="blue">{record.role}</Tag></div>
          {record.specialization && (
            <Text type="secondary" className="text-xs">{record.specialization}</Text>
          )}
        </div>
      )},
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => <Tag>{dept}</Tag>},
    {
      title: 'Contact',
      key: 'contact',
      render: (_: any, record: StaffMember) => (
        <div>
          <div className="flex items-center gap-1 text-sm">
            <MailOutlined /> {record.email}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <PhoneOutlined /> {record.phone}
          </div>
        </div>
      )},
    {
      title: 'Qualification',
      dataIndex: 'qualification',
      key: 'qualification',
      render: (qual: string) => <Text className="text-sm">{qual}</Text>},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          'Active': 'success',
          'On Leave': 'warning',
          'Inactive': 'default',
          'Terminated': 'error'};
        return <Tag color={colors[status]}>{status}</Tag>;
      }},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: StaffMember) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      )},
  ];

  const stats = {
    total: staff.length,
    active: staff.filter((s: any) => s.status === 'Active').length,
    doctors: staff.filter((s: any) => s.role === 'Doctor').length,
    nurses: staff.filter((s: any) => s.role === 'Nurse').length,
    onLeave: staff.filter((s: any) => s.status === 'On Leave').length};

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <Title level={3} className="!mb-1">Staff Registration</Title>
          <Text type="secondary">Register and manage hospital staff members</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Register Staff
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Staff</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.doctors}</div>
              <div className="text-sm text-gray-500">Doctors</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600">{stats.nurses}</div>
              <div className="text-sm text-gray-500">Nurses</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title="Staff Directory"
        extra={
          <Search
            placeholder="Search staff..."
            allowClear
            style={{ width: 250 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
          />
        }
      >
        <div className="overflow-x-auto">
        <Table
          dataSource={filteredStaff}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 15 }}
          scroll={{ x: 1000 }}
        />
        </div>
      </Card>

      <Modal
        title={editingStaff ? 'Edit Staff Member' : 'Register New Staff'}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingStaff(null);
        }}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="email@example.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                <Input placeholder="+234 XXX XXX XXXX" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                <Select placeholder="Select role">
                  <Select.Option value="Doctor">Doctor</Select.Option>
                  <Select.Option value="Nurse">Nurse</Select.Option>
                  <Select.Option value="Technician">Technician</Select.Option>
                  <Select.Option value="Admin">Admin</Select.Option>
                  <Select.Option value="Support Staff">Support Staff</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="department" label="Department" rules={[{ required: true }]}>
                <Select placeholder="Select department">
                  <Select.Option value="Cardiology">Cardiology</Select.Option>
                  <Select.Option value="General Medicine">General Medicine</Select.Option>
                  <Select.Option value="Orthopedics">Orthopedics</Select.Option>
                  <Select.Option value="Pediatrics">Pediatrics</Select.Option>
                  <Select.Option value="Neurology">Neurology</Select.Option>
                  <Select.Option value="Nursing">Nursing</Select.Option>
                  <Select.Option value="Laboratory">Laboratory</Select.Option>
                  <Select.Option value="Radiology">Radiology</Select.Option>
                  <Select.Option value="Administration">Administration</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="specialization" label="Specialization (Optional)">
            <Input placeholder="e.g., Interventional Cardiology" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="qualification" label="Qualification" rules={[{ required: true }]}>
                <Input placeholder="e.g., MBBS, MD, BSc Nursing" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="licenseNumber" label="License Number">
                <Input placeholder="Professional license number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="joiningDate" label="Joining Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="Active">
            <Select>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="On Leave">On Leave</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
