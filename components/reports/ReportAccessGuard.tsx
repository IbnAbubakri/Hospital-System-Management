'use client';

import React from 'react';
import { Result, Button } from 'antd';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ReportAccessGuardProps {
  children: React.ReactNode;
  requiredPermission: string;
  fallback?: React.ReactNode;
}

/**
 * ReportAccessGuard Component
 *
 * Wraps report content and shows access denied if user lacks permission.
 * Follows the ProtectedRoute pattern from AuthContext.
 *
 * Usage:
 * <ReportAccessGuard requiredPermission={PERMISSIONS.VIEW_FINANCIAL_REPORTS}>
 *   <FinancialReportContent />
 * </ReportAccessGuard>
 */
export function ReportAccessGuard({
  children,
  requiredPermission,
  fallback,
}: ReportAccessGuardProps) {
  const { user, hasPermission, isAuthenticated } = useAuth();
  const router = useRouter();

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div style={{ padding: '100px 24px', textAlign: 'center' }}>
        <Result
          status="info"
          title="Authentication Required"
          subTitle="Please log in to access this report."
          extra={
            <Button type="primary" onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          }
        />
      </div>
    );
  }

  // Check if user has required permission
  const hasAccess = hasPermission(requiredPermission);

  // Show access denied if permission check fails
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div style={{ padding: '100px 24px', textAlign: 'center' }}>
        <Result
          status="403"
          title="Access Denied"
          subTitle={
            <div>
              <p>You don&apos;tt have permission to view this report.</p>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                Required permission: <code>{requiredPermission}</code>
              </p>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                Your role: <strong>{user?.role || 'Unknown'}</strong>
              </p>
            </div>
          }
          extra={
            <Button type="primary" onClick={() => router.push('/reports')}>
              Back to Reports
            </Button>
          }
        />
      </div>
    );
  }

  // Render children if user has access
  return <>{children}</>;
}

/**
 * HOC (Higher-Order Component) version for easier usage
 * Wraps a component with ReportAccessGuard
 *
 * Usage:
 * const FinancialReportWithGuard = withReportAccessGuard(FinancialReport, PERMISSIONS.VIEW_FINANCIAL_REPORTS);
 */
export function withReportAccessGuard<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: string
): React.ComponentType<P> {
  return function WrappedComponent(props: P) {
    return (
      <ReportAccessGuard requiredPermission={requiredPermission}>
        <Component {...props} />
      </ReportAccessGuard>
    );
  };
}

/**
 * Hook to check if user can access a specific report
 * Returns the access status and permission check result
 */
export function useReportAccess(requiredPermission: string): {
  canAccess: boolean;
  isAuthenticated: boolean;
  userRole: string | undefined;
  userDepartment: string | undefined;
} {
  const { hasPermission, isAuthenticated, user } = useAuth();

  return {
    canAccess: hasPermission(requiredPermission),
    isAuthenticated,
    userRole: user?.role,
    userDepartment: user?.department,
  };
}

export default ReportAccessGuard;
