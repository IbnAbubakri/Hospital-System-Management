// © 2026 Abubakri Faaruq Adebowale (IbnAbubakri). All rights reserved.
// Faruqsuzay@gmail.com | +2349061345507

import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { medicalTheme } from "@/lib/theme";
import { QueryProvider } from "@/lib/QueryProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={medicalTheme}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </ConfigProvider>
    </AntdRegistry>
  );
}
