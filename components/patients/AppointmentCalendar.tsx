'use client';

import React, { useState } from 'react';
import { Calendar, Badge, Modal, Select } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { mockAppointments, mockPatients, mockDoctors } from '@/lib/mockData';
import { useRouter } from 'next/navigation';
import { NewAppointmentModal } from './NewAppointmentModal';

interface AppointmentCalendarProps {
  currentMonth?: Dayjs;
  onMonthChange?: (date: Dayjs) => void;
}

export function AppointmentCalendar({ currentMonth = dayjs(), onMonthChange }: AppointmentCalendarProps) {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const getAppointmentsForDate = (date: Dayjs) => {
    return mockAppointments.filter((apt) =>
      dayjs(apt.date).isSame(date, 'day')
    );
  };

  const dateCellRender = (value: Dayjs) => {
    const appointments = getAppointmentsForDate(value);
    const isToday = dayjs().isSame(value, 'day');

    return (
      <div className="space-y-1">
        {appointments.slice(0, 3).map((apt) => {
          const statusColor: Record<string, string> = {
            confirmed: '#10B981',
            scheduled: '#6B7280',
            in_progress: '#F59E0B',
            completed: '#3B82F6',
            cancelled: '#EF4444',
          };
          const color = statusColor[apt.status] || '#6B7280';

          return (
            <div
              key={apt.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAppointment(apt);
                router.push(`/patients/${apt.patientId}`);
              }}
              className="text-xs cursor-pointer hover:opacity-80 transition-opacity"
              style={{ padding: '2px 0' }}
            >
              <div
                style={{
                  background: `${color}15`,
                  borderLeft: `3px solid ${color}`,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 500,
                }}
              >
                <div className="truncate" style={{ color }}>
                  {apt.patientName}
                </div>
                <div className="truncate" style={{ fontSize: '10px', color: '#6B7280' }}>
                  {apt.startTime}
                </div>
              </div>
            </div>
          );
        })}
        {appointments.length > 3 && (
          <div
            className="text-xs font-medium"
            style={{ color: '#3B82F6', paddingLeft: '6px' }}
          >
            +{appointments.length - 3} more
          </div>
        )}
      </div>
    );
  };

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const handlePanelChange = (date: Dayjs) => {
    if (onMonthChange) {
      onMonthChange(date);
    }
  };

  return (
    <>
      <Calendar
        value={currentMonth}
        onSelect={handleDateSelect}
        onPanelChange={handlePanelChange}
        cellRender={dateCellRender}
        fullscreen={true}
        headerRender={({ value, onChange, type }) => {
          const start = 0;
          const end = 12;
          const monthOptions = [];

          // Use month names directly instead of localeData
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

          for (let i = start; i < end; i++) {
            monthOptions.push(
              <Select.Option key={i} value={i} className="month-item">
                {months[i]}
              </Select.Option>
            );
          }

          const year = value.year();
          const currentYear = dayjs().year();
          const startYear = Math.floor(currentYear / 10) * 10 - 50;
          const endYear = startYear + 100;

          const yearOptions = [];
          for (let i = startYear; i < endYear; i++) {
            yearOptions.push(
              <Select.Option key={i} value={i} className="year-item">
                {i}
              </Select.Option>
            );
          }

          const month = value.month();

          return (
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #E2E8F0' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    <CalendarOutlined style={{ fontSize: '20px', color: 'white' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 m-0">
                      {value.format('MMMM YYYY')}
                    </h3>
                    <p className="text-xs text-gray-500 m-0">
                      Select a date to book or view appointments
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    size="large"
                    popupMatchSelectWidth
                    className="my-year-select"
                    value={year}
                    onChange={(newYear) => {
                      const now = value.clone().year(newYear);
                      onChange(now);
                    }}
                    style={{ width: 100 }}
                  >
                    {yearOptions}
                  </Select>
                  <Select
                    size="large"
                    popupMatchSelectWidth
                    className="my-month-select"
                    value={month}
                    onChange={(newMonth) => {
                      const now = value.clone().month(newMonth);
                      onChange(now);
                    }}
                    style={{ width: 120 }}
                  >
                    {monthOptions}
                  </Select>
                </div>
              </div>
            </div>
          );
        }}
      />

      <NewAppointmentModal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        defaultDate={selectedDate}
      />
    </>
  );
}
