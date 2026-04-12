'use client';

import React from 'react';
import { Card, Typography } from 'antd';
import { PageHeader } from '@/components/layout/PageHeader';

const { Text } = Typography;

export default function RadiologyOrdersPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader
        title="Radiology Orders"
        subtitle="Manage radiology imaging orders"
      />
      <Card className="-xl border-0 shadow">
        <Text type="secondary">Radiology orders management coming soon.</Text>
      </Card>
    </div>
  );
}
