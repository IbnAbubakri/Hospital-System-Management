import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd';
import { medicalTheme } from "@/lib/theme";
import { QueryProvider } from "@/lib/QueryProvider";
import { MainLayout } from '@/components/layout/MainLayout';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { RootContent } from '@/components/layout/RootContent';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediCore Hospital Management System",
  description: "Complete hospital management system solution",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <ConfigProvider theme={medicalTheme}>
            <App>
              <ErrorBoundary>
                <AuthProvider>
                  <QueryProvider>
                    <RootContent>{children}</RootContent>
                  </QueryProvider>
                </AuthProvider>
              </ErrorBoundary>
            </App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
