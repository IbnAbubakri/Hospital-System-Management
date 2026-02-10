'use client';

import React, { useState } from 'react';
import { Input, AutoComplete } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Search } = Input;

interface SearchOption {
  value: string;
  label: string;
  path: string;
  type: string;
}

export function SearchBar() {
  const [searchValue, setSearchValue] = useState('');
  const [options, setOptions] = useState<SearchOption[]>([]);
  const router = useRouter();

  // Mock search data - in real app, this would come from API
  const allSearchOptions: SearchOption[] = [
    { value: 'john smith', label: 'John Smith (Patient)', path: '/patients/1', type: 'Patient' },
    { value: 'sarah johnson', label: 'Sarah Johnson (Patient)', path: '/patients/2', type: 'Patient' },
    { value: 'dr emily', label: 'Dr. Emily Brown (Doctor)', path: '/staff', type: 'Doctor' },
    { value: 'cardiology', label: 'Cardiology Department', path: '/admin/departments', type: 'Department' },
  ];

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (!value) {
      setOptions([]);
      return;
    }

    const filtered = allSearchOptions.filter(
      (option) =>
        option.value.toLowerCase().includes(value.toLowerCase()) ||
        option.label.toLowerCase().includes(value.toLowerCase())
    );
    setOptions(filtered);
  };

  const handleSelect = (value: string, option: SearchOption) => {
    router.push(option.path);
    setSearchValue('');
    setOptions([]);
  };

  const typeColors: Record<string, string> = {
    Patient: '#0077B6',
    Doctor: '#10B981',
    Department: '#8B5CF6',
  };

  return (
    <AutoComplete
      value={searchValue}
      options={options.map((opt) => ({
        value: opt.value,
        label: (
          <div className="flex items-center justify-between py-1">
            <span className="text-gray-800">{opt.label}</span>
            <span
              className="text-xs px-2 py-1 rounded"
              style={{
                backgroundColor: `${typeColors[opt.type] || '#6B7280'}15`,
                color: typeColors[opt.type] || '#6B7280',
                fontWeight: 500,
              }}
            >
              {opt.type}
            </span>
          </div>
        ),
      })) as any}
      onSearch={handleSearch}
      onSelect={handleSelect}
      placeholder="Search patients, doctors, departments..."
      className="w-80"
      style={{ width: '320px' }}
    >
      <Search
        prefix={<SearchOutlined style={{ color: '#9CA3AF' }} />}
        allowClear
        onSearch={(value) => {
          // Handle enter key press
          if (value && options.length > 0) {
            router.push(options[0].path);
            setSearchValue('');
            setOptions([]);
          }
        }}
        style={{
          borderRadius: '10px',
        }}
      />
    </AutoComplete>
  );
}
