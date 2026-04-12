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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50">
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
      <div className=" bg-gradient-to-br from-white to-slate-50 border-b border-slate-200 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-10 -right-10  h-[200px] bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_70%)] -full" />
        <div className="absolute -bottom-20 left-[100px]  h-[300px] bg-[radial-gradient(circle,rgba(16,185,129,0.06)_0%,transparent_70%)] -full" />

        <div className="page-content relative z-10" style={{ animationDelay: '0s' }}>
          <div className="   ">
            <div>
              <div className="   ">
                <div style={{
                  width: '4px',
                  height: '28px',
                  background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)',
                  borderRadius: '2px'
                }} />
                <h1 className="text-2xl font-semibold ">
                  Appointment Calendar
                </h1>
              </div>
              <p className=" " style={{ marginLeft: '7px' }}>
                View and manage appointments by date
              </p>
            </div>
            <Button
              type="primary"
              icon={<CalendarOutlined />}
              onClick={() => router.push('/patients/appointments')}
              className="  font-semibold "
            >
              List View
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 ">
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
                                    
                  background: `linear-gradient(135deg, ${stat.bg} 0%, rgba(255,255,255,0.8) 100%)`,
                  border: `1px solid ${stat.border}`,
                  cursor: 'default',
                }}
              >
                <div className=" font-medium text-slate-500 .5">
                  {stat.label}
                </div>
                <div className="stat-number text-[28px] font-bold leading-none" style={{ color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="  page-content" style={{ animationDelay: '0.1s' }}>
        {/* Calendar Controls */}
        <div
          className="     bg-white  border border-slate-200 shadow"
        >
          <div className="  ">
            <Button
              icon={<LeftOutlined />}
              onClick={handlePreviousMonth}
              className=" border border-slate-200"
            >
              Previous
            </Button>
            <Button
              onClick={handleToday}
              className=" border border-slate-200 font-semibold"
            >
              Today
            </Button>
            <Button
              icon={<RightOutlined />}
              onClick={handleNextMonth}
              className=" border border-slate-200"
            >
              Next
            </Button>
          </div>

          <div className=".5   bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <span className=" font-semibold ">
              {currentMonth.format('MMMM YYYY')}
            </span>
          </div>

          <div className="  ">
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
        <div className="bg-white  border border-slate-200 overflow-hidden shadow">
          <AppointmentCalendar currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
        </div>
      </div>
    </div>
  );
}
