'use client';

import React from 'react';
import { Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, WarningOutlined, SyncOutlined } from '@ant-design/icons';

type StatusType = 'patient' | 'appointment' | 'lab' | 'radiology' | 'billing' | 'admission' | 'inpatient' | 'prescription' | 'custom';

interface StatusConfig {
  color: string;
  bg: string;
  icon?: React.ReactNode;
}

interface StatusTagProps {
  status: string;
  type?: StatusType;
  customConfig?: Record<string, StatusConfig>;
  showIcon?: boolean;
}

/**
 * Status configuration mappings for different entity types
 */
const STATUS_CONFIGS: Record<StatusType, Record<string, StatusConfig>> = {
  patient: {
    active: { color: '#10B981', bg: '#D1FAE5', icon: <CheckCircleOutlined /> },
    inactive: { color: '#6B7280', bg: '#F3F4F6', icon: <CloseCircleOutlined /> },
    admitted: { color: '#3B82F6', bg: '#DBEAFE', icon: <CheckCircleOutlined /> },
    discharged: { color: '#10B981', bg: '#D1FAE5', icon: <CheckCircleOutlined /> },
    pending: { color: '#F59E0B', bg: '#FEF3C7', icon: <ClockCircleOutlined /> },
  },
  appointment: {
    scheduled: { color: '#6B7280', bg: '#F3F4F6', icon: <ClockCircleOutlined /> },
    confirmed: { color: '#10B981', bg: '#D1FAE5', icon: <CheckCircleOutlined /> },
    in_progress: { color: '#3B82F6', bg: '#DBEAFE', icon: <SyncOutlined spin /> },
    completed: { color: '#10B981', bg: '#D1FAE5', icon: <CheckCircleOutlined /> },
    cancelled: { color: '#EF4444', bg: '#FEE2E2', icon: <CloseCircleOutlined /> },
    no_show: { color: '#EF4444', bg: '#FEE2E2', icon: <WarningOutlined /> },
  },
  lab: {
    pending: { color: '#F59E0B', bg: '#FEF3C7', icon: <ClockCircleOutlined /> },
    ordered: { color: '#6B7280', bg: '#F3F4F6', icon: <ClockCircleOutlined /> },
    in_progress: { color: '#3B82F6', bg: '#DBEAFE', icon: <SyncOutlined spin /> },
    completed: { color: '#10B981', bg: '#D1FAE5', icon: <CheckCircleOutlined /> },
    critical: { color: '#EF4444', bg: '#FEE2E2', icon: <WarningOutlined /> },
    abnormal: { color: '#F59E0B', bg: '#FEF3C7', icon: <WarningOutlined /> },
  },
  radiology: {
    scheduled: { color: '#6B7280', bg: '#F3F4F6', icon: <ClockCircleOutlined /> },
    in_progress: { color: '#3B82F6', bg: '#DBEAFE', icon: <SyncOutlined spin /> },
    completed: { color: '#10B981', bg: '#D1FAE5', icon: <CheckCircleOutlined /> },
    cancelled: { color: '#EF4444', bg: '#FEE2E2', icon: <CloseCircleOutlined /> },
  },
  billing: {
    pending: { color: '#F59E0B', bg: '#FEF3C7', icon: <ClockCircleOutlined /> },
    partially_paid: { color: '#3B82F6', bg: '#DBEAFE', icon: <ClockCircleOutlined /> },
    paid: { color: '#10B981', bg: '#D1FAE5', icon: <CheckCircleOutlined /> },
    overdue: { color: '#EF4444', bg: '#FEE2E2', icon: <WarningOutlined /> },
    cancelled: { color: '#EF4444', bg: '#FEE2E2', icon: <CloseCircleOutlined /> },
  },
  admission: {
    pending: { color: '#F59E0B', bg: '#FEF3C7', icon: <ClockCircleOutlined /> },
    admitted: { color: '#3B82F6', bg: '#DBEAFE', icon: <CheckCircleOutlined /> },
    discharged: { color: '#10B981', bg: '#D1FAE5', icon: <CheckCircleOutlined /> },
  },
  inpatient: {
    stable: { color: '#10B981', bg: '#D1FAE5', icon: <CheckCircleOutlined /> },
    critical: { color: '#EF4444', bg: '#FEE2E2', icon: <WarningOutlined /> },
    improving: { color: '#3B82F6', bg: '#DBEAFE', icon: <CheckCircleOutlined /> },
    deteriorating: { color: '#F59E0B', bg: '#FEF3C7', icon: <WarningOutlined /> },
  },
  prescription: {
    dispensed: { color: '#10B981', bg: '#D1FAE5', icon: <CheckCircleOutlined /> },
    pending: { color: '#F59E0B', bg: '#FEF3C7', icon: <ClockCircleOutlined /> },
    partially_dispensed: { color: '#3B82F6', bg: '#DBEAFE', icon: <WarningOutlined /> },
    cancelled: { color: '#EF4444', bg: '#FEE2E2', icon: <CloseCircleOutlined /> },
    active: { color: '#10B981', bg: '#D1FAE5', icon: <CheckCircleOutlined /> },
    discontinued: { color: '#EF4444', bg: '#FEE2E2', icon: <CloseCircleOutlined /> },
    completed: { color: '#6B7280', bg: '#F3F4F6', icon: <CheckCircleOutlined /> },
    on_hold: { color: '#F59E0B', bg: '#FEF3C7', icon: <ClockCircleOutlined /> },
  },
  custom: {},
};

/**
 * StatusTag - Consistent status tags with color mapping
 *
 * @example
 * <StatusTag status="active" type="patient" showIcon />
 * <StatusTag status="confirmed" type="appointment" />
 * <StatusTag
 *   status="custom_status"
 *   customConfig={{
 *     custom_status: { color: '#8B5CF6', bg: '#EDE9FE' }
 *   }}
 * />
 */
export function StatusTag({
  status,
  type = 'custom',
  customConfig = {},
  showIcon = false,
}: StatusTagProps) {
  // Get configuration based on type
  const configs = type === 'custom' ? customConfig : STATUS_CONFIGS[type];
  const config = configs[status.toLowerCase()] || {
    color: '#6B7280',
    bg: '#F3F4F6',
  };

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
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      {showIcon && config.icon && <span style={{ fontSize: '12px' }}>{config.icon}</span>}
      <span style={{ textTransform: 'capitalize' }}>
        {status.replace(/_/g, ' ')}
      </span>
    </Tag>
  );
}
