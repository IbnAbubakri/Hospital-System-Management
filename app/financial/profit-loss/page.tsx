'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  Table,
  Input,
  Button,
  Select,
  Drawer,
  Typography,
  Row,
  Col,
  Statistic,
  Tag,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;
const { Text, Title } = Typography;

interface PLItem {
  id: string;
  category: string;
  item: string;
  currentMonth: number;
  lastMonth: number;
  variance: number;
  variancePercent: number;
  ytd: number;
  budget: number;
  budgetVariance: number;
}

export default function ProfitLossPage() {
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [selectedItem, setSelectedItem] = useState<PLItem | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [plItems] = useState<PLItem[]>([
    // Revenue
    { id: '1', category: 'Revenue', item: 'Outpatient Revenue', currentMonth: 18500000, lastMonth: 17100000, variance: 1400000, variancePercent: 8.2, ytd: 38250000, budget: 18000000, budgetVariance: 500000 },
    { id: '2', category: 'Revenue', item: 'Inpatient Revenue', currentMonth: 12300000, lastMonth: 11700000, variance: 600000, variancePercent: 5.1, ytd: 25410000, budget: 12500000, budgetVariance: -200000 },
    { id: '3', category: 'Revenue', item: 'Laboratory Revenue', currentMonth: 4250000, lastMonth: 4230000, variance: 20000, variancePercent: 0.5, ytd: 8780000, budget: 4200000, budgetVariance: 50000 },
    { id: '4', category: 'Revenue', item: 'Radiology Revenue', currentMonth: 2150000, lastMonth: 2200000, variance: -50000, variancePercent: -2.3, ytd: 4430000, budget: 2300000, budgetVariance: -150000 },
    { id: '5', category: 'Revenue', item: 'Pharmacy Revenue', currentMonth: 1020000, lastMonth: 1009000, variance: 11000, variancePercent: 1.1, ytd: 2106000, budget: 1050000, budgetVariance: -30000 },
    // Operating Expenses
    { id: '6', category: 'Operating Expenses', item: 'Salaries & Wages', currentMonth: 8900000, lastMonth: 8750000, variance: 150000, variancePercent: 1.7, ytd: 18340000, budget: 8800000, budgetVariance: 100000 },
    { id: '7', category: 'Operating Expenses', item: 'Medical Supplies', currentMonth: 3450000, lastMonth: 3200000, variance: 250000, variancePercent: 7.8, ytd: 7125000, budget: 3300000, budgetVariance: 150000 },
    { id: '8', category: 'Operating Expenses', item: 'Pharmaceuticals', currentMonth: 4200000, lastMonth: 4100000, variance: 100000, variancePercent: 2.4, ytd: 8670000, budget: 4300000, budgetVariance: -100000 },
    { id: '9', category: 'Operating Expenses', item: 'Utilities', currentMonth: 850000, lastMonth: 820000, variance: 30000, variancePercent: 3.7, ytd: 1755000, budget: 800000, budgetVariance: 50000 },
    { id: '10', category: 'Operating Expenses', item: 'Maintenance', currentMonth: 650000, lastMonth: 580000, variance: 70000, variancePercent: 12.1, ytd: 1342000, budget: 600000, budgetVariance: 50000 },
    // Other Income/Expenses
    { id: '11', category: 'Other Income', item: 'Investment Income', currentMonth: 250000, lastMonth: 280000, variance: -30000, variancePercent: -10.7, ytd: 516000, budget: 300000, budgetVariance: -50000 },
    { id: '12', category: 'Other Expenses', item: 'Depreciation', currentMonth: 1200000, lastMonth: 1200000, variance: 0, variancePercent: 0, ytd: 2480000, budget: 1200000, budgetVariance: 0 },
    { id: '13', category: 'Other Expenses', item: 'Interest Expense', currentMonth: 450000, lastMonth: 450000, variance: 0, variancePercent: 0, ytd: 930000, budget: 450000, budgetVariance: 0 },
  ]);

  const [animatedStats, setAnimatedStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
  });

  const stats = useMemo(() => {
    const revenueItems = plItems.filter((i: any) => i.category === 'Revenue');
    const expenseItems = plItems.filter((i: any) =>
      i.category === 'Operating Expenses' || i.category === 'Other Expenses'
    );

    const totalRevenue = revenueItems.reduce((sum, i) => sum + i.currentMonth, 0);
    const totalExpenses = expenseItems.reduce((sum, i) => sum + i.currentMonth, 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = (netProfit / totalRevenue) * 100;

    return { totalRevenue, totalExpenses, netProfit, profitMargin };
  }, [plItems]);

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
        totalRevenue: Math.round(currentValues.totalRevenue + (targets.totalRevenue - currentValues.totalRevenue) * easeProgress),
        totalExpenses: Math.round(currentValues.totalExpenses + (targets.totalExpenses - currentValues.totalExpenses) * easeProgress),
        netProfit: Math.round(currentValues.netProfit + (targets.netProfit - currentValues.netProfit) * easeProgress),
        profitMargin: parseFloat((currentValues.profitMargin + (targets.profitMargin - currentValues.profitMargin) * easeProgress).toFixed(1)),
      });

      if (step >= steps) {
        clearInterval(interval);
        setAnimatedStats(targets);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const filteredItems = useMemo(() => {
    return plItems.filter((item) => {
      const matchesSearch =
        item.item.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = !categoryFilter || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchText, categoryFilter, plItems]);

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
      render: (item: string) => <span className="font-medium">{item}</span>,
    },
    {
      title: 'Current Month',
      dataIndex: 'currentMonth',
      key: 'currentMonth',
      render: (amount: number) => <span className="font-semibold">₦{amount.toLocaleString()}</span>,
      sorter: (a: PLItem, b: PLItem) => a.currentMonth - b.currentMonth,
    },
    {
      title: 'Last Month',
      dataIndex: 'lastMonth',
      key: 'lastMonth',
      render: (amount: number) => <span>₦{amount.toLocaleString()}</span>,
    },
    {
      title: 'Variance',
      key: 'variance',
      render: (_: any, record: PLItem) => {
        const isPositive = record.variance >= 0;
        const isRevenue = record.category === 'Revenue';
        const color = (isRevenue && isPositive) || (!isRevenue && !isPositive) ? 'success' : 'error';
        return (
          <div>
            <div className="flex items-center gap-1">
              {isPositive ? <RiseOutlined /> : <FallOutlined />}
              <span style={{ color: isRevenue ? (isPositive ? '#10B981' : '#EF4444') : (!isPositive ? '#10B981' : '#EF4444') }}>
                {isPositive ? '+' : ''}₦{record.variance.toLocaleString()}
              </span>
            </div>
            <Text type="secondary" className="text-xs">({isPositive ? '+' : ''}{record.variancePercent}%)</Text>
          </div>
        );
      },
    },
    {
      title: 'YTD',
      dataIndex: 'ytd',
      key: 'ytd',
      render: (amount: number) => <span>₦{amount.toLocaleString()}</span>,
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      render: (amount: number, record: PLItem) => {
        const variance = record.budgetVariance;
        const isPositive = variance >= 0;
        return (
          <div>
            <div>₦{amount.toLocaleString()}</div>
            <Text
              type="secondary"
              className="text-xs"
              style={{ color: isPositive ? '#10B981' : '#EF4444' }}
            >
              {isPositive ? '+' : ''}₦{variance.toLocaleString()}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: PLItem) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedItem(record);
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
        .stat-card:nth-child(2) { animation-delay: 0.15s; --card-color: #EF4444; }
        .stat-card:nth-child(3) { animation-delay: 0.2s; --card-color: #10B981; }
        .stat-card:nth-child(4) { animation-delay: 0.25s; --card-color: #8B5CF6; }

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
            <h1 className="text-2xl font-semibold text-gray-900">
              Profit & Loss Statement
            </h1>
          </div>
          <p className="text-gray-500 text-sm" style={{ marginLeft: '7px' }}>
            Monthly financial performance analysis
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
                  Total Revenue
                </div>
                <div className="stat-number" style={{ fontSize: '24px', fontWeight: 700, color: '#3B82F6', lineHeight: 1 }}>
                  ₦{(animatedStats.totalRevenue / 1000000).toFixed(1)}M
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
                  Total Expenses
                </div>
                <div className="stat-number" style={{ fontSize: '24px', fontWeight: 700, color: '#EF4444', lineHeight: 1 }}>
                  ₦{(animatedStats.totalExpenses / 1000000).toFixed(1)}M
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
                  Net Profit
                </div>
                <div className="stat-number" style={{ fontSize: '24px', fontWeight: 700, color: '#10B981', lineHeight: 1 }}>
                  ₦{(animatedStats.netProfit / 1000000).toFixed(1)}M
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
                  Profit Margin
                </div>
                <div className="stat-number" style={{ fontSize: '24px', fontWeight: 700, color: '#8B5CF6', lineHeight: 1 }}>
                  {animatedStats.profitMargin}%
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-8 py-6 page-content" style={{ animationDelay: '0.1s' }}>
        <Card
          title="Profit & Loss Details"
          extra={
            <div className="flex gap-3">
              <Search
                placeholder="Search items..."
                allowClear
                style={{ width: 200 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
              />
              <Select
                placeholder="Category"
                value={categoryFilter}
                onChange={setCategoryFilter}
                allowClear
                style={{ width: 160 }}
              >
                <Option value="Revenue">Revenue</Option>
                <Option value="Operating Expenses">Operating Expenses</Option>
                <Option value="Other Income">Other Income</Option>
                <Option value="Other Expenses">Other Expenses</Option>
              </Select>
            </div>
          }
        >
          <Table
            dataSource={filteredItems}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 15 }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </div>

      {/* Detail Drawer */}
      <Drawer
        title="Item Details"
        placement="right"
        size="large"
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedItem(null);
        }}
      >
        {selectedItem && (
          <div>
            <Card style={{ marginBottom: '16px' }}>
              <div className="mb-3">
                <Text type="secondary">Category</Text>
                <div><Tag color="blue">{selectedItem.category}</Tag></div>
              </div>
              <div className="mb-3">
                <Text type="secondary">Item</Text>
                <div className="text-xl font-semibold">{selectedItem.item}</div>
              </div>
            </Card>

            <Card title="Monthly Comparison" style={{ marginBottom: '16px' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Current Month"
                    value={selectedItem.currentMonth}
                    prefix="₦"
                    formatter={(value) => `₦${Number(value).toLocaleString()}`}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Last Month"
                    value={selectedItem.lastMonth}
                    prefix="₦"
                    formatter={(value) => `₦${Number(value).toLocaleString()}`}
                  />
                </Col>
              </Row>
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <Text type="secondary">Variance: </Text>
                <Text strong style={{ color: selectedItem.variance >= 0 ? '#10B981' : '#EF4444' }}>
                  {selectedItem.variance >= 0 ? '+' : ''}₦{selectedItem.variance.toLocaleString()} ({selectedItem.variancePercent}%)
                </Text>
              </div>
            </Card>

            <Card title="Budget Analysis">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Budget"
                    value={selectedItem.budget}
                    prefix="₦"
                    formatter={(value) => `₦${Number(value).toLocaleString()}`}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Year to Date"
                    value={selectedItem.ytd}
                    prefix="₦"
                    formatter={(value) => `₦${Number(value).toLocaleString()}`}
                  />
                </Col>
              </Row>
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <Text type="secondary">Budget Variance: </Text>
                <Text strong style={{ color: selectedItem.budgetVariance >= 0 ? '#10B981' : '#EF4444' }}>
                  {selectedItem.budgetVariance >= 0 ? '+' : ''}₦{selectedItem.budgetVariance.toLocaleString()}
                </Text>
              </div>
            </Card>
          </div>
        )}
      </Drawer>
    </div>
  );
}
