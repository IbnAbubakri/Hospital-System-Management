'use client';

import React from 'react';

export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  /**
   * Show this column on mobile
   * @default true
   */
  showOnMobile?: boolean;
  /**
   * Priority for mobile display (higher = shown first)
   * @default 0
   */
  priority?: number;
}

interface MobileTableProps<T = any> {
  /**
   * Data source array
   */
  dataSource: T[];
  /**
   * Column definitions
   */
  columns: Column<T>[];
  /**
   * Unique key field name
   */
  rowKey: string;
  /**
   * Render function for each card
   */
  renderCard?: (record: T, index: number) => React.ReactNode;
  /**
   * Optional click handler
   */
  onRowClick?: (record: T, index: number) => void;
  /**
   * Title for each card (e.g., record name)
   */
  getCardTitle?: (record: T) => string;
  /**
   * Optional subtitle for cards
   */
  getCardSubtitle?: (record: T) => string;
  /**
   * Optional badge/status indicator
   */
  getCardBadge?: (record: T) => React.ReactNode;
}

/**
 * MobileTable - Card-based table view optimized for mobile devices
 *
 * This component transforms tabular data into a card-based layout that's
 * much easier to read on mobile devices. Each row becomes a card with
 * the data displayed as key-value pairs.
 *
 * @example
 * <MobileTable
 *   dataSource={patients}
 *   rowKey="id"
 *   columns={[
 *     { key: 'name', title: 'Name', dataIndex: 'name' },
 *     { key: 'age', title: 'Age', dataIndex: 'age', showOnMobile: true },
 *     { key: 'status', title: 'Status', dataIndex: 'status', priority: 1 },
 *   ]}
 *   getCardTitle={(record) => record.name}
 *   getCardBadge={(record) => <StatusTag status={record.status} />}
 *   onRowClick={(record) => router.push(`/patients/${record.id}`)}
 * />
 */
export function MobileTable<T extends Record<string, any>>({
  dataSource,
  columns,
  rowKey,
  renderCard,
  onRowClick,
  getCardTitle,
  getCardSubtitle,
  getCardBadge,
}: MobileTableProps<T>) {
  // Filter and sort columns for mobile display
  const mobileColumns = columns
    .filter((col) => col.showOnMobile !== false)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  if (dataSource.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4"
          style={{ color: '#9CA3AF' }}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {dataSource.map((record, index) => {
        const key = record[rowKey] || index;

        if (renderCard) {
          return (
            <div key={key} onClick={() => onRowClick?.(record, index)}>
              {renderCard(record, index)}
            </div>
          );
        }

        return (
          <div
            key={key}
            className="bg-white rounded-lg border border-gray-200 p-4 active:bg-gray-50 transition-colors"
            onClick={() => onRowClick?.(record, index)}
            style={{
              cursor: onRowClick ? 'pointer' : 'default',
            }}
          >
            {/* Card Header */}
            {(getCardTitle || getCardBadge) && (
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  {getCardTitle && (
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                      {getCardTitle(record)}
                    </h3>
                  )}
                  {getCardSubtitle && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      {getCardSubtitle(record)}
                    </p>
                  )}
                </div>
                {getCardBadge && <div className="ml-2">{getCardBadge(record)}</div>}
              </div>
            )}

            {/* Card Body - Data Fields */}
            <div className="space-y-2">
              {mobileColumns.map((column) => {
                const value = record[column.dataIndex];
                const renderedValue = column.render
                  ? column.render(value, record, index)
                  : value;

                // Skip if this is the title field (already shown above)
                if (getCardTitle && column.dataIndex === 'name') {
                  return null;
                }

                return (
                  <div key={column.key} className="flex justify-between items-start">
                    <span className="text-sm text-gray-500 mr-4 flex-shrink-0">
                      {column.title}:
                    </span>
                    <span className="text-sm text-gray-900 text-right flex-1 truncate">
                      {renderedValue ?? '-'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * CompactCard - Even more compact card for very small screens
 */
interface CompactCardProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  badge?: React.ReactNode;
  onClick?: () => void;
}

export function CompactCard({
  title,
  subtitle,
  value,
  badge,
  onClick,
}: CompactCardProps) {
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 px-3 py-2 active:bg-gray-50"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 truncate">{title}</p>
          <p className="text-sm font-medium text-gray-900 truncate">{subtitle || value}</p>
        </div>
        {badge && <div className="ml-2 flex-shrink-0">{badge}</div>}
      </div>
    </div>
  );
}
