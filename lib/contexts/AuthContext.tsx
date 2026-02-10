'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockUsers, mockPatients, mockAppointments } from '@/lib/mockData';
import {
  filterPatientsByUser,
  filterEMRsByUser,
  canUserViewPatient,
  canUserViewEMR,
  getUserFullName,
  getPatientStatsForUser,
  filterAppointmentsByUser,
} from '@/lib/dataFilters';

// User type definition
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  phoneNumber: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  permissions: string[];
  lastLogin?: Date;
}

// Auth context type definition
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  canViewPatient: (patientId: string) => boolean;
  canViewEMR: (emrId: string) => boolean;
  getFilteredPatients: () => any[];
  getFilteredEMRs: (allEMRs?: any[]) => any[];
  getUserFullName: () => string;
  getPatientStats: () => { total: number; active: number; newThisMonth: number; withAllergies: number };
  getPendingAppointments: () => any[];
  getNotificationCount: () => number;
  clearNotifications: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Storage key
const STORAGE_KEY = 'hospital_user_session';
const TOKEN_KEY = 'hospital_token';

// Auth Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const loadSession = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to load session:', error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Find user by email or username
    const foundUser = mockUsers.find(
      (u) => (u.email === email || u.username === email) && u.password === password
    );

    if (foundUser) {
      const userSession: User = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        role: foundUser.role,
        department: foundUser.department,
        status: foundUser.status as 'active' | 'inactive' | 'suspended',
        phoneNumber: (foundUser as any).contactNumber || (foundUser as any).phoneNumber || '',
        permissions: (foundUser as any).permissions || [],
      };

      // Store session
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userSession));
      localStorage.setItem(TOKEN_KEY, `mock-token-${Date.now()}`);

      setUser(userSession);
      return true;
    }

    return false;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  // Check if user has specific role
  const hasRole = (role: string): boolean => {
    if (!user) return false;
    if (user.role === 'Administrator') return true;
    return user.role.toLowerCase() === role.toLowerCase();
  };

  // Check if user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'Administrator') return true;

    // Define permissions per role
    const rolePermissions: Record<string, string[]> = {
      Doctor: [
        'view_patients',
        'create_emr',
        'view_emr',
        'create_prescription',
        'schedule_appointments',
        'view_lab_results',
        // Report permissions for Doctors
        'reports:clinical:view',
        'reports:patient:view',
        'reports:doctor_metrics:view',
        'reports:disease_trends:view',
        'reports:outcomes:view',
        'reports:utilization:view',
        // NOTE: NO financial reports access for Doctors
      ],
      AuxiliaryNurse: [
        'view_patients',
        'triage_patients',
        'create_appointments',
        'view_all_doctors',
        // Report permissions for AuxiliaryNurses
        'reports:patient:view',        // For triage
        'reports:utilization:view',    // Bed utilization for triage
        // NOTE: NO financial, clinical, or doctor metrics access for Nurses
      ],
      Administrator: ['*'], // All permissions
    };

    const permissions = rolePermissions[user.role] || [];
    return permissions.includes('*') || permissions.includes(permission);
  };

  // Check if user can view a specific patient
  const canViewPatientCheck = (patientId: string): boolean => {
    return canUserViewPatient(user, patientId);
  };

  // Check if user can view a specific EMR
  const canViewEMRCheck = (emrId: string): boolean => {
    return canUserViewEMR(user, emrId);
  };

  // Get filtered patients based on logged-in user
  const getFilteredPatients = (): any[] => {
    return filterPatientsByUser(user);
  };

  // Get filtered EMRs based on logged-in user
  const getFilteredEMRs = (allEMRs?: any[]): any[] => {
    return filterEMRsByUser(user, allEMRs || []);
  };

  // Get user's full name with title
  const getUserDisplayName = (): string => {
    return getUserFullName(user);
  };

  // Get patient statistics for user
  const getPatientStats = () => {
    return getPatientStatsForUser(user);
  };

  // Get pending appointments for notification (for doctors)
  const getPendingAppointments = (): any[] => {
    if (!user || user.role !== 'Doctor') return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userApps = filterAppointmentsByUser(user, mockAppointments);
    return userApps.filter((apt: any) => {
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate.getTime() >= today.getTime() && apt.status === 'scheduled';
    });
  };

  // Get notification count
  const getNotificationCount = (): number => {
    return getPendingAppointments().length;
  };

  // Clear notifications (mark as viewed)
  const clearNotifications = () => {
    // In a real app, this would mark notifications as read in the database
    // For now, we'll just log it
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasRole,
    hasPermission,
    canViewPatient: canViewPatientCheck,
    canViewEMR: canViewEMRCheck,
    getFilteredPatients,
    getFilteredEMRs,
    getUserFullName: getUserDisplayName,
    getPatientStats,
    getPendingAppointments,
    getNotificationCount,
    clearNotifications,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
