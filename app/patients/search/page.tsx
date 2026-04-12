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
      <span style={{ fontWeight: 600 }} className=".5 -md bg-blue-100">
          {mrn}
        </span>
      ),
    },
    {
      title: 'Patient',
      key: 'patient',
      render: (_: unknown, record: any) => (
        <div className="  ">
            <div className="  ">
              <div className="  -full bg-gradient-to-br from-blue-500 to-blue-600      font-semibold">
            {record.firstName.charAt(0)}{record.lastName.charAt(0)}
          </div>
          <div>
            <div className="font-medium ">
              {record.firstName} {record.lastName}
            </div>
            <div className="">{record.email || 'No email'}</div>
          </div>
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
        <span className="font-medium">{age} years</span>
      ),},
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => (
        <span className="font-medium">{gender.toUpperCase()}</span>
      ),},
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
      <span className=".5  -md  font-medium bg-violet-100 ">
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
        <div className="">
          <Button
            type="link"
            size="small"
            style={{ color: '#3B82F6' }}
            onClick={() => router.push(`/patients/${record.id}`)}
          >
            View Profile
          </Button>
          <Button
            type="link"
            size="small"
            className=""
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
      <div className="grid grid-cols-4  ">
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
      <div className="bg-white -xl  border border-slate-200 ">
        <div className="   ">
          <SearchOutlined className="color: '#10B981' text-xl" />
          <h2 className=" font-semibold ">Search Criteria</h2>
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
                  className="-lg"
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
                  className="-lg"
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
                  className="-lg"
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
                  className="-lg"
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
                  className=" -xl font-semibold "
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
        <div className="bg-white -xl  border border-slate-200">
          <div className="   ">
            <div className="  ">
              <UserOutlined className="color: '#3B82F6' text-xl" />
              <h2 className=" font-semibold ">
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
            <div className="text-center bg-gradient-to-br from-slate-50 to-slate-100">
              <SearchOutlined style={{ fontSize: '48px', color: '#CBD5E1' }} />
              <div className="font-semibold">No patients found</div>
              <div className="">
                Try adjusting your search criteria or filters
              </div>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}

