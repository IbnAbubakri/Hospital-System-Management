/**
 * Dashboard Filtering Utilities
 *
 * Centralized filtering logic specifically for dashboard data.
 * Ensures each role sees only the information relevant to them:
 * - Administrator: Hospital-wide metrics and all data
 * - Doctor: Only their department's data and assigned patients
 * - AuxiliaryNurse: Triage-related information and scheduling data
 */

import { User } from '@/types';
import { mockPatients, mockAppointments, mockInpatients, mockStats, dashboardChartData, mockDoctors, doctorAvailability } from './mockData';
import { filterPatientsByUser, filterAppointmentsByUser } from './dataFilters';

/**
 * Dashboard statistics interface
 */
export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  admittedPatients: number;
  pendingLabResults: number;
  pendingRadiologyReports: number;
  monthlyRevenue?: number;
  occupancyRate?: number;
  // Doctor-specific stats
  myPatients?: number;
  pendingEMRs?: number;
  labOrders?: number;
  // Nurse-specific stats
  triageToday?: number;
  availableDoctors?: number;
  pendingTriage?: number;
}

/**
 * Get dashboard statistics filtered by user role
 */
export function getDashboardStatsForUser(user: User | null): DashboardStats {
  if (!user) {
    return {
      totalPatients: 0,
      todayAppointments: 0,
      admittedPatients: 0,
      pendingLabResults: 0,
      pendingRadiologyReports: 0,
    };
  }

  // Administrator - sees hospital-wide data
  if (user.role === 'Administrator') {
    return {
      totalPatients: mockStats.totalPatients,
      todayAppointments: mockStats.todayAppointments,
      admittedPatients: mockStats.admittedPatients,
      pendingLabResults: mockStats.pendingLabResults,
      pendingRadiologyReports: mockStats.pendingRadiologyReports,
      monthlyRevenue: mockStats.totalRevenue,
      occupancyRate: mockStats.occupancyRate,
    };
  }

  // Doctor - sees department-specific and assigned data
  if (user.role === 'Doctor') {
    const myPatients = filterPatientsByUser(user);
    const myAppointments = filterAppointmentsByUser(user, mockAppointments);

    const todayAppointments = myAppointments.filter(apt => {
      const aptDate = new Date(apt.date);
      const today = new Date();
      return aptDate.getDate() === today.getDate() &&
             aptDate.getMonth() === today.getMonth() &&
             aptDate.getFullYear() === today.getFullYear();
    }).length;

    return {
      totalPatients: myPatients.length,
      todayAppointments: todayAppointments,
      admittedPatients: myPatients.filter(p => p.status === 'active').length,
      pendingLabResults: Math.floor(mockStats.pendingLabResults / 5), // Estimated for department
      pendingRadiologyReports: Math.floor(mockStats.pendingRadiologyReports / 5),
      myPatients: myPatients.length,
      pendingEMRs: 8, // Mock value - would come from EMR system
      labOrders: 12, // Mock value - would come from lab orders
    };
  }

  // AuxiliaryNurse - sees triage and scheduling data
  if (user.role === 'AuxiliaryNurse') {
    const allPatients = filterPatientsByUser(user); // Returns all for nurses
    const allAppointments = mockAppointments; // All appointments for scheduling

    const todayAppointments = allAppointments.filter(apt => {
      const aptDate = new Date(apt.date);
      const today = new Date();
      return aptDate.getDate() === today.getDate() &&
             aptDate.getMonth() === today.getMonth() &&
             aptDate.getFullYear() === today.getFullYear();
    }).length;

    const availableDoctors = getAvailableDoctors().length;

    return {
      totalPatients: allPatients.length,
      todayAppointments: todayAppointments,
      admittedPatients: allPatients.filter(p => p.status === 'active').length,
      pendingLabResults: mockStats.pendingLabResults,
      pendingRadiologyReports: mockStats.pendingRadiologyReports,
      triageToday: 24, // Mock value - would come from triage system
      availableDoctors: availableDoctors,
      pendingTriage: 7, // Mock value - would come from triage queue
    };
  }

  // Default fallback
  return {
    totalPatients: 0,
    todayAppointments: 0,
    admittedPatients: 0,
    pendingLabResults: 0,
    pendingRadiologyReports: 0,
  };
}

