'use client';

import React, { Component, ReactNode } from 'react';
import { Button, Card, Result } from 'antd';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/dashboard';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '24px',
            background: '#F8FAFC',
          }}
        >
          <Card style={{ maxWidth: 500, textAlign: 'center' }}>
            <Result
              status="error"
              title="Something went wrong"
              subTitle="We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists."
              extra={[
                <Button key="retry" type="primary" onClick={this.handleReset}>
                  Go to Dashboard
                </Button>,
                <Button key="home" onClick={() => window.location.href = '/'}>
                  Go Home
                </Button>,
              ]}
            />
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div
                style={{
                  marginTop: '24px',
                  padding: '16px',
                  background: '#FEF2F2',
                  borderRadius: '8px',
                  textAlign: 'left',
                  fontSize: '12px',
                }}
              >
                <strong style={{ color: '#DC2626' }}>Error:</strong>
                <pre
                  style={{
                    overflow: 'auto',
                    maxHeight: '150px',
                    marginTop: '8px',
                    color: '#991B1B',
                  }}
                >
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo?.componentStack && (
                  <>
                    <strong style={{ color: '#DC2626', marginTop: '12px', display: 'block' }}>
                      Component Stack:
                    </strong>
                    <pre
                      style={{
                        overflow: 'auto',
                        maxHeight: '100px',
                        marginTop: '8px',
                        fontSize: '10px',
                        color: '#991B1B',
                      }}
                    >
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </>
                )}
              </div>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

interface AsyncBoundaryProps {
  children: ReactNode;
  loading?: ReactNode;
}

interface AsyncBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class AsyncErrorBoundary extends Component<AsyncBoundaryProps, AsyncBoundaryState> {
  constructor(props: AsyncBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): Partial<AsyncBoundaryState> {
    return { hasError: true, error };
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '48px 24px',
          }}
        >
          <Card style={{ maxWidth: 400, textAlign: 'center' }}>
            <Result
              status="error"
              title="Failed to load data"
              subTitle="We couldn't fetch the latest data. Please check your connection and try again."
              extra={
                <Button type="primary" onClick={this.handleRetry}>
                  Try Again
                </Button>
              }
            />
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
