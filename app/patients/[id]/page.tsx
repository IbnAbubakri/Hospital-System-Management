'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tabs, Typography, Tag, Space, Button, Descriptions, Timeline, Alert, Row, Col, Card } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, EditOutlined, CalendarOutlined, WarningOutlined, HomeOutlined, IdcardOutlined } from '@ant-design/icons';
import { mockPatients, mockDoctors } from '@/lib/mockData';
import { formatDate, calculateAge } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser } from '@/lib/dataFilters';
import { PageShell, StatCard, InfoCard, StatusTag, GradientButton } from '@/components/design-system';

const { Title, Text, Paragraph } = Typography;

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  // Get accessible patients based on logged-in user
  const accessiblePatients = useMemo(() => {
    if (!user) return [];
    return filterPatientsByUser(user);
  }, [user]);

  const patient = accessiblePatients.find((p: any) => p.id === params.id) as any;

  if (!patient) {
    return (
      <PageShell title="Access Denied">
        <div style={{ padding: '32px', maxWidth: '600px', margin: '0 auto' }}>
          <Alert
            message="Access Denied"
            description={
              user?.role === 'Doctor'
                ? "You don&apos;tt have permission to view this patient's details. You can only view patients assigned to you."
                : 'Patient not found or you do not have permission to view this page.'
            }
            type="warning"
            showIcon
            icon={<WarningOutlined />}
            action={
              <Button type="primary" onClick={() => router.back()}>
                Go Back
              </Button>
            }
            style={{
              borderRadius: '12px',
              border: '1px solid #FDE68A',
            }}
          />
        </div>
      </PageShell>
    );
  }

  // Medical history using real doctor names from mockData
  const medicalHistory = [
    { date: '2024-01-25', condition: 'Hypertension follow-up', doctor: `Dr. ${mockDoctors[0].firstName} ${mockDoctors[0].lastName}` },
    { date: '2024-01-10', condition: 'Annual checkup', doctor: `Dr. ${mockDoctors[1].firstName} ${mockDoctors[1].lastName}` },
    { date: '2023-11-15', condition: 'Chest pain evaluation', doctor: `Dr. ${mockDoctors[0].firstName} ${mockDoctors[0].lastName}` },
    { date: '2023-08-20', condition: 'Diabetes screening', doctor: `Dr. ${mockDoctors[3].firstName} ${mockDoctors[3].lastName}` },
  ];

  const recentVisits = [
    { date: '2024-01-25', department: 'Cardiology', doctor: `Dr. ${mockDoctors[0].firstName} ${mockDoctors[0].lastName}`, diagnosis: 'Hypertension', status: 'completed' },
    { date: '2024-01-10', department: 'General Medicine', doctor: `Dr. ${mockDoctors[1].firstName} ${mockDoctors[1].lastName}`, diagnosis: 'Routine checkup', status: 'completed' },
    { date: '2023-11-15', department: 'Emergency', doctor: `Dr. ${mockDoctors[0].firstName} ${mockDoctors[0].lastName}`, diagnosis: 'Chest pain', status: 'completed' },
  ];

  return (
    <PageShell
      title={`${patient.firstName} ${patient.lastName}`}
      subtitle={`MRN: ${patient.mrn}`}
      action={
        <Space>
          <Button
            icon={<CalendarOutlined />}
            onClick={() => router.push(`/patients/appointments/new?patientId=${patient.id}`)}
            style={{
              height: '42px',
              borderRadius: '10px',
              fontWeight: 600,
              padding: '0 20px',
            }}
          >
            Book Appointment
          </Button>
          <GradientButton icon={<EditOutlined />} onClick={() => router.push(`/patients/${patient.id}/edit`)}>
            Edit Patient
          </GradientButton>
        </Space>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Age"
          value={calculateAge(patient.dateOfBirth)}
          suffix=" years"
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Total Visits"
          value={12}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#A7F3D0"
          index={1}
        />
        <StatCard
          label="Active Conditions"
          value={patient.chronicConditions.length}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FDE68A"
          index={2}
        />
        <StatCard
          label="Known Allergies"
          value={patient.allergies.length}
          color={patient.allergies.length > 0 ? '#EF4444' : '#8B5CF6'}
          bg={patient.allergies.length > 0
            ? 'linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)'
            : 'linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)'
          }
          border={patient.allergies.length > 0 ? '#FCA5A5' : '#DDD6FE'}
          index={3}
        />
      </div>

      {/* Patient Overview Card */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
        <Row gutter={24}>
          <Col xs={24} md={6} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'white',
                fontSize: '36px',
                fontWeight: 700,
              }}
            >
              {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
            </div>
            <Title level={4} className="!mb-1">
              {patient.firstName} {patient.lastName}
            </Title>
            <Text type="secondary" style={{ fontSize: '13px' }}>{patient.mrn}</Text>
            <div style={{ marginTop: '12px' }}>
              <StatusTag status={patient.status} type="patient" />
            </div>
          </Col>
          <Col xs={24} md={18}>
            <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
              <Descriptions.Item label="Age">{calculateAge(patient.dateOfBirth)} years</Descriptions.Item>
              <Descriptions.Item label="Gender">{patient.gender.toUpperCase()}</Descriptions.Item>
              <Descriptions.Item label="Blood Group">{patient.bloodGroup || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Contact">{patient.contactNumber}</Descriptions.Item>
              <Descriptions.Item label="Email">{patient.email || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Registered">{formatDate(patient.registeredDate)}</Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </div>

      {/* Detailed Information Tabs */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
        <Tabs
          defaultActiveKey="overview"
          items={[
            {
              key: 'overview',
              label: 'Overview',
              children: (
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <InfoCard
                      title="Personal Information"
                      icon={<IdcardOutlined />}
                      color="#3B82F6"
                    >
                      <Space direction="vertical" className="w-full" size="middle">
                        <div>
                          <Text type="secondary">Full Name</Text>
                          <br />
                          <Text strong style={{ fontSize: '15px' }}>{patient.firstName} {patient.lastName}</Text>
                        </div>
                        <div>
                          <Text type="secondary">Date of Birth</Text>
                          <br />
                          <Text style={{ fontSize: '14px' }}>{formatDate(patient.dateOfBirth)}</Text>
                        </div>
                        <div>
                          <Text type="secondary">Gender</Text>
                          <br />
                          <Text style={{ fontSize: '14px' }}>{patient.gender.toUpperCase()}</Text>
                        </div>
                      </Space>
                    </InfoCard>
                  </Col>
                  <Col xs={24} md={12}>
                    <InfoCard
                      title="Contact Information"
                      icon={<PhoneOutlined />}
                      color="#10B981"
                    >
                      <Space direction="vertical" className="w-full" size="middle">
                        <div className="flex items-center gap-2">
                          <PhoneOutlined className="text-gray-400" />
                          <Text style={{ fontSize: '14px' }}>{patient.contactNumber}</Text>
                        </div>
                        {patient.email && (
                          <div className="flex items-center gap-2">
                            <MailOutlined className="text-gray-400" />
                            <Text style={{ fontSize: '14px' }}>{patient.email}</Text>
                          </div>
                        )}
                        <div>
                          <Text type="secondary">Address</Text>
                          <br />
                          <Text style={{ fontSize: '14px' }}>
                            {patient.address.street}
                            <br />
                            {patient.address.city}, {patient.address.state} {patient.address.zipCode}
                          </Text>
                        </div>
                      </Space>
                    </InfoCard>
                  </Col>
                  <Col xs={24} md={12}>
                    <InfoCard
                      title="Emergency Contact"
                      icon={<WarningOutlined />}
                      color="#EF4444"
                    >
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Name">{patient.emergencyContact.name}</Descriptions.Item>
                        <Descriptions.Item label="Relationship">{patient.emergencyContact.relationship}</Descriptions.Item>
                        <Descriptions.Item label="Contact">{patient.emergencyContact.contactNumber}</Descriptions.Item>
                      </Descriptions>
                    </InfoCard>
                  </Col>
                  <Col xs={24} md={12}>
                    <InfoCard
                      title="Insurance Information"
                      icon={<IdcardOutlined />}
                      color="#8B5CF6"
                    >
                      {patient.insurance ? (
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="Provider">{patient.insurance.provider}</Descriptions.Item>
                          <Descriptions.Item label="Policy Number">{patient.insurance.policyNumber}</Descriptions.Item>
                          <Descriptions.Item label="Expiry">{formatDate(patient.insurance.expiryDate)}</Descriptions.Item>
                        </Descriptions>
                      ) : (
                        <Text type="secondary">No insurance information available</Text>
                      )}
                    </InfoCard>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'medical',
              label: 'Medical History',
              children: (
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <InfoCard
                      title="Known Allergies"
                      icon={<WarningOutlined />}
                      color={patient.allergies.length > 0 ? '#EF4444' : '#10B981'}
                    >
                      {patient.allergies.length > 0 ? (
                        <Space wrap>
                          {patient.allergies.map((allergy: string, index: number) => (
                            <Tag
                              key={index}
                              style={{
                                padding: '4px 12px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontWeight: 500,
                              }}
                              color="error"
                            >
                              {allergy}
                            </Tag>
                          ))}
                        </Space>
                      ) : (
                        <Text type="secondary">No known allergies</Text>
                      )}
                    </InfoCard>
                  </Col>
                  <Col xs={24} md={12}>
                    <InfoCard
                      title="Chronic Conditions"
                      icon={<IdcardOutlined />}
                      color="#F59E0B"
                    >
                      {patient.chronicConditions.length > 0 ? (
                        <Space wrap>
                          {patient.chronicConditions.map((condition: string, index: number) => (
                            <Tag
                              key={index}
                              style={{
                                padding: '4px 12px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontWeight: 500,
                              }}
                              color="warning"
                            >
                              {condition}
                            </Tag>
                          ))}
                        </Space>
                      ) : (
                        <Text type="secondary">No chronic conditions</Text>
                      )}
                    </InfoCard>
                  </Col>
                  <Col xs={24}>
                    <InfoCard
                      title="Medical History Timeline"
                      icon={<CalendarOutlined />}
                      color="#3B82F6"
                    >
                      <Timeline
                        items={medicalHistory.map((item) => ({
                          children: (
                            <div>
                              <Text strong>{item.condition}</Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: '13px' }}>{item.date} | {item.doctor}</Text>
                            </div>
                          ),
                        }))}
                      />
                    </InfoCard>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'visits',
              label: 'Recent Visits',
              children: (
                <Row gutter={16}>
                  {recentVisits.map((visit, index) => (
                    <Col xs={24} md={8} key={index}>
                      <div
                        style={{
                          padding: '16px',
                          background: 'white',
                          borderRadius: '10px',
                          border: '1px solid #E2E8F0',
                          marginBottom: '16px',
                        }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div style={{ flex: 1 }}>
                            <Text strong style={{ fontSize: '15px', display: 'block', marginBottom: '4px' }}>
                              {visit.diagnosis}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '13px' }}>
                              {visit.department} • {visit.doctor}
                            </Text>
                          </div>
                          <StatusTag status={visit.status} type="appointment" />
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarOutlined style={{ color: '#64748B', fontSize: '13px' }} />
                          <Text type="secondary" style={{ fontSize: '13px' }}>{visit.date}</Text>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              ),
            },
            {
              key: 'documents',
              label: 'Documents',
              children: (
                <div
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                    borderRadius: '10px',
                  }}
                >
                  <IdcardOutlined style={{ fontSize: '48px', color: '#CBD5E1', marginBottom: '16px' }} />
                  <div className="text-lg font-semibold text-gray-700 mb-2">No documents uploaded yet</div>
                  <div className="text-sm text-gray-500">Documents will appear here once uploaded</div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </PageShell>
  );
}
