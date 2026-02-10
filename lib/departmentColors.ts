/**
 * Department Color Scheme Configuration
 *
 * Provides consistent color coding for different hospital departments
 * Used throughout the application for visual distinction
 */

export interface DepartmentColorScheme {
  primary: string;
  light: string;
  lighter: string;
  dark: string;
  gradient: string;
  bg: string;
  border: string;
  text: string;
}

export const DEPARTMENT_COLORS: Record<string, DepartmentColorScheme> = {
  Cardiology: {
    primary: '#EF4444',           // Red
    light: '#FEE2E2',
    lighter: '#FEE2E2',
    dark: '#DC2626',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.2)',
    text: '#991B1B',
  },
  'General Medicine': {
    primary: '#3B82F6',           // Blue
    light: '#DBEAFE',
    lighter: '#EFF6FF',
    dark: '#2563EB',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    bg: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.2)',
    text: '#1E40AF',
  },
  Orthopedics: {
    primary: '#F59E0B',           // Orange/Amber
    light: '#FEF3C7',
    lighter: '#FEF3C7',
    dark: '#D97706',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.2)',
    text: '#92400E',
  },
  Pediatrics: {
    primary: '#A855F7',           // Purple
    light: '#E9D5FF',
    lighter: '#F3E8FF',
    dark: '#9333EA',
    gradient: 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
    bg: 'rgba(168, 85, 247, 0.1)',
    border: 'rgba(168, 85, 247, 0.2)',
    text: '#5B21B6',
  },
  Neurology: {
    primary: '#10B981',           // Emerald/Green
    light: '#D1FAE5',
    lighter: '#ECFDF5',
    dark: '#059669',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.2)',
    text: '#065F46',
  },
  Administration: {
    primary: '#6B7280',           // Gray
    light: '#F3F4F6',
    lighter: '#F9FAFB',
    dark: '#4B5563',
    gradient: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
    bg: 'rgba(107, 114, 128, 0.1)',
    border: 'rgba(107, 114, 128, 0.2)',
    text: '#374151',
  },
  ICU: {
    primary: '#8B5CF6',            // Violet/Purple
    light: '#EDE9FE',
    lighter: '#F5F3FF',
    dark: '#7C3AED',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    bg: 'rgba(139, 92, 246, 0.1)',
    border: 'rgba(139, 92, 246, 0.2)',
    text: '#5B21B6',
  },
  Emergency: {
    primary: '#DC2626',           // Dark Red
    light: '#FEE2E2',
    lighter: '#FEE2E2',
    dark: '#B91C1C',
    gradient: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
    bg: 'rgba(220, 38, 38, 0.1)',
    border: 'rgba(220, 38, 38, 0.2)',
    text: '#991B1B',
  },
  Laboratory: {
    primary: '#EC4899',           // Pink
    light: '#FCE7F3',
    lighter: '#FDF2F8',
    dark: '#DB2777',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
    bg: 'rgba(236, 72, 153, 0.1)',
    border: 'rgba(236, 72, 153, 0.2)',
    text: '#9F1239',
  },
  Radiology: {
    primary: '#6366F1',           // Indigo
    light: '#E0E7FF',
    lighter: '#EEF2FF',
    dark: '#4F46E5',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    bg: 'rgba(99, 102, 241, 0.1)',
    border: 'rgba(99, 102, 241, 0.2)',
    text: '#4338CA',
  },
  Pharmacy: {
    primary: '#14B8A6',           // Teal/Green
    light: '#CCFBF1',
    lighter: '#D1FAE5',
    dark: '#0D9488',
    gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    bg: 'rgba(20, 184, 166, 0.1)',
    border: 'rgba(20, 184, 166, 0.2)',
    text: '#0F766E',
  },
  // Default fallback
  General: {
    primary: '#64748B',           // Slate
    light: '#F3F4F6',
    lighter: '#F9FAFB',
    dark: '#475569',
    gradient: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
    bg: 'rgba(100, 116, 139, 0.1)',
    border: 'rgba(100, 116, 139, 0.2)',
    text: '#1E293B',
  },
};

/**
 * Get color scheme for a department
 */
export function getDepartmentColors(department: string): DepartmentColorScheme {
  return DEPARTMENT_COLORS[department] || DEPARTMENT_COLORS.General;
}

/**
 * Get department badge styles
 */
export function getDepartmentBadgeStyle(department: string) {
  const colors = getDepartmentColors(department);
  return {
    backgroundColor: colors.light,
    color: colors.text,
    borderColor: colors.border,
  };
}

/**
 * Get department gradient background
 */
export function getDepartmentGradient(department: string): string {
  const colors = getDepartmentColors(department);
  return colors.gradient;
}

/**
 * Get department tag style for status
 */
export function getDepartmentTagStyle(department: string, variant: 'filled' | 'outlined' = 'filled') {
  const colors = getDepartmentColors(department);

  if (variant === 'filled') {
    return {
      backgroundColor: colors.primary,
      color: 'white',
      border: 'none',
    };
  }

  return {
    backgroundColor: colors.light,
    color: colors.text,
    borderColor: colors.border,
  };
}

/**
 * Get color for department dot/avatar
 */
export function getDepartmentDotColor(department: string): string {
  const colors = getDepartmentColors(department);
  return colors.primary;
}

/**
 * Get department icon color
 */
export function getDepartmentIconColor(department: string): string {
  const colors = getDepartmentColors(department);
  return colors.primary;
}
