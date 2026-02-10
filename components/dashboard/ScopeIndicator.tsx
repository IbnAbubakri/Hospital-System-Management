'use client';

import React from 'react';
import { Tag, Alert } from 'antd';
import { FilterOutlined, EyeOutlined } from '@ant-design/icons';
import { User } from '@/types';

interface ScopeIndicatorProps {
  user: User | null;
  dataType?: 'dashboard' | 'patients' | 'reports' | 'appointments';
  totalCount?: number;
  filteredCount?: number;
}

/**
 * Visual indicator showing the scope of data being displayed
 * Helps users understand what data they're seeing (filtered vs. hospital-wide)
 */
export function ScopeIndicator({
  user,
  dataType = 'dashboard',
  totalCount,
  filteredCount,
}: ScopeIndicatorProps) {
  if (!user) return null;

  // Administrator sees everything - no filtering indicator needed
  if (user.role === 'Administrator') {
    return (
      <Alert
        title="Hospital-Wide View"
        description="You are viewing all hospital data across all departments."
        type="info"
        showIcon
        icon={<EyeOutlined />}
        closable
        style={{ marginBottom: '16px', borderRadius: '8px' }}
      />
    );
  }

  // Doctor sees department-specific data
  if (user.role === 'Doctor') {
    return (
      <Alert
        title={
          <span style={{ fontWeight: 600 }}>
            <FilterOutlined /> {user.department} Department View
          </span>
        }
        description={
          totalCount !== undefined && filteredCount !== undefined ? (
            <span>
              Showing {filteredCount} of {totalCount} total hospital records
              (filtered by {user.department} department)
            </span>
          ) : (
            <span>
              Viewing only data related to {user.department} department and your assigned patients
            </span>
          )
        }
        type="info"
        showIcon
        closable
        style={{ marginBottom: '16px', borderRadius: '8px' }}
      />
    );
  }

  // AuxiliaryNurse sees triage and scheduling data
  if (user.role === 'AuxiliaryNurse') {
    return (
      <Alert
        title={
          <span style={{ fontWeight: 600 }}>
            <FilterOutlined /> Triage & Scheduling View
          </span>
        }
        description={
          <span>
            Viewing all patients (for triage duties) and all appointments (for scheduling).
            Doctor availability and bed utilization data visible.
          </span>
        }
        type="info"
        showIcon
        closable
        style={{ marginBottom: '16px', borderRadius: '8px' }}
      />
    );
  }

  return null;
}

/**
 * Compact tag version for use in headers or cards
 */
export function ScopeTag({ user }: { user: User | null }) {
  if (!user || user.role === 'Administrator') return null;

  if (user.role === 'Doctor') {
    return (
      <Tag
        icon={<FilterOutlined />}
        color="blue"
        style={{ fontWeight: 500, borderRadius: '6px', padding: '4px 12px' }}
      >
        {user.department} Department
      </Tag>
    );
  }

  if (user.role === 'AuxiliaryNurse') {
    return (
      <Tag
        icon={<FilterOutlined />}
        color="pink"
        style={{ fontWeight: 500, borderRadius: '6px', padding: '4px 12px' }}
      >
        Triage View
      </Tag>
    );
  }

  return null;
}

/**
 * Compact text indicator for use in descriptions
 */
export function getScopeMessage(user: User | null): string {
  if (!user) return 'Login to view your dashboard';

  if (user.role === 'Administrator') {
    return 'Showing hospital-wide data';
  }

  if (user.role === 'Doctor') {
    return `Showing ${user.department} department data only`;
  }

  if (user.role === 'AuxiliaryNurse') {
    return 'Showing triage and scheduling data';
  }

  return 'Showing filtered data based on your role';
}
