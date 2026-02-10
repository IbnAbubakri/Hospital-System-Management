'use client';

import React from 'react';
import { Table, TableProps } from 'antd';

interface ModernTableProps<T> extends TableProps<T> {
  showGradientHover?: boolean;
  animationDelay?: number;
}

/**
 * ModernTable - Styled Ant Design Table with modern enhancements
 *
 * @example
 * <ModernTable
 *   dataSource={patients}
 *   columns={columns}
 *   rowKey="id"
 *   pagination={{ pageSize: 10 }}
 *   showGradientHover={true}
 * />
 */
export function ModernTable<T extends Record<string, any>>({
  showGradientHover = true,
  animationDelay = 0,
  ...props
}: ModernTableProps<T>) {
  return (
    <>
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
        className="overflow-x-auto" // Enable horizontal scroll on mobile
      >
        <Table<T>
          {...props}
          className="modern-table"
          pagination={{
            ...props.pagination,
            style: {
              padding: '16px',
              borderTop: '1px solid #E2E8F0',
            },
          }}
          scroll={{ x: 'max-content' }} // Enable horizontal scroll
        />
      </div>

      <style jsx global>{`
        /* Modern Table Styles */
        .modern-table .ant-table-thead > tr > th {
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%) !important;
          border-bottom: 2px solid #e2e8f0 !important;
          font-weight: 600;
          color: #1e293b;
          padding: 14px 16px !important;
          font-size: 13px;
        }

        .modern-table .ant-table-tbody > tr > td {
          padding: 12px 16px !important;
          border-bottom: 1px solid #f1f5f9 !important;
          font-size: 14px;
          animation: fadeInUp 0.3s ease-out forwards;
          animation-delay: ${animationDelay}s;
          opacity: 0;
        }

        ${showGradientHover
          ? `
        .modern-table .ant-table-tbody > tr:hover > td {
          background: linear-gradient(90deg, #eff6ff 0%, #f0f9ff 100%) !important;
          transition: 'all 0.2s ease';
        }
        `
          : ''}

        .modern-table .ant-table-tbody > tr:last-child > td {
          border-bottom: none !important;
        }

        .modern-table .ant-pagination-item {
          border-radius: 8px !important;
          border: 1px solid #e2e8f0 !important;
        }

        .modern-table .ant-pagination-item-active {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
          border-color: #3b82f6 !important;
        }

        .modern-table .ant-pagination-item-active a {
          color: white !important;
        }

        .modern-table .ant-pagination-prev,
        .modern-table .ant-pagination-next {
          border-radius: 8px !important;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
