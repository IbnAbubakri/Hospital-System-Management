'use client';

import React from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton, InfoCard } from '@/components/design-system';
import { Modal, Form, Alert, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, BuildOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons';

interface Department {
  id: number;
  name: string;
  code: string;
  head: string;
  beds: number;
  status: 'active' | 'inactive';
}

interface Ward {
  id: number;
  name: string;
  department: string;
  capacity: number;
  occupied: number;
  gender: 'Male' | 'Female' | 'Mixed';
  status: 'active' | 'inactive';
}

interface Room {
  id: number;
  roomNumber: string;
  ward: string;
  beds: number;
  occupied: number;
  type: 'General' | 'Private' | 'ICU';
  status: 'available' | 'occupied' | 'maintenance';
}

const departments: Department[] = [
  { id: 1, name: 'Cardiology', code: 'CARD', head: 'Dr. Okonkwo', beds: 45, status: 'active' },
  { id: 2, name: 'Orthopedics', code: 'ORTHO', head: 'Dr. Eze', beds: 30, status: 'active' },
  { id: 3, name: 'Pediatrics', code: 'PED', head: 'Dr. Okafor', beds: 25, status: 'active' },
  { id: 4, name: 'General Medicine', code: 'GM', head: 'Dr. Nnamdi', beds: 60, status: 'active' },
  { id: 5, name: 'ICU', code: 'ICU', head: 'Dr. Ibrahim', beds: 10, status: 'active' },
  { id: 6, name: 'Emergency', code: 'EMERG', head: 'Dr. Adeleke', beds: 20, status: 'active' },
];

const wards: Ward[] = [
  { id: 1, name: 'Ward A1', department: 'Cardiology', capacity: 20, occupied: 15, gender: 'Male', status: 'active' },
  { id: 2, name: 'Ward A2', department: 'Cardiology', capacity: 25, occupied: 22, gender: 'Female', status: 'active' },
  { id: 3, name: 'Ward B1', department: 'Orthopedics', capacity: 15, occupied: 10, gender: 'Male', status: 'active' },
  { id: 4, name: 'Ward B2', department: 'Orthopedics', capacity: 15, occupied: 12, gender: 'Female', status: 'active' },
  { id: 5, name: 'Ward C1', department: 'General Medicine', capacity: 30, occupied: 28, gender: 'Male', status: 'active' },
  { id: 6, name: 'Ward C2', department: 'General Medicine', capacity: 30, occupied: 25, gender: 'Female', status: 'active' },
  { id: 7, name: 'ICU Ward', department: 'ICU', capacity: 10, occupied: 8, gender: 'Mixed', status: 'active' },
  { id: 8, name: 'Emergency Ward', department: 'Emergency', capacity: 20, occupied: 15, gender: 'Mixed', status: 'active' },
];

const rooms: Room[] = [
  { id: 1, roomNumber: '101', ward: 'Ward A1', beds: 4, occupied: 3, type: 'General', status: 'available' },
  { id: 2, roomNumber: '102', ward: 'Ward A1', beds: 4, occupied: 4, type: 'General', status: 'occupied' },
  { id: 3, roomNumber: '201', ward: 'Ward A2', beds: 1, occupied: 1, type: 'Private', status: 'occupied' },
  { id: 4, roomNumber: 'ICU-01', ward: 'ICU Ward', beds: 1, occupied: 1, type: 'ICU', status: 'occupied' },
  { id: 5, roomNumber: 'ICU-02', ward: 'ICU Ward', beds: 1, occupied: 0, type: 'ICU', status: 'available' },
  { id: 6, roomNumber: '301', ward: 'Ward B1', beds: 3, occupied: 2, type: 'General', status: 'available' },
  { id: 7, roomNumber: '302', ward: 'Ward B2', beds: 3, occupied: 3, type: 'General', status: 'occupied' },
  { id: 8, roomNumber: '401', ward: 'Ward C1', beds: 5, occupied: 5, type: 'General', status: 'occupied' },
];

export default function MasterDataPage() {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = React.useState('departments');
  const [searchText, setSearchText] = React.useState('');
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [form] = Form.useForm();

  // CRITICAL SECURITY: Restrict access to administrators only
  if (!hasPermission('admin:master_data:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '16px' }}>
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access master data management. This area is restricted to administrators only."
          type="error"
          showIcon
          style={{ marginTop: '24px', borderRadius: '12px' }}
        />
      </div>
    );
  }

  // Filter data based on search
  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchText.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchText.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredWards = wards.filter(
    (ward) =>
      ward.name.toLowerCase().includes(searchText.toLowerCase()) ||
      ward.department.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredRooms = rooms.filter(
    (room) =>
      room.roomNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      room.ward.toLowerCase().includes(searchText.toLowerCase()) ||
      room.type.toLowerCase().includes(searchText.toLowerCase())
  );

  const departmentColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Department Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: '#DBEAFE',
            color: '#1E40AF',
          }}
        >
          {code}
        </span>
      ),
    },
    { title: 'Department Head', dataIndex: 'head', key: 'head' },
    { title: 'Total Beds', dataIndex: 'beds', key: 'beds' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="patient" showIcon />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <GradientButton variant="secondary" size="small" icon={<EditOutlined />}>
          Edit
        </GradientButton>
      ),
    },
  ];

  const wardColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Ward Name', dataIndex: 'name', key: 'name' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Capacity', dataIndex: 'capacity', key: 'capacity' },
    { title: 'Occupied', dataIndex: 'occupied', key: 'occupied' },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: gender === 'Male' ? '#DBEAFE' : gender === 'Female' ? '#FCE7F3' : '#F3E8FF',
            color: gender === 'Male' ? '#1E40AF' : gender === 'Female' ? '#BE185D' : '#7C3AED',
          }}
        >
          {gender}
        </span>
      ),
    },
    {
      title: 'Occupancy Rate',
      key: 'occupancy',
      render: (_: any, record: Ward) => {
        const percentage = Math.round((record.occupied / record.capacity) * 100);
        const color = percentage >= 100 ? '#EF4444' : percentage > 80 ? '#F59E0B' : '#10B981';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: 1, height: '6px', background: '#E5E7EB', borderRadius: '3px', overflow: 'hidden', width: '80px' }}>
              <div
                style={{
                  height: '100%',
                  width: `${percentage}%`,
                  background: color,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 500, color }}>{percentage}%</span>
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <GradientButton variant="secondary" size="small" icon={<EditOutlined />}>
          Edit
        </GradientButton>
      ),
    },
  ];

  const roomColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Room No.',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      render: (num: string) => (
        <span style={{ fontWeight: 600, color: '#1E40AF' }}>{num}</span>
      ),
    },
    { title: 'Ward', dataIndex: 'ward', key: 'ward' },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colors = {
          General: '#DBEAFE',
          Private: '#FEF3C7',
          ICU: '#FEE2E2',
        };
        const textColors = {
          General: '#1E40AF',
          Private: '#92400E',
          ICU: '#B91C1C',
        };
        return (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              background: colors[type as keyof typeof colors],
              color: textColors[type as keyof typeof textColors],
            }}
          >
            {type}
          </span>
        );
      },
    },
    { title: 'Total Beds', dataIndex: 'beds', key: 'beds' },
    { title: 'Occupied', dataIndex: 'occupied', key: 'occupied' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          available: { label: 'Available', color: '#10B981', bg: '#D1FAE5' },
          occupied: { label: 'Occupied', color: '#F59E0B', bg: '#FEF3C7' },
          maintenance: { label: 'Maintenance', color: '#EF4444', bg: '#FEE2E2' },
        };
        const s = statusMap[status as keyof typeof statusMap];
        return (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              background: s.bg,
              color: s.color,
            }}
          >
            {s.label}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <GradientButton variant="secondary" size="small" icon={<EditOutlined />}>
          Edit
        </GradientButton>
      ),
    },
  ];

  const handleCreate = () => {
    form.validateFields().then((values) => {
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'departments':
        return {
          data: filteredDepartments,
          columns: departmentColumns,
          totalCount: departments.length,
          icon: <BuildOutlined style={{ color: '#3B82F6', fontSize: '20px' }} />,
          title: 'Departments',
          buttonLabel: 'Add Department',
        };
      case 'wards':
        return {
          data: filteredWards,
          columns: wardColumns,
          totalCount: wards.length,
          icon: <HomeOutlined style={{ color: '#8B5CF6', fontSize: '20px' }} />,
          title: 'Wards',
          buttonLabel: 'Add Ward',
        };
      case 'rooms':
        return {
          data: filteredRooms,
          columns: roomColumns,
          totalCount: rooms.length,
          icon: <TeamOutlined style={{ color: '#10B981', fontSize: '20px' }} />,
          title: 'Rooms',
          buttonLabel: 'Add Room',
        };
      default:
        return null;
    }
  };

  const tabContent = getTabContent();

  return (
    <PageShell
      title="Master Data Management"
      subtitle="Configure and manage departments, wards, and rooms"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Total Departments"
          value={departments.length}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Total Wards"
          value={wards.length}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={1}
        />
        <StatCard
          label="Total Rooms"
          value={rooms.length}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={2}
        />
        <StatCard
          label="Total Beds"
          value={wards.reduce((sum, w) => sum + w.capacity, 0)}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={3}
        />
      </div>

      {/* Main Content Card */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'departments',
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BuildOutlined />
                  Departments
                </span>
              ),
            },
            {
              key: 'wards',
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HomeOutlined />
                  Wards
                </span>
              ),
            },
            {
              key: 'rooms',
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TeamOutlined />
                  Rooms
                </span>
              ),
            },
          ]}
        />

        <div className="mt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              {tabContent?.icon}
              <h2 className="text-lg font-semibold text-gray-900">{tabContent?.title}</h2>
            </div>
            <GradientButton icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
              {tabContent?.buttonLabel}
            </GradientButton>
          </div>

          <SearchFilterBar
            searchPlaceholder={`Search ${tabContent?.title.toLowerCase()}...`}
            searchValue={searchText}
            onSearchChange={setSearchText}
            resultCount={tabContent?.data.length || 0}
            totalCount={tabContent?.totalCount || 0}
            filterLabel={tabContent?.title.toLowerCase()}
          />

          <ModernTable
            dataSource={tabContent?.data as any[] || []}
            columns={tabContent?.columns as any || []}
            rowKey="id"
            pagination={{ defaultPageSize: 10 }}
          />
        </div>
      </div>

      {/* Add Department Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <BuildOutlined style={{ color: '#3B82F6' }} />
            <span>Add Department</span>
          </div>
        }
        open={isModalVisible}
        onOk={handleCreate}
        onCancel={() => setIsModalVisible(false)}
        okText="Create Department"
      >
        <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
          <Form.Item name="name" label="Department Name" rules={[{ required: true }]}>
            <input
              placeholder="Enter department name"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            />
          </Form.Item>
          <Form.Item name="code" label="Department Code" rules={[{ required: true }]}>
            <input
              placeholder="Enter department code (e.g., CARD)"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            />
          </Form.Item>
          <Form.Item name="head" label="Department Head">
            <select
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            >
              <option value="">Select department head</option>
              <option value="dr-okonkwo">Dr. Okonkwo</option>
              <option value="dr-eze">Dr. Eze</option>
              <option value="dr-okafor">Dr. Okafor</option>
              <option value="dr-nnamdi">Dr. Nnamdi</option>
            </select>
          </Form.Item>
          <Form.Item name="beds" label="Total Beds">
            <input
              type="number"
              placeholder="Enter total beds"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageShell>
  );
}
