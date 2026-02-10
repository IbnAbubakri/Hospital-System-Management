'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Tag, Drawer, Typography, Row, Col, Statistic } from 'antd';
import { SearchOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Text } = Typography;

interface TATRecord {
  id: string;
  test: string;
  department: string;
  avgTAT: number;
  targetTAT: number;
  compliance: number;
  samples: number;
  withinTarget: number;
  trend: 'improving' | 'stable' | 'declining';
}

export default function TurnaroundTimePage() {
  const [searchText, setSearchText] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<TATRecord | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [records] = useState<TATRecord[]>([
    { id: '1', test: 'Complete Blood Count', department: 'Hematology', avgTAT: 45, targetTAT: 60, compliance: 95, samples: 245, withinTarget: 233, trend: 'improving' },
    { id: '2', test: 'Comprehensive Metabolic Panel', department: 'Chemistry', avgTAT: 55, targetTAT: 60, compliance: 92, samples: 189, withinTarget: 174, trend: 'stable' },
    { id: '3', test: 'Troponin I', department: 'Chemistry', avgTAT: 25, targetTAT: 30, compliance: 98, samples: 67, withinTarget: 66, trend: 'improving' },
    { id: '4', test: 'Urinalysis', department: 'Urinalysis', avgTAT: 35, targetTAT: 45, compliance: 89, samples: 156, withinTarget: 139, trend: 'declining' },
    { id: '5', test: 'Blood Culture', department: 'Microbiology', avgTAT: 72, targetTAT: 48, compliance: 67, samples: 52, withinTarget: 35, trend: 'improving' },
    { id: '6', test: 'Coagulation Panel', department: 'Hematology', avgTAT: 38, targetTAT: 60, compliance: 96, samples: 98, withinTarget: 94, trend: 'stable' },
    { id: '7', test: 'HbA1c', department: 'Chemistry', avgTAT: 42, targetTAT: 60, compliance: 93, samples: 156, withinTarget: 145, trend: 'improving' },
    { id: '8', test: 'Urine Culture', department: 'Microbiology', avgTAT: 48, targetTAT: 48, compliance: 88, samples: 87, withinTarget: 77, trend: 'stable' },
  ]);

  const [animatedStats, setAnimatedStats] = useState({ avgTAT: 0, compliance: 0, samples: 0, withinTarget: 0 });

  useEffect(() => {
    const stats = {
      avgTAT: Math.round(records.reduce((s, r) => s + r.avgTAT, 0) / records.length),
      compliance: parseFloat((records.reduce((s, r) => s + r.compliance, 0) / records.length).toFixed(1)),
      samples: records.reduce((s, r) => s + r.samples, 0),
      withinTarget: records.reduce((s, r) => s + r.withinTarget, 0)
    };

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const e = 1 - Math.pow(1 - step / 30, 3);
      setAnimatedStats({
        avgTAT: Math.round(e * stats.avgTAT),
        compliance: parseFloat((e * stats.compliance).toFixed(1)),
        samples: Math.round(e * stats.samples),
        withinTarget: Math.round(e * stats.withinTarget)
      });

      if (step >= 30) clearInterval(interval);
    }, 1000 / 30);

    return () => clearInterval(interval);
  }, []);

  const filteredRecords = records.filter(r =>
    r.test.toLowerCase().includes(searchText.toLowerCase()) ||
    r.department.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Test',
      dataIndex: 'test',
      key: 'test',
      render: (t: string) => <span className="font-medium">{t}</span>
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (d: string) => <Tag color="blue">{d}</Tag>
    },
    {
      title: 'Avg TAT',
      dataIndex: 'avgTAT',
      key: 'avgTAT',
      render: (t: number) => <span className="font-semibold text-orange-600">{t} min</span>
    },
    {
      title: 'Target',
      dataIndex: 'targetTAT',
      key: 'targetTAT',
      render: (t: number) => <span className="text-gray-600">{t} min</span>
    },
    {
      title: 'Compliance',
      dataIndex: 'compliance',
      key: 'compliance',
      render: (c: number) => {
        const color = c >= 95 ? 'success' : c >= 90 ? 'warning' : 'error';
        return <Tag color={color}>{c}%</Tag>;
      }
    },
    {
      title: 'Samples',
      dataIndex: 'samples',
      key: 'samples',
      render: (s: number) => <span className="font-medium">{s}</span>
    },
    {
      title: 'Within Target',
      dataIndex: 'withinTarget',
      key: 'withinTarget',
      render: (w: number) => {
        const found = records.find(r => r.withinTarget === w);
        const samples = found?.samples || 1;
        const percentage = Math.round((w / samples) * 100);
        return <Tag color={percentage >= 95 ? 'success' : percentage >= 90 ? 'warning' : 'error'}>{w} ({percentage}%)</Tag>;
      }
    },
    {
      title: 'Trend',
      dataIndex: 'trend',
      key: 'trend',
      render: (t: string) => {
        const colorMap: Record<string, string> = { improving: 'success', stable: 'default', declining: 'error' };
        return <Tag color={colorMap[t] || 'default'}>{t.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, r: TATRecord) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedRecord(r);
            setDrawerVisible(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <ClockCircleOutlined style={{ color: '#10B981' }} />;
      case 'declining':
        return <ClockCircleOutlined style={{ color: '#EF4444' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#6B7280' }} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)' }}>
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .page-content { animation: fadeInUp 0.5s ease-out forwards; }

        .stat-card {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--card-color) 0%, rgba(255,255,255,0.5) 50%, var(--card-color) 100%);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }

        .stat-card:nth-child(1) { animation-delay: 0.1s; --card-color: #3B82F6; }
        .stat-card:nth-child(2) { animation-delay: 0.15s; --card-color: #10B981; }
        .stat-card:nth-child(3) { animation-delay: 0.2s; --card-color: #8B5CF6; }
        .stat-card:nth-child(4) { animation-delay: 0.25s; --card-color: #F59E0B; }

        .stat-card:hover {
          transform: translateY(-4px);
          transition: transform 0.3s ease;
          box-shadow: 0 12px 24px -8px var(--card-color);
        }

        .stat-number { transition: transform 0.3s ease; }
        .stat-card:hover .stat-number { transform: scale(1.1); }
      `}</style>

      {/* Header Section */}
      <div style={{
        padding: '32px',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        borderBottom: '1px solid #E2E8F0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        <div className="page-content" style={{ animationDelay: '0s', position: 'relative', zIndex: 1 }}>
          <div className="flex items-center gap-3 mb-1">
            <div style={{
              width: '4px',
              height: '28px',
              background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)',
              borderRadius: '2px'
            }} />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Turnaround Time Analytics
              </h1>
            </div>
          </div>
          <p className="text-gray-500 text-sm" style={{ marginLeft: '7px' }}>
            Monitor test processing times and compliance targets
          </p>

          {/* Stats Cards */}
          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            <Col xs={12} sm={6}>
              <div
                className="stat-card"
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #EFF6FF 0%, rgba(255,255,255,0.8) 100%)',
                  border: '1px solid #DBEAFE',
                }}
              >
                <div className="text-sm font-medium" style={{ color: '#64748B', marginBottom: '6px' }}>
                  Avg TAT
                </div>
                <div className="stat-number" style={{ fontSize: '28px', fontWeight: 700, color: '#3B82F6', lineHeight: 1 }}>
                  {animatedStats.avgTAT} <span className="text-lg">min</span>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div
                className="stat-card"
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)',
                  border: '1px solid #A7F3D0',
                }}
              >
                <div className="text-sm font-medium" style={{ color: '#64748B', marginBottom: '6px' }}>
                  Compliance
                </div>
                <div className="stat-number" style={{ fontSize: '28px', fontWeight: 700, color: '#10B981', lineHeight: 1 }}>
                  {animatedStats.compliance} <span className="text-lg">%</span>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div
                className="stat-card"
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)',
                  border: '1px solid #DDD6FE',
                }}
              >
                <div className="text-sm font-medium" style={{ color: '#64748B', marginBottom: '6px' }}>
                  Total Samples
                </div>
                <div className="stat-number" style={{ fontSize: '28px', fontWeight: 700, color: '#8B5CF6', lineHeight: 1 }}>
                  {animatedStats.samples}
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div
                className="stat-card"
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)',
                  border: '1px solid #FDE68A',
                }}
              >
                <div className="text-sm font-medium" style={{ color: '#64748B', marginBottom: '6px' }}>
                  Within Target
                </div>
                <div className="stat-number" style={{ fontSize: '28px', fontWeight: 700, color: '#F59E0B', lineHeight: 1 }}>
                  {animatedStats.withinTarget}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-8 py-6 page-content" style={{ animationDelay: '0.1s' }}>
        <Card
          title="TAT by Test"
          extra={
            <div className="flex gap-3">
              <Search
                placeholder="Search tests..."
                allowClear
                style={{ width: 200 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
              />
              <Button icon={<ClockCircleOutlined />}>Export Report</Button>
            </div>
          }
        >
          <div className="overflow-x-auto">
        <Table
            dataSource={filteredRecords}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} tests`
            }}
            scroll={{ x: 800 }}
          />
          </div>
        </Card>
      </div>

      {/* Detail Drawer */}
      <Drawer
        title="TAT Details"
        placement="right"
        size="large"
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedRecord(null);
        }}
      >
        {selectedRecord && (
          <div>
            <Card style={{ marginBottom: '16px' }}>
              <div className="mb-4">
                <Text type="secondary">Test</Text>
                <div className="text-xl font-semibold">{selectedRecord.test}</div>
                <div><Tag color="blue">{selectedRecord.department}</Tag></div>
              </div>

              <Row gutter={16}>
                <Col span={12}>
                  <div className="mb-3">
                    <Text type="secondary">Average TAT</Text>
                    <div className="text-lg font-semibold text-orange-600">{selectedRecord.avgTAT} min</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="mb-3">
                    <Text type="secondary">Target TAT</Text>
                    <div className="text-lg font-semibold">{selectedRecord.targetTAT} min</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="mb-3">
                    <Text type="secondary">Compliance</Text>
                    <div>
                      <Tag color={selectedRecord.compliance >= 95 ? 'success' : selectedRecord.compliance >= 90 ? 'warning' : 'error'}>
                        {selectedRecord.compliance}%
                      </Tag>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="mb-3">
                    <Text type="secondary">Total Samples</Text>
                    <div className="text-lg font-semibold">{selectedRecord.samples}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="mb-3">
                    <Text type="secondary">Within Target</Text>
                    <div className="text-lg font-semibold">{selectedRecord.withinTarget}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="mb-3">
                    <Text type="secondary">Trend</Text>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(selectedRecord.trend)}
                      <Tag color={selectedRecord.trend === 'improving' ? 'success' : selectedRecord.trend === 'declining' ? 'error' : 'default'}>
                        {selectedRecord.trend.toUpperCase()}
                      </Tag>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            <Card title="Performance Metrics" style={{ marginBottom: '16px' }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">SLA Achievement</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((selectedRecord.withinTarget / selectedRecord.samples) * 100)}%
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">TAT Variance</div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.abs(selectedRecord.avgTAT - selectedRecord.targetTAT)} min
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Drawer>
    </div>
  );
}