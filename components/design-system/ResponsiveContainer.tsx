'use client';

import React from 'react';
import {
  getResponsiveContainerClass,
  getResponsivePadding,
} from '@/lib/utils/responsive';

/**
 * Max width options for ResponsiveContainer
 */
type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';

/**
 * Padding level options for ResponsiveContainer
 */
type PaddingLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  /**
   * Maximum width of the container
   * @default 'xl' (1280px)
   */
  maxWidth?: MaxWidth;
  /**
   * Padding level
   * @default 'md'
   */
  padding?: PaddingLevel;
  /**
   * Additional CSS classes to apply
   */
  className?: string;
  /**
   * Whether to add horizontal padding (default: true)
   * Set to false if you want full-width content
   */
  withPadding?: boolean;
  /**
   * Custom padding level for vertical spacing
   * Adds py-4 sm:py-6 md:py-8
   */
  verticalPadding?: boolean;
  /**
   * Background color
   * @default 'transparent'
   */
  background?: 'white' | 'gray' | 'blue' | 'transparent';
}

/**
 * ResponsiveContainer - A reusable wrapper that handles responsive layout
 *
 * This component provides:
 * - Responsive padding (4px mobile → 32px desktop)
 * - Max width constraints (responsive, not fixed)
 * - Center alignment
 * - Full-width support on mobile
 *
 * @example
 * // Basic usage
 * <ResponsiveContainer>
 *   <YourContent />
 * </ResponsiveContainer>
 *
 * @example
 * // Custom max width and padding
 * <ResponsiveContainer maxWidth="2xl" padding="lg">
 *   <YourContent />
 * </ResponsiveContainer>
 *
 * @example
 * // Full-width with background
 * <ResponsiveContainer maxWidth="full" background="blue">
 *   <YourContent />
 * </ResponsiveContainer>
 */
export function ResponsiveContainer({
  children,
  maxWidth = 'xl',
  padding = 'md',
  className = '',
  withPadding = true,
  verticalPadding = false,
  background = 'transparent',
}: ResponsiveContainerProps) {
  // Build container classes
  const containerClasses = [
    'w-full',
    'mx-auto', // Center horizontally
    // Max width constraints
    maxWidth === 'sm' && 'max-w-sm',
    maxWidth === 'md' && 'max-w-md',
    maxWidth === 'lg' && 'max-w-lg',
    maxWidth === 'xl' && 'max-w-xl',
    maxWidth === '2xl' && 'max-w-2xl',
    maxWidth === 'full' && 'max-w-full',
    maxWidth === 'none' && '',
    // Background colors
    background === 'white' && 'bg-white',
    background === 'gray' && 'bg-gray-50',
    background === 'blue' && 'bg-blue-50',
    background === 'transparent' && '',
    // Vertical padding
    verticalPadding && 'py-4 sm:py-6 md:py-8',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Build padding classes
  const paddingClasses = withPadding
    ? getResponsivePadding(padding)
    : '';

  return (
    <div className={containerClasses}>
      <div className={paddingClasses}>{children}</div>
    </div>
  );
}

/**
 * ResponsiveSection - A section variant with consistent vertical spacing
 *
 * Useful for dividing content into logical sections with proper spacing
 *
 * @example
 * <ResponsiveSection>
 *   <h2>Section Title</h2>
 *   <p>Section content...</p>
 * </ResponsiveSection>
 */
interface ResponsiveSectionProps extends Omit<ResponsiveContainerProps, 'verticalPadding'> {
  /**
   * Section ID for anchor links
   */
  id?: string;
}

export function ResponsiveSection({
  children,
  id,
  maxWidth = 'xl',
  padding = 'md',
  className = '',
  withPadding = true,
  background = 'transparent',
}: ResponsiveSectionProps) {
  return (
    <section
      id={id}
      className={`my-6 sm:my-8 md:my-12 ${background === 'white' ? 'bg-white' : background === 'gray' ? 'bg-gray-50' : ''}`}
    >
      <ResponsiveContainer
        maxWidth={maxWidth}
        padding={padding}
        className={className}
        withPadding={withPadding}
        background={background}
      >
        {children}
      </ResponsiveContainer>
    </section>
  );
}

/**
 * ResponsiveGrid - A responsive grid container
 *
 * Provides consistent responsive grid layouts with proper spacing
 *
 * @example
 * // 4-column grid (1 on mobile, 2 on tablet, 4 on desktop)
 * <ResponsiveGrid cols={4}>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 *   <Card>Item 4</Card>
 * </ResponsiveGrid>
 */
interface ResponsiveGridProps {
  children: React.ReactNode;
  /**
   * Number of columns
   * - 1: Single column (all sizes)
   * - 2: 1 col mobile, 2 cols tablet+
   * - 3: 1 col mobile, 2 cols tablet, 3 cols desktop
   * - 4: 1 col mobile, 2 cols tablet, 4 cols desktop
   * - 6: 2 cols mobile, 3 cols tablet, 4 cols desktop, 6 cols large desktop
   * @default 4
   */
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  /**
   * Gap between grid items
   * @default 'md' (1rem)
   */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = 4,
  gap = 'md',
  className = '',
}: ResponsiveGridProps) {
  // Grid column classes
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
    12: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12',
  }[cols];

  // Gap classes
  const gapClass = {
    none: 'gap-0',
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4 md:gap-6',
    lg: 'gap-4 sm:gap-6 md:gap-8',
    xl: 'gap-6 sm:gap-8 md:gap-12',
  }[gap];

  return (
    <div className={`grid ${gridColsClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
}

/**
 * ResponsiveStack - A flex container that stacks vertically on mobile
 *
 * @example
 * <ResponsiveStack>
 *   <Button>Button 1</Button>
 *   <Button>Button 2</Button>
 * </ResponsiveStack>
 */
interface ResponsiveStackProps {
  children: React.ReactNode;
  /**
   * Alignment on desktop (when items are in a row)
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /**
   * Justify content
   * @default 'start'
   */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  /**
   * Breakpoint to switch from column to row
   * @default 'md'
   */
  directionBreakpoint?: 'sm' | 'md' | 'lg';
  /**
   * Gap between items
   * @default 'md'
   */
  gap?: 'sm' | 'md' | 'lg';
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function ResponsiveStack({
  children,
  align = 'start',
  justify = 'start',
  directionBreakpoint = 'md',
  gap = 'md',
  className = '',
}: ResponsiveStackProps) {
  // Alignment classes
  const alignClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }[align];

  // Justify classes
  const justifyClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  }[justify];

  // Direction classes
  const directionClass = {
    sm: 'flex-col sm:flex-row',
    md: 'flex-col md:flex-row',
    lg: 'flex-col lg:flex-row',
  }[directionBreakpoint];

  // Gap classes
  const gapClass = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4',
    lg: 'gap-4 sm:gap-6',
  }[gap];

  return (
    <div
      className={`flex ${directionClass} ${alignClass} ${justifyClass} ${gapClass} ${className}`}
    >
      {children}
    </div>
  );
}
