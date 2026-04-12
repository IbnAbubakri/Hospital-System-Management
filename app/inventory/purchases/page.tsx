'use client';

import React from 'react';
import { Card, Typography } from 'antd';
import { PageHeader } from '@/components/layout/PageHeader';

const { Text } = Typography;

export default function InventoryPurchasesPage() {
  return (
    <div className="bg-gray-50">
      <PageHeader
        title="Purchase Orders"
        subtitle="Manage inventory procurement"
      />
      <Card className="-xl shadow">
        <Text type="secondary">Purchase order management coming soon.</Text>
      </Card>
    </div>
  );
}
