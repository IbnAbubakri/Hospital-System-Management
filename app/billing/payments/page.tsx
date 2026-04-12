'use client';

import React from 'react';
import { Card, Typography } from 'antd';
import { PageHeader } from '@/components/layout/PageHeader';

const { Text } = Typography;

export default function BillingPaymentsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader
        title="Payments"
        subtitle="Manage billing payments"
      />
      <Card className="-xl border-0 shadow">
        <Text type="secondary">Payment management coming soon.</Text>
      </Card>
    </div>
  );
}
