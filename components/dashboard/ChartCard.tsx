'use client';

import React from 'react';
import { Card, Select, Space } from 'antd';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ChartCardProps {
  title: string;
  type: 'bar' | 'line' | 'pie' | 'area';
  data: any[];
  dataKey?: string;
  xAxisKey?: string;
  extra?: React.ReactNode;
  height?: number;
  color?: string | string[];
}

const COLORS = ['#0077B6', '#00B4D8', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

export function ChartCard({
  title,
  type,
  data,
  dataKey = 'value',
  xAxisKey = 'name',
  extra,
  height = 300,
  color = '#0077B6',
}: ChartCardProps) {
  const renderChart = () => {
    const chartProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    const tooltipStyle = {
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    };

    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey={dataKey}
                fill={color as string}
                radius={[8, 8, 0, 0]}
                animationBegin={0}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color as string}
                strokeWidth={3}
                dot={{ fill: color as string, r: 4, strokeWidth: 2 }}
                activeDot={{ r: 8, stroke: color as string, strokeWidth: 2 }}
                animationBegin={0}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...chartProps}>
              <defs>
                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color as string} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color as string} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color as string}
                strokeWidth={2}
                fill={`url(#gradient-${dataKey})`}
                animationBegin={0}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={xAxisKey}
                cx="50%"
                cy="50%"
                outerRadius={Math.min(height, 300) / 2 - 20}
                innerRadius={Math.min(height, 300) / 4}
                paddingAngle={2}
                label={(entry: any) => entry.payload[xAxisKey]}
                labelLine={false}
                animationBegin={0}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card
      title={<span className="text-gray-800 font-semibold">{title}</span>}
      extra={extra}
      className="hover:shadow-xl transition-all duration-300 chart-card"
      style={{
        borderRadius: '16px',
        border: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      <div className="chart-container">
        {renderChart()}
      </div>
    </Card>
  );
}
