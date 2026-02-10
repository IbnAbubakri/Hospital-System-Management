'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  Input,
  Button,
  Tag,
  Select,
  DatePicker,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  CalendarOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { mockAppointments } from '@/lib/mockData';
import { Appointment } from '@/types';
import { formatDate } from '@/lib/utils';
import dayjs from 'dayjs';
import { NewAppointmentModal } from '@/components/patients/NewAppointmentModal';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterAppointmentsByUser } from '@/lib/dataFilters';
import { getDepartmentColors } from '@/lib/departmentColors';

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

export default function AppointmentsPage() {
  const router = useRouter();
  const { user, getUserFullName } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [mounted, setMounted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Count-up animation for stats
  const [animatedStats, setAnimatedStats] = useState({
    total: 0,
    today: 0,
    scheduled: 0,
    confirmed: 0,
  });

  // Get filtered appointments based on logged-in user
  const userAppointments = useMemo(() => {
    if (!user) return [];
    return filterAppointmentsByUser(user, mockAppointments);
  }, [user]);

  // Calculate statistics based on filtered appointments
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const total = userAppointments.length;
    const todayAppointments = userAppointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate.getTime() === today.getTime();
    }).length;
    const scheduled = userAppointments.filter((apt: any) => apt.status === 'scheduled').length;
    const confirmed = userAppointments.filter((apt: any) => apt.status === 'confirmed').length;

    return { total, today: todayAppointments, scheduled, confirmed };
  }, [userAppointments]);

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
      const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out

      setAnimatedStats({
        total: Math.round(currentValues.total + (targets.total - currentValues.total) * easeProgress),
        today: Math.round(currentValues.today + (targets.today - currentValues.today) * easeProgress),
        scheduled: Math.round(currentValues.scheduled + (targets.scheduled - currentValues.scheduled) * easeProgress),
        confirmed: Math.round(currentValues.confirmed + (targets.confirmed - currentValues.confirmed) * easeProgress),
      });

      if (step >= steps) {
        clearInterval(interval);
        setAnimatedStats(targets);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  // Get department colors
  const departmentColors = user?.department ? getDepartmentColors(user.department) : null;

  // Filter appointments (already filtered by user, now applying search/filter)
  const filteredAppointments = useMemo(() => {
    return userAppointments.filter((apt) => {
      const matchesSearch =
        apt.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
        apt.doctorName.toLowerCase().includes(searchText.toLowerCase()) ||
        apt.department.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = !statusFilter || apt.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter, userAppointments]);

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  // Table columns
  const columns = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_: any, record: Appointment) => (
        <div className="patient-name-cell">
          <div className="font-medium text-gray-900">{record.patientName}</div>
          <div className="text-xs text-gray-500">MRN: {record.patientId}</div>
        </div>
      ),
      sorter: (a: Appointment, b: Appointment) =>
        a.patientName.localeCompare(b.patientName),
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
      render: (doctor: string) => <span className="text-sm">{doctor}</span>,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => <span className="text-sm">{dept}</span>,
    },
    {
      title: 'Date & Time',
      key: 'dateTime',
      render: (_: any, record: Appointment) => (
        <span className="text-sm">
          <div>{formatDate(record.date)}</div>
          <div className="text-xs text-gray-500">{record.startTime} - {record.endTime}</div>
        </span>
      ),
      sorter: (a: Appointment, b: Appointment) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap: Record<string, { label: string; color: string; bg: string }> = {
          new: { label: 'New', color: '#3B82F6', bg: '#DBEAFE' },
          followup: { label: 'Follow-up', color: '#8B5CF6', bg: '#EDE9FE' },
          emergency: { label: 'Emergency', color: '#EF4444', bg: '#FEE2E2' },
          consultation: { label: 'Consultation', color: '#10B981', bg: '#D1FAE5' },
        };
        const config = typeMap[type] || typeMap.new;
        return (
          <Tag
            style={{
              backgroundColor: config.bg,
              color: config.color,
              border: 'none',
              fontWeight: 500,
              fontSize: '13px',
              padding: '3px 10px',
              borderRadius: '6px',
            }}
          >
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config: Record<string, { color: string; bg: string; text: string }> = {
          scheduled: { color: '#6B7280', bg: '#F3F4F6', text: 'Scheduled' },
          confirmed: { color: '#10B981', bg: '#D1FAE5', text: 'Confirmed' },
          in_progress: { color: '#F59E0B', bg: '#FEF3C7', text: 'In Progress' },
          completed: { color: '#3B82F6', bg: '#DBEAFE', text: 'Completed' },
          cancelled: { color: '#EF4444', bg: '#FEE2E2', text: 'Cancelled' },
          no_show: { color: '#DC2626', bg: '#FEE2E2', text: 'No Show' },
        };
        const { color, bg, text } = config[status] || config.scheduled;
        return (
          <Tag
            className="status-tag"
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
    },
  ];

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

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
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

        .ant-table-tbody > tr {
          transition: all 0.2s ease;
          animation: fadeIn 0.3s ease-out forwards;
        }

        .ant-table-tbody > tr:nth-child(1) { animation-delay: 0.05s; }
        .ant-table-tbody > tr:nth-child(2) { animation-delay: 0.08s; }
        .ant-table-tbody > tr:nth-child(3) { animation-delay: 0.11s; }
        .ant-table-tbody > tr:nth-child(4) { animation-delay: 0.14s; }
        .ant-table-tbody > tr:nth-child(5) { animation-delay: 0.17s; }

        .ant-table-tbody > tr:hover > td {
          background: linear-gradient(90deg, #EFF6FF 0%, #F0F9FF 100%) !important;
          transform: scale(1.005);
        }

        .patient-name-cell {
          transition: color 0.2s ease;
          position: relative;
        }

        .ant-table-tbody > tr:hover .patient-name-cell {
          color: #2563EB;
        }

        .status-tag {
          transition: all 0.2s ease;
        }

        .status-tag:hover {
          transform: scale(1.05);
          filter: brightness(0.95);
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

        .ant-btn-primary:active {
          transform: translateY(0);
        }

        .ant-table-thead > tr > th {
          background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%) !important;
          border-bottom: 2px solid #E2E8F0 !important;
          font-weight: 600;
          color: #1E293B;
          padding: 14px 16px !important;
          font-size: 13px;
        }
        .ant-table-tbody > tr > td {
          padding: 12px 16px !important;
          border-bottom: 1px solid #F1F5F9 !important;
          font-size: 14px;
        }
        .ant-pagination-item {
          border-radius: 8px !important;
          border: 1px solid #E2E8F0 !important;
          transition: all 0.2s ease !important;
        }
        .ant-pagination-item:hover {
          border-color: #3B82F6 !important;
          color: #3B82F6 !important;
          background: #EFF6FF !important;
        }
        .ant-pagination-item-active {
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%) !important;
          border-color: #3B82F6 !important;
        }
        .ant-select-selector {
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
          border: 1px solid #E2E8F0 !important;
        }
        .ant-select:hover .ant-select-selector {
          border-color: #3B82F6 !important;
        }
        .ant-select-focused .ant-select-selector {
          border-color: #3B82F6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        .ant-input {
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
          border: 1px solid #E2E8F0 !important;
        }
        .ant-input:hover {
          border-color: #3B82F6 !important;
        }
        .ant-input:focus {
          border-color: #3B82F6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        .ant-picker {
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
          border: 1px solid #E2E8F0 !important;
        }
        .ant-picker:hover {
          border-color: #3B82F6 !important;
        }
        .ant-picker-focused {
          border-color: #3B82F6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
      `}</style>

      {/* Header Section */}
      <div style={{
        padding: '32px',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        borderBottom: '1px solid #E2E8F0',
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div style={{
                  width: '4px',
                  height: '28px',
                  background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)',
                  borderRadius: '2px'
                }} />
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Appointments
                  </h1>
                  {user?.role === 'Doctor' && (
                    <Text style={{ color: '#64748B', fontSize: '14px', marginLeft: '8px' }}>
                      ({getUserFullName()}'s Schedule)
                    </Text>
                  )}
                </div>
              </div>
              <p className="text-gray-500 text-sm" style={{ marginLeft: '7px' }}>
                {user?.role === 'Administrator'
                  ? 'Manage all patient appointments and schedules'
                  : `View and manage your ${userAppointments.length} scheduled appointments`
                }
              </p>
              {user?.role === 'Doctor' && userAppointments.length === 0 && (
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
                    No upcoming appointments. Use the "New Appointment" button to schedule one.
                  </Text>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                icon={<CalendarOutlined />}
                onClick={() => router.push('/patients/appointments/calendar')}
                style={{
                  height: '42px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  padding: '0 20px',
                  border: '1px solid #E2E8F0',
                }}
              >
                Calendar View
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleModalOpen}
                style={{
                  height: '42px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  padding: '0 20px',
                }}
              >
                New Appointment
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-5">
            {[
              { label: 'Total Appointments', value: animatedStats.total, color: '#3B82F6', bg: '#EFF6FF', border: '#DBEAFE' },
              { label: "Today's", value: animatedStats.today, color: '#10B981', bg: '#D1FAE5', border: '#A7F3D0' },
              { label: 'Scheduled', value: animatedStats.scheduled, color: '#F59E0B', bg: '#FEF3C7', border: '#FDE68A' },
              { label: 'Confirmed', value: animatedStats.confirmed, color: '#8B5CF6', bg: '#EDE9FE', border: '#DDD6FE' },
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
      </div>

      {/* Content Section */}
      <div className="px-8 py-6 page-content" style={{ animationDelay: '0.1s' }}>
        {/* Search and Filter Bar */}
        <div
          className="flex items-center gap-3 mb-6 p-4"
          style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className="flex-1">
            <Search
              placeholder="Search appointments..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ borderRadius: '8px' }}
            />
          </div>
          <Select
            placeholder="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            style={{ width: 140 }}
          >
            <Option value="scheduled">Scheduled</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="in_progress">In Progress</Option>
            <Option value="completed">Completed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
          <DatePicker
            placeholder="Filter by date"
            style={{ width: 160 }}
          />
          <div
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
              border: '1px solid #BFDBFE',
            }}
          >
            <span className="text-sm font-medium" style={{ color: '#1D4ED8' }}>
              {filteredAppointments.length} appointments
            </span>
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Table
            dataSource={filteredAppointments}
            columns={columns}
            rowKey="id"
            pagination={{
              defaultPageSize: 20,
              showSizeChanger: false,
              showTotal: (total) => `${total} appointments`,
              pageSizeOptions: ['10', '20', '50'],
            }}
            onRow={(record) => ({
              onClick: () => router.push(`/patients/${record.patientId}`),
              style: { cursor: 'pointer' },
            })}
          />
        </div>
      </div>

      {/* New Appointment Modal */}
      <NewAppointmentModal
        open={modalVisible}
        onCancel={handleModalCancel}
      />
    </div>
  );
}
