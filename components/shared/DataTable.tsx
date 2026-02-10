'use client';

import React from 'react';
import { Table, TableProps } from 'antd';
import { CSVLink } from 'react-csv';

interface DataTableProps<T> extends TableProps<T> {
  data: T[];
  exportable?: boolean;
  exportFileName?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  exportable = true,
  exportFileName = 'export',
  ...props
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      {exportable && data.length > 0 && (
        <div className="flex justify-end">
          <CSVLink
            data={data}
            filename={`${exportFileName}-${new Date().toISOString().split('T')[0]}.csv`}
            className="ant-btn ant-btn-default"
          >
            Export to CSV
          </CSVLink>
        </div>
      )}
      <Table<T>
        dataSource={data}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        scroll={{ x: true }}
        {...props}
      />
    </div>
  );
}
