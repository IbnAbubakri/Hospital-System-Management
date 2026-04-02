'use client';

import React from 'react';
import { Button, Card } from 'antd';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  compact?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
}: EmptyStateProps) {
  const defaultIcon = (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="8" y="16" width="48" height="36" rx="4" stroke="#CBD5E1" strokeWidth="2" fill="none" />
      <path d="M8 24H56" stroke="#CBD5E1" strokeWidth="2" />
      <circle cx="16" cy="20" r="2" fill="#CBD5E1" />
      <circle cx="24" cy="20" r="2" fill="#CBD5E1" />
      <rect x="16" y="32" width="32" height="4" rx="2" fill="#E2E8F0" />
      <rect x="16" y="40" width="24" height="4" rx="2" fill="#E2E8F0" />
    </svg>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: compact ? '32px 16px' : '64px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: compact ? '48px' : '64px', marginBottom: '16px' }}>
        {icon || defaultIcon}
      </div>
      <h3
        style={{
          fontSize: compact ? '16px' : '18px',
          fontWeight: 600,
          color: '#1E293B',
          marginBottom: '8px',
          margin: 0,
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: '14px',
            color: '#64748B',
            maxWidth: '400px',
            marginBottom: compact ? '16px' : '24px',
          }}
        >
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {action && (
            <Button type="primary" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '3px solid #E2E8F0',
          borderTopColor: '#3B82F6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px',
        }}
      />
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ fontSize: '14px', color: '#64748B' }}>{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading this page. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="28" stroke="#FCA5A5" strokeWidth="2" fill="#FEF2F2" />
          <path d="M32 20V36" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="44" r="3" fill="#EF4444" />
        </svg>
      </div>
      <h3
        style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#1E293B',
          marginBottom: '8px',
          margin: 0,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '14px',
          color: '#64748B',
          maxWidth: '400px',
          marginBottom: '24px',
        }}
      >
        {message}
      </p>
      {onRetry && (
        <Button type="primary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
