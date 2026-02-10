'use client';

import React, { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Timeline, Typography, Tag, Space, Button, Select, Row, Col, Empty } from 'antd';
import { CalendarOutlined, UserOutlined, MedicineBoxOutlined, FileTextOutlined, HomeOutlined, FilterOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/shared/PageHeader';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser } from '@/lib/dataFilters';
import { mockDoctors } from '@/lib/mockData';

const { Title, Text } = Typography;
const { Option } = Select;

interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  type: 'visit' | 'lab' | 'admission' | 'surgery' | 'prescription' | 'emergency' | 'checkup';
  title: string;
  description: string;
  department: string;
  doctor: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export default function PatientTimelinePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<string | undefined>();

  const accessiblePatients = useMemo(() => {
    if (!user) return [];
    return filterPatientsByUser(user);
  }, [user]);

  const patient = accessiblePatients.find((p: any) => p.id === params.id) as any;

  if (!patient) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <Title level={3}>Access Denied</Title>
        <Text>Patient not found or you do not have permission to view this page.</Text>
        <br />
        <Button type="primary" onClick={() => router.back()} style={{ marginTop: '16px' }}>
          Go Back
        </Button>
      </div>
    );
  }

  // Mock timeline events
  const allEvents: TimelineEvent[] = [
    {
      id: '1',
      date: '2024-02-01',
      time: '09:30',
      type: 'visit',
      title: 'Follow-up Consultation',
      description: 'Hypertension follow-up, blood pressure monitoring',
      department: 'Cardiology',
      doctor: `Dr. ${mockDoctors[0].firstName} ${mockDoctors[0].lastName}`,
      status: 'completed',
    },
    {
      id: '2',
      date: '2024-01-25',
      time: '14:00',
      type: 'lab',
      title: 'Blood Test',
      description: 'Complete blood count, lipid panel, thyroid function',
      department: 'Laboratory',
      doctor: 'Lab Technician',
      status: 'completed',
    },
    {
      id: '3',
      date: '2024-01-20',
      time: '08:00',
      type: 'admission',
      title: 'Hospital Admission',
      description: 'Admitted for observation and monitoring',
      department: 'Inpatient',
      doctor: `Dr. ${mockDoctors[0].firstName} ${mockDoctors[0].lastName}`,
      status: 'completed',
    },
    {
      id: '4',
      date: '2024-01-15',
      time: '11:00',
      type: 'prescription',
      title: 'Prescription Issued',
      description: 'Amlodipine 10mg daily, Metformin 500mg twice daily',
      department: 'Pharmacy',
      doctor: `Dr. ${mockDoctors[0].firstName} ${mockDoctors[0].lastName}`,
      status: 'completed',
    },
    {
      id: '5',
      date: '2024-01-10',
      time: '10:30',
      type: 'checkup',
      title: 'Annual Health Checkup',
      description: 'Complete physical examination and health assessment',
      department: 'General Medicine',
      doctor: `Dr. ${mockDoctors[1].firstName} ${mockDoctors[1].lastName}`,
      status: 'completed',
    },
    {
      id: '6',
      date: '2023-12-20',
      time: '16:00',
      type: 'emergency',
      title: 'Emergency Visit',
      description: 'Chest pain evaluation, ECG performed',
      department: 'Emergency',
      doctor: `Dr. ${mockDoctors[0].firstName} ${mockDoctors[0].lastName}`,
      status: 'completed',
    },
  ];

  const filteredEvents = filterType
    ? allEvents.filter((event: any) => event.type === filterType)
    : allEvents;

  const getEventIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      visit: <MedicineBoxOutlined style={{ fontSize: '16px' }} />,
      lab: <FileTextOutlined style={{ fontSize: '16px' }} />,
      admission: <HomeOutlined style={{ fontSize: '16px' }} />,
      surgery: <UserOutlined style={{ fontSize: '16px' }} />,
      prescription: <FileTextOutlined style={{ fontSize: '16px' }} />,
      emergency: <CalendarOutlined style={{ fontSize: '16px' }} />,
      checkup: <MedicineBoxOutlined style={{ fontSize: '16px' }} />,
    };
    return icons[type] || <CalendarOutlined style={{ fontSize: '16px' }} />;
  };

  const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
      visit: '#3B82F6',
      lab: '#10B981',
      admission: '#F59E0B',
      surgery: '#EF4444',
      prescription: '#8B5CF6',
      emergency: '#DC2626',
      checkup: '#06B6D4',
    };
    return colors[type] || '#6B7280';
  };

  const getTypeOptions = [
    { label: 'All Events', value: '' },
    { label: 'Visits', value: 'visit' },
    { label: 'Lab Tests', value: 'lab' },
    { label: 'Admissions', value: 'admission' },
    { label: 'Surgeries', value: 'surgery' },
    { label: 'Prescriptions', value: 'prescription' },
    { label: 'Emergency', value: 'emergency' },
    { label: 'Checkups', value: 'checkup' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <PageHeader
        title={`${patient.firstName} ${patient.lastName} - Timeline`}
        subtitle={`MRN: ${patient.mrn}`}
        extra={
          <Button onClick={() => router.push(`/patients/${patient.id}`)}>Back to Patient</Button>
        }
      />

      <Card>
        <div className="flex items-center justify-between mb-6">
          <Title level={4} className="!mb-0">
            Medical Timeline
          </Title>
          <Space>
            <FilterOutlined />
            <Select
              placeholder="Filter by type"
              value={filterType}
              onChange={setFilterType}
              style={{ width: 150 }}
              allowClear
            >
              {getTypeOptions.map((option) => (
                <Option key={option.label} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Space>
        </div>

        {filteredEvents.length > 0 ? (
          <Timeline
            mode="left"
            items={filteredEvents.map((event) => ({
              color: getEventColor(event.type),
              dot: getEventIcon(event.type),
              children: (
                <Card
                  size="small"
                  style={{
                    marginBottom: '16px',
                    borderLeft: `3px solid ${getEventColor(event.type)}`,
                  }}
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <div className="mb-2">
                        <Text type="secondary" className="text-xs">
                          Date & Time
                        </Text>
                        <br />
                        <Text strong>
                          {event.date} at {event.time}
                        </Text>
                      </div>
                      <div>
                        <Tag color={event.status === 'completed' ? 'success' : event.status === 'pending' ? 'warning' : 'error'}>
                          {event.status.toUpperCase()}
                        </Tag>
                      </div>
                    </Col>
                    <Col xs={24} sm={16}>
                      <Title level={5} className="!mb-2">
                        {event.title}
                      </Title>
                      <Text type="secondary" className="text-sm block mb-2">
                        {event.description}
                      </Text>
                      <Space size="middle" className="text-sm">
                        <span>
                          <Text type="secondary">Department:</Text> {event.department}
                        </span>
                        <span>
                          <Text type="secondary">Doctor:</Text> {event.doctor}
                        </span>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              ),
            }))}
          />
        ) : (
          <Empty description="No events found" />
        )}
      </Card>
    </div>
  );
}