/**
 * Filter patient visits chart data by user role
 */
export function filterPatientVisitsByUser(user: User | null): { name: string; value: number }[] {
  if (!user) return [];

  const allData = dashboardChartData.patientVisits.labels.map((label, index) => ({
    name: label,
    value: dashboardChartData.patientVisits.data[index],
  }));

  // Administrator sees all data
  if (user.role === 'Administrator') {
    return allData;
  }

  // Doctor sees department-specific data (estimated)
  if (user.role === 'Doctor') {
    return allData.map(item => ({
      ...item,
      value: Math.floor(item.value / 5), // Roughly 1/5th for one department
    }));
  }

  // Nurse sees all data for scheduling purposes
  if (user.role === 'AuxiliaryNurse') {
    return allData;
  }

  return [];
}

/**
 * Filter revenue trend data by user role
 */
export function filterRevenueByUser(user: User | null): { name: string; value: number }[] {
  if (!user) return [];

  const allData = dashboardChartData.revenue.labels.map((label, index) => ({
    name: label,
    value: dashboardChartData.revenue.data[index],
  }));

  // Administrator sees all revenue data
  if (user.role === 'Administrator') {
    return allData;
  }

  // Doctor sees department-specific revenue
  if (user.role === 'Doctor') {
    return allData.map(item => ({
      ...item,
      value: Math.floor(item.value / 5), // Roughly 1/5th for one department
    }));
  }

  // Nurse does not see revenue data
  if (user.role === 'AuxiliaryNurse') {
    return [];
  }

  return [];
}

/**
 * Filter department distribution by user role
 */
export function filterDepartmentDistribution(user: User | null): { name: string; value: number }[] {
  if (!user) return [];

  const allData = dashboardChartData.departmentDistribution;

  // Administrator sees all departments
  if (user.role === 'Administrator') {
    return allData;
  }

  // Doctor sees only their department
  if (user.role === 'Doctor') {
    return allData.filter(dept => dept.name === user.department);
  }

  // Nurse sees all departments for scheduling
  if (user.role === 'AuxiliaryNurse') {
    return allData;
  }

  return [];
}

/**
 * Activity feed item interface
 */
export interface ActivityItem {
  id: string;
  type: 'appointment' | 'admission' | 'payment' | 'lab' | 'patient' | 'triage' | 'scheduling';
  title: string;
  description: string;
  user: string;
  timeString: string;
  status?: string;
  department?: string;
  doctorId?: string;
}

/**
 * Default activities for dashboard
 */
const defaultActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'New Appointment Scheduled',
    description: 'Chukwuemeka Okonkwo scheduled an appointment with Dr. Ngozi Adeleke',
    user: 'Reception',
    timeString: '5 minutes ago',
    status: 'confirmed',
    department: 'Cardiology',
    doctorId: 'd1',
  },
  {
    id: '2',
    type: 'admission',
    title: 'Patient Admitted',
    description: 'Chukwuemeka Okonkwo was admitted to Male Ward A - Bed 101',
    user: 'Dr. Ngozi Adeleke',
    timeString: '15 minutes ago',
    status: 'admitted',
    department: 'Cardiology',
    doctorId: 'd1',
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Received',
    description: '₦65,000 payment received for invoice INV-2024-0001',
    user: 'Billing',
    timeString: '30 minutes ago',
    status: 'completed',
  },
  {
    id: '4',
    type: 'lab',
    title: 'Lab Results Completed',
    description: 'Complete Blood Count results for Chukwuemeka Okonkwo',
    user: 'Lab Technician',
    timeString: '45 minutes ago',
    status: 'approved',
    department: 'Cardiology',
    doctorId: 'd1',
  },
  {
    id: '5',
    type: 'patient',
    title: 'New Patient Registered',
    description: 'Amina Okonkwo registered in Pediatrics',
    user: 'Reception',
    timeString: '1 hour ago',
    department: 'Pediatrics',
  },
  {
    id: '6',
    type: 'triage',
    title: 'Patient Triage Completed',
    description: 'Triage assessment completed for Adanna Okafor - General Medicine',
    user: 'Nurse Amaka',
    timeString: '2 hours ago',
    status: 'completed',
  },
  {
    id: '7',
    type: 'scheduling',
    title: 'Doctor Schedule Updated',
    description: 'Dr. Emeka Okoro availability updated for next week',
    user: 'Administration',
    timeString: '3 hours ago',
  },
];

