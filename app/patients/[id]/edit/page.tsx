'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { App, Spin } from 'antd';
import { useRouter, useParams } from 'next/navigation';
import { PatientForm } from '@/components/patients/PatientForm';
import { PageHeader } from '@/components/shared/PageHeader';
import { Patient } from '@/types';
import { filterPatientsByUser } from '@/lib/dataFilters';

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const { message } = App.useApp();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<Patient> | null>(null);

  const accessiblePatients = useMemo(() => {
    if (!user) return [];
    return filterPatientsByUser(user);
  }, [user]);

  const patient = accessiblePatients.find((p: Patient) => p.id === params.id);

  useEffect(() => {
    if (patient) {
      setInitialValues({
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        email: patient.email,
        contactNumber: patient.contactNumber,
        address: patient.address,
        bloodGroup: patient.bloodGroup,
        allergies: patient.allergies?.join(', ') || '',
        emergencyContactName: patient.emergencyContact?.name || '',
        emergencyContactPhone: patient.emergencyContact?.contactNumber || '',
        emergencyContactRelationship: patient.emergencyContact?.relationship || '',
      });
    }
  }, [patient]);

  if (!patient) {
    return (
      <div className="   min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  const handleSubmit = async (values: { [key: string]: string | number }) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success('Patient updated successfully!');
      router.push(`/patients/${params.id}`);
    } catch (error) {
      message.error('Failed to update patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/patients/${params.id}`);
  };

  return (
    <div>
      <PageHeader
        title="Edit Patient"
        subtitle={`Editing ${patient.firstName} ${patient.lastName}`}
        showBackButton
        onBack={() => router.push(`/patients/${params.id}`)}
      />
      <PatientForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        initialValues={initialValues}
        mode="edit"
      />
    </div>
  );
}
