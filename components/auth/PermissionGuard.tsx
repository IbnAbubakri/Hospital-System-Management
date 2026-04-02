'use client';

import React from 'react';
import { Result, Button, Card } from 'antd';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string | string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function PermissionGuard({
  children,
  requiredPermission,
  requiredRole,
  fallback,
  redirectTo,
}: PermissionGuardProps) {
  const router = useRouter();
  const { hasPermission, hasRole, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        padding: '48px',
      }}>
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <div>Loading...</div>
        </Card>
      </div>
    );
  }

  if (!user) {
    if (redirectTo) {
      router.replace(redirectTo);
      return null;
    }
    return (
      <Card style={{ maxWidth: 500, margin: '48px auto' }}>
        <Result
          status="403"
          title="Authentication Required"
          subTitle="Please log in to access this page."
          extra={
            <Button type="primary" onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          }
        />
      </Card>
    );
  }

  const hasAccess = () => {
    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      return roles.some((role) => hasRole(role));
    }
    if (requiredPermission) {
      return hasPermission(requiredPermission);
    }
    return true;
  };

  if (!hasAccess()) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        padding: '24px',
      }}>
        <Card style={{ maxWidth: 500, textAlign: 'center' }}>
          <Result
            status="403"
            title="Access Denied"
            subTitle={`You don't have permission to access this page. Please contact your administrator if you believe this is an error.`}
            extra={
              <>
                <Button type="primary" onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => router.back()}>
                  Go Back
                </Button>
              </>
            }
          />
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#999' }}>
            <strong>Required:</strong> {requiredRole ? `Role: ${Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole}` : `Permission: ${requiredPermission}`}
            <br />
            <strong>Your role:</strong> {user.role}
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

interface RequireAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function RequireAuth({ children, redirectTo = '/login' }: RequireAuthProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.replace(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}>
        <Card style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <div>Loading...</div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
