'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ReactNode } from 'react';
import { Spin } from 'antd';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/lib/contexts/AuthContext';

export function RootContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const isAuthRoute = pathname?.startsWith('/login') ||
                      pathname?.startsWith('/forgot-password') ||
                      pathname?.startsWith('/reset-password');

  useEffect(() => {
    if (!isLoading && !isAuthRoute) {
      if (!user) {
        router.replace('/login');
      }
    }
  }, [user, isLoading, isAuthRoute, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!user && !isAuthRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
}
