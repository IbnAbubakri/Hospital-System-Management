'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ResponsiveContainer as RechartsResponsiveContainer } from 'recharts';

interface MobileChartProps {
  /**
   * Chart height
   * @default 300 on mobile, 400 on desktop
   */
  height?: number | { mobile: number; desktop: number };
  /**
   * Minimum height for chart
   */
  minHeight?: number;
  /**
   * Maximum height for chart
   */
  maxHeight?: number;
  /**
   * Chart children (actual chart component from recharts)
   */
  children: React.ReactNode;
  /**
   * Enable pinch-to-zoom
   * @default false
   */
  enableZoom?: boolean;
  /**
   * Show loading state
   */
  loading?: boolean;
  /**
   * Show error state
   */
  error?: string;
  /**
   * Empty state message
   */
  empty?: boolean;
  emptyMessage?: string;
  /**
   * Additional container className
   */
  className?: string;
}

/**
 * MobileChart - Touch-friendly chart wrapper for mobile devices
 *
 * This component wraps Recharts components to provide:
 * - Responsive sizing that works well on mobile
 * - Touch-friendly minimum heights
 * - Proper aspect ratio maintenance
 * - Loading, error, and empty states
 * - Optional pinch-to-zoom support
 *
 * @example
 * <MobileChart height={{ mobile: 250, desktop: 400 }}>
 *   <LineChart data={data}>
 *     <Line type="monotone" dataKey="value" stroke="#3B82F6" />
 *     <XAxis dataKey="name" />
 *     <YAxis />
 *   </LineChart>
 * </MobileChart>
 */
export function MobileChart({
  height,
  minHeight = 200,
  maxHeight,
  children,
  enableZoom = false,
  loading = false,
  error,
  empty = false,
  emptyMessage = 'No data available',
  className = '',
}: MobileChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isTouching, setIsTouching] = useState(false);

  // Calculate responsive height
  const getChartHeight = () => {
    if (typeof height === 'number') {
      return height;
    }

    if (typeof height === 'object' && height.mobile && height.desktop) {
      // Use mobile height for small screens
      if (containerWidth < 768) {
        return height.mobile;
      }
      return height.desktop;
    }

    // Default heights
    return containerWidth < 768 ? 300 : 400;
  };

  const chartHeight = getChartHeight();

  // Update container width on resize
  useEffect(() => {
    // SSR safety check
    if (typeof window === 'undefined') {
      return;
    }

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Handle touch events for zoom (if enabled)
  const handleTouchStart = () => {
    if (enableZoom) {
      setIsTouching(true);
    }
  };

  const handleTouchEnd = () => {
    if (enableZoom) {
      setIsTouching(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div
        ref={containerRef}
        className={`bg-white rounded-lg border border-gray-200 flex items-center justify-center ${className}`}
        style={{ minHeight: `${minHeight}px` }}
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-sm text-gray-500">Loading chart...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        ref={containerRef}
        className={`bg-white rounded-lg border border-red-200 flex items-center justify-center ${className}`}
        style={{ minHeight: `${minHeight}px` }}
      >
        <div className="text-center px-4">
          <svg
            className="mx-auto h-12 w-12 text-red-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (empty) {
    return (
      <div
        ref={containerRef}
        className={`bg-white rounded-lg border border-gray-200 flex items-center justify-center ${className}`}
        style={{ minHeight: `${minHeight}px` }}
      >
        <div className="text-center px-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-300 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`bg-white rounded-lg border border-gray-200 ${isTouching ? 'touch-pan-x touch-pan-y' : ''} ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        minHeight: `${minHeight}px`,
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        overflow: 'hidden',
      }}
    >
      <RechartsResponsiveContainer
        width="100%"
        height={chartHeight}
      >
        {children}
      </RechartsResponsiveContainer>
    </div>
  );
}

/**
 * MobileChartGrid - Responsive grid layout for multiple charts
 */
interface MobileChartGridProps {
  children: React.ReactNode;
  /**
   * Number of columns on desktop
   * @default 2
   */
  cols?: 1 | 2 | 3 | 4;
  /**
   * Gap between charts
   * @default 'medium'
   */
  gap?: 'small' | 'medium' | 'large';
}

export function MobileChartGrid({
  children,
  cols = 2,
  gap = 'medium',
}: MobileChartGridProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const gapClasses = {
    small: 'gap-3',
    medium: 'gap-4 sm:gap-6',
    large: 'gap-6 sm:gap-8',
  };

  return (
    <div className={`grid ${colClasses[cols]} ${gapClasses[gap]}`}>
      {children}
    </div>
  );
}

/**
 * MobileLegend - Custom legend that wraps nicely on mobile
 */
interface MobileLegendProps {
  items: Array<{
    name: string;
    color: string;
    value?: string | number;
  }>;
  /**
   * Layout direction
   * @default 'wrap' (wraps on mobile, row on desktop)
   */
  layout?: 'wrap' | 'horizontal' | 'vertical';
}

export function MobileLegend({
  items,
  layout = 'wrap',
}: MobileLegendProps) {
  const layoutClasses = {
    wrap: 'flex flex-wrap justify-center gap-3 sm:gap-4 lg:flex-nowrap lg:justify-end',
    horizontal: 'flex flex-wrap justify-center gap-3 sm:gap-4',
    vertical: 'flex flex-col gap-2',
  };

  return (
    <div className={layoutClasses[layout]}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-gray-600">{item.name}</span>
          {item.value !== undefined && (
            <span className="text-sm font-medium text-gray-900">
              ({item.value})
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * MobileChartTooltip - Touch-friendly tooltip
 */
interface MobileChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (value: any, name: string) => React.ReactNode;
}

export function MobileChartTooltip({
  active,
  payload,
  label,
  formatter,
}: MobileChartTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-3 max-w-xs">
      {label && (
        <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
      )}
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}</span>
          </div>
          <span className="font-medium text-gray-900">
            {formatter ? formatter(entry.value, entry.name) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}
