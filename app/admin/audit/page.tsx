'use client';

import React from 'react';
import { Card, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';

const { Text } = Typography;

export default function AdminAuditPage() {
  const router = useRouter();

  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader
        title="Audit Logs"
        subtitle="System activity and user actions"
      />
      <Card className="-xl shadow">
        <Text type="secondary">Audit log viewer coming soon. Track user actions, system changes, and compliance events.</Text>
      </Card>
    </div>
  );
}
