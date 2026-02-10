'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Tag, Drawer, Typography, Row, Col, Badge } from 'antd';
import { SearchOutlined, EyeOutlined, SyncOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Text } = Typography;

interface AnalyzerResult {
  id: string;
  sampleId: string;
  patientName: string;
  mrn: string;
  test: string;
  analyzer: string;
  status: 'completed' | 'pending' | 'error' | 'in_progress';
  resultTime: string;
  operator: string;
}

export default function AnalyzerInterfacePage() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedResult, setSelectedResult] = useState<AnalyzerResult | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [results] = useState<AnalyzerResult[]>([
    { id: '1', sampleId: 'SAM-2024-0125', patientName: 'Chukwuemeka Okonkwo', mrn: 'MRN-2024-0001', test: 'Complete Blood Count', analyzer: 'Sysmex XN-1000', status: 'completed', resultTime: '2024-02-05 10:30', operator: 'Lab Tech. Amaka Okafor' },
    { id: '2', sampleId: 'SAM-2024-0126', patientName: 'Grace Adeleke', mrn: 'MRN-2024-0015', test: 'Metabolic Panel', analyzer: 'Cobas c311', status: 'in_progress', resultTime: '-', operator: 'Lab Tech. Chioma Eze' },
    { id: '3', sampleId: 'SAM-2024-0127', patientName: 'Tobi Okafor', mrn: 'MRN-2024-0007', test: 'Lipid Profile', analyzer: 'Cobas c311', status: 'pending', resultTime: '-', operator: '-' },
    { id: '4', sampleId: 'SAM-2024-0124', patientName: 'Emeka Nnamdi', mrn: 'MRN-2024-0018', test: 'HbA1c', analyzer: 'Bio-Rad D-10', status: 'error', resultTime: '-', operator: 'Lab Tech. Fatima Ibrahim' },
  ]);

  const [animatedStats, setAnimatedStats] = useState({ pending: 0, running: 0, completed: 0, errors: 0 });

  useEffect(() => {
    const stats = { pending: results.filter(r => r.status === 'pending').length, running: results.filter(r => r.status === 'in_progress').length, completed: results.filter(r => r.status === 'completed').length, errors: results.filter(r => r.status === 'error').length };
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / 30, 3);
      setAnimatedStats({ pending: Math.round(ease * stats.pending), running: Math.round(ease * stats.running), completed: Math.round(ease * stats.completed), errors: Math.round(ease * stats.errors) });
      if (step >= 30) clearInterval(interval);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const filteredResults = results.filter(r => {
    const m = r.patientName.toLowerCase().includes(searchText.toLowerCase()) || r.sampleId.toLowerCase().includes(searchText.toLowerCase());
    const s = !statusFilter || r.status === statusFilter;
    return m && s;
  });

  const columns = [
    { title: 'Sample ID', dataIndex: 'sampleId', key: 'sampleId', render: (id: string) => <Tag color="blue">{id}</Tag> },
    { title: 'Patient', key: 'patient', render: (_: any, r: AnalyzerResult) => (<div><div className="font-medium">{r.patientName}</div><Text type="secondary" className="text-xs">{r.mrn}</Text></div>) },
    { title: 'Test', dataIndex: 'test', key: 'test' },
    { title: 'Analyzer', dataIndex: 'analyzer', key: 'analyzer' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => { const c: Record<string, string> = { completed: 'success', pending: 'default', error: 'error', in_progress: 'processing' }; return <Tag color={c[s]} icon={s === 'in_progress' ? <SyncOutlined spin /> : undefined}>{s.toUpperCase().replace('_', ' ')}</Tag>; } },
    { title: 'Result Time', dataIndex: 'resultTime', key: 'resultTime' },
    { title: 'Actions', key: 'actions', render: (_: any, r: AnalyzerResult) => (<Button type="text" icon={<EyeOutlined />} onClick={() => { setSelectedResult(r); setDrawerVisible(true); }}>View</Button>) },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)' }}>
      <style jsx global>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .page-content { animation: fadeInUp 0.5s ease-out forwards; }
        .stat-card { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; position: relative; overflow: hidden; }
        .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--card-color) 0%, rgba(255,255,255,0.5) 50%, var(--card-color) 100%); background-size: 200% 100%; animation: shimmer 3s infinite; }
        .stat-card:nth-child(1) { animation-delay: 0.1s; --card-color: #F59E0B; }
        .stat-card:nth-child(2) { animation-delay: 0.15s; --card-color: #3B82F6; }
        .stat-card:nth-child(3) { animation-delay: 0.2s; --card-color: #10B981; }
        .stat-card:nth-child(4) { animation-delay: 0.25s; --card-color: #EF4444; }
        .stat-card:hover { transform: translateY(-4px); transition: transform 0.3s ease; box-shadow: 0 12px 24px -8px var(--card-color); }
      `}</style>

      <div style={{ padding: '32px', background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)', borderBottom: '1px solid #E2E8F0' }}>
        <div className="page-content">
          <div className="flex items-center gap-3 mb-6"><div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)', borderRadius: '2px' }} /><div><h1 className="text-2xl font-semibold text-gray-900">Laboratory Analyzer Interface</h1></div></div>
          <p className="text-gray-500 text-sm" style={{ marginLeft: '7px' }}>Monitor analyzer status and test results in real-time</p>

          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            {[
              { label: 'Pending', value: animatedStats.pending, color: '#F59E0B', bg: '#FEF3C7', border: '#FDE68A' },
              { label: 'Running', value: animatedStats.running, color: '#3B82F6', bg: '#EFF6FF', border: '#DBEAFE' },
              { label: 'Completed', value: animatedStats.completed, color: '#10B981', bg: '#D1FAE5', border: '#A7F3D0' },
              { label: 'Errors', value: animatedStats.errors, color: '#EF4444', bg: '#FEE2E2', border: '#FECACA' },
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

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8 page-content">
        <Card title="Analyzer Results" extra={<div className="flex flex-col sm:flex-row gap-3"><Search placeholder="Search..." allowClear className="w-full sm:w-auto" style={{ width: 200 }} value={searchText} onChange={(e) => setSearchText(e.target.value)} prefix={<SearchOutlined />} /><Button.Group><Button size="small">Pending</Button><Button size="small" type="primary">Running</Button><Button size="small">Completed</Button></Button.Group></div>}>
          <div className="overflow-x-auto">
            <Table dataSource={filteredResults} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
          </div>
        </Card>
      </div>

      <Drawer title="Result Details" placement="right" size="large" open={drawerVisible} onClose={() => { setDrawerVisible(false); setSelectedResult(null); }}>
        {selectedResult && (<Card><div className="mb-3"><Text type="secondary">Sample ID</Text><div><Tag color="blue">{selectedResult.sampleId}</Tag></div></div><div className="mb-3"><Text type="secondary">Patient</Text><div className="text-xl font-semibold">{selectedResult.patientName}</div><div className="text-sm text-gray-500">{selectedResult.mrn}</div></div><Row gutter={16}><Col span={12}><div className="mb-3"><Text type="secondary">Test</Text><div>{selectedResult.test}</div></div></Col><Col span={12}><div className="mb-3"><Text type="secondary">Analyzer</Text><div>{selectedResult.analyzer}</div></div></Col><Col span={12}><div className="mb-3"><Text type="secondary">Status</Text><div><Tag color="blue">{selectedResult.status.toUpperCase()}</Tag></div></div></Col><Col span={12}><div className="mb-3"><Text type="secondary">Operator</Text><div>{selectedResult.operator}</div></div></Col></Row></Card>)}
      </Drawer>
    </div>
  );
}
