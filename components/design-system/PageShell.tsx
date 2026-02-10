'use client';

import React from 'react';

interface PageShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

/**
 * PageShell - Wrapper component providing consistent gradient background,
 * animations, and layout structure for all pages
 *
 * @example
 * <PageShell
 *   title="Patients"
 *   subtitle="Manage patient records and information"
 *   badge={<Badge>Department: Cardiology</Badge>}
 * >
 *   {pageContent}
 * </PageShell>
 */
export function PageShell({
  children,
  title,
  subtitle,
  action,
  badge,
}: PageShellProps) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)',
      }}
    >
      {/* Header Section */}
      {(title || subtitle || action || badge) && (
        <div
          className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
            borderBottom: '1px solid #E2E8F0',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative Elements */}
          <div
            style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              background:
                'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '150px',
              height: '150px',
              background:
                'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  {title && (
                    <h1
                      className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900"
                      style={{ animation: 'fadeInUp 0.5s ease-out forwards' }}
                    >
                      {title}
                    </h1>
                  )}
                  {badge && <div className="sm:mt-1">{badge}</div>}
                </div>
                {subtitle && (
                  <p
                    className="text-gray-500 text-sm sm:text-base"
                    style={{
                      animation: 'fadeInUp 0.5s ease-out 0.1s forwards',
                      opacity: 0,
                    }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
              {action && (
                <div
                  className="flex sm:block"
                  style={{
                    animation: 'fadeInUp 0.5s ease-out 0.2s forwards',
                    opacity: 0,
                  }}
                >
                  {action}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-6">
        <div
          className="page-content"
          style={{ animation: 'fadeInUp 0.5s ease-out forwards' }}
        >
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
