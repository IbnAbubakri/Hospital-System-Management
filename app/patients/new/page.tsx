'use client';

import React, { useState } from 'react';
import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { PatientForm } from '@/components/patients/PatientForm';
import { PageHeader } from '@/components/shared/PageHeader';

export default function NewPatientPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { [key: string]: string | number }) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate MRN
      const mrn = `MRN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;


      message.success('Patient registered successfully!');

      // Navigate to patient list
      router.push('/patients');
    } catch (error) {
      message.error('Failed to register patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div>
      <PageHeader
        title="Register New Patient"
        subtitle="Enter patient details to register in the system"
        showBackButton
      />
      <PatientForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}
