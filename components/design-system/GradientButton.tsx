'use client';

import React from 'react';
import { Button, ButtonProps } from 'antd';

interface GradientButtonProps extends Omit<ButtonProps, 'type' | 'variant'> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  gradient?: string;
  /**
   * Make button full width on mobile devices
   * @default false
   */
  fullWidthOnMobile?: boolean;
}

/**
 * GradientButton - Primary action button with gradient background
 *
 * @example
 * <GradientButton
 *   icon={<PlusOutlined />}
 *   onClick={handleClick}
 * >
 *   Add Patient
 * </GradientButton>
 *
 * <GradientButton variant="success">
 *   Approve
 * </GradientButton>
 *
 * <GradientButton variant="secondary">
 *   Cancel
 * </GradientButton>
 */
export function GradientButton({
  children,
  variant = 'primary',
  gradient,
  icon,
  fullWidthOnMobile = false,
  style,
  ...props
}: GradientButtonProps) {
  const getGradientConfig = () => {
    if (gradient) {
      return { gradient, hoverGradient: gradient };
    }

    switch (variant) {
      case 'primary':
        return {
          gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
          hoverGradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
        };
      case 'secondary':
        return {
          gradient: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
          hoverGradient: 'linear-gradient(135deg, #4B5563 0%, #374151 100%)',
        };
      case 'success':
        return {
          gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          hoverGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        };
      case 'warning':
        return {
          gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          hoverGradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
        };
      case 'danger':
        return {
          gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          hoverGradient: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
        };
      default:
        return {
          gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
          hoverGradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
        };
    }
  };

  const config = getGradientConfig();
  const isSecondary = variant === 'secondary' && !gradient;

  return (
    <>
      <Button
        type={isSecondary ? 'default' : 'primary'}
        icon={icon}
        style={{
          height: '42px',
          borderRadius: '10px',
          fontWeight: 600,
          padding: '0 20px',
          background: isSecondary ? 'white' : config.gradient,
          border: isSecondary ? '1px solid #E2E8F0' : 'none',
          transition: 'all 0.3s ease',
          width: fullWidthOnMobile ? '100%' : undefined,
          ...style,
        }}
        className={`gradient-button ${fullWidthOnMobile ? 'sm:w-auto' : ''}`}
        {...props}
      >
        {children}
      </Button>

      <style jsx global>{`
        .gradient-button:hover {
          transform: translateY(-2px);
          box-shadow: ${isSecondary
            ? '0 4px 12px rgba(0, 0, 0, 0.1)'
            : '0 8px 20px rgba(59, 130, 246, 0.4)'};
          background: ${isSecondary ? 'white' : config.hoverGradient} !important;
        }

        .gradient-button:active {
          transform: translateY(0);
        }

        .gradient-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
      `}</style>
    </>
  );
}
