'use client';

import React, { useState, useMemo } from 'react';
import { Select, Progress, Button } from 'antd';
import { BarChartOutlined, RestOutlined, UserOutlined, CalendarOutlined, DownloadOutlined } from '@ant-design/icons';
import { PageShell, StatCard, SearchFilterBar, ModernTable, GradientButton } from '@/components/design-system';

interface UtilizationData {
  department: string;
  beds: number;
  occupied: number;
  rate: number;
  admissions: number;
  discharges: number;
  avgStay: number;
}

const utilizationData: UtilizationData[] = [
  { department: 'Cardiology', beds: 45, occupied: 38, rate: 84, admissions: 156, discharges: 142, avgStay: 5.2 },
  { department: 'Orthopedics', beds: 30, occupied: 22, rate: 73, admissions: 89, discharges: 85, avgStay: 7.5 },
  { department: 'Pediatrics', beds: 25, occupied: 20, rate: 80, admissions: 134, discharges: 128, avgStay: 2.8 },
  { department: 'General Medicine', beds: 60, occupied: 52, rate: 87, admissions: 234, discharges: 218, avgStay: 3.1 },
  { department: 'ICU', beds: 10, occupied: 9, rate: 90, admissions: 45, discharges: 38, avgStay: 8.5 },
  { department: 'Emergency', beds: 15, occupied: 14, rate: 93, admissions: 287, discharges: 275, avgStay: 1.5 },
  { department: 'Surgery', beds: 35, occupied: 28, rate: 80, admissions: 178, discharges: 165, avgStay: 4.5 },
  { department: 'Neurology', beds: 20, occupied: 16, rate: 80, admissions: 92, discharges: 88, avgStay: 6.2 },
];

