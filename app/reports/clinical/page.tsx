'use client';

import React, { useState, useMemo } from 'react';
import { Table, Button, Tag, Select, DatePicker, Badge } from 'antd';
import { SearchOutlined, DownloadOutlined, FileTextOutlined, BarChartOutlined, SyncOutlined } from '@ant-design/icons';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterClinicalReportsByUser } from '@/lib/reportFilters';
import { ReportAccessGuard } from '@/components/reports/ReportAccessGuard';
import { ReportDataFilter } from '@/components/reports/ReportDataFilter';
import { PERMISSIONS } from '@/lib/constants/permissions';
import { PageShell, StatCard, SearchFilterBar, ModernTable, StatusTag, GradientButton } from '@/components/design-system';

const { RangePicker } = DatePicker;

interface Report {
  id: string;
  reportName: string;
  category: 'clinical' | 'operational' | 'financial' | 'inventory';
  generatedBy: string;
  generatedDate: Date;
  status: 'ready' | 'generating';
  fileUrl: string;
  department?: string;
  isTriageRelated?: boolean;
}

const mockReports: Report[] = [
  { id: 'r1', reportName: 'Daily Patient Census', category: 'operational', generatedBy: 'Admin', generatedDate: new Date('2024-02-05'), status: 'ready', fileUrl: '/reports/daily-census.pdf', department: 'Cardiology', isTriageRelated: true },
  { id: 'r2', reportName: 'Monthly Revenue Report', category: 'financial', generatedBy: 'Finance Manager', generatedDate: new Date('2024-02-01'), status: 'ready', fileUrl: '/reports/monthly-revenue.pdf', department: 'Administration' },
  { id: 'r3', reportName: 'Bed Occupancy Rate', category: 'operational', generatedBy: 'Admin', generatedDate: new Date('2024-02-05'), status: 'ready', fileUrl: '/reports/bed-occupancy.pdf', department: 'Cardiology', isTriageRelated: true },
  { id: 'r4', reportName: 'Department Performance', category: 'clinical', generatedBy: 'Medical Director', generatedDate: new Date('2024-02-04'), status: 'ready', fileUrl: '/reports/department-perf.pdf', department: 'Cardiology' },
  { id: 'r5', reportName: 'Expiry Alerts', category: 'inventory', generatedBy: 'Pharmacy Manager', generatedDate: new Date('2024-02-05'), status: 'generating', fileUrl: '', department: 'Pharmacy' },
  { id: 'r6', reportName: 'Triage Summary', category: 'clinical', generatedBy: 'Nurse Station', generatedDate: new Date('2024-02-05'), status: 'ready', fileUrl: '/reports/triage.pdf', isTriageRelated: true },
  { id: 'r7', reportName: 'Patient Outcomes', category: 'clinical', generatedBy: 'Medical Director', generatedDate: new Date('2024-02-03'), status: 'ready', fileUrl: '/reports/outcomes.pdf', department: 'General Medicine' },
  { id: 'r8', reportName: 'Treatment Analysis', category: 'clinical', generatedBy: 'Quality Assurance', generatedDate: new Date('2024-02-02'), status: 'ready', fileUrl: '/reports/treatment.pdf', department: 'Surgery' },
];

