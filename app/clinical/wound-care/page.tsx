'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, Table, Input, Button, Tag, Select, Drawer, Typography, Row, Col, Avatar, Badge } from 'antd';
import { SearchOutlined, EyeOutlined, PlusOutlined, WarningOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

interface WoundCareRecord {
  id: string;
  patientName: string;
  mrn: string;
  woundLocation: string;
  woundType: string;
  size: string;
  stage: string;
  status: 'healing' | 'stable' | 'infected' | 'deteriorating';
  lastAssessment: string;
  nextDressing: string;
  nurse: string;
}

export default function WoundCarePage() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedRecord, setSelectedRecord] = useState<WoundCareRecord | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [woundRecords] = useState<WoundCareRecord[]>([
    {
      id: '1',
      patientName: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-2024-0001',
      woundLocation: 'Left lower leg',
      woundType: 'Venous ulcer',
      size: '4cm x 3cm',
      stage: 'Stage III',
      status: 'healing',
      lastAssessment: '2024-02-05',
      nextDressing: '2024-02-06',
      nurse: 'Nurse Grace Adeleke',
    },
    {
      id: '2',
      patientName: 'Amaka Okafor',
      mrn: 'MRN-2024-0002',
      woundLocation: 'Sacral area',
      woundType: 'Pressure injury',
      size: '2cm x 2cm',
      stage: 'Stage II',
      status: 'healing',
      lastAssessment: '2024-02-04',
      nextDressing: '2024-02-05',
      nurse: 'Nurse Chioma Eze',
    },
    {
      id: '3',
      patientName: 'Tobi Okafor',
      mrn: 'MRN-2024-0007',
      woundLocation: 'Right foot',
      woundType: 'Diabetic ulcer',
      size: '3cm x 4cm',
      stage: 'Stage III',
      status: 'infected',
      lastAssessment: '2024-02-05',
      nextDressing: '2024-02-05',
      nurse: 'Nurse Fatima Ibrahim',
    },
  ]);

  const [animatedStats, setAnimatedStats] = useState({ total: 0, healing: 0, infected: 0, stable: 0 });

  const stats = useMemo(() => ({
    total: woundRecords.length,
    healing: woundRecords.filter(w => w.status === 'healing').length,
    infected: woundRecords.filter(w => w.status === 'infected').length,
    stable: woundRecords.filter(w => w.status === 'stable').length,
  }), [woundRecords]);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedStats({
        total: Math.round(easeProgress * stats.total),
        healing: Math.round(easeProgress * stats.healing),
        infected: Math.round(easeProgress * stats.infected),
        stable: Math.round(easeProgress * stats.stable),
      });
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  const filteredRecords = useMemo(() =>
    woundRecords.filter(record => {
      const matchesSearch = record.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
        record.mrn.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = !statusFilter || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    }), [searchText, statusFilter, woundRecords]);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; label: string }> = {
      'healing': { color: 'success', label: 'Healing' },
      'stable': { color: 'processing', label: 'Stable' },
      'infected': { color: 'error', label: 'Infected' },
      'deteriorating': { color: 'error', label: 'Deteriorating' },
    };
    return configs[status] || configs.stable;
  };

  const columns = [
    { title: 'Patient', key: 'patient', render: (_: any, r: WoundCareRecord) => (
      <div><div className="font-medium">{r.patientName}</div><Text type="secondary" className="text-xs">{r.mrn}</Text></div>
    )},
    { title: 'Location', dataIndex: 'woundLocation', key: 'woundLocation' },
    { title: 'Type', dataIndex: 'woundType', key: 'woundType' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { title: 'Stage', dataIndex: 'stage', key: 'stage', render: (stage: string) => <Tag color="orange">{stage}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => {
      const config = getStatusConfig(status);
      return <Tag color={config.color}>{config.label}</Tag>;
    }},
    { title: 'Next Dressing', dataIndex: 'nextDressing', key: 'nextDressing' },
    { title: 'Actions', key: 'actions', render: (_: any, r: WoundCareRecord) => (
      <Button type="text" icon={<EyeOutlined />} onClick={() => { setSelectedRecord(r); setDrawerVisible(true); }}>View</Button>
    )},
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)' }}>
      <style jsx global>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .page-content { animation: fadeInUp 0.5s ease-out forwards; }
        .stat-card { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; position: relative; overflow: hidden; }
        .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--card-color) 0%, rgba(255,255,255,0.5) 50%, var(--card-color) 100%); background-size: 200% 100%; animation: shimmer 3s infinite; }
        .stat-card:nth-child(1) { animation-delay: 0.1s; --card-color: #3B82F6; }
        .stat-card:nth-child(2) { animation-delay: 0.15s; --card-color: #10B981; }
        .stat-card:nth-child(3) { animation-delay: 0.2s; --card-color: #EF4444; }
        .stat-card:nth-child(4) { animation-delay: 0.25s; --card-color: #F59E0B; }
        .stat-card:hover { transform: translateY(-4px); transition: transform 0.3s ease; box-shadow: 0 12px 24px -8px var(--card-color); }
      `}</style>

      <div style={{ padding: '32px', background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)', borderBottom: '1px solid #E2E8F0' }}>
        <div className="page-content">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)', borderRadius: '2px' }} />
              <div><h1 className="text-2xl font-semibold text-gray-900">Wound Care Management</h1></div>
            </div>
            <Button type="primary" icon={<PlusOutlined />}>New Assessment</Button>
          </div>
          <p className="text-gray-500 text-sm" style={{ marginLeft: '7px' }}>Track and manage wound care assessments and treatments</p>

          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            {[
              { label: 'Total Wounds', value: animatedStats.total, color: '#3B82F6', bg: '#EFF6FF', border: '#DBEAFE' },
              { label: 'Healing', value: animatedStats.healing, color: '#10B981', bg: '#D1FAE5', border: '#A7F3D0' },
              { label: 'Infected', value: animatedStats.infected, color: '#EF4444', bg: '#FEE2E2', border: '#FECACA' },
              { label: 'Stable', value: animatedStats.stable, color: '#F59E0B', bg: '#FEF3C7', border: '#FDE68A' },
            ].map((stat, i) => (
              <Col xs={12} sm={6} key={i}>
                <div className="stat-card" style={{ padding: '16px', borderRadius: '12px', background: `linear-gradient(135deg, ${stat.bg} 0%, rgba(255,255,255,0.8) 100%)`, border: `1px solid ${stat.border}` }}>
                  <div className="text-sm font-medium" style={{ color: '#64748B', marginBottom: '6px' }}>{stat.label}</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <div className="px-8 py-6 page-content">
        <Card title="Wound Care Records" extra={
          <div className="flex gap-3">
            <Search placeholder="Search..." allowClear style={{ width: 200 }} value={searchText} onChange={(e) => setSearchText(e.target.value)} prefix={<SearchOutlined />} />
            <Select placeholder="Status" value={statusFilter} onChange={setStatusFilter} allowClear style={{ width: 140 }}>
              <Option value="healing">Healing</Option>
              <Option value="stable">Stable</Option>
              <Option value="infected">Infected</Option>
              <Option value="deteriorating">Deteriorating</Option>
            </Select>
          </div>
        }>
          <Table dataSource={filteredRecords} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
        </Card>
      </div>

      <Drawer title="Wound Care Details" placement="right" size="large" open={drawerVisible} onClose={() => { setDrawerVisible(false); setSelectedRecord(null); }}>
        {selectedRecord && (
          <div>
            <Card style={{ marginBottom: '16px' }}>
              <div className="mb-3"><Text type="secondary">Patient</Text><div className="text-xl font-semibold">{selectedRecord.patientName}</div><div className="text-sm text-gray-500">{selectedRecord.mrn}</div></div>
              <Row gutter={16}>
                <Col span={12}><div className="mb-3"><Text type="secondary">Location</Text><div>{selectedRecord.woundLocation}</div></div></Col>
                <Col span={12}><div className="mb-3"><Text type="secondary">Type</Text><div>{selectedRecord.woundType}</div></div></Col>
                <Col span={12}><div className="mb-3"><Text type="secondary">Size</Text><div>{selectedRecord.size}</div></div></Col>
                <Col span={12}><div className="mb-3"><Text type="secondary">Stage</Text><div><Tag color="orange">{selectedRecord.stage}</Tag></div></div></Col>
              </Row>
            </Card>
            <Card title="Assessment"><div className="mb-4"><Text type="secondary">Status</Text><div>{(() => { const c = getStatusConfig(selectedRecord.status); return <Tag color={c.color}>{c.label}</Tag>; })()}</div></div><div className="mb-4"><Text type="secondary">Assigned Nurse</Text><div>{selectedRecord.nurse}</div></div><div><Text type="secondary">Next Dressing</Text><div>{selectedRecord.nextDressing}</div></div></Card>
          </div>
        )}
      </Drawer>
    </div>
  );
}
