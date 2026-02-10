'use client';

import { useEffect, useState } from 'react';

/**
 * Responsive breakpoint constants following Tailwind CSS v4 default breakpoints
 * These align with the project's Tailwind configuration
 */
export const breakpoints = {
  xs: '320px',   // Small phones
  sm: '640px',   // Large phones
  md: '768px',   // Tablets
  lg: '1024px',  // Desktops
  xl: '1280px',  // Large desktops
  '2xl': '1536px', // Extra large screens
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Breakpoint values in pixels for numeric comparisons
 */
export const breakpointValues = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Custom hook to detect if a media query matches
 * @param query - CSS media query string (e.g., '(max-width: 768px)')
 * @returns Boolean indicating if the media query currently matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Use addListener for older browsers, addEventListener for newer ones
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
}

/**
 * Custom hook to get current breakpoint information
 * @returns Object with boolean flags for each breakpoint level
 *
 * @example
 * const { isSm, isMd, isLg, currentBreakpoint } = useBreakpoint();
 * if (isMd) { // Tablet or larger }
 */
export function useBreakpoint() {
  const isXs = useMediaQuery(`(min-width: ${breakpoints.xs})`);
  const isSm = useMediaQuery(`(min-width: ${breakpoints.sm})`);
  const isMd = useMediaQuery(`(min-width: ${breakpoints.md})`);
  const isLg = useMediaQuery(`(min-width: ${breakpoints.lg})`);
  const isXl = useMediaQuery(`(min-width: ${breakpoints.xl})`);
  const is2Xl = useMediaQuery(`(min-width: ${breakpoints['2xl']})`);

  const currentBreakpoint: Breakpoint = is2Xl
    ? '2xl'
    : isXl
    ? 'xl'
    : isLg
    ? 'lg'
    : isMd
    ? 'md'
    : isSm
    ? 'sm'
    : 'xs';

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    currentBreakpoint,
    // Convenience aliases
    isMobile: isSm && !isMd, // Between sm and md (large phones)
    isTablet: isMd && !isLg, // Between md and lg (tablets)
    isDesktop: isLg, // lg and above (desktops)
  };
}

/**
 * Get a value based on the current breakpoint
 * Useful for responsive props that don't work well with Tailwind classes
 *
 * @param values - Object with breakpoint keys and corresponding values
 * @param currentBreakpoint - Current breakpoint from useBreakpoint()
 * @returns The value for the current breakpoint (or closest smaller breakpoint)
 *
 * @example
 * const { currentBreakpoint } = useBreakpoint();
 * const columns = getBreakpointValue(
 *   { xs: 1, sm: 2, md: 3, lg: 4 },
 *   currentBreakpoint
 * );
 */
export function getBreakpointValue<T>(
  values: Partial<Record<Breakpoint, T>>,
  currentBreakpoint: Breakpoint
): T {
  // Direct match
  if (values[currentBreakpoint] !== undefined) {
    return values[currentBreakpoint] as T;
  }

  // Find the closest smaller breakpoint
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);

  for (let i = currentIndex - 1; i >= 0; i--) {
    const smallerBreakpoint = breakpointOrder[i];
    if (values[smallerBreakpoint] !== undefined) {
      return values[smallerBreakpoint] as T;
    }
  }

  // Fallback to xs if nothing else found
  return values.xs as T;
}

/**
 * Responsive container padding classes
 * Returns Tailwind classes for responsive padding
 *
 * @param level - Padding level: 'none' | 'sm' | 'md' | 'lg' | 'xl'
 * @returns Responsive padding classes
 */
export function getResponsivePadding(level: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md'): string {
  const paddingMap = {
    none: 'px-0 sm:px-0 md:px-0 lg:px-0',
    sm: 'px-2 sm:px-4 md:px-6 lg:px-4',
    md: 'px-4 sm:px-6 md:px-8 lg:px-8',
    lg: 'px-4 sm:px-6 md:px-8 lg:px-12',
    xl: 'px-4 sm:px-6 md:px-12 lg:px-16',
  };
  return paddingMap[level];
}

/**
 * Responsive container class
 * Combines width, max-width, and padding for consistent responsive containers
 *
 * @param maxWidth - Maximum width: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none'
 * @param padding - Padding level
 * @returns Complete container class string
 */
export function getResponsiveContainerClass(
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none' = 'xl',
  padding: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
): string {
  const maxWidthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
    none: '',
  };

  return `w-full mx-auto ${maxWidthMap[maxWidth]} ${getResponsivePadding(padding)}`;
}

/**
 * Responsive grid classes
 * Returns Tailwind classes for responsive grid layouts
 *
 * @param cols - Number of columns: 1 | 2 | 3 | 4 | 6 | 12
 * @returns Responsive grid classes
 */
export function getResponsiveGrid(cols: 1 | 2 | 3 | 4 | 6 | 12 = 4): string {
  const gridMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
    12: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12',
  };
  return gridMap[cols];
}

/**
 * Hide elements on specific breakpoints
 * Useful for showing mobile/desktop alternatives
 *
 * @param hideOn - Array of breakpoints to hide on
 * @returns Tailwind classes to hide on specified breakpoints
 */
export function getHiddenClasses(hideOn: Breakpoint[]): string {
  const classMap: Record<Breakpoint, string> = {
    xs: 'hidden',
    sm: 'sm:hidden',
    md: 'md:hidden',
    lg: 'lg:hidden',
    xl: 'xl:hidden',
    '2xl': '2xl:hidden',
  };

  return hideOn.map(bp => classMap[bp]).join(' ');
}

/**
 * Show elements only on specific breakpoints
 * Useful for mobile-only or desktop-only elements
 *
 * @param showOnly - Array of breakpoints to show on
 * @returns Tailwind classes to show only on specified breakpoints
 */
export function getShowOnlyClasses(showOnly: Breakpoint[]): string {
  // Hide by default, then show on specific breakpoints
  const baseClass = 'hidden';
  const showClasses = showOnly.map(bp => {
    const classMap: Record<Breakpoint, string> = {
      xs: '',
      sm: 'sm:block',
      md: 'md:block',
      lg: 'lg:block',
      xl: 'xl:block',
      '2xl': '2xl:block',
    };
    return classMap[bp];
  });

  return [baseClass, ...showClasses].join(' ');
}

/**
 * Check if the current viewport is in mobile range (< 768px)
 * @param currentBreakpoint - Current breakpoint from useBreakpoint()
 * @returns true if mobile, false otherwise
 */
export function isMobileBreakpoint(currentBreakpoint: Breakpoint): boolean {
  return ['xs', 'sm'].includes(currentBreakpoint);
}

/**
 * Check if the current viewport is in tablet range (768px - 1024px)
 * @param currentBreakpoint - Current breakpoint from useBreakpoint()
 * @returns true if tablet, false otherwise
 */
export function isTabletBreakpoint(currentBreakpoint: Breakpoint): boolean {
  return currentBreakpoint === 'md';
}

/**
 * Check if the current viewport is in desktop range (>= 1024px)
 * @param currentBreakpoint - Current breakpoint from useBreakpoint()
 * @returns true if desktop, false otherwise
 */
export function isDesktopBreakpoint(currentBreakpoint: Breakpoint): boolean {
  return ['lg', 'xl', '2xl'].includes(currentBreakpoint);
}
