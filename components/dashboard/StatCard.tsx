'use client';

import React from 'react';
import { Card, Statistic, Space } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  color?: string;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  prefix,
  suffix,
  trend,
  icon,
  color = '#0077B6',
  loading = false,
}: StatCardProps) {
  const gradientStyle = {
    background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
    borderRadius: '12px',
  };

  const iconContainerStyle = {
    background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
    boxShadow: `0 4px 12px ${color}40`,
  };

  return (
    <Card
      loading={loading}
      className="stat-card hover:shadow-xl transition-all duration-300 group"
      style={{
        borderRadius: '16px',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${color}08 0%, transparent 100%)`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
        className="group-hover:opacity-100"
      />

      <Space orientation="vertical" className="w-full relative z-10" size={12}>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-xs font-semibold uppercase tracking-wider">
            {title}
          </span>
          {icon && (
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110"
              style={iconContainerStyle}
            >
              <div className="text-lg">{icon}</div>
            </div>
          )}
        </div>

        <div>
          <Statistic
            value={value}
            prefix={prefix}
            suffix={suffix}
            styles={{
              content: {
                color: '#111827',
                fontSize: '32px',
                fontWeight: 700,
                lineHeight: '1.2',
              },
            }}
          />
        </div>

        {trend && (
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold ${
                trend.isPositive
                  ? 'text-green-700 bg-green-50'
                  : 'text-red-700 bg-red-50'
              }`}
              style={{
                background: trend.isPositive
                  ? 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)'
                  : 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
              }}
            >
              {trend.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              <span>{Math.abs(trend.value)}%</span>
            </div>
            <span className="text-gray-500 text-xs">vs last month</span>
          </div>
        )}
      </Space>
    </Card>
  );
}
