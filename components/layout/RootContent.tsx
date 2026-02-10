'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';

export function RootContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Check if we're on an auth route (login, forgot-password, reset-password)
  const isAuthRoute = pathname?.startsWith('/login') ||
                      pathname?.startsWith('/forgot-password') ||
                      pathname?.startsWith('/reset-password');

  // Don't show MainLayout with sidebar for auth routes
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Show MainLayout with sidebar for all other routes
  return <MainLayout>{children}</MainLayout>;
}
