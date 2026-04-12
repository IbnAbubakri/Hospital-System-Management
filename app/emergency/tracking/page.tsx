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
          <div className=" ">{record.mrn}</div>
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
            className="  -full    font-bold text-base"
            style={{
              background: config.bg,
              border: `2px solid ${config.border}`,
              color: config.text,
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
        return <Tag className="border-none font-medium" style={{ backgroundColor: config.bg, color: config.color }}>{status.replace('_', ' ').toUpperCase()}</Tag>;
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
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-slate-50 ">
      <div className="bg-white -xl  border border-gray-200">
        <div className=" -col sm:-row items-start sm:   ">
          <div>
            <h1 className="text-2xl font-semibold     ">
              <WarningOutlined className="" />
              ED Tracking Board
            </h1>
            <p className=" ">Real-time emergency department patient tracking</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4  ">
          <div className=" bg-red-50 -xl border-2 border-red-200">
            <div className="  ">Total Patients</div>
            <div className="text-2xl font-bold ">{mockEDStats.totalPatients}</div>
          </div>
          <div className=" bg-yellow-50 -xl border-2 border-yellow-200">
            <div className="  ">Critical (1-2)</div>
            <div className="text-2xl font-bold text-yellow-600">{mockEDStats.critical}</div>
          </div>
          <div className=" bg-blue-50 -xl border-2 border-blue-200">
            <div className="  ">In Progress</div>
            <div className="text-2xl font-bold ">{mockEDStats.inProgress}</div>
          </div>
          <div className=" bg-gray-50 -xl border-2 border-gray-200">
            <div className="  ">Bed Occupancy</div>
            <div className="text-2xl font-bold ">{mockEDStats.bedOccupancy}/{mockEDStats.totalBeds}</div>
            <Progress percent={Math.round((mockEDStats.bedOccupancy / mockEDStats.totalBeds) * 100)} size="small" strokeColor="#6B7280" showInfo={false} />
          </div>
        </div>

        <div className="   ">
          <Input placeholder="Search patients..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} className="-1 max-w" />
          <Badge count={filteredPatients.length} className="bg-red-600" />
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
          <div className=" -col h-full">
            <div className=" bg-gradient-to-r from-red-50 to-red-100 -xl ">
              <div className=" -col sm:-row items-start sm:  ">
                <div>
                  <h2 className="text-xl font-bold  ">{selectedPatient.patientName}</h2>
                  <p className=" ">{selectedPatient.mrn}</p>
                </div>
                <div
                  className=" h-[60px] -full    font-bold text-2xl"
                  style={{
                    background: getTriageColor(selectedPatient.triageLevel).bg,
                    border: `3px solid ${getTriageColor(selectedPatient.triageLevel).border}`,
                    color: getTriageColor(selectedPatient.triageLevel).text,
                  }}
                >
                  {selectedPatient.triageLevel}
                </div>
              </div>
            </div>

            <div className="-1 overflow-y-auto ">
              <div className="">
                <h3 className=" font-semibold  ">Chief Complaint</h3>
                <p className=" ">{selectedPatient.chiefComplaint}</p>
              </div>

              <div className="">
                <h3 className=" font-semibold  ">Vitals</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
                  {selectedPatient.vitals.bloodPressure && (
                    <div className=" bg-gray-50 ">
                      <div className=" ">BP</div>
                      <div className=" font-medium">{selectedPatient.vitals.bloodPressure}</div>
                    </div>
                  )}
                  {selectedPatient.vitals.pulse && (
                    <div className=" bg-gray-50 ">
                      <div className=" ">Pulse</div>
                      <div className=" font-medium">{selectedPatient.vitals.pulse} bpm</div>
                    </div>
                  )}
                  {selectedPatient.vitals.spO2 && (
                    <div className=" bg-gray-50 ">
                      <div className=" ">SpO2</div>
                      <div className=" font-medium">{selectedPatient.vitals.spO2}%</div>
                    </div>
                  )}
                </div>
              </div>

              {selectedPatient.assignedDoctor && (
                <div className=" bg-blue-50 -lg">
                  <div className=" ">Assigned Doctor</div>
                  <div className=" font-medium">{selectedPatient.assignedDoctor}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
