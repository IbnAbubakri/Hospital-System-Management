'use client';

import React, { useState } from 'react';
import { Card, Typography, Table, Button, Space, Row, Col, Select, Statistic, Tag, Alert } from 'antd';
import { ThunderboltOutlined, RiseOutlined, FallOutlined, LineChartOutlined, WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface PredictionData {
  id: string;
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  timeframe: string;
  impact: 'high' | 'medium' | 'low';
}

export default function PredictiveReportPage() {
  const [modelType, setModelType] = useState<string>('linear-regression');

  const [predictions] = useState<PredictionData[]>([
    {
      id: '1',
      metric: 'Patient Volume',
      currentValue: 1250,
      predictedValue: 1420,
      confidence: 87,
      trend: 'up',
      timeframe: '3 months',
      impact: 'high',
    },
    {
      id: '2',
      metric: 'Revenue (₦ Millions)',
      currentValue: 45.5,
      predictedValue: 52.3,
      confidence: 82,
      trend: 'up',
      timeframe: '3 months',
      impact: 'high',
    },
    {
      id: '3',
      metric: 'Bed Occupancy Rate (%)',
      currentValue: 85,
      predictedValue: 92,
      confidence: 91,
      trend: 'up',
      timeframe: '2 months',
      impact: 'high',
    },
    {
      id: '4',
      metric: 'Staff Turnover Rate (%)',
      currentValue: 12,
      predictedValue: 14,
      confidence: 68,
      trend: 'up',
      timeframe: '6 months',
      impact: 'medium',
    },
    {
      id: '5',
      metric: 'Patient Wait Time (Min)',
      currentValue: 25,
      predictedValue: 22,
      confidence: 79,
      trend: 'down',
      timeframe: '2 months',
      impact: 'low',
    },
    {
      id: '6',
      metric: 'Readmission Rate (%)',
      currentValue: 4.2,
      predictedValue: 3.8,
      confidence: 84,
      trend: 'down',
      timeframe: '4 months',
      impact: 'medium',
    },
  ]);

  const columns = [
    { title: 'Metric', dataIndex: 'metric', key: 'metric', width: 200 },
    {
      title: 'Current',
      dataIndex: 'currentValue',
      key: 'currentValue',
      align: 'right' as const,
      render: (value: number) => <span>{value.toLocaleString()}</span>,
    },
    {
      title: 'Predicted',
      dataIndex: 'predictedValue',
      key: 'predictedValue',
      align: 'right' as const,
      render: (value: number) => (
        <span className="font-medium" style={{ color: '#1890ff' }}>{value.toLocaleString()}</span>
      ),
    },
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      align: 'center' as const,
      render: (confidence: number) => (
        <Tag color={confidence >= 80 ? 'success' : confidence >= 60 ? 'processing' : 'warning'}>
          {confidence}%
        </Tag>
      ),
    },
    {
      title: 'Trend',
      dataIndex: 'trend',
      key: 'trend',
      align: 'center' as const,
      render: (trend: string) => (
        <Space>
          {trend === 'up' ? <RiseOutlined style={{ color: '#cf1322' }} /> : trend === 'down' ? <FallOutlined style={{ color: '#3f8600' }} /> : <LineChartOutlined />}
          <span style={{ textTransform: 'capitalize' }}>{trend}</span>
        </Space>
      ),
    },
    {
      title: 'Impact',
      dataIndex: 'impact',
      key: 'impact',
      align: 'center' as const,
      render: (impact: string) => (
        <Tag color={impact === 'high' ? 'error' : impact === 'medium' ? 'warning' : 'default'}>
          {impact}
        </Tag>
      ),
    },
  ];

  const summaryStats = {
    totalPredictions: predictions.length,
    highImpact: predictions.filter((p: any) => p.impact === 'high').length,
    avgConfidence: (predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length).toFixed(0),
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }} className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
      <Title level={3}>Predictive Analytics</Title>

      <Alert
        message="AI-Powered Predictions"
        description="These predictions are based on historical data analysis using machine learning models."
        type="info"
        showIcon
        icon={<ThunderboltOutlined />}
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={8}>
          <Card className="p-4 sm:p-6">
            <Statistic title="Total Predictions" value={summaryStats.totalPredictions} prefix={<LineChartOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card className="p-4 sm:p-6">
            <Statistic title="High Impact" value={summaryStats.highImpact} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card className="p-4 sm:p-6">
            <Statistic title="Avg Confidence" value={summaryStats.avgConfidence} suffix="%" />
          </Card>
        </Col>
      </Row>

      <Card
        title="Prediction Results"
        className="p-4 sm:p-6"
        extra={
          <Select value={modelType} onChange={setModelType} style={{ width: 200 }}>
            <Select.Option value="linear-regression">Linear Regression</Select.Option>
            <Select.Option value="arima">ARIMA</Select.Option>
            <Select.Option value="lstm">LSTM Neural Network</Select.Option>
          </Select>
        }
      >
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={predictions}
            rowKey="id"
            pagination={false}
          />
        </div>
      </Card>
    </div>
  );
}