export default function UtilizationReportPage() {
  const [timeRange, setTimeRange] = useState<string>('month');
  const [deptFilter, setDeptFilter] = useState<string | undefined>();

  // Filter by department
  const filteredData = useMemo(() => {
    if (!deptFilter) return utilizationData;
    return utilizationData.filter(d => d.department === deptFilter);
  }, [deptFilter]);

  // Calculate overall statistics
  const stats = useMemo(() => {
    const totalBeds = filteredData.reduce((sum, u) => sum + u.beds, 0);
    const totalOccupied = filteredData.reduce((sum, u) => sum + u.occupied, 0);
    const overallRate = totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 0;
    const totalAdmissions = filteredData.reduce((sum, u) => sum + u.admissions, 0);
    const totalDischarges = filteredData.reduce((sum, u) => sum + u.discharges, 0);

    return {
      totalBeds,
      totalOccupied,
      overallRate,
      totalAdmissions,
      totalDischarges,
    };
  }, [filteredData]);

  const columns = [
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => (
        <div className="  ">
          <div
            className="  -lg      font-semibold"
            style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}
          >
            {dept.charAt(0)}
          </div>
          <span className="font-medium">{dept}</span>
        </div>
      ),
    },
    {
      title: 'Total Beds',
      dataIndex: 'beds',
      key: 'beds',
      render: (beds: number) => (
        <span className="font-semibold ">{beds}</span>
      ),
    },
    {
      title: 'Occupied',
      dataIndex: 'occupied',
      key: 'occupied',
      render: (occupied: number) => (
        <span className="font-semibold ">{occupied}</span>
      ),
    },
    {
      title: 'Utilization Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => (
        <div>
          <Progress
            percent={rate}
            size="small"
            strokeColor={rate > 85 ? '#EF4444' : rate > 75 ? '#F59E0B' : '#10B981'}
            format={(percent) => `${percent}%`}
          />
        </div>
      ),
      sorter: (a: UtilizationData, b: UtilizationData) => a.rate - b.rate,
    },
    {
      title: 'Admissions',
      dataIndex: 'admissions',
      key: 'admissions',
      render: (admissions: number) => (
        <span className="font-semibold ">{admissions}</span>
      ),
    },
    {
      title: 'Discharges',
      dataIndex: 'discharges',
      key: 'discharges',
    },
    {
      title: 'Avg Stay',
      dataIndex: 'avgStay',
      key: 'avgStay',
      render: (days: number) => `${days} days`,
      sorter: (a: UtilizationData, b: UtilizationData) => a.avgStay - b.avgStay,
    },
  ];

  return (
    <PageShell
      title="Bed Utilization Report"
      subtitle="Hospital bed occupancy and department-wise utilization metrics"
      action={
        <GradientButton icon={<DownloadOutlined />}>
          Export Report
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4  ">
        <StatCard
          label="Total Beds"
          value={stats.totalBeds}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Occupied Beds"
          value={stats.totalOccupied}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#A7F3D0"
          index={1}
        />
        <StatCard
          label="Utilization Rate"
          value={stats.overallRate}
          suffix="%"
          color={stats.overallRate > 85 ? '#EF4444' : stats.overallRate > 75 ? '#F59E0B' : '#10B981'}
          bg={stats.overallRate > 85
            ? 'linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)'
            : stats.overallRate > 75
            ? 'linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)'
            : 'linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)'
          }
          border={stats.overallRate > 85 ? '#FCA5A5' : stats.overallRate > 75 ? '#FDE68A' : '#A7F3D0'}
          index={2}
        />
        <StatCard
          label="Total Admissions"
          value={stats.totalAdmissions}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#DDD6FE"
          index={3}
        />
      </div>

      {/* Utilization Table */}
      <div className="bg-white -xl  border border-slate-200">
        <div className="   ">
          <BarChartOutlined className=" text-xl" />
          <h2 className=" font-semibold ">Department-wise Utilization</h2>
        </div>

        <SearchFilterBar
          filters={[
            {
              key: 'timeRange',
              label: 'Time Range',
              value: timeRange,
              options: [
                { label: 'This Week', value: 'week' },
                { label: 'This Month', value: 'month' },
                { label: 'This Quarter', value: 'quarter' },
                { label: 'This Year', value: 'year' },
              ],
              onChange: (value) => setTimeRange(value as string),
              icon: <CalendarOutlined />,
            },
            {
              key: 'department',
              label: 'Department',
              value: deptFilter,
              options: [
                { label: 'All Departments', value: '' },
                ...utilizationData.map(d => ({ label: d.department, value: d.department })),
              ],
              onChange: (value) => setDeptFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredData.length}
          totalCount={utilizationData.length}
          filterLabel="departments"
        />

        <div className="overflow-x-auto">
          <ModernTable
            dataSource={filteredData}
            columns={columns}
            rowKey="department"
            pagination={false}
            showGradientHover={true}
          />
        </div>
      </div>

      {/* Utilization Summary */}
      <div className="bg-white -xl  border border-slate-200 ">
        <div className="   ">
          <RestOutlined className="color: '#3B82F6' text-xl" />
          <h2 className=" font-semibold ">Utilization Summary</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
          <div className=" -xl bg-gradient-to-br from-red-50 to-white border border-red-200">
            <div className="  ">High Utilization ({'>'}85%)</div>
            <div className="text-2xl font-bold ">
              {filteredData.filter(d => d.rate > 85).length}
            </div>
            <div className="  ">Departments</div>
          </div>

          <div className=" -xl bg-gradient-to-br from-amber-50 to-white border border-amber-200">
            <div className="  ">Moderate Utilization (75-85%)</div>
            <div className="text-2xl font-bold ">
              {filteredData.filter(d => d.rate > 75 && d.rate <= 85).length}
            </div>
            <div className="  ">Departments</div>
          </div>

          <div className=" -xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200">
            <div className="  ">Optimal Utilization ({'<'}75%)</div>
            <div className="text-2xl font-bold ">
              {filteredData.filter(d => d.rate <= 75).length}
            </div>
            <div className="  ">Departments</div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
