'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useAuth } from '@/lib/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const isAuthRoute = pathname?.startsWith('/login') ||
                      pathname?.startsWith('/forgot-password') ||
                      pathname?.startsWith('/reset-password') ||
                      pathname?.startsWith('/register');

  useEffect(() => {
    if (!isLoading && !isAuthRoute && !user) {
      router.replace('/login');
    }
  }, [isLoading, isAuthRoute, user, router]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f5f7fa'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f5f7fa'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
