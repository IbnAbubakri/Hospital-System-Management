'use client';

import React from 'react';
import { Card, Typography } from 'antd';
import { PageHeader } from '@/components/layout/PageHeader';

const { Text } = Typography;

export default function ReportsOperationalPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader
        title="Operational Reports"
        subtitle="Daily operations and performance metrics"
      />
      <Card className="-xl border-none shadow">
        <Text type="secondary">Operational reports coming soon.</Text>
      </Card>
    </div>
  );
}
