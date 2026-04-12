'use client';

import React from 'react';
import { Card, Typography } from 'antd';
import { PageHeader } from '@/components/layout/PageHeader';

const { Text } = Typography;

export default function RadiologyReportsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader
        title="Radiology Reports"
        subtitle="View and manage radiology reports"
      />
      <Card className="-xl border-0 shadow">
        <Text type="secondary">Radiology reports coming soon.</Text>
      </Card>
    </div>
  );
}
