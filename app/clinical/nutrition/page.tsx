'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, Table, Input, Button, Tag, Select, Drawer, Typography, Row, Col } from 'antd';
import { SearchOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

interface NutritionPlan {
  id: string;
  patientName: string;
  mrn: string;
  dietType: string;
  allergies: string[];
  calorieTarget: number;
  proteinTarget: number;
  status: 'active' | 'pending_review' | 'modified';
  dietician: string;
  lastUpdated: string;
}

export default function NutritionPage() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedPlan, setSelectedPlan] = useState<NutritionPlan | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [nutritionPlans] = useState<NutritionPlan[]>([
    { id: '1', patientName: 'Chukwuemeka Okonkwo', mrn: 'MRN-2024-0001', dietType: 'Diabetic Diet', allergies: ['None'], calorieTarget: 1800, proteinTarget: 80, status: 'active', dietician: 'Diet. Amaka Okafor', lastUpdated: '2024-02-05' },
    { id: '2', patientName: 'Grace Adeleke', mrn: 'MRN-2024-0015', dietType: 'Low Sodium Diet', allergies: ['Shellfish'], calorieTarget: 2000, proteinTarget: 90, status: 'active', dietician: 'Diet. Chioma Eze', lastUpdated: '2024-02-04' },
    { id: '3', patientName: 'Emeka Nnamdi', mrn: 'MRN-2024-0018', dietType: 'Renal Diet', allergies: ['None'], calorieTarget: 1600, proteinTarget: 40, status: 'pending_review', dietician: 'Diet. Fatima Ibrahim', lastUpdated: '2024-02-03' },
  ]);

  const [animatedStats, setAnimatedStats] = useState({ total: 0, active: 0, pending: 0, modified: 0 });

  useEffect(() => {
    const stats = { total: nutritionPlans.length, active: nutritionPlans.filter(p => p.status === 'active').length, pending: nutritionPlans.filter(p => p.status === 'pending_review').length, modified: nutritionPlans.filter(p => p.status === 'modified').length };
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / 30;
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedStats({
        total: Math.round(easeProgress * stats.total),
        active: Math.round(easeProgress * stats.active),
        pending: Math.round(easeProgress * stats.pending),
        modified: Math.round(easeProgress * stats.modified),
      });
      if (step >= 30) clearInterval(interval);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  const filteredPlans = useMemo(() => nutritionPlans.filter(plan => {
    const matchesSearch = plan.patientName.toLowerCase().includes(searchText.toLowerCase()) || plan.mrn.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [searchText, statusFilter, nutritionPlans]);

  const columns = [
    { title: 'Patient', key: 'patient', render: (_: any, r: NutritionPlan) => (<div><div className="font-medium">{r.patientName}</div><Text type="secondary" className="text-xs">{r.mrn}</Text></div>) },
    { title: 'Diet Type', dataIndex: 'dietType', key: 'dietType' },
    { title: 'Calories', dataIndex: 'calorieTarget', key: 'calorieTarget', render: (c: number) => `${c} kcal` },
    { title: 'Protein', dataIndex: 'proteinTarget', key: 'proteinTarget', render: (p: number) => `${p}g` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => { const colors: Record<string, string> = { active: 'success', pending_review: 'warning', modified: 'processing' }; return <Tag color={colors[s] || 'default'}>{s.replace('_', ' ').toUpperCase()}</Tag>; } },
    { title: 'Actions', key: 'actions', render: (_: any, r: NutritionPlan) => (<Button type="text" icon={<EyeOutlined />} onClick={() => { setSelectedPlan(r); setDrawerVisible(true); }}>View</Button>) },
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
        .stat-card:nth-child(3) { animation-delay: 0.2s; --card-color: #F59E0B; }
        .stat-card:nth-child(4) { animation-delay: 0.25s; --card-color: #8B5CF6; }
        .stat-card:hover { transform: translateY(-4px); transition: transform 0.3s ease; box-shadow: 0 12px 24px -8px var(--card-color); }
      `}</style>

      <div style={{ padding: '32px', background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)', borderBottom: '1px solid #E2E8F0' }}>
        <div className="page-content">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3"><div style={{ width: '4px', height: '28px', background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)', borderRadius: '2px' }} /><div><h1 className="text-2xl font-semibold text-gray-900">Nutrition Management</h1></div></div>
            <Button type="primary" icon={<PlusOutlined />}>New Plan</Button>
          </div>
          <p className="text-gray-500 text-sm" style={{ marginLeft: '7px' }}>Manage patient nutrition plans and dietary requirements</p>

          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            {[
              { label: 'Total Plans', value: animatedStats.total, color: '#3B82F6', bg: '#EFF6FF', border: '#DBEAFE' },
              { label: 'Active', value: animatedStats.active, color: '#10B981', bg: '#D1FAE5', border: '#A7F3D0' },
              { label: 'Pending Review', value: animatedStats.pending, color: '#F59E0B', bg: '#FEF3C7', border: '#FDE68A' },
              { label: 'Modified', value: animatedStats.modified, color: '#8B5CF6', bg: '#EDE9FE', border: '#DDD6FE' },
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
        <Card title="Nutrition Plans" extra={<div className="flex gap-3"><Search placeholder="Search..." allowClear style={{ width: 200 }} value={searchText} onChange={(e) => setSearchText(e.target.value)} prefix={<SearchOutlined />} /><Select placeholder="Status" value={statusFilter} onChange={setStatusFilter} allowClear style={{ width: 140 }}><Option value="active">Active</Option><Option value="pending_review">Pending</Option><Option value="modified">Modified</Option></Select></div>}>
          <Table dataSource={filteredPlans} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
        </Card>
      </div>

      <Drawer title="Nutrition Plan Details" placement="right" size="large" open={drawerVisible} onClose={() => { setDrawerVisible(false); setSelectedPlan(null); }}>
        {selectedPlan && (<Card><div className="mb-3"><Text type="secondary">Patient</Text><div className="text-xl font-semibold">{selectedPlan.patientName}</div><div className="text-sm text-gray-500">{selectedPlan.mrn}</div></div><Row gutter={16}><Col span={12}><div className="mb-3"><Text type="secondary">Diet Type</Text><div>{selectedPlan.dietType}</div></div></Col><Col span={12}><div className="mb-3"><Text type="secondary">Status</Text><div><Tag color="success">ACTIVE</Tag></div></div></Col><Col span={12}><div className="mb-3"><Text type="secondary">Calorie Target</Text><div>{selectedPlan.calorieTarget} kcal</div></div></Col><Col span={12}><div className="mb-3"><Text type="secondary">Protein Target</Text><div>{selectedPlan.proteinTarget}g</div></div></Col></Row><div className="mt-4"><Text type="secondary">Dietician</Text><div>{selectedPlan.dietician}</div></div></Card>)}
      </Drawer>
    </div>
  );
}
