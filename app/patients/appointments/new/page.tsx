'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Form, App, Card, Typography } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { mockPatients, mockDoctors } from '@/lib/mockData';

const { Title } = Typography;

function NewAppointmentContent() {
  const router = useRouter();
  const { message } = App.useApp();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (patientId) {
      form.setFieldsValue({ patientId });
    }
  }, [patientId, form]);

  const handleSubmit = async (values: { [key: string]: string | number }) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success('Appointment booked successfully!');
      router.push('/patients/appointments');
    } catch (error) {
      message.error('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Book New Appointment"
        subtitle="Schedule a new appointment for a patient"
        showBackButton
      />

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="max-w-2xl"
        >
          <Form.Item
            label="Patient"
            name="patientId"
            rules={[{ required: true, message: 'Please select a patient' }]}
          >
            <select className="w-full px-3 py-2 border rounded-md">
              <option value="">Select Patient</option>
              {mockPatients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName} ({patient.mrn})
                </option>
              ))}
            </select>
          </Form.Item>

          <Form.Item
            label="Doctor"
            name="doctorId"
            rules={[{ required: true, message: 'Please select a doctor' }]}
          >
            <select className="w-full px-3 py-2 border rounded-md">
              <option value="">Select Doctor</option>
              {mockDoctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.firstName} {doctor.lastName} ({doctor.department})
                </option>
              ))}
            </select>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <input type="date" className="w-full px-3 py-2 border rounded-md" />
            </Form.Item>

            <Form.Item
              label="Time"
              name="time"
              rules={[{ required: true, message: 'Please select a time' }]}
            >
              <select className="w-full px-3 py-2 border rounded-md">
                <option value="">Select Time</option>
                <option value="09:00">09:00 AM</option>
                <option value="09:30">09:30 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="10:30">10:30 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="11:30">11:30 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="14:30">02:30 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="15:30">03:30 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="16:30">04:30 PM</option>
              </select>
            </Form.Item>
          </div>

          <Form.Item
            label="Appointment Type"
            name="type"
            rules={[{ required: true, message: 'Please select appointment type' }]}
          >
            <select className="w-full px-3 py-2 border rounded-md">
              <option value="">Select Type</option>
              <option value="new">New Consultation</option>
              <option value="followup">Follow-up</option>
              <option value="emergency">Emergency</option>
            </select>
          </Form.Item>

          <Form.Item
            label="Reason for Visit"
            name="reason"
            rules={[{ required: true, message: 'Please enter the reason' }]}
          >
            <textarea
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter reason for appointment"
            />
          </Form.Item>

          <Form.Item label="Additional Notes" name="notes">
            <textarea
              rows={2}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Any additional notes"
            />
          </Form.Item>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default function NewAppointmentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewAppointmentContent />
    </Suspense>
  );
}
