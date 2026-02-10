'use client';

import React from 'react';
import { Form, FormProps, Card, Space, Button } from 'antd';

interface FormWrapperProps extends FormProps {
  title?: string;
  subtitle?: string;
  onSubmit?: (values: { [key: string]: string | number }) => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  children: React.ReactNode;
  extra?: React.ReactNode;
}

export function FormWrapper({
  title,
  subtitle,
  onSubmit,
  onCancel,
  submitText = 'Submit',
  cancelText = 'Cancel',
  loading = false,
  children,
  extra,
  ...props
}: FormWrapperProps) {
  const [form] = Form.useForm();

  const handleFinish = (values: { [key: string]: string | number }) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <Card
      title={title}
      extra={extra}
      className="w-full"
    >
      {subtitle && <p className="text-gray-500 mb-4">{subtitle}</p>}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        {...props}
      >
        {children}

        {(onSubmit || onCancel) && (
          <Form.Item className="mb-0 mt-6">
            <Space>
              {onSubmit && (
                <Button type="primary" htmlType="submit" loading={loading}>
                  {submitText}
                </Button>
              )}
              {onCancel && (
                <Button onClick={onCancel}>
                  {cancelText}
                </Button>
              )}
            </Space>
          </Form.Item>
        )}
      </Form>
    </Card>
  );
}