export default function ClinicalReportsPage() {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();

  // Step 1: Filter data by user role
  const roleFilteredReports = useMemo(() => {
    return filterClinicalReportsByUser(user, mockReports);
  }, [user]);

  // Step 2: Apply search and category filters on top of role-based filtering
  const filteredReports = useMemo(() => {
    return roleFilteredReports.filter((report) => {
      const matchesSearch =
        report.reportName.toLowerCase().includes(searchText.toLowerCase()) ||
        report.generatedBy.toLowerCase().includes(searchText.toLowerCase());

      const matchesCategory = !categoryFilter || report.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [roleFilteredReports, searchText, categoryFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const ready = roleFilteredReports.filter(r => r.status === 'ready').length;
    const generating = roleFilteredReports.filter(r => r.status === 'generating').length;
    const clinical = roleFilteredReports.filter(r => r.category === 'clinical').length;
    const operational = roleFilteredReports.filter(r => r.category === 'operational').length;

    return {
      total: roleFilteredReports.length,
      ready,
      generating,
      clinical,
      operational,
    };
  }, [roleFilteredReports]);

  const columns = [
    {
      title: 'Report Name',
      dataIndex: 'reportName',
      key: 'name',
      sorter: (a: Report, b: Report) => a.reportName.localeCompare(b.reportName),
      render: (name: string) => (
        <div className="flex items-center gap-2">
          <FileTextOutlined style={{ color: '#3B82F6' }} />
          <span className="font-medium">{name}</span>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: category === 'clinical'
              ? '#DBEAFE'
              : category === 'financial'
              ? '#FEF3C7'
              : category === 'operational'
              ? '#D1FAE5'
              : '#EDE9FE',
            color: category === 'clinical'
              ? '#1E40AF'
              : category === 'financial'
              ? '#92400E'
              : category === 'operational'
              ? '#065F46'
              : '#5B21B6',
          }}
        >
          {category.toUpperCase()}
        </span>
      ),
    },
    {
      title: 'Generated By',
      dataIndex: 'generatedBy',
      key: 'by',
    },
    {
      title: 'Generated Date',
      dataIndex: 'generatedDate',
      key: 'date',
      render: (d: Date) => formatDate(d),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <StatusTag
          status={status}
          type="patient"
          customConfig={{
            ready: { color: '#10B981', bg: '#D1FAE5', icon: <FileTextOutlined /> },
            generating: { color: '#3B82F6', bg: '#DBEAFE', icon: <SyncOutlined spin /> },
          }}
          showIcon
        />
      ),
    },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: Report) => (
        <div className="flex gap-2">
          <Button
            size="small"
            icon={<DownloadOutlined />}
            disabled={record.status !== 'ready'}
            style={{
              borderRadius: '8px',
              fontWeight: 500,
            }}
          >
            Download
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ReportAccessGuard requiredPermission={PERMISSIONS.VIEW_CLINICAL_REPORTS}>
      <ReportDataFilter
        reportType="clinical"
        totalCount={mockReports.length}
        filteredCount={roleFilteredReports.length}
      >
        <PageShell
          title="Clinical Reports"
          subtitle="Patient care and medical performance reports"
          action={
            <GradientButton icon={<DownloadOutlined />}>
              Export Report
            </GradientButton>
          }
        >
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <StatCard
              label="Total Reports"
              value={stats.total}
              color="#3B82F6"
              bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
              border="#93C5FD"
              index={0}
            />
            <StatCard
              label="Ready"
              value={stats.ready}
              color="#10B981"
              bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
              border="#A7F3D0"
              index={1}
            />
            <StatCard
              label="Generating"
              value={stats.generating}
              color="#F59E0B"
              bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
              border="#FDE68A"
              index={2}
            />
            <StatCard
              label="Clinical Reports"
              value={stats.clinical}
              color="#8B5CF6"
              bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
              border="#DDD6FE"
              index={3}
            />
          </div>

          {/* Reports Table */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }} className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChartOutlined style={{ color: '#059669', fontSize: '20px' }} />
              <h2 className="text-lg font-semibold text-gray-900">All Reports</h2>
            </div>

            <SearchFilterBar
              searchPlaceholder="Search reports..."
              searchValue={searchText}
              onSearchChange={setSearchText}
              filters={[
                {
                  key: 'category',
                  label: 'Category',
                  value: categoryFilter,
                  options: [
                    { label: 'All Categories', value: '' },
                    { label: 'Clinical', value: 'clinical' },
                    { label: 'Operational', value: 'operational' },
                    { label: 'Financial', value: 'financial' },
                    { label: 'Inventory', value: 'inventory' },
                  ],
                  onChange: (value) => setCategoryFilter(value as string | undefined),
                },
              ]}
              resultCount={filteredReports.length}
              totalCount={roleFilteredReports.length}
              filterLabel="reports"
              extra={
                <RangePicker
                  style={{
                    borderRadius: '8px',
                  }}
                />
              }
            />

            <div className="overflow-x-auto">
              <ModernTable
                dataSource={filteredReports}
                columns={columns}
                rowKey="id"
                pagination={{ defaultPageSize: 10 }}
                showGradientHover={true}
              />
            </div>
          </div>
        </PageShell>
      </ReportDataFilter>
    </ReportAccessGuard>
  );
}
