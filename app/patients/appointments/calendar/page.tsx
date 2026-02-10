'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button, Select } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { mockAppointments } from '@/lib/mockData';
import dayjs from 'dayjs';
import { AppointmentCalendar } from '@/components/patients/AppointmentCalendar';

const { Option } = Select;

export default function AppointmentCalendarPage() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [mounted, setMounted] = useState(false);

  // Count-up animation for stats
  const [animatedStats, setAnimatedStats] = useState({
    today: 0,
    week: 0,
    month: 0,
    confirmed: 0,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const today = dayjs().startOf('day');
    const weekStart = today.startOf('week');
    const weekEnd = today.endOf('week');
    const monthStart = today.startOf('month');
    const monthEnd = today.endOf('month');

    const todayAppointments = mockAppointments.filter((apt) =>
      dayjs(apt.date).isSame(today, 'day')
    ).length;

    const weekAppointments = mockAppointments.filter((apt) => {
      const aptDate = dayjs(apt.date);
      return aptDate.isAfter(weekStart) && aptDate.isBefore(weekEnd);
    }).length;

    const monthAppointments = mockAppointments.filter((apt) => {
      const aptDate = dayjs(apt.date);
      return aptDate.isAfter(monthStart) && aptDate.isBefore(monthEnd);
    }).length;

    const confirmed = mockAppointments.filter((apt) =>
      apt.status === 'confirmed'
    ).length;

    return { today: todayAppointments, week: weekAppointments, month: monthAppointments, confirmed };
  }, []);

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
        week: Math.round(currentValues.week + (targets.week - currentValues.week) * easeProgress),
        month: Math.round(currentValues.month + (targets.month - currentValues.month) * easeProgress),
        confirmed: Math.round(currentValues.confirmed + (targets.confirmed - currentValues.confirmed) * easeProgress),
      });

      if (step >= steps) {
        clearInterval(interval);
        setAnimatedStats(targets);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const handlePreviousMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  const handleToday = () => {
    setCurrentMonth(dayjs());
  };

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

        .ant-picker-calendar {
          background: white !important;
          border-radius: 12px !important;
          overflow: hidden !important;
        }

        .ant-picker-panel {
          border-radius: 12px !important;
        }

        .ant-picker-header {
          border-bottom: 2px solid #E2E8F0 !important;
          padding: 16px !important;
        }

        .ant-picker-calendar-header {
          padding: 16px 24px !important;
          border-bottom: 1px solid #E2E8F0 !important;
        }

        .ant-picker-calendar .ant-picker-panel {
          background: white !important;
        }

        .ant-picker-calendar-date {
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
        }

        .ant-picker-calendar-date:hover {
          background: #EFF6FF !important;
        }

        .ant-picker-calendar-date-today {
          background: linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%) !important;
          border: 2px solid #3B82F6 !important;
        }

        .ant-picker-calendar-date-content {
          margin-top: 4px !important;
        }

        .ant-badge {
          font-size: 11px !important;
        }

        .ant-picker-month-panel,
        .ant-picker-date-panel {
          border-radius: 12px !important;
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
                <h1 className="text-2xl font-semibold text-gray-900">
                  Appointment Calendar
                </h1>
              </div>
              <p className="text-gray-500 text-sm" style={{ marginLeft: '7px' }}>
                View and manage appointments by date
              </p>
            </div>
            <Button
              type="primary"
              icon={<CalendarOutlined />}
              onClick={() => router.push('/patients/appointments')}
              style={{
                height: '42px',
                borderRadius: '10px',
                fontWeight: 600,
                padding: '0 20px',
              }}
            >
              List View
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-5">
            {[
              { label: "Today's", value: animatedStats.today, color: '#3B82F6', bg: '#EFF6FF', border: '#DBEAFE' },
              { label: 'This Week', value: animatedStats.week, color: '#10B981', bg: '#D1FAE5', border: '#A7F3D0' },
              { label: 'This Month', value: animatedStats.month, color: '#F59E0B', bg: '#FEF3C7', border: '#FDE68A' },
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

      {/* Calendar Section */}
      <div className="px-8 py-6 page-content" style={{ animationDelay: '0.1s' }}>
        {/* Calendar Controls */}
        <div
          className="flex items-center justify-between p-4 mb-6"
          style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className="flex items-center gap-3">
            <Button
              icon={<LeftOutlined />}
              onClick={handlePreviousMonth}
              style={{
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            >
              Previous
            </Button>
            <Button
              onClick={handleToday}
              style={{
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                fontWeight: 600,
              }}
            >
              Today
            </Button>
            <Button
              icon={<RightOutlined />}
              onClick={handleNextMonth}
              style={{
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            >
              Next
            </Button>
          </div>

          <div
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
              border: '1px solid #BFDBFE',
            }}
          >
            <span className="text-lg font-semibold" style={{ color: '#1D4ED8' }}>
              {currentMonth.format('MMMM YYYY')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Select
              defaultValue="month"
              style={{ width: 120 }}
              onChange={(value) => {
                if (value === 'today') {
                  setCurrentMonth(dayjs());
                }
              }}
            >
              <Option value="month">Month View</Option>
              <Option value="today">Go to Today</Option>
            </Select>
          </div>
        </div>

        {/* Calendar */}
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <AppointmentCalendar currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
        </div>
      </div>
    </div>
  );
}
