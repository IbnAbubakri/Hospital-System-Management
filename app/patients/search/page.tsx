'use client';

import React, { useState, useMemo } from 'react';
import { Form, Input, Button, Select, DatePicker, Slider, Row, Col } from 'antd';
import { SearchOutlined, FilterOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser } from '@/lib/dataFilters';
import { mockPatients } from '@/lib/mockData';
import { PageShell, StatCard, SearchFilterBar, ModernTable, StatusTag, GradientButton } from '@/components/design-system';

export default function PatientSearchPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [form] = Form.useForm();

  // Get accessible patients based on logged-in user
  const accessiblePatients = useMemo(() => {
    if (!user) return [];
    return filterPatientsByUser(user, mockPatients);
  }, [user]);

  const handleSearch = (values: { [key: string]: string | number }) => {
    setLoading(true);
    setHasSearched(true);

    // Simulate search - filter patients based on search criteria
    setTimeout(() => {
      const results = accessiblePatients.filter((patient) => {
        // Search by name, MRN, or phone
        const searchLower = (values.searchTerm || '').toLowerCase();
        const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
        const matchesSearch =
          !searchLower ||
          fullName.includes(searchLower) ||
          patient.mrn.toLowerCase().includes(searchLower) ||
          patient.contactNumber.includes(searchLower);

        // Filter by gender
        const matchesGender = !values.gender || patient.gender === values.gender;

        // Filter by status
        const matchesStatus = !values.status || patient.status === values.status;

        // Filter by department
        const matchesDepartment = !values.department || patient.department === values.department;

        // Filter by age range
        const matchesAge = !values.ageRange || (
          patient.age >= values.ageRange[0] && patient.age <= values.ageRange[1]
        );

        return matchesSearch && matchesGender && matchesStatus && matchesDepartment && matchesAge;
      });

      setSearchResults(results);
      setLoading(false);
    }, 800);
  };

  const handleReset = () => {
    form.resetFields();
    setSearchResults([]);
    setHasSearched(false);
  };

  const columns = [
    {
      title: 'MRN',
      dataIndex: 'mrn',
      key: 'mrn',
      render: (mrn: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            background: '#DBEAFE',
            color: '#1E40AF',
          }}
        >
          {mrn}
        </span>
      ),
    },
    {
      title: 'Patient',
      key: 'patient',
      render: (_: unknown, record: any) => (
        <div className="flex items-center gap-2">
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            {record.firstName.charAt(0)}{record.lastName.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {record.firstName} {record.lastName}
            </div>
            <div className="text-xs text-gray-500">{record.email || 'No email'}</div>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) =>
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      render: (age: number) => (
        <span style={{ fontWeight: 500 }}>{age} years</span>
      ),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => (
        <span style={{ fontWeight: 500 }}>{gender.toUpperCase()}</span>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'contactNumber',
      key: 'contactNumber',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: '#EDE9FE',
            color: '#5B21B6',
          }}
        >
          {dept}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="patient" />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: any) => (
        <div className="flex gap-2">
          <Button
            type="link"
            size="small"
            style={{ color: '#3B82F6', fontWeight: 500, padding: 0 }}
            onClick={() => router.push(`/patients/${record.id}`)}
          >
            View Profile
          </Button>
          <Button
            type="link"
            size="small"
            style={{ color: '#10B981', fontWeight: 500, padding: 0 }}
            onClick={() => router.push(`/patients/appointments/new?patientId=${record.id}`)}
          >
            Book Appointment
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageShell
      title="Advanced Patient Search"
      subtitle="Search and filter patient records"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Accessible Patients"
          value={accessiblePatients.length}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Search Results"
          value={searchResults.length}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#A7F3D0"
          index={1}
        />
        <StatCard
          label="Active Patients"
          value={accessiblePatients.filter(p => p.status === 'active').length}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#DDD6FE"
          index={2}
        />
        <StatCard
          label="Inactive Patients"
          value={accessiblePatients.filter(p => p.status === 'inactive').length}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FDE68A"
          index={3}
        />
      </div>

      {/* Search Form */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
        <div className="flex items-center gap-2 mb-4">
          <SearchOutlined style={{ color: '#059669', fontSize: '20px' }} />
          <h2 className="text-lg font-semibold text-gray-900">Search Criteria</h2>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
          initialValues={{ ageRange: [0, 100] }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="searchTerm" label="Search by Name, MRN, or Phone">
                <Input.Search
                  placeholder="Enter search term..."
                  enterButton={<SearchOutlined />}
                  size="large"
                  loading={loading}
                  onSearch={(value) => handleSearch({ searchTerm: value })}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="department" label="Department">
                <Select
                  placeholder="All Departments"
                  allowClear
                  size="large"
                  style={{ borderRadius: '8px' }}
                >
                  <Select.Option value="Cardiology">Cardiology</Select.Option>
                  <Select.Option value="General Medicine">General Medicine</Select.Option>
                  <Select.Option value="Orthopedics">Orthopedics</Select.Option>
                  <Select.Option value="Pediatrics">Pediatrics</Select.Option>
                  <Select.Option value="Neurology">Neurology</Select.Option>
                  <Select.Option value="Surgery">Surgery</Select.Option>
                  <Select.Option value="Emergency">Emergency</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="gender" label="Gender">
                <Select
                  placeholder="All"
                  allowClear
                  size="large"
                  style={{ borderRadius: '8px' }}
                >
                  <Select.Option value="Male">Male</Select.Option>
                  <Select.Option value="Female">Female</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="Status">
                <Select
                  placeholder="All"
                  allowClear
                  size="large"
                  style={{ borderRadius: '8px' }}
                >
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label=" ">
                <GradientButton
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  loading={loading}
                  block
                >
                  Search
                </GradientButton>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="ageRange" label="Age Range">
                <Slider
                  range
                  min={0}
                  max={100}
                  marks={{ 0: '0', 25: '25', 50: '50', 75: '75', 100: '100' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label=" ">
                <Button
                  onClick={handleReset}
                  style={{
                    height: '42px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    padding: '0 20px',
                  }}
                >
                  Reset Filters
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UserOutlined style={{ color: '#3B82F6', fontSize: '20px' }} />
              <h2 className="text-lg font-semibold text-gray-900">
                Search Results ({searchResults.length})
              </h2>
            </div>
            {searchResults.length > 0 && (
              <GradientButton icon={<FilterOutlined />}>
                Refine Search
              </GradientButton>
            )}
          </div>

          {searchResults.length > 0 ? (
            <ModernTable
              dataSource={searchResults}
              columns={columns}
              rowKey="id"
              pagination={{ defaultPageSize: 20 }}
              showGradientHover={true}
            />
          ) : (
            <div
              style={{
                padding: '60px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                borderRadius: '10px',
              }}
            >
              <SearchOutlined style={{ fontSize: '48px', color: '#CBD5E1', marginBottom: '16px' }} />
              <div className="text-lg font-semibold text-gray-700 mb-2">No patients found</div>
              <div className="text-sm text-gray-500">
                Try adjusting your search criteria or filters
              </div>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
