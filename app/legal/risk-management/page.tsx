'use client';

import React from 'react';
import { Card, Typography, Row, Col, Statistic, Table, Tag, Space, Progress } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function RiskManagementPage() {
  const risks = [
    { id: 1, category: 'Clinical', risk: 'Medication Errors', likelihood: 3, impact: 5, riskScore: 15, mitigation: 'Barcode scanning, double-check protocols', status: 'Controlled' },
    { id: 2, category: 'Operational', risk: 'Equipment Failure', likelihood: 2, impact: 4, riskScore: 8, mitigation: 'Preventive maintenance, backup equipment', status: 'Monitored' },
    { id: 3, category: 'Financial', risk: 'Insurance Claim Denials', likelihood: 4, impact: 3, riskScore: 12, mitigation: 'Documentation review, pre-authorization', status: 'Monitored' },
    { id: 4, category: 'Legal', risk: 'Malpractice Claims', likelihood: 2, impact: 5, riskScore: 10, mitigation: 'Quality improvement, proper documentation', status: 'Controlled' },
    { id: 5, category: 'Safety', risk: 'Patient Falls', likelihood: 3, impact: 4, riskScore: 12, mitigation: 'Fall prevention protocols, patient education', status: 'Monitored' },
    { id: 6, category: 'IT', risk: 'Data Breach', likelihood: 1, impact: 5, riskScore: 5, mitigation: 'Firewall, encryption, access controls', status: 'Controlled' },
    { id: 7, category: 'Reputation', risk: 'Negative Publicity', likelihood: 2, impact: 4, riskScore: 8, mitigation: 'PR strategy, quality service', status: 'Monitored' },
    { id: 8, category: 'Regulatory', risk: 'Non-Compliance', likelihood: 2, impact: 5, riskScore: 10, mitigation: 'Compliance monitoring, regular audits', status: 'Controlled' },
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat: string) => <Tag color="blue">{cat}</Tag> },
    { title: 'Risk Description', dataIndex: 'risk', key: 'risk' },
    {
      title: 'Likelihood',
      dataIndex: 'likelihood',
      key: 'likelihood',
      render: (value: number) => (
        <Tag color={value <= 2 ? 'success' : value <= 4 ? 'warning' : 'error'}>{value}/5</Tag>
      ),
    },
    {
      title: 'Impact',
      dataIndex: 'impact',
      key: 'impact',
      render: (value: number) => (
        <Tag color={value <= 2 ? 'success' : value <= 4 ? 'warning' : 'error'}>{value}/5</Tag>
      ),
    },
    {
      title: 'Risk Score',
      dataIndex: 'riskScore',
      key: 'riskScore',
      render: (score: number) => (
        <Tag color={score <= 5 ? 'success' : score <= 10 ? 'warning' : 'error'}>{score}</Tag>
      ),
      sorter: (a: any, b: any) => b.riskScore - a.riskScore,
    },
    { title: 'Mitigation Strategy', dataIndex: 'mitigation', key: 'mitigation' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Controlled' ? 'success' : 'warning'}>{status}</Tag>,
    },
  ];

  const highRisks = risks.filter(r => r.riskScore >= 10).length;
  const controlledRisks = risks.filter(r => r.status === 'Controlled').length;
  const avgRiskScore = Math.round(risks.reduce((sum, r) => sum + r.riskScore, 0) / risks.length);

  const likelihoodLabels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
  const riskMatrix = React.useMemo(() => {
    const matrix: Record<string, number> = {};
    risks.forEach(risk => {
      const key = `${risk.likelihood}`;
      matrix[key] = (matrix[key] || 0) + 1;
    });
    return matrix;
  }, [risks]);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Risk Management Dashboard</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="High Priority Risks"
              value={highRisks}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#EF4444' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Controlled Risks"
              value={controlledRisks}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Average Risk Score"
              value={avgRiskScore}
              suffix="/25"
              valueStyle={{ color: avgRiskScore <= 10 ? '#10B981' : '#F59E0B' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Risks"
              value={risks.length}
              valueStyle={{ color: '#3B82F6' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Risk Matrix by Likelihood" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {likelihoodLabels.map((likelihood, idx) => {
            const level = idx + 1;
            const riskCount = riskMatrix[level] || 0;
            return (
              <div key={level} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 500 }}>{likelihood}</span>
                  {riskCount > 0 && <div className="font-semibold">{riskCount}</div>}
                </div>
                <Progress
                  percent={(riskCount / risks.length) * 100}
                  strokeColor={level <= 2 ? '#10B981' : level <= 4 ? '#F59E0B' : '#EF4444'}
                  showInfo={false}
                />
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Risk Register">
        <Table dataSource={risks} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}
