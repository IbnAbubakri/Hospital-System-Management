'use client';

import React, { useState, useMemo } from 'react';
import { Input, Select, DatePicker, Progress } from 'antd';
import { DollarOutlined, SearchOutlined, ArrowUpOutlined, ArrowDownOutlined, DownloadOutlined } from '@ant-design/icons';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterFinancialDataByUser, getFinancialSummaryForUser } from '@/lib/reportFilters';
import { ReportAccessGuard } from '@/components/reports/ReportAccessGuard';
import { ReportDataFilter } from '@/components/reports/ReportDataFilter';
import { PERMISSIONS } from '@/lib/constants/permissions';
import { PageShell, StatCard, ModernTable, SearchFilterBar, GradientButton } from '@/components/design-system';
import { Table } from 'antd';

const { RangePicker } = DatePicker;

interface RevenueItem {
  id: string;
  category: string;
  item: string;
  amount: number;
  change: number;
  changePercent: number;
  department?: string;
}

const mockRevenue: RevenueItem[] = [
  { id: 'rev1', category: 'Consultation', item: 'OPD Consultations', amount: 2500000, change: 150000, changePercent: 6.5, department: 'Cardiology' },
  { id: 'rev2', category: 'Laboratory', item: 'Lab Tests', amount: 1800000, change: -80000, changePercent: -4.2, department: 'Laboratory' },
  { id: 'rev3', category: 'Radiology', item: 'Imaging Services', amount: 2200000, change: 250000, changePercent: 12.8, department: 'Radiology' },
  { id: 'rev4', category: 'Pharmacy', item: 'Drug Sales', amount: 3500000, change: 450000, changePercent: 14.8, department: 'Pharmacy' },
  { id: 'rev5', category: 'Inpatient', item: 'Room Charges', amount: 4200000, change: 320000, changePercent: 8.3, department: 'Cardiology' },
  { id: 'rev6', category: 'Procedures', item: 'Surgery Charges', amount: 5800000, change: -150000, changePercent: -2.5, department: 'Surgery' },
];

export default function FinancialReportsPage() {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();

  // Step 1: Filter data by user role
  const roleFilteredRevenue = useMemo(() => {
    return filterFinancialDataByUser(user, mockRevenue);
  }, [user]);

  // Step 2: Apply search and category filters on top of role-based filtering
  const filteredRevenue = useMemo(() => {
    return roleFilteredRevenue.filter((item) => {
      const matchesSearch =
        item.item.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase());

      const matchesCategory = !categoryFilter || item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [roleFilteredRevenue, searchText, categoryFilter]);

  // Calculate totals based on filtered data
  const financialSummary = useMemo(() => {
    return getFinancialSummaryForUser(user, filteredRevenue);
  }, [user, filteredRevenue]);

  const totalRevenue = financialSummary.totalRevenue;
  const totalChange = financialSummary.totalChange;

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: '#DBEAFE',
            color: '#1E40AF',
          }}
        >
          {cat}
        </span>
      ),
    },
    { title: 'Revenue Item', dataIndex: 'item', key: 'item' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount),
      sorter: (a: RevenueItem, b: RevenueItem) => a.amount - b.amount,
    },
    {
      title: 'Change',
      key: 'change',
      render: (_: any, record: RevenueItem) => (
        <div>
          <div className="flex items-center gap-2">
            {record.change > 0 ? <ArrowUpOutlined style={{ color: '#10B981' }} /> : <ArrowDownOutlined style={{ color: '#EF4444' }} />}
            <span style={{ color: record.change > 0 ? '#10B981' : '#EF4444', fontWeight: 500 }}>
              {formatCurrency(Math.abs(record.change))}
            </span>
          </div>
          <div className="text-xs text-gray-500">({record.changePercent > 0 ? '+' : ''}{record.changePercent}%)</div>
        </div>
      ),
    },
  ];

  return (
    <ReportAccessGuard requiredPermission={PERMISSIONS.VIEW_FINANCIAL_REPORTS}>
      <ReportDataFilter
        reportType="financial"
        totalCount={mockRevenue.length}
        filteredCount={roleFilteredRevenue.length}
      >
        <PageShell
          title="Financial Reports"
          subtitle="Revenue, collections, and financial performance"
          action={
            <GradientButton icon={<DownloadOutlined />}>
              Export Report
            </GradientButton>
          }
        >
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <div
              style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                borderRadius: '12px',
                color: 'white',
                boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.1)',
              }}
              className="p-4 sm:p-6"
            >
              <div className="text-sm opacity-90 mb-2">Total Revenue</div>
              <div className="text-3xl font-bold mb-1">{formatCurrency(totalRevenue)}</div>
              <div className="text-sm opacity-90 flex items-center gap-1">
                <ArrowUpOutlined />
                {formatCurrency(totalChange)}
              </div>
            </div>
            <StatCard
              label="Outstanding"
              value={8500000}
              color="#EF4444"
              bg="linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)"
              border="#FCA5A5"
              index={1}
            />
            <StatCard
              label="Collections"
              value={12800000}
              color="#3B82F6"
              bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
              border="#93C5FD"
              index={2}
            />
            <div
              style={{
                padding: '20px',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
              }}
              className="p-4 sm:p-6"
            >
              <div className="text-sm text-gray-500 mb-2">Collection Rate</div>
              <div className="text-3xl font-bold text-green-600 mb-2">94.5%</div>
              <Progress percent={94.5} size="small" strokeColor="#10B981" showInfo={false} />
            </div>
          </div>

          {/* Revenue Details Section */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }} className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarOutlined style={{ color: '#059669', fontSize: '20px' }} />
              <h2 className="text-lg font-semibold text-gray-900">Revenue Breakdown</h2>
            </div>

            <SearchFilterBar
              searchPlaceholder="Search items..."
              searchValue={searchText}
              onSearchChange={setSearchText}
              filters={[
                {
                  key: 'category',
                  label: 'Category',
                  value: categoryFilter,
                  options: [
                    { label: 'All Categories', value: '' },
                    { label: 'Consultation', value: 'Consultation' },
                    { label: 'Laboratory', value: 'Laboratory' },
                    { label: 'Radiology', value: 'Radiology' },
                    { label: 'Pharmacy', value: 'Pharmacy' },
                    { label: 'Inpatient', value: 'Inpatient' },
                    { label: 'Procedures', value: 'Procedures' },
                  ],
                  onChange: (value) => setCategoryFilter(value as string | undefined),
                },
              ]}
              resultCount={filteredRevenue.length}
              totalCount={roleFilteredRevenue.length}
              filterLabel="items"
            />

            <div className="mb-4">
              <RangePicker style={{ width: '100%', maxWidth: '300px' }} />
            </div>

            <div className="overflow-x-auto">
              <Table
                dataSource={filteredRevenue}
                columns={columns}
                rowKey="id"
                pagination={false}
                size="middle"
                summary={(pageData) => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={2} className="font-semibold">
                        <span className="text-lg">Total</span>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} className="font-semibold text-lg">
                        {formatCurrency(totalRevenue)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} />
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </div>
          </div>
        </PageShell>
      </ReportDataFilter>
    </ReportAccessGuard>
  );
}