/**
 * Filter activity feed by user role and permissions
 *
 * SECURITY: This function implements role-based access control for activity feeds.
 * Payment activities are ONLY visible to Administrators (VIEW_FINANCIAL_REPORTS permission).
 * Doctors see only clinical activities related to their department/patients.
 * AuxiliaryNurses see only triage/admission/scheduling activities.
 */
export function filterActivityFeedByUser(user: User | null, activities: ActivityItem[] = defaultActivities): ActivityItem[] {
  if (!user) return [];

  // Administrator sees all activities (has wildcard permission)
  if (user.role === 'Administrator') {
    return activities;
  }

  // Filter activities based on role and permissions
  return activities.filter(activity => checkActivityPermission(user, activity));
}

/**
 * Helper function to check if user can see an activity
 *
 * Implements permission-based filtering for activity feeds:
 * - Payment activities: ONLY Administrators (requires VIEW_FINANCIAL_REPORTS)
 * - Doctors: Department-specific and assigned patient activities
 * - AuxiliaryNurses: Triage, admission, scheduling, appointments only
 */
function checkActivityPermission(user: User, activity: ActivityItem): boolean {
  // Payment activities: ONLY Administrators (financial data)
  if (activity.type === 'payment') {
    return user.role === 'Administrator';
  }

  // Doctors: See activities related to their department or themselves
  if (user.role === 'Doctor') {
    // Department-specific activities
    if (activity.department && activity.department === user.department) return true;
    // Activities where they're the assigned doctor
    if (activity.doctorId === user.id) return true;

    // Generic patient/triage/appointment activities (but NOT payment)
    // Only if related to their department or has no department (hospital-wide)
    const allowedGenericTypes = ['patient', 'triage', 'appointment', 'scheduling', 'admission'];
    if (allowedGenericTypes.includes(activity.type)) {
      // Allow if no department specified (hospital-wide) or matches their department
      return !activity.department || activity.department === user.department;
    }

    // Lab results: only if in their department
    if (activity.type === 'lab' && activity.department === user.department) {
      return true;
    }

    return false;
  }

  // AuxiliaryNurses: Only triage, admission, scheduling, and appointments
  // Explicitly EXCLUDE payment, lab, and other clinical activities
  if (user.role === 'AuxiliaryNurse') {
    const allowedTypes = ['triage', 'admission', 'scheduling', 'appointment'];
    return allowedTypes.includes(activity.type);
  }

  return false;
}

/**
 * Get available doctors
 */
export function getAvailableDoctors() {
  const today = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = daysOfWeek[today.getDay()];

  // Get doctors available today
  const availableToday = doctorAvailability.filter(doc =>
    doc.availableDays.includes(currentDay)
  );

  return availableToday.map(doc => ({
    id: doc.doctorId,
    name: doc.doctorName,
    department: doc.department,
    availableToday: true,
    timeSlots: doc.timeSlots,
  }));
}

/**
 * Get doctor availability for a specific department
 */
export function getAvailableDoctorsForDepartment(department: string) {
  const availableDoctors = getAvailableDoctors();
  return availableDoctors.filter(doc => doc.department === department);
}

/**
 * Get triage-specific statistics
 */
export function getTriageStats() {
  return {
    totalTriageToday: 24,
    pendingTriage: 7,
    completedTriage: 17,
    averageTriageTime: 15, // minutes
    acuityDistribution: {
      critical: 3,
      urgent: 8,
      routine: 13,
    },
  };
}

/**
 * Get bed utilization by department
 */
export function getBedUtilization() {
  return [
    { department: 'Cardiology', occupied: 18, total: 25, percentage: 72 },
    { department: 'General Medicine', occupied: 22, total: 30, percentage: 73 },
    { department: 'Orthopedics', occupied: 15, total: 20, percentage: 75 },
    { department: 'Pediatrics', occupied: 12, total: 20, percentage: 60 },
    { department: 'Neurology', occupied: 8, total: 15, percentage: 53 },
    { department: 'ICU', occupied: 6, total: 10, percentage: 60 },
  ];
}
