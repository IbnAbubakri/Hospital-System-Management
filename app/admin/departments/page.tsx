'use client';

import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, App, Avatar, Alert, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BuildOutlined, StopOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';
import { useAuth } from '@/lib/contexts/AuthContext';

interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  location: string;
  phone: string;
  beds: number;
  status: 'Active' | 'Inactive';
}

export default function DepartmentsPage() {
  const { hasPermission } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { message } = App.useApp();
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: 'Cardiology',
      code: 'CARD',
      head: 'Dr. Emeka Adeleke',
      location: '2nd Floor, Wing A',
      phone: '+234 1 234 5678',
      beds: 20,
      status: 'Active'},
    {
      id: '2',
      name: 'General Medicine',
      code: 'GM',
      head: 'Dr. Ibrahim Musa',
      location: '1st Floor, Wing B',
      phone: '+234 1 234 5679',
      beds: 30,
      status: 'Active'},
    {
      id: '3',
      name: 'Orthopedics',
      code: 'ORTHO',
      head: 'Dr. Chinedu Okonkwo',
      location: '3rd Floor, Wing A',
      phone: '+234 1 234 5680',
      beds: 15,
      status: 'Active'},
    {
      id: '4',
      name: 'Pediatrics',
      code: 'PED',
      head: 'Dr. Aisha Yusuf',
      location: 'Ground Floor, Wing C',
      phone: '+234 1 234 5681',
      beds: 25,
      status: 'Active'},
    {
      id: '5',
      name: 'Neurology',
      code: 'NEURO',
      head: 'Dr. Chioma Nnamani',
      location: '2nd Floor, Wing B',
      phone: '+234 1 234 5682',
      beds: 10,
      status: 'Active'},
  ]);

  // CRITICAL SECURITY: Restrict access to administrators only
  if (!hasPermission('admin:departments:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '16px' }}>
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access department management. This area is restricted to administrators only."
          type="error"
          showIcon
          icon={<StopOutlined />}
          style={{ marginTop: '24px', borderRadius: '12px' }}
        />
      </div>
    );
  }

  const handleSubmit = (values: { [key: string]: string | number }) => {
    const newDept: Department = {
      id: editingDept?.id || Date.now().toString(),
      ...(values as any),
      status: 'Active'};

    if (editingDept) {
      setDepartments(departments.map((d) => (d.id === editingDept.id ? newDept : d)));
      message.success('Department updated');
    } else {
      setDepartments([...departments, newDept]);
      message.success('Department added');
    }

    setIsModalOpen(false);
    form.resetFields();
    setEditingDept(null);
  };

  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    form.setFieldsValue(dept);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDepartments(departments.filter((d: any) => d.id !== id));
    message.success('Department deleted');
  };

  const filteredDepartments = departments.filter((dept) => {
    return (
      dept.name.toLowerCase().includes(searchText.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchText.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const columns = [
    {
      title: 'Department',
      key: 'department',
      render: (_: unknown, record: Department) => (
        <div className="flex items-center gap-3">
          <Avatar size={40} icon={<BuildOutlined />} style={{ backgroundColor: '#3B82F6' }} />
          <div>
            <div className="font-medium text-gray-900">{record.name}</div>
            <div className="text-xs text-gray-500">{record.code}</div>
          </div>
        </div>
      ),
    },
    { title: 'Head of Department', dataIndex: 'head', key: 'head' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    {
      title: 'Beds',
      dataIndex: 'beds',
      key: 'beds',
      render: (beds: number) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: '#F1F5F9',
            color: '#475569',
          }}
        >
          {beds} beds
        </span>
      ),
    },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status.toLowerCase()} type="patient" showIcon />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Department) => (
        <Space>
          <GradientButton variant="secondary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </GradientButton>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const stats = {
    total: departments.length,
    active: departments.filter((d: any) => d.status === 'Active').length,
    totalBeds: departments.reduce((sum, d) => sum + d.beds, 0)};

  return (
    <PageShell
      title="Department Management"
      subtitle="Configure hospital departments and their settings"
      action={
        <GradientButton icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          Add Department
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Total Departments"
          value={stats.total}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Active Departments"
          value={stats.active}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="Total Beds"
          value={stats.totalBeds}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={2}
        />
        <StatCard
          label="Avg Beds/Dept"
          value={Math.round(stats.totalBeds / stats.total)}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={3}
        />
      </div>

      {/* Departments List Section */}
      <div className="p-4 sm:p-6 overflow-x-auto" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <SearchFilterBar
          searchPlaceholder="Search departments by name, code, or head..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          resultCount={filteredDepartments.length}
          totalCount={departments.length}
          filterLabel="departments"
        />

        <ModernTable
          dataSource={filteredDepartments}
          columns={columns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </div>

      <Modal
        title={editingDept ? 'Edit Department' : 'Add Department'}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingDept(null);
        }}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Department Name" rules={[{ required: true }]}>
                <Input placeholder="e.g., Cardiology" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="code" label="Department Code" rules={[{ required: true }]}>
                <Input placeholder="e.g., CARD" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="head" label="Head of Department" rules={[{ required: true }]}>
            <Input placeholder="Dr. Name" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                <Input placeholder="e.g., 2nd Floor, Wing A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Extension/Phone">
                <Input placeholder="+234 XXX XXX XXXX" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="beds" label="Number of Beds" rules={[{ required: true }]}>
                <Input type="number" placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status" initialValue="Active">
                <Select>
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageShell>
  );
}
