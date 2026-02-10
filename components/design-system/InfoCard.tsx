'use client';

import React from 'react';

interface InfoCardProps {
  title: string;
  icon?: React.ReactNode;
  color?: string;
  children: React.ReactNode;
  accentBar?: boolean;
}

/**
 * InfoCard - Reusable card for detail sections (used in drawers/modals)
 *
 * @example
 * <InfoCard
 *   title="Patient Information"
 *   icon={<UserOutlined />}
 *   color="#3B82F6"
 * >
 *   <p>Name: John Doe</p>
 *   <p>Age: 45</p>
 * </InfoCard>
 */
export function InfoCard({
  title,
  icon,
  color = '#3B82F6',
  children,
  accentBar = true,
}: InfoCardProps) {
  return (
    <div
      className="px-3 py-4 sm:px-4 sm:py-5 md:px-5"
      style={{
        background: 'white',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        marginBottom: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Accent Bar */}
      {accentBar && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            background: `linear-gradient(180deg, ${color} 0%, ${color}99 100%)`,
          }}
        />
      )}

      {/* Header */}
      <div
        className="flex items-center gap-2 mb-3"
        style={{ paddingLeft: accentBar ? '12px' : '0' }}
      >
        {icon && (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: `${color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
              fontSize: '16px',
            }}
          >
            {icon}
          </div>
        )}
        <h3
          className="text-sm font-semibold"
          style={{ color: '#1E293B', margin: 0 }}
        >
          {title}
        </h3>
      </div>

      {/* Content */}
      <div style={{ paddingLeft: accentBar ? '12px' : '0' }}>{children}</div>
    </div>
  );
}
