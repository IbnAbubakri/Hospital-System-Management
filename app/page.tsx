'use client';

import React from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { DoctorDashboard } from '@/components/dashboard/DoctorDashboard';
import { NurseDashboard } from '@/components/dashboard/NurseDashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'admin':
    case 'Admin':
      return <AdminDashboard />;
    case 'doctor':
    case 'Doctor':
    case 'Consultant':
      return <DoctorDashboard />;
    case 'nurse':
    case 'Nurse':
    case 'Head Nurse':
      return <NurseDashboard />;
    default:
      return <AdminDashboard />;
  }
}