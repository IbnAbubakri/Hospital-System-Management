'use client';

import React from 'react';
import { Input, Select, Space, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;

interface FilterOption {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface SearchFilterBarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: Array<{
    key: string;
    label: string;
    value: string | number | undefined;
    options: FilterOption[];
    onChange: (value: string | number) => void;
    icon?: React.ReactNode;
  }>;
  resultCount?: number;
  totalCount?: number;
  filterLabel?: string;
  extra?: React.ReactNode;
}

/**
 * SearchFilterBar - Unified search and filter bar with modern styling
 *
 * @example
 * <SearchFilterBar
 *   searchPlaceholder="Search patients..."
 *   searchValue={searchText}
 *   onSearchChange={setSearchText}
 *   filters={[
 *     {
 *       key: 'status',
 *       label: 'Status',
 *       value: statusFilter,
 *       options: [
 *         { label: 'All', value: 'all' },
 *         { label: 'Active', value: 'active' },
 *       ],
 *       onChange: setStatusFilter,
 *     }
 *   ]}
 *   resultCount={filteredPatients.length}
 *   totalCount={patients.length}
 *   filterLabel="patients"
 * />
 */
export function SearchFilterBar({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  filters = [],
  resultCount,
  totalCount,
  filterLabel = 'items',
  extra,
}: SearchFilterBarProps) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6"
      style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Search Input */}
      <div className="w-full sm:flex-1">
        <Search
          placeholder={searchPlaceholder}
          allowClear
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          prefix={<SearchOutlined className="text-gray-400" />}
          style={{
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
          }}
        />
      </div>

      {/* Filters */}
      {filters.length > 0 && (
        <Space size="middle" wrap className="w-full sm:w-auto">
          {filters.map((filter) => (
            <div key={filter.key} className="flex items-center gap-2">
              {filter.icon && <span className="text-gray-400">{filter.icon}</span>}
              <span className="text-sm text-gray-500 whitespace-nowrap">{filter.label}:</span>
              <Select
                value={filter.value}
                onChange={filter.onChange}
                options={filter.options}
                className="w-full sm:w-auto"
                style={{
                  minWidth: 120,
                  borderRadius: '8px',
                }}
              />
            </div>
          ))}
        </Space>
      )}

      {/* Result Count */}
      {resultCount !== undefined && totalCount !== undefined && (
        <div
          className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end"
          style={{
            padding: '6px 12px',
            background: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)',
            borderRadius: '8px',
            border: '1px solid #93C5FD',
          }}
        >
          <Tag
            style={{
              margin: 0,
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              color: 'white',
              border: 'none',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            {resultCount}
          </Tag>
          <span className="text-sm text-gray-600 whitespace-nowrap">
            of {totalCount} {filterLabel}
          </span>
        </div>
      )}

      {/* Extra Content */}
      {extra && <div className="w-full sm:w-auto">{extra}</div>}
    </div>
  );
}
