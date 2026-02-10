'use client';

import React from 'react';
import { Alert, Space, Tag, Tooltip } from 'antd';
import { InfoCircleOutlined, FilterOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getReportDataSummary } from '@/lib/reportFilters';

interface ReportDataFilterProps {
  children: React.ReactNode;
  reportType: string;
  totalCount?: number;
  filteredCount?: number;
  showFilterInfo?: boolean;
  customMessage?: string;
}

/**
 * ReportDataFilter Component
 *
 * Displays filtering information to users when data is filtered based on their role.
 * Shows visual indicators like "Viewing Cardiology department data only"
 *
 * Usage:
 * <ReportDataFilter reportType="clinical" totalCount={100} filteredCount={25}>
 *   <YourReportContent filteredData={filteredData} />
 * </ReportDataFilter>
 */
export function ReportDataFilter({
  children,
  reportType,
  totalCount = 0,
  filteredCount = 0,
  showFilterInfo = true,
  customMessage,
}: ReportDataFilterProps) {
  const { user } = useAuth();

  // Get filtering metadata
  const summary = getReportDataSummary(user, reportType, totalCount, filteredCount);

  // Don't show filter info for admin (they see all data)
  if (!showFilterInfo || user?.role === 'Administrator' || !summary.isFiltered) {
    return <>{children}</>;
  }

  // Determine filter message
  const filterMessage = customMessage || getDefaultFilterMessage(reportType, user);

  // Determine alert type based on filtering
  const getAlertType = (): 'info' | 'warning' => {
    if (user?.role === 'AuxiliaryNurse' && reportType === 'clinical') {
      return 'warning'; // Nurses have limited access
    }
    return 'info';
  };

  return (
    <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
      {/* Filter Information Alert */}
      <Alert
        title={
          <Space size="small">
            <FilterOutlined />
            <span>Filtered View</span>
          </Space>
        }
        description={
          <div>
            <p style={{ marginBottom: '8px', fontWeight: 500 }}>
              {filterMessage}
            </p>
            <div style={{ fontSize: '13px', color: '#666' }}>
              <Space orientation="horizontal" size="large">
                <span>
                  <strong>Scope:</strong> {summary.filterScope}
                </span>
                {totalCount !== filteredCount && (
                  <span>
                    <strong>Showing:</strong> {filteredCount} of {totalCount} records
                  </span>
                )}
                <span>
                  <strong>Role:</strong> {summary.userRole}
                  {summary.userDepartment && ` (${summary.userDepartment})`}
                </span>
              </Space>
            </div>
          </div>
        }
        type={getAlertType()}
        showIcon
        icon={<InfoCircleOutlined />}
        closable
        style={{ marginBottom: '16px' }}
      />

      {/* Render children */}
      {children}
    </Space>
  );
}

/**
 * Hook to get filtering metadata for a report
 * Returns information about what data is being shown to the user
 */
export function useReportFilter(reportType: string, totalCount: number = 0, filteredCount: number = 0): {
  isFiltered: boolean;
  filterReason: string;
  filterScope: string;
  userRole: string | undefined;
  userDepartment: string | undefined;
  shouldShowWarning: boolean;
  filterMessage: string;
} {
  const { user } = useAuth();
  const summary = getReportDataSummary(user, reportType, totalCount, filteredCount);

  const filterMessage = getDefaultFilterMessage(reportType, user);

  // Determine if we should show a warning (limited access)
  const shouldShowWarning = user?.role === 'AuxiliaryNurse' &&
    (reportType === 'clinical' || reportType === 'doctor-metrics');

  return {
    ...summary,
    userRole: user?.role,
    userDepartment: user?.department,
    shouldShowWarning,
    filterMessage,
  };
}

/**
 * Component to display a small filter indicator badge
 * Use this in headers or titles to show filtered state
 */
