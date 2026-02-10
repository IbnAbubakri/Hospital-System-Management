'use client';

import React from 'react';
import { Breadcrumb, Button, Space, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { title: string; path?: string }[];
  extra?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumb,
  extra,
  showBackButton = false,
  onBack,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="mb-6">
      {breadcrumb && (
        <Breadcrumb className="mb-2">
          {breadcrumb.map((item, index) => (
            <Breadcrumb.Item key={index}>
              {item.path ? (
                <a href={item.path}>{item.title}</a>
              ) : (
                item.title
              )}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      )}
      <div className="flex items-center justify-between">
        <Space orientation="vertical" size={0}>
          <Space>
            {showBackButton && (
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
              />
            )}
            <Title level={3} className="!mb-0">
              {title}
            </Title>
          </Space>
          {subtitle && (
            <Typography.Text type="secondary">{subtitle}</Typography.Text>
        )}
        </Space>
        {extra && <div>{extra}</div>}
      </div>
    </div>
  );
}
