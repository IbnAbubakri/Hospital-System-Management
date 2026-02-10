'use client';

import React, { useState } from 'react';
import { Table, Button, Tag, Input, Badge, Drawer, Typography, Progress } from 'antd';
import { WarningOutlined, UserOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { mockEmergencyPatients, mockEDStats } from '@/lib/mockDataExtended';
import { EmergencyPatient } from '@/types';
import { formatDateTime } from '@/lib/utils';

const { Text } = Typography;

export default function EDTrackingPage() {
  const [searchText, setSearchText] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<EmergencyPatient | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const filteredPatients = mockEmergencyPatients.filter((patient) => {
    return (
      patient.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.visitNumber.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const getTriageColor = (level: number) => {
    const colors: Record<number, { bg: string; border: string; text: string }> = {
      1: { bg: '#FEE2E2', border: '#DC2626', text: '#DC2626' },
      2: { bg: '#FED7AA', border: '#EA580C', text: '#EA580C' },
      3: { bg: '#FEF3C7', border: '#D97706', text: '#D97706' },
      4: { bg: '#DBEAFE', border: '#3B82F6', text: '#3B82F6' },
      5: { bg: '#D1FAE5', border: '#10B981', text: '#10B981' },
    };
    return colors[level];
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string }> = {
      waiting: { color: '#F59E0B', bg: '#FEF3C7' },
      triaged: { color: '#3B82F6', bg: '#DBEAFE' },
      in_examination: { color: '#8B5CF6', bg: '#EDE9FE' },
      admitted: { color: '#10B981', bg: '#D1FAE5' },
      discharged: { color: '#059669', bg: '#D1FAE5' },
      transferred: { color: '#6366F1', bg: '#EDE9FE' },
      deceased: { color: '#EF4444', bg: '#FEE2E2' },
    };
    return configs[status] || configs.waiting;
  };

  const columns = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_: any, record: EmergencyPatient) => (
        <div>
          <div className="font-medium">{record.patientName}</div>
          <div className="text-xs text-gray-500">{record.mrn}</div>
        </div>
      ),
    },
    { title: 'Visit Number', dataIndex: 'visitNumber', key: 'visitNumber' },
    {
      title: 'Triage',
      dataIndex: 'triageLevel',
      key: 'triage',
      render: (level: number) => {
        const config = getTriageColor(level);
        return (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: config.bg,
              border: `2px solid ${config.border}`,
              color: config.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            {level}
          </div>
        );
      },
    },
    {
      title: 'Chief Complaint',
      dataIndex: 'chiefComplaint',
      key: 'complaint',
      ellipsis: true,
    },
    {
      title: 'Arrival',
      dataIndex: 'arrivalDate',
      key: 'arrival',
      render: (d: Date) => formatDateTime(d),
    },
    {
      title: 'Mode',
      dataIndex: 'arrivalMode',
      key: 'mode',
      render: (mode: string) => mode.replace('_', ' ').toUpperCase(),
    },
    { title: 'Bed/Location', dataIndex: 'bed', key: 'bed', render: (bed?: string) => bed || '—' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getStatusConfig(status);
        return <Tag style={{ backgroundColor: config.bg, color: config.color, border: 'none', fontWeight: 500 }}>{status.replace('_', ' ').toUpperCase()}</Tag>;
      },
    },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: EmergencyPatient) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => viewPatient(record)} />
      ),
    },
  ];

  const viewPatient = (patient: EmergencyPatient) => {
    setSelectedPatient(patient);
    setDrawerVisible(true);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #FEF2F2 0%, #F8FAFC 100%)', padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <WarningOutlined style={{ color: '#DC2626' }} />
              ED Tracking Board
            </h1>
            <p className="text-gray-500 text-sm">Real-time emergency department patient tracking</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div style={{ padding: '16px', background: '#FEF2F2', borderRadius: '10px', border: '2px solid #FECACA' }}>
            <div className="text-sm text-gray-500 mb-1">Total Patients</div>
            <div className="text-2xl font-bold text-red-600">{mockEDStats.totalPatients}</div>
          </div>
          <div style={{ padding: '16px', background: '#FEF3C7', borderRadius: '10px', border: '2px solid #FDE68A' }}>
            <div className="text-sm text-gray-500 mb-1">Critical (1-2)</div>
            <div className="text-2xl font-bold text-yellow-600">{mockEDStats.critical}</div>
          </div>
          <div style={{ padding: '16px', background: '#DBEAFE', borderRadius: '10px', border: '2px solid #BFDBFE' }}>
            <div className="text-sm text-gray-500 mb-1">In Progress</div>
            <div className="text-2xl font-bold text-blue-600">{mockEDStats.inProgress}</div>
          </div>
          <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '10px', border: '2px solid #E5E7EB' }}>
            <div className="text-sm text-gray-500 mb-1">Bed Occupancy</div>
            <div className="text-2xl font-bold text-gray-700">{mockEDStats.bedOccupancy}/{mockEDStats.totalBeds}</div>
            <Progress percent={Math.round((mockEDStats.bedOccupancy / mockEDStats.totalBeds) * 100)} size="small" strokeColor="#6B7280" showInfo={false} />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Input placeholder="Search patients..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ flex: 1, maxWidth: '400px' }} />
          <Badge count={filteredPatients.length} style={{ background: '#DC2626' }} />
        </div>

        <Table dataSource={filteredPatients} columns={columns} rowKey="id" pagination={false} size="middle" />
      </div>

      <Drawer
        title="Patient Details"
        placement="right"
        width={600}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedPatient(null);
        }}
      >
        {selectedPatient && (
          <div className="flex flex-col h-full">
            <div style={{ padding: '16px', background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)', borderRadius: '12px', marginBottom: '16px' }}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedPatient.patientName}</h2>
                  <p className="text-sm text-gray-600">{selectedPatient.mrn}</p>
                </div>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: getTriageColor(selectedPatient.triageLevel).bg,
                    border: `3px solid ${getTriageColor(selectedPatient.triageLevel).border}`,
                    color: getTriageColor(selectedPatient.triageLevel).text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '24px',
                  }}
                >
                  {selectedPatient.triageLevel}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto" style={{ padding: '16px' }}>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Chief Complaint</h3>
                <p className="text-sm text-gray-600">{selectedPatient.chiefComplaint}</p>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Vitals</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {selectedPatient.vitals.bloodPressure && (
                    <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}>
                      <div className="text-xs text-gray-500">BP</div>
                      <div className="text-sm font-medium">{selectedPatient.vitals.bloodPressure}</div>
                    </div>
                  )}
                  {selectedPatient.vitals.pulse && (
                    <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}>
                      <div className="text-xs text-gray-500">Pulse</div>
                      <div className="text-sm font-medium">{selectedPatient.vitals.pulse} bpm</div>
                    </div>
                  )}
                  {selectedPatient.vitals.spO2 && (
                    <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}>
                      <div className="text-xs text-gray-500">SpO2</div>
                      <div className="text-sm font-medium">{selectedPatient.vitals.spO2}%</div>
                    </div>
                  )}
                </div>
              </div>

              {selectedPatient.assignedDoctor && (
                <div style={{ padding: '12px', background: '#EFF6FF', borderRadius: '8px' }}>
                  <div className="text-xs text-gray-500">Assigned Doctor</div>
                  <div className="text-sm font-medium">{selectedPatient.assignedDoctor}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