export function FilterIndicator({
  reportType,
  totalCount,
  filteredCount,
}: {
  reportType: string;
  totalCount?: number;
  filteredCount?: number;
}) {
  const { isFiltered, filterScope, userRole } = useReportFilter(
    reportType,
    totalCount || 0,
    filteredCount || 0
  );

  if (!isFiltered) {
    return null;
  }

  return (
    <Tooltip title={`Viewing ${filterScope} (${userRole})`}>
      <Tag icon={<FilterOutlined />} color="blue" style={{ marginLeft: '8px' }}>
        Filtered
      </Tag>
    </Tooltip>
  );
}

/**
 * Component to display access level indicator
 * Shows if user has full, partial, or limited access
 */
export function AccessLevelIndicator({ reportType }: { reportType: string }) {
  const { user } = useAuth();

  if (!user || user.role === 'Administrator') {
    return null;
  }

  const getAccessLevel = () => {
    if (user.role === 'Doctor') {
      return { level: 'Department Access', color: 'green', icon: <LockOutlined /> };
    }
    if (user.role === 'AuxiliaryNurse') {
      const limitedReports = ['clinical', 'doctor-metrics', 'financial'];
      if (limitedReports.includes(reportType)) {
        return { level: 'Limited Access', color: 'orange', icon: <LockOutlined /> };
      }
      return { level: 'Triage Access', color: 'blue', icon: <LockOutlined /> };
    }
    return { level: 'Standard Access', color: 'default', icon: <LockOutlined /> };
  };

  const { level, color, icon } = getAccessLevel();

  return (
    <Tooltip title={`Your access level: ${level}`}>
      <Tag icon={icon} color={color} style={{ marginLeft: '8px' }}>
        {level}
      </Tag>
    </Tooltip>
  );
}

/**
 * Helper function to get default filter message based on report type and user
 */
function getDefaultFilterMessage(reportType: string, user: any): string {
  if (!user) {
    return 'Please log in to view report data.';
  }

  if (user.role === 'Administrator') {
    return 'You are viewing all data (Administrator access).';
  }

  if (user.role === 'Doctor') {
    const dept = user.department || 'your';
    switch (reportType) {
      case 'financial':
        return `Viewing ${dept} department financial data only.`;
      case 'clinical':
        return `Viewing ${dept} department clinical reports only.`;
      case 'patient-stats':
        return `Viewing ${dept} department patient statistics only.`;
      case 'doctor-metrics':
        return 'Viewing your own performance metrics only.';
      case 'disease-trends':
        return `Viewing ${dept} department disease trends only.`;
      case 'utilization':
        return `Viewing ${dept} department resource utilization only.`;
      case 'outcomes':
        return `Viewing ${dept} department patient outcomes only.`;
      default:
        return `Viewing ${dept} department data only.`;
    }
  }

  if (user.role === 'AuxiliaryNurse') {
    switch (reportType) {
      case 'clinical':
        return 'Viewing triage-related clinical reports only.';
      case 'patient-stats':
        return 'Viewing all patient statistics (for triage duties).';
      case 'disease-trends':
        return 'Viewing communicable disease trends only (for infection control).';
      case 'utilization':
        return 'Viewing bed utilization and triage facility data only.';
      case 'doctor-metrics':
        return 'Viewing all doctor schedules for triage coordination.';
      default:
        return 'Viewing triage-related data only.';
    }
  }

  return 'Viewing filtered data based on your role and permissions.';
}

/**
 * Component to display filter summary in a compact format
 * Useful for placing in table headers or card headers
 */
export function FilterSummary({
  reportType,
  filteredCount,
  totalCount,
}: {
  reportType: string;
  filteredCount: number;
  totalCount: number;
}) {
  const { isFiltered, filterScope } = useReportFilter(reportType, totalCount, filteredCount);

  if (!isFiltered) {
    return null;
  }

  return (
    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
      <Space size="small">
        <FilterOutlined style={{ fontSize: '11px' }} />
        <span>
          {filteredCount === totalCount
            ? `All ${totalCount} records`
            : `${filteredCount} of ${totalCount} records`}
        </span>
        <span>•</span>
        <span>{filterScope}</span>
      </Space>
    </div>
  );
}

export default ReportDataFilter;
