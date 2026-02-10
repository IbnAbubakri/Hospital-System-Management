'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  Table,
  Input,
  Button,
  Tag,
  Select,
  Drawer,
  Typography,
  Row,
  Col,
  Progress,
  Statistic,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  DollarOutlined,
  BarChartOutlined,
  PlusOutlined,
} from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;
const { Text, Title } = Typography;

interface CostCenter {
  id: string;
  code: string;
  name: string;
  department: string;
  manager: string;
  budget: number;
  actual: number;
  variance: number;
  variancePercent: number;
  status: 'under' | 'on_track' | 'over';
  lastUpdated: string;
}

interface CostCenterExpense {
  id: string;
  costCenterId: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  approvedBy: string;
}

export default function CostCenterPage() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedCenter, setSelectedCenter] = useState<CostCenter | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [costCenters] = useState<CostCenter[]>([
    {
      id: '1',
      code: 'CC-001',
      name: 'Emergency Department',
      department: 'Clinical Services',
      manager: 'Dr. Adebayo Johnson',
      budget: 12500000,
      actual: 11850000,
      variance: 650000,
      variancePercent: 5.2,
      status: 'under',
      lastUpdated: '2024-02-05',
    },
    {
      id: '2',
      code: 'CC-002',
      name: 'Operating Theatre',
      department: 'Clinical Services',
      manager: 'Dr. Ngozi Okafor',
      budget: 18500000,
      actual: 19250000,
      variance: -750000,
      variancePercent: -4.1,
      status: 'over',
      lastUpdated: '2024-02-05',
    },
    {
      id: '3',
      code: 'CC-003',
      name: 'Laboratory Services',
      department: 'Diagnostic Services',
      manager: 'Dr. Emeka Nwosu',
      budget: 8500000,
      actual: 8425000,
      variance: 75000,
      variancePercent: 0.9,
      status: 'on_track',
      lastUpdated: '2024-02-04',
    },
    {
      id: '4',
      code: 'CC-004',
      name: 'Radiology Department',
      department: 'Diagnostic Services',
      manager: 'Dr. Chioma Eze',
      budget: 12000000,
      actual: 10800000,
      variance: 1200000,
      variancePercent: 10.0,
      status: 'under',
      lastUpdated: '2024-02-05',
    },
    {
      id: '5',
      code: 'CC-005',
      name: 'Pharmacy',
      department: 'Clinical Support',
      manager: 'Pharm. Ibrahim Kofi',
      budget: 15000000,
      actual: 15150000,
      variance: -150000,
      variancePercent: -1.0,
      status: 'on_track',
      lastUpdated: '2024-02-05',
    },
    {
      id: '6',
      code: 'CC-006',
      name: 'Inpatient Ward A',
      department: 'Clinical Services',
      manager: 'Nurse Grace Adeleke',
      budget: 9500000,
      actual: 9120000,
      variance: 380000,
      variancePercent: 4.0,
      status: 'under',
      lastUpdated: '2024-02-04',
    },
  ]);

  const [animatedStats, setAnimatedStats] = useState({
    totalBudget: 0,
    totalActual: 0,
    underBudget: 0,
    overBudget: 0,
  });

  const stats = useMemo(() => {
    const totalBudget = costCenters.reduce((sum, cc) => sum + cc.budget, 0);
    const totalActual = costCenters.reduce((sum, cc) => sum + cc.actual, 0);
    const underBudget = costCenters.filter((cc: any) => cc.status === 'under').length;
    const overBudget = costCenters.filter((cc: any) => cc.status === 'over').length;

    return { totalBudget, totalActual, underBudget, overBudget };
  }, [costCenters]);

  useEffect(() => {
    setMounted(true);
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;

    const currentValues = { ...animatedStats };
    const targets = stats;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        totalBudget: Math.round(currentValues.totalBudget + (targets.totalBudget - currentValues.totalBudget) * easeProgress),
        totalActual: Math.round(currentValues.totalActual + (targets.totalActual - currentValues.totalActual) * easeProgress),
        underBudget: Math.round(currentValues.underBudget + (targets.underBudget - currentValues.underBudget) * easeProgress),
        overBudget: Math.round(currentValues.overBudget + (targets.overBudget - currentValues.overBudget) * easeProgress),
      });

      if (step >= steps) {
        clearInterval(interval);
        setAnimatedStats(targets);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const filteredCenters = useMemo(() => {
    return costCenters.filter((center) => {
      const matchesSearch =
        center.name.toLowerCase().includes(searchText.toLowerCase()) ||
        center.code.toLowerCase().includes(searchText.toLowerCase()) ||
        center.manager.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = !statusFilter || center.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter, costCenters]);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; label: string }> = {
      'under': { color: 'success', label: 'Under Budget' },
      'on_track': { color: 'processing', label: 'On Track' },
      'over': { color: 'error', label: 'Over Budget' },
    };
    return configs[status] || configs.on_track;
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Cost Center Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <span className="font-medium">{name}</span>,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => <Tag>{dept}</Tag>,
    },
    {
      title: 'Manager',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      render: (amount: number) => <span>₦{amount.toLocaleString()}</span>,
      sorter: (a: CostCenter, b: CostCenter) => a.budget - b.budget,
    },
    {
      title: 'Actual',
      dataIndex: 'actual',
      key: 'actual',
      render: (amount: number) => <span className="font-semibold">₦{amount.toLocaleString()}</span>,
    },
    {
      title: 'Variance',
      key: 'variance',
      render: (_: any, record: CostCenter) => (
        <div>
          <div style={{ color: record.variance >= 0 ? '#10B981' : '#EF4444', fontWeight: 600 }}>
            {record.variance >= 0 ? '+' : ''}₦{record.variance.toLocaleString()}
          </div>
          <Progress
            percent={Math.abs(record.variancePercent)}
            size="small"
            status={record.variancePercent >= 0 ? 'success' : 'exception'}
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: CostCenter) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedCenter(record);
            setDrawerVisible(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

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
        .stat-card:nth-child(2) { animation-delay: 0.15s; --card-color: #8B5CF6; }
        .stat-card:nth-child(3) { animation-delay: 0.2s; --card-color: #10B981; }
        .stat-card:nth-child(4) { animation-delay: 0.25s; --card-color: #EF4444; }

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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 mb-1">
              <div style={{
                width: '4px',
                height: '28px',
                background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)',
                borderRadius: '2px'
              }} />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Cost Center Management
                </h1>
              </div>
            </div>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Cost Center
            </Button>
          </div>
          <p className="text-gray-500 text-sm" style={{ marginLeft: '7px' }}>
            Monitor budget allocation and spending by department
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
                  Total Budget
                </div>
                <div className="stat-number" style={{ fontSize: '24px', fontWeight: 700, color: '#3B82F6', lineHeight: 1 }}>
                  ₦{(animatedStats.totalBudget / 1000000).toFixed(1)}M
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
                  Total Spent
                </div>
                <div className="stat-number" style={{ fontSize: '24px', fontWeight: 700, color: '#8B5CF6', lineHeight: 1 }}>
                  ₦{(animatedStats.totalActual / 1000000).toFixed(1)}M
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
                  Under Budget
                </div>
                <div className="stat-number" style={{ fontSize: '24px', fontWeight: 700, color: '#10B981', lineHeight: 1 }}>
                  {animatedStats.underBudget}
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div
                className="stat-card"
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)',
                  border: '1px solid #FECACA',
                }}
              >
                <div className="text-sm font-medium" style={{ color: '#64748B', marginBottom: '6px' }}>
                  Over Budget
                </div>
                <div className="stat-number" style={{ fontSize: '24px', fontWeight: 700, color: '#EF4444', lineHeight: 1 }}>
                  {animatedStats.overBudget}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-8 py-6 page-content" style={{ animationDelay: '0.1s' }}>
        <Card
          title="Cost Centers"
          extra={
            <div className="flex gap-3">
              <Search
                placeholder="Search cost centers..."
                allowClear
                style={{ width: 200 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
              />
              <Select
                placeholder="Status"
                value={statusFilter}
                onChange={setStatusFilter}
                allowClear
                style={{ width: 140 }}
              >
                <Option value="under">Under Budget</Option>
                <Option value="on_track">On Track</Option>
                <Option value="over">Over Budget</Option>
              </Select>
            </div>
          }
        >
          <Table
            dataSource={filteredCenters}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </div>

      {/* Detail Drawer */}
      <Drawer
        title="Cost Center Details"
        placement="right"
        size="large"
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedCenter(null);
        }}
      >
        {selectedCenter && (
          <div>
            <Card style={{ marginBottom: '16px' }}>
              <div className="mb-3">
                <Text type="secondary">Code</Text>
                <div><Tag color="blue">{selectedCenter.code}</Tag></div>
              </div>
              <div className="mb-3">
                <Text type="secondary">Name</Text>
                <div className="text-xl font-semibold">{selectedCenter.name}</div>
              </div>
              <div className="mb-3">
                <Text type="secondary">Department</Text>
                <div><Tag>{selectedCenter.department}</Tag></div>
              </div>
              <div className="mb-3">
                <Text type="secondary">Manager</Text>
                <div>{selectedCenter.manager}</div>
              </div>
              <div>
                <Text type="secondary">Status</Text>
                <div>
                  {(() => {
                    const config = getStatusConfig(selectedCenter.status);
                    return <Tag color={config.color}>{config.label}</Tag>;
                  })()}
                </div>
              </div>
            </Card>

            <Card title="Budget Analysis" style={{ marginBottom: '16px' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Budget"
                    value={selectedCenter.budget}
                    prefix="₦"
                    formatter={(value) => `₦${Number(value).toLocaleString()}`}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Actual"
                    value={selectedCenter.actual}
                    prefix="₦"
                    formatter={(value) => `₦${Number(value).toLocaleString()}`}
                  />
                </Col>
              </Row>
              <div style={{ marginTop: '16px' }}>
                <Text type="secondary">Variance</Text>
                <div style={{ fontSize: '18px', fontWeight: 600, color: selectedCenter.variance >= 0 ? '#10B981' : '#EF4444' }}>
                  {selectedCenter.variance >= 0 ? '+' : ''}₦{selectedCenter.variance.toLocaleString()}
                </div>
                <Progress
                  percent={Math.abs(selectedCenter.variancePercent)}
                  status={selectedCenter.variancePercent >= 0 ? 'success' : 'exception'}
                />
              </div>
            </Card>
          </div>
        )}
      </Drawer>
    </div>
  );
}
