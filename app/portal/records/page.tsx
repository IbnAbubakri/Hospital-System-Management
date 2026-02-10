'use client';

import React from 'react';
import { Card, Table, Tag, Tabs } from 'antd';

export default function PortalRecordsPage() {
  const medicalRecords = [
    { key: '1', date: '2024-01-25', visitType: 'OPD', doctor: 'Dr. Emily Brown', diagnosis: 'Hypertension', department: 'Cardiology' },
    { key: '2', date: '2024-01-10', visitType: 'Follow-up', doctor: 'Dr. Michael Chen', diagnosis: 'Viral Infection', department: 'General Medicine' },
    { key: '3', date: '2023-11-15', visitType: 'Emergency', doctor: 'Dr. Emily Brown', diagnosis: 'Chest Pain', department: 'Emergency' },
  ];

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Visit Type', dataIndex: 'visitType', key: 'visitType', render: (type: string) => <Tag>{type}</Tag> },
    { title: 'Doctor', dataIndex: 'doctor', key: 'doctor' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Diagnosis', dataIndex: 'diagnosis', key: 'diagnosis' },
    { title: 'Actions', key: 'actions', render: () => <a>View Details</a> },
  ];

  const prescriptions = [
    { key: '1', date: '2024-01-25', medications: 'Amlodipine 5mg, Hydrochlorothiazide 25mg', doctor: 'Dr. Emily Brown' },
    { key: '2', date: '2024-01-10', medications: 'Paracetamol 500mg, Vitamin C', doctor: 'Dr. Michael Chen' },
  ];

  const prescriptionColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Medications', dataIndex: 'medications', key: 'medications' },
    { title: 'Prescribed By', dataIndex: 'doctor', key: 'doctor' },
    { title: 'Actions', key: 'actions', render: () => <a>View</a> },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Health Records</h2>

      <Card>
        <Tabs
          items={[
            {
              key: 'visits',
              label: 'Visit History',
              children: <div className="overflow-x-auto"><Table dataSource={medicalRecords} columns={columns} pagination={{ pageSize: 10 }} /></div>,
            },
            {
              key: 'prescriptions',
              label: 'Prescriptions',
              children: <div className="overflow-x-auto"><Table dataSource={prescriptions} columns={prescriptionColumns} pagination={{ pageSize: 10 }} /></div>,
            },
            {
              key: 'labs',
              label: 'Lab Results',
              children: <div className="text-center py-8 text-gray-500">No lab results available</div>,
            },
            {
              key: 'imaging',
              label: 'Imaging',
              children: <div className="text-center py-8 text-gray-500">No imaging records available</div>,
            },
          ]}
        />
      </Card>
    </div>
  );
}
