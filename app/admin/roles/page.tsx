'use client';

import React from 'react';
import { Card, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';

const { Text } = Typography;

export default function AdminRolesPage() {
  const router = useRouter();

  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader
        title="Roles & Permissions"
        subtitle="Manage system roles and access control"
      />
      <Card className="-xl shadow">
        <Text type="secondary">Role management coming soon. Define custom roles and assign permissions.</Text>
      </Card>
    </div>
  );
}
