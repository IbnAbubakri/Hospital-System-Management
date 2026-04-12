'use client';

import React from 'react';
import { Card, Typography } from 'antd';
import { PageHeader } from '@/components/layout/PageHeader';

const { Text } = Typography;

export default function LaboratoryReportsPage() {
  return (
    <div className="bg-gray-50 min-h-full">
      <PageHeader
        title="Laboratory Reports"
        subtitle="Generate and view laboratory reports"
      />
      <Card className="-xl border-0 shadow">
        <Text type="secondary">Laboratory reports coming soon.</Text>
      </Card>
    </div>
  );
}
