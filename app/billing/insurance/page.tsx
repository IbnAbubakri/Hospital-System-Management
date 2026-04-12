'use client';

import React from 'react';
import { Card, Typography } from 'antd';
import { PageHeader } from '@/components/layout/PageHeader';

const { Text } = Typography;

export default function BillingInsurancePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader
        title="Insurance Billing"
        subtitle="Manage insurance claims and billing"
      />
      <Card className="-xl border-0 shadow">
        <Text type="secondary">Insurance billing management coming soon.</Text>
      </Card>
    </div>
  );
}
