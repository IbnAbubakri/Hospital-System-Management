'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  Tabs,
  Button,
  Select,
  Input,
  message,
  Row,
  Col,
  Tag,
  Avatar,
  Typography,
  Divider,
} from 'antd';
import {
  UserOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  HeartOutlined,
  HistoryOutlined,
  PlusOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { mockPatients, mockDoctors } from '@/lib/mockData';
import { EMRForm } from '@/components/clinical/EMRForm';
import { PrescriptionForm } from '@/components/clinical/PrescriptionForm';
import { calculateAge, formatDate } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser } from '@/lib/dataFilters';
import { getDepartmentColors } from '@/lib/departmentColors';

const { Option } = Select;
const { Title, Text } = Typography;

export default function ConsultationPage() {
  const router = useRouter();
  const { user, getUserFullName } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>(user?.role === 'Doctor' ? user.id : 'd1');
  const [activeTab, setActiveTab] = useState('emr');
  const [mounted, setMounted] = useState(false);

  // Animated stats
  const [animatedStats, setAnimatedStats] = useState({
    today: 0,
    pending: 0,
    completed: 0,
    patients: 0,
  });

  // Get patients accessible to logged-in user
  const accessiblePatients = useMemo(() => {
    if (!user) return [];
    return filterPatientsByUser(user);
  }, [user]);

  // Get accessible doctors (all doctors for admin, only logged-in doctor for doctors)
  const accessibleDoctors = useMemo(() => {
    if (!user) return [];
    if (user.role === 'Administrator') {
      return mockDoctors;
    }
    // Doctors can only select themselves
    return mockDoctors.filter(d => d.id === user.id);
  }, [user]);

  // Calculate statistics based on accessible data
  const stats = useMemo(() => {
    return {
      today: user?.role === 'Doctor' ? Math.floor(Math.random() * 10) + 1 : 127,
      pending: user?.role === 'Doctor' ? Math.floor(Math.random() * 5) : 23,
      completed: user?.role === 'Doctor' ? accessiblePatients.length * 2 : 104,
      patients: accessiblePatients.length,
    };
  }, [accessiblePatients, user]);

  // Get department colors
  const departmentColors = user?.department ? getDepartmentColors(user.department) : null;

  // Animate stats on mount
  useEffect(() => {
    setMounted(true);
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;

    const currentValues = { ...animatedStats };
    const targets = stats;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        today: Math.round(currentValues.today + (targets.today - currentValues.today) * easeProgress),
        pending: Math.round(currentValues.pending + (targets.pending - currentValues.pending) * easeProgress),
        completed: Math.round(currentValues.completed + (targets.completed - currentValues.completed) * easeProgress),
        patients: Math.round(currentValues.patients + (targets.patients - currentValues.patients) * easeProgress),
      });

      if (step >= steps) {
        clearInterval(interval);
        setAnimatedStats(targets);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const handlePatientChange = (value: string) => {
    setSelectedPatient(value);
  };

  const handleSaveEMR = (values: { [key: string]: string | number }) => {
    message.success('EMR saved successfully!');
  };

  const handleSavePrescription = (values: { [key: string]: string | number }) => {
    message.success('Prescription sent to pharmacy!');
  };

  const patient = mockPatients.find((p) => p.id === selectedPatient);
  const doctor = mockDoctors.find((d) => d.id === selectedDoctor);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)' }}>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .page-content {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .stat-card {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--card-color) 0%, rgba(255,255,255,0.5) 50%, var(--card-color) 100%);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }

        .stat-card:nth-child(1) { animation-delay: 0.1s; --card-color: #3B82F6; }
        .stat-card:nth-child(2) { animation-delay: 0.15s; --card-color: #10B981; }
        .stat-card:nth-child(3) { animation-delay: 0.2s; --card-color: #F59E0B; }
        .stat-card:nth-child(4) { animation-delay: 0.25s; --card-color: #8B5CF6; }

        .stat-card:hover {
          transform: translateY(-4px);
          transition: transform 0.3s ease;
          box-shadow: 0 12px 24px -8px var(--card-color);
        }

        .stat-number {
          transition: transform 0.3s ease;
        }

        .stat-card:hover .stat-number {
          transform: scale(1.1);
        }

        .ant-select-selector {
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
          border: 1px solid #E2E8E0 !important;
        }
        .ant-select:hover .ant-select-selector {
          border-color: #3B82F6 !important;
        }
        .ant-select-focused .ant-select-selector {
          border-color: #3B82F6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }

        .ant-btn-primary {
          transition: all 0.3s ease !important;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%) !important;
          border: none !important;
        }

        .ant-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4) !important;
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%) !important;
        }

        .ant-tabs-tab {
          border-radius: 8px 8px 0 0 !important;
          padding: 12px 20px !important;
          font-weight: 500 !important;
        }

        .ant-tabs-tab-active {
          background: #EFF6FF !important;
        }

        .ant-tabs-ink-bar {
          background: #3B82F6 !important;
        }
      `}</style>

      {/* Header Section */}
      <div style={{
        padding: '32px',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        borderBottom: '1px solid #E2E8E0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          left: '100px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        <div className="page-content" style={{ animationDelay: '0s', position: 'relative', zIndex: 1 }}>
          <div className="flex items-center gap-3 mb-1">
            <div style={{
              width: '4px',
              height: '28px',
              background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)',
              borderRadius: '2px'
            }} />
            <h1 className="text-2xl font-semibold text-gray-900">
              Doctor Consultation
            </h1>
          </div>
          <p className="text-gray-500 text-sm" style={{ marginLeft: '7px' }}>
            Conduct patient consultation and create medical records
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        padding: '24px 32px 0',
      }}>
        <div
          className="grid grid-cols-4 gap-5 page-content"
          style={{ animationDelay: '0.1s' }}
        >
          {[
            { label: "Today's Consultations", value: animatedStats.today, color: '#3B82F6', bg: '#EFF6FF', border: '#DBEAFE' },
            { label: 'Pending EMRs', value: animatedStats.pending, color: '#F59E0B', bg: '#FEF3C7', border: '#FDE68A' },
            { label: 'Completed', value: animatedStats.completed, color: '#10B981', bg: '#D1FAE5', border: '#A7F3D0' },
            { label: 'Total Patients', value: animatedStats.patients, color: '#8B5CF6', bg: '#EDE9FE', border: '#DDD6FE' },
          ].map((stat, index) => (
            <div
              key={index}
              className="stat-card"
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${stat.bg} 0%, rgba(255,255,255,0.8) 100%)`,
                border: `1px solid ${stat.border}`,
                cursor: 'default',
              }}
            >
              <div className="text-sm font-medium" style={{ color: '#64748B', marginBottom: '6px' }}>
                {stat.label}
              </div>
              <div className="stat-number" style={{
                fontSize: '28px',
                fontWeight: 700,
                color: stat.color,
                lineHeight: 1,
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-8 py-6 page-content" style={{ animationDelay: '0.2s' }}>
        {/* Patient & Doctor Selection */}
        <div
          className="flex flex-col gap-4 mb-6"
          style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #E2E8E0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Row gutter={16} style={{ padding: '20px 24px 0' }}>
            <Col xs={24} md={12}>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                  Select Patient {user?.role === 'Doctor' && <Text style={{ color: '#64748B', fontSize: '12px' }}>(Your Patients)</Text>}
                </label>
                <Select
                  placeholder="Search patient by name or MRN"
                  value={selectedPatient}
                  onChange={handlePatientChange}
                  showSearch
                  optionFilterProp="children"
                  className="w-full"
                  size="large"
                  style={{ borderRadius: '8px' }}
                >
                  {accessiblePatients.map((p: any) => (
                    <Option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.mrn})
                    </Option>
                  ))}
                </Select>
                {accessiblePatients.length === 0 && user?.role === 'Doctor' && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    background: '#FEF3C7',
                    borderRadius: '6px',
                    border: '1px solid #FCD34D'
                  }}>
                    <Text style={{ color: '#92400E', fontSize: '12px' }}>
                      No patients assigned to you yet. Contact administration.
                    </Text>
                  </div>
                )}
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                  Attending Doctor {user?.role === 'Doctor' && <Text style={{ color: '#64748B', fontSize: '12px' }}>(You)</Text>}
                </label>
                <Select
                  value={selectedDoctor}
                  onChange={setSelectedDoctor}
                  className="w-full"
                  size="large"
                  disabled={user?.role === 'Doctor'}
                  style={{ borderRadius: '8px' }}
                >
                  {accessibleDoctors.map((d) => (
                    <Option key={d.id} value={d.id}>
                      Dr. {d.firstName} {d.lastName} ({d.department})
                    </Option>
                  ))}
                </Select>
                {user?.role === 'Doctor' && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    background: departmentColors?.bg || 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                    borderRadius: '6px',
                    border: `1px solid ${departmentColors?.border || '#BFDBFE'}`
                  }}>
                    <Text style={{ color: departmentColors?.text || '#1E40AF', fontSize: '12px' }}>
                      You are logged in as <strong>{getUserFullName()}</strong>
                    </Text>
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* Selected Patient Info */}
          {patient && (
            <div
              style={{
                margin: '0 24px 20px',
                padding: '16px',
                background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                borderRadius: '10px',
                border: '1px solid #BFDBFE',
              }}
            >
              <Row gutter={16} align="middle">
                <Col>
                  <Avatar
                    size={56}
                    icon={<UserOutlined />}
                    style={{
                      backgroundColor: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    }}
                  />
                </Col>
                <Col flex="1">
                  <div className="flex items-center gap-3 mb-2">
                    <Title level={5} className="!mb-0">
                      {patient.firstName} {patient.lastName}
                    </Title>
                    <Tag style={{
                      background: '#D1FAE5',
                      color: '#065F46',
                      border: 'none',
                      fontWeight: 500,
                    }}>
                      {patient.mrn}
                    </Tag>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span style={{ color: '#64748B' }}>
                      <strong style={{ color: '#334155' }}>Age:</strong> {calculateAge(patient.dateOfBirth)}y
                    </span>
                    <span style={{ color: '#64748B' }}>
                      <strong style={{ color: '#334155' }}>Gender:</strong> {patient.gender.toUpperCase()}
                    </span>
                    <span style={{ color: '#64748B' }}>
                      <strong style={{ color: '#334155' }}>Blood:</strong> {patient.bloodGroup || 'N/A'}
                    </span>
                    <span style={{ color: '#64748B' }}>
                      <strong style={{ color: '#334155' }}>Phone:</strong> {patient.contactNumber}
                    </span>
                  </div>
                  {patient.allergies.length > 0 && (
                    <div className="mt-2">
                      <Text className="text-xs" style={{ color: '#EF4444', fontWeight: 600 }}>
                        ⚠ ALLERGIES:
                      </Text>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {patient.allergies.map((allergy, index) => (
                          <Tag
                            key={index}
                            style={{
                              background: '#FEE2E2',
                              color: '#DC2626',
                              border: 'none',
                              borderRadius: '6px',
                            }}
                          >
                            {allergy}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                </Col>
                {doctor && (
                  <Col>
                    <div
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar
                          size={32}
                          icon={<MedicineBoxOutlined />}
                          style={{
                            backgroundColor: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          }}
                        />
                        <div>
                          <div className="text-sm font-semibold" style={{ color: '#065F46' }}>
                            Dr. {doctor.firstName} {doctor.lastName}
                          </div>
                          <div className="text-xs" style={{ color: '#64748B' }}>
                            {doctor.department}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          )}
        </div>

        {/* Consultation Content */}
        {patient && doctor ? (
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #E2E8E0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
            }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: 'emr',
                  label: (
                    <span className="flex items-center gap-2">
                      <FileTextOutlined />
                      EMR Documentation
                    </span>
                  ),
                  children: (
                    <div style={{ padding: '24px' }}>
                      <EMRForm
                        patientName={`${patient.firstName} ${patient.lastName}`}
                        patientId={patient.id}
                        onSubmit={handleSaveEMR}
                      />
                    </div>
                  ),
                },
                {
                  key: 'prescription',
                  label: (
                    <span className="flex items-center gap-2">
                      <MedicineBoxOutlined />
                      Prescription
                    </span>
                  ),
                  children: (
                    <div style={{ padding: '24px' }}>
                      <PrescriptionForm onSubmit={handleSavePrescription} />
                    </div>
                  ),
                },
                {
                  key: 'vitals',
                  label: (
                    <span className="flex items-center gap-2">
                      <HeartOutlined />
                      Vitals History
                    </span>
                  ),
                  children: (
                    <div style={{ padding: '24px' }}>
                      <div
                        className="text-center py-12"
                        style={{
                          background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                          borderRadius: '10px',
                        }}
                      >
                        <HeartOutlined style={{ fontSize: '48px', color: '#CBD5E1', marginBottom: '16px' }} />
                        <Title level={5} type="secondary">No previous vitals recorded</Title>
                        <Text type="secondary">Vital signs will be displayed here once recorded</Text>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'history',
                  label: (
                    <span className="flex items-center gap-2">
                      <HistoryOutlined />
                      Medical History
                    </span>
                  ),
                  children: (
                    <div style={{ padding: '24px' }}>
                      {patient.chronicConditions.length > 0 ? (
                        <div>
                          <Title level={5} className="mb-3">Chronic Conditions</Title>
                          <div className="flex flex-wrap gap-2">
                            {patient.chronicConditions.map((condition, index) => (
                              <Tag
                                key={index}
                                style={{
                                  background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                                  color: '#92400E',
                                  border: 'none',
                                  fontWeight: 500,
                                  padding: '6px 14px',
                                  fontSize: '13px',
                                }}
                              >
                                {condition}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div
                          className="text-center py-12"
                          style={{
                            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                            borderRadius: '10px',
                          }}
                        >
                          <HistoryOutlined style={{ fontSize: '48px', color: '#CBD5E1', marginBottom: '16px' }} />
                          <Title level={5} type="secondary">No medical history recorded</Title>
                          <Text type="secondary">Chronic conditions and past medical history will be displayed here</Text>
                        </div>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        ) : (
          <div
            className="text-center py-12"
            style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #E2E8E0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            <UserOutlined style={{ fontSize: '64px', color: '#CBD5E1', marginBottom: '16px' }} />
            <Title level={4} type="secondary">Please select a patient to begin consultation</Title>
            <Text type="secondary">Choose a patient from the dropdown above to start the consultation process</Text>
          </div>
        )}
      </div>
    </div>
  );
}
