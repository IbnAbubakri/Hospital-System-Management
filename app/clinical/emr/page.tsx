'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  Input,
  Select,
  Button,
  Tag,
  DatePicker,
  Drawer,
  Descriptions,
  Typography,
} from 'antd';
import {
  EyeOutlined,
  SearchOutlined,
  PlusOutlined,
  FileTextOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { mockPatients, mockDoctors } from '@/lib/mockData';
import { formatDate, calculateAge } from '@/lib/utils';
import dayjs from 'dayjs';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterEMRsByUser } from '@/lib/dataFilters';
import { getDepartmentColors } from '@/lib/departmentColors';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

export default function EMRPage() {
  const router = useRouter();
  const { user, getUserFullName } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [doctorFilter, setDoctorFilter] = useState<string | undefined>();
  const [dateFilter, setDateFilter] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedEMR, setSelectedEMR] = useState<any>(null);

  // Animated stats
  const [animatedStats, setAnimatedStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
    completed: 0,
  });

  // Create EMR records using real patient and doctor data from mockData
  const emrList = React.useMemo(() => {
    // Helper function to get doctor name and department
    const getDoctorInfo = (doctorId: string) => {
      const doctor = mockDoctors.find(d => d.id === doctorId);
      return {
        doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor',
        department: doctor?.department || 'General Medicine',
      };
    };

    // Helper function to get patient info
    const getPatientInfo = (patientId: string) => {
      const patient = mockPatients.find(p => p.id === patientId);
      if (!patient) return null;
      return {
        patientName: `${patient.firstName} ${patient.lastName}`,
        mrn: patient.mrn,
        age: calculateAge(patient.dateOfBirth),
        gender: patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1),
        bloodGroup: patient.bloodGroup,
      };
    };

    // EMR clinical data template (medical records with associated patient and doctor IDs)
    const emrTemplates = [
      {
        id: '1',
        patientId: '1',
        doctorId: 'd1',
        date: '2024-02-01',
        time: '10:30 AM',
        chiefComplaint: 'Chest pain and shortness of breath, worsening with exertion over the past 2 weeks',
        diagnosis: 'Hypertension Stage 2 with Type 2 Diabetes Mellitus',
        status: 'completed',
        vitals: { temperature: '37.1°C', pulse: '88 bpm', bp: '148/94 mmHg', respiratoryRate: '18/min', spo2: '97%', height: '175 cm', weight: '82 kg', bmi: '26.8' },
        physicalExam: { general: 'Conscious, oriented, well-built, no acute distress', cardiovascular: 'S1S2 heard, no murmurs, PMI displaced', respiratory: 'Clear bilaterally, good air entry', abdomen: 'Soft, non-tender, no organomegaly', cns: 'Alert and oriented x3' },
        treatment: 'Prescribed Amlodipine 10mg daily, Metformin 500mg twice daily. Lifestyle modifications advised. Regular BP and blood sugar monitoring.',
        followUp: '2024-02-15',
        notes: 'Patient educated on DASH diet and importance of medication adherence.',
      },
      {
        id: '2',
        patientId: '2',
        doctorId: 'd2',
        date: '2024-02-01',
        time: '11:45 AM',
        chiefComplaint: 'High fever, body aches, fatigue, and loss of appetite for 3 days',
        diagnosis: 'Viral infection (Dengue suspected)',
        status: 'pending',
        vitals: { temperature: '39.2°C', pulse: '108 bpm', bp: '105/68 mmHg', respiratoryRate: '22/min', spo2: '96%', height: '162 cm', weight: '58 kg', bmi: '22.1' },
        physicalExam: { general: 'Febrile, lethargic, appears unwell', cardiovascular: 'Tachycardic, regular rhythm', respiratory: 'Clear, mild tachypnea', abdomen: 'Mild tenderness in right upper quadrant', skin: 'Flushed, no rash noted' },
        treatment: 'Blood samples sent for full blood count, dengue serology, liver function tests. Supportive care with antipyretics. IV fluids started.',
        followUp: '2024-02-03',
        notes: 'Monitor for warning signs. CBC to be repeated every 6 hours.',
      },
      {
        id: '3',
        patientId: '3',
        doctorId: 'd3',
        date: '2024-02-01',
        time: '09:00 AM',
        chiefComplaint: 'Severe knee pain, stiffness in both knees, especially in the morning',
        diagnosis: 'Osteoarthritis - Bilateral Knee',
        status: 'completed',
        vitals: { temperature: '36.8°C', pulse: '72 bpm', bp: '138/82 mmHg', respiratoryRate: '16/min', spo2: '99%', height: '168 cm', weight: '85 kg', bmi: '30.1' },
        physicalExam: { general: 'Well-nourished, cooperative', cardiovascular: 'Normal', respiratory: 'Normal', msk: 'Bilateral knee crepitus, decreased range of motion, tenderness along joint line. Heberden nodes present.', abdomen: 'Normal' },
        treatment: 'NSAIDs prescribed, physiotherapy recommended. Weight loss advised. Knee X-rays done showing joint space narrowing.',
        followUp: '2024-02-15',
        notes: 'Patient referred for orthopedic surgery evaluation. Viscosupplementant injection discussed.',
      },
      {
        id: '4',
        patientId: '4',
        doctorId: 'd5',
        date: '2024-02-01',
        time: '02:30 PM',
        chiefComplaint: 'Severe throbbing headache on right side, sensitivity to light and sound',
        diagnosis: 'Migraine with Aura',
        status: 'completed',
        vitals: { temperature: '36.9°C', pulse: '78 bpm', bp: '122/78 mmHg', respiratoryRate: '16/min', spo2: '99%', height: '165 cm', weight: '55 kg', bmi: '20.2' },
        physicalExam: { general: 'Alert but uncomfortable, photophobic during exam', cardiovascular: 'Normal', respiratory: 'Normal', neurological: 'Cranial nerves II-XII intact, no focal deficits. Motor strength normal.', abdomen: 'Normal' },
        treatment: 'Sumatriptan 100mg prescribed for acute attacks. MRI brain ordered. Propranolol 40mg for prophylaxis.',
        followUp: '2024-02-08',
        notes: 'Patient advised to maintain headache diary. Triggers identified: lack of sleep, stress, certain foods.',
      },
      {
        id: '5',
        patientId: '5',
        doctorId: 'd1',
        date: '2024-01-31',
        time: '04:00 PM',
        chiefComplaint: 'Burning epigastric pain after meals, especially spicy foods',
        diagnosis: 'Gastritis with H. Pylori infection',
        status: 'completed',
        vitals: { temperature: '37.0°C', pulse: '74 bpm', bp: '125/80 mmHg', respiratoryRate: '16/min', spo2: '99%', height: '180 cm', weight: '78 kg', bmi: '24.1' },
        physicalExam: { general: 'Normal', cardiovascular: 'Regular rhythm, no murmurs', respiratory: 'Normal', abdomen: 'Epigastric tenderness present, no guarding or rebound' },
        treatment: 'H. pylori test positive. Triple therapy prescribed: Clarithromycin 500mg, Amoxicillin 1g, Omeprazole 20mg - all twice daily for 14 days.',
        followUp: '2024-02-14',
        notes: 'Patient advised to avoid NSAIDs, alcohol, spicy foods until treatment complete.',
      },
      {
        id: '6',
        patientId: '6',
        doctorId: 'd4',
        date: '2024-02-02',
        time: '11:00 AM',
        chiefComplaint: 'Runny nose, cough, mild fever, poor appetite for 2 days',
        diagnosis: 'Upper Respiratory Tract Infection (URTI)',
        status: 'completed',
        vitals: { temperature: '38.4°C', pulse: '95 bpm', bp: '98/60 mmHg', respiratoryRate: '20/min', spo2: '98%', height: '155 cm', weight: '52 kg', bmi: '21.6' },
        physicalExam: { general: 'Mild distress, well-hydrated', cardiovascular: 'Tachycardic, regular rhythm', respiratory: 'Clear bilaterally, mild wheezing heard', ent: 'Throat erythema, tonsils enlarged', abdomen: 'Normal' },
        treatment: 'Supportive care: paracetamol syrup, nasal decongestant, warm fluids. No antibiotics needed at this time.',
        followUp: '2024-02-05',
        notes: 'Mother educated on warning signs: high fever >39°C, difficulty breathing, poor oral intake.',
      },
      // Pediatric EMRs for Dr. Aisha Yusuf
      {
        id: '7',
        patientId: '7',
        doctorId: 'd4',
        date: '2024-02-01',
        time: '09:30 AM',
        chiefComplaint: 'Coughing and wheezing at night, difficulty breathing when lying down',
        diagnosis: 'Childhood Asthma Exacerbation',
        status: 'completed',
        vitals: { temperature: '37.2°C', pulse: '110 bpm', bp: '90/60 mmHg', respiratoryRate: '26/min', spo2: '95%', height: '110 cm', weight: '18 kg', bmi: '14.9' },
        physicalExam: { general: 'Alert, cooperative', cardiovascular: 'Tachycardic, regular rhythm', respiratory: 'Bilateral wheezing, prolonged expiration, chest hyperresonance', ent: 'Nasal turbinate swelling, allergic shiners', abdomen: 'Soft, non-tender' },
        treatment: 'Albuterol nebulizer given. Prescribed Flovent 44mcg twice daily. Montelukast 4mg chewable at bedtime. Avoid peanuts (known allergy).',
        followUp: '2024-02-08',
        notes: 'Mother educated on asthma triggers, proper inhaler technique, and asthma action plan.',
      },
      {
        id: '8',
        patientId: '8',
        doctorId: 'd4',
        date: '2024-02-03',
        time: '10:00 AM',
        chiefComplaint: 'School physical examination, no complaints',
        diagnosis: 'Routine Health Supervision - Well Child',
        status: 'completed',
        vitals: { temperature: '36.8°C', pulse: '82 bpm', bp: '100/65 mmHg', respiratoryRate: '18/min', spo2: '99%', height: '145 cm', weight: '38 kg', bmi: '18.1' },
        physicalExam: { general: 'Well-developed, well-nourished', cardiovascular: 'Regular rhythm, no murmurs', respiratory: 'Clear bilaterally', ent: 'Normal', abdomen: 'Soft, no organomegaly', skin: 'No rashes', neurological: 'Age appropriate' },
        treatment: 'All vaccinations up to date. Vision and hearing screening normal. Discuss nutrition and exercise. BMI within normal range.',
        followUp: '2024-08-03',
        notes: 'Annual physical exam completed. No concerns.',
      },
      {
        id: '9',
        patientId: '9',
        doctorId: 'd4',
        date: '2024-02-02',
        time: '02:00 PM',
        chiefComplaint: 'Itchy eyes, runny nose, and sneezing, especially in the morning',
        diagnosis: 'Allergic Rhinitis',
        status: 'completed',
        vitals: { temperature: '37.0°C', pulse: '88 bpm', bp: '95/60 mmHg', respiratoryRate: '20/min', spo2: '98%', height: '122 cm', weight: '23 kg', bmi: '15.5' },
        physicalExam: { general: 'Alert, no distress', cardiovascular: 'Normal', respiratory: 'Nasal congestion, pale swollen nasal mucosa', ent: 'Allergic shiners, dark circles under eyes, tonsils not enlarged', skin: 'Dry skin, eczema patches on elbows' },
        treatment: 'Cetirizine 5mg daily prescribed. Nasal corticosteroid spray for congestion. Moisturizer for eczema. Allergy testing recommended.',
        followUp: '2024-02-15',
        notes: 'Parents educated on avoiding dust mites and pollen triggers. Regular vacuuming and washing bedding recommended.',
      },
    ];

    // Merge EMR templates with actual patient and doctor data from mockData
    return emrTemplates.map(emr => {
      const patientInfo = getPatientInfo(emr.patientId);
      const doctorInfo = getDoctorInfo(emr.doctorId);

      if (!patientInfo) return null;

      return {
        ...emr,
        ...patientInfo,
        ...doctorInfo,
      };
    }).filter(Boolean);
  }, [mockPatients, mockDoctors]);

  // Filter EMR list based on logged-in user (must be declared before stats)
  const userFilteredEMR = useMemo(() => {
    if (!user) return [];
    return filterEMRsByUser(user, emrList);
  }, [user, emrList]);

  // Calculate statistics - use filtered EMRs based on logged-in user
  const stats = React.useMemo(() => {
    const sourceList = userFilteredEMR;
    return {
      total: sourceList.length,
      today: sourceList.filter((emr: any) => {
        const emrDate = new Date(emr.date);
        const todayDate = new Date();
        return (
          emrDate.getDate() === todayDate.getDate() &&
          emrDate.getMonth() === todayDate.getMonth() &&
          emrDate.getFullYear() === todayDate.getFullYear()
        );
      }).length,
      pending: sourceList.filter((emr: any) => emr.status === 'pending').length,
      completed: sourceList.filter((emr: any) => emr.status === 'completed').length,
    };
  }, [userFilteredEMR]);

  // Animate stats on mount
  React.useEffect(() => {
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
        total: Math.round(currentValues.total + (targets.total - currentValues.total) * easeProgress),
        today: Math.round(currentValues.today + (targets.today - currentValues.today) * easeProgress),
        pending: Math.round(currentValues.pending + (targets.pending - currentValues.pending) * easeProgress),
        completed: Math.round(currentValues.completed + (targets.completed - currentValues.completed) * easeProgress),
      });

      if (step >= steps) {
        clearInterval(interval);
        setAnimatedStats(targets);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [stats]);

  // Get department colors
  const departmentColors = user?.department ? getDepartmentColors(user.department) : null;

  // Filter EMR list by search, doctor, and date (applied after user filtering)
  const filteredEMR = React.useMemo(() => {
    const sourceList = userFilteredEMR;
    return sourceList.filter((emr: any) => {
      const matchesSearch =
        emr.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
        emr.mrn.toLowerCase().includes(searchText.toLowerCase()) ||
        emr.chiefComplaint.toLowerCase().includes(searchText.toLowerCase()) ||
        emr.diagnosis.toLowerCase().includes(searchText.toLowerCase()) ||
        emr.doctor.toLowerCase().includes(searchText.toLowerCase());

      // For doctors, don't show doctor filter (they only see their own EMRs)
      const matchesDoctor = user?.role === 'Doctor' ? true : (!doctorFilter || emr.doctor.includes(doctorFilter));

      const matchesDate =
        !dateFilter ||
        emr.date === dateFilter.format('YYYY-MM-DD');

      return matchesSearch && matchesDoctor && matchesDate;
    });
  }, [searchText, doctorFilter, dateFilter, userFilteredEMR, user]);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string, record: any) => (
        <div>
          <div className="text-sm text-gray-900">{formatDate(date)}</div>
          <div className="text-xs text-gray-500">{record.time}</div>
        </div>
      ),
      width: 120,
    },
    {
      title: 'Patient',
      key: 'patient',
      render: (_: unknown, record: any) => (
        <div>
          <div className="font-medium text-gray-900">{record.patientName}</div>
          <div className="text-xs text-gray-500">{record.mrn}</div>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
      render: (doctor: string) => <span className="text-sm">{doctor}</span>,
      width: 200,
    },
    {
      title: 'Chief Complaint',
      dataIndex: 'chiefComplaint',
      key: 'chiefComplaint',
      ellipsis: true,
      render: (text: string) => <span className="text-sm">{text}</span>,
    },
    {
      title: 'Diagnosis',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      render: (diagnosis: string) => (
        <Tag color="blue" className="text-sm">{diagnosis}</Tag>
      ),
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config: Record<string, { color: string; bg: string; text: string }> = {
          completed: { color: '#059669', bg: '#D1FAE5', text: 'Completed' },
          pending: { color: '#D97706', bg: '#FEF3C7', text: 'Pending' },
          in_progress: { color: '#3B82F6', bg: '#DBEAFE', text: 'In Progress' },
        };
        const { color, bg, text } = config[status] || config.pending;
        return (
          <Tag
            style={{
              backgroundColor: bg,
              color,
              border: 'none',
              fontWeight: 500,
              fontSize: '13px',
              padding: '3px 10px',
              borderRadius: '6px',
            }}
          >
            {text}
          </Tag>
        );
      },
      width: 110,
    },
    {
      title: '',
      key: 'actions',
      render: (_: unknown, record: any) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedEMR(record);
            setDrawerVisible(true);
          }}
          className="view-btn"
          style={{ padding: '4px 8px' }}
        >
          View
        </Button>
      ),
      width: 80,
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)' }}>
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .page-content { animation: fadeInUp 0.5s ease-out forwards; }
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
        .stat-card:hover { transform: translateY(-4px); transition: transform 0.3s ease; box-shadow: 0 12px 24px -8px var(--card-color); }
        .stat-number { transition: transform 0.3s ease; }
        .stat-card:hover .stat-number { transform: scale(1.1); }
        .ant-table-tbody > tr { transition: all 0.2s ease; }
        .ant-table-tbody > tr:hover > td { background: linear-gradient(90deg, #EFF6FF 0%, #F0F9FF 100%) !important; }
        .view-btn { transition: all 0.2s ease; }
        .view-btn:hover { background: #DBEAFE !important; color: #1D4ED8 !important; transform: scale(1.05); }
        .ant-btn-primary { transition: all 0.3s ease !important; background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%) !important; border: none !important; }
        .ant-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4) !important; background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%) !important; }
        .ant-table-thead > tr > th { background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%) !important; border-bottom: 2px solid #E2E8E0 !important; font-weight: 600; color: #1E293B; padding: 14px 16px !important; font-size: 13px; }
        .ant-table-tbody > tr > td { padding: 12px 16px !important; border-bottom: 1px solid #F1F5F9 !important; font-size: 14px; }
        .ant-select-selector, .ant-input { border-radius: 8px !important; transition: all 0.2s ease !important; border: 1px solid #E2E8E0 !important; }
        .ant-select:hover .ant-select-selector, .ant-input:hover { border-color: #3B82F6 !important; }
        .ant-select-focused .ant-select-selector, .ant-input:focus { border-color: #3B82F6 !important; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important; }
      `}</style>

      {/* Header Section */}
      <div style={{
        padding: '32px',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        borderBottom: '1px solid #E2E8E0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div className="page-content" style={{ animationDelay: '0s', position: 'relative', zIndex: 1 }}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <div className="flex items-center gap-3">
                <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)', borderRadius: '2px' }} />
                <h1 className="text-2xl font-semibold text-gray-900">Electronic Medical Records</h1>
                {user?.role === 'Doctor' && (
                  <Text style={{ color: '#64748B', fontSize: '14px' }}>
                    ({getUserFullName()}'s Records)
                  </Text>
                )}
              </div>
              <p className="text-gray-500 text-sm" style={{ marginLeft: '7px' }}>
                {user?.role === 'Administrator'
                  ? 'View and manage all patient medical records and documentation'
                  : `View and manage your ${userFilteredEMR.length} medical record${userFilteredEMR.length !== 1 ? 's' : ''}`
                }
              </p>
              {user?.role === 'Doctor' && (
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  background: departmentColors?.bg || 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                  borderRadius: '8px',
                  border: `1px solid ${departmentColors?.border || '#BFDBFE'}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <WarningOutlined style={{ color: departmentColors?.text || '#1D4ED8', fontSize: '14px' }} />
                  <Text style={{ color: departmentColors?.text || '#1E40AF', fontSize: '13px', fontWeight: 500 }}>
                    You can only view EMRs you created
                  </Text>
                </div>
              )}
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push('/clinical/consultation')}
              style={{ height: '42px', borderRadius: '10px', fontWeight: 600, padding: '0 20px' }}
            >
              New EMR
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ padding: '24px 32px 0' }}>
        <div className="grid grid-cols-4 gap-5 page-content" style={{ animationDelay: '0.1s' }}>
          {[
            { label: 'Total Records', value: animatedStats.total, color: '#3B82F6', bg: '#EFF6FF', border: '#DBEAFE' },
            { label: "Today's EMRs", value: animatedStats.today, color: '#10B981', bg: '#D1FAE5', border: '#A7F3D0' },
            { label: 'Pending', value: animatedStats.pending, color: '#F59E0B', bg: '#FEF3C7', border: '#FDE68A' },
            { label: 'Completed', value: animatedStats.completed, color: '#8B5CF6', bg: '#EDE9FE', border: '#DDD6FE' },
          ].map((stat, index) => (
            <div
              key={index}
              className="stat-card"
              style={{ padding: '16px', borderRadius: '12px', background: `linear-gradient(135deg, ${stat.bg} 0%, rgba(255,255,255,0.8) 100%)`, border: `1px solid ${stat.border}`, cursor: 'default' }}
            >
              <div className="text-sm font-medium" style={{ color: '#64748B', marginBottom: '6px' }}>{stat.label}</div>
              <div className="stat-number" style={{ fontSize: '28px', fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-8 py-6 page-content" style={{ animationDelay: '0.2s' }}>
        {/* Search and Filter Bar */}
        <div className="flex items-center gap-3 mb-6 p-4" style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8E0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <div className="flex-1">
            <Search
              placeholder="Search EMR by patient, diagnosis, doctor, or complaint..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ borderRadius: '8px' }}
            />
          </div>
          <Select placeholder="Filter by Doctor" value={doctorFilter} onChange={setDoctorFilter} allowClear style={{ width: 220 }}>
            {mockDoctors.map((d) => (
              <Option key={d.id} value={`${d.firstName} ${d.lastName}`}>Dr. {d.firstName} {d.lastName} - {d.department}</Option>
            ))}
          </Select>
          <DatePicker value={dateFilter} onChange={setDateFilter} placeholder="Filter by Date" style={{ width: 150 }} />
          <div style={{ padding: '8px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', border: '1px solid #BFDBFE' }}>
            <span className="text-sm font-medium" style={{ color: '#1D4ED8' }}>{filteredEMR.length} records</span>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8E0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <Table
            dataSource={filteredEMR}
            columns={columns}
            rowKey="id"
            pagination={{ defaultPageSize: 10, showSizeChanger: true, showTotal: (total) => `${total} EMR records`, pageSizeOptions: ['10', '20', '50'] }}
          />
        </div>
      </div>

      {/* EMR Detail Drawer */}
      <Drawer
        title={null}
        placement="right"
        size="large"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedEMR && (
          <div>
            <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E2E8E0' }}>
              <Title level={4} style={{ margin: 0, marginBottom: '8px' }}>{selectedEMR.patientName}</Title>
              <Text type="secondary">{selectedEMR.mrn} • {selectedEMR.age} years • {selectedEMR.gender} • {selectedEMR.bloodGroup}</Text>
            </div>

            <Descriptions title="Visit Information" bordered column={1} size="small">
              <Descriptions.Item label="Date & Time">{selectedEMR.date} at {selectedEMR.time}</Descriptions.Item>
              <Descriptions.Item label="Attending Doctor">{selectedEMR.doctor}</Descriptions.Item>
              <Descriptions.Item label="Department">{selectedEMR.department}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: '24px' }}>
              <Title level={5}>Chief Complaint</Title>
              <p style={{ background: '#FEF3C7', padding: '12px', borderRadius: '8px', border: '1px solid #FDE68A' }}>{selectedEMR.chiefComplaint}</p>
            </div>

            <div style={{ marginTop: '24px' }}>
              <Title level={5}>Diagnosis</Title>
              <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>{selectedEMR.diagnosis}</Tag>
            </div>

            <div style={{ marginTop: '24px' }}>
              <Title level={5}>Vital Signs</Title>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '12px' }}>
                {Object.entries(selectedEMR.vitals).map(([key, value]) => (
                  <div key={key} style={{ background: '#F3F4F6', padding: '12px', borderRadius: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '12px', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</Text>
                    <div style={{ fontWeight: 600, color: '#1E293B' }}>{value as string}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <Title level={5}>Physical Examination</Title>
              {Object.entries(selectedEMR.physicalExam).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '12px' }}>
                  <Text strong style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}:</Text>
                  <p style={{ margin: '4px 0', color: '#475569' }}>{value as string}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px' }}>
              <Title level={5}>Treatment Plan</Title>
              <p style={{ background: '#EFF6FF', padding: '12px', borderRadius: '8px', border: '1px solid #DBEAFE' }}>{selectedEMR.treatment}</p>
            </div>

            <div style={{ marginTop: '24px' }}>
              <Title level={5}>Follow-up</Title>
              <Text>{selectedEMR.followUp}</Text>
            </div>

            <div style={{ marginTop: '24px' }}>
              <Title level={5}>Notes</Title>
              <p style={{ color: '#475569' }}>{selectedEMR.notes}</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
