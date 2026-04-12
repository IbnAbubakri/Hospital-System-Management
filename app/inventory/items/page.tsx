'use client';

import React from 'react';
import { Card, Typography } from 'antd';
import { PageHeader } from '@/components/layout/PageHeader';

const { Text } = Typography;

export default function InventoryItemsPage() {
  return (
    <div className="bg-gray-50">
      <PageHeader
        title="Inventory Items"
        subtitle="Manage inventory items and catalog"
      />
      <Card className="-xl shadow">
        <Text type="secondary">Inventory items management coming soon.</Text>
      </Card>
    </div>
  );
}
