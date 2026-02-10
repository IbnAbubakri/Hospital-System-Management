/**
 * Data Filtering Utilities
 *
 * Functions to filter mockData based on logged-in user's role and department
 */

import { mockPatients } from './mockData';
import { patientDoctorAssignments, getDepartmentForPatient, getDepartmentsForPatient } from './patientAssignments';
import { emrDoctorAssignments, getDepartmentForEMR } from './emrAssignments';

// User type
interface User {
  id: string;
  role: string;
  department?: string;
  firstName: string;
  lastName: string;
}

/**
 * Filter patients based on logged-in user
 * - Admin: sees all patients
 * - AuxiliaryNurse: sees all patients (for triage)
 * - Doctor: sees only their assigned patients
 */
export function filterPatientsByUser(user: User | null, patients: unknown[] = mockPatients): unknown[] {
  if (!user) return [];

  // Admin sees all patients
  if (user.role === 'Administrator') {
    return patients;
  }

  // Auxiliary Nurses see all patients for triage purposes
  if (user.role === 'AuxiliaryNurse') {
    return patients;
  }

  // Doctors see only their assigned patients
  if (user.role === 'Doctor') {
    return patients.filter(patient => {
      const assignedDoctor = patientDoctorAssignments[patient.id];
      return assignedDoctor === user.id;
    });
  }

  return [];
}

/**
 * Filter patients by department
 */
export function filterPatientsByDepartment(department: string, patients: unknown[] = mockPatients): unknown[] {
  return patients.filter(patient => {
    const departments = getDepartmentsForPatient(patient.id);
    return departments.includes(department);
  });
}

/**
 * Filter patients by specific doctor
 */
export function filterPatientsByDoctor(doctorId: string, patients: unknown[] = mockPatients): unknown[] {
  return patients.filter(patient => {
    const assignedDoctor = patientDoctorAssignments[patient.id];
    return assignedDoctor === doctorId;
  });
}

/**
 * Get patient count for user
 */
export function getPatientCountForUser(user: User | null): number {
  return filterPatientsByUser(user).length;
}

/**
 * Get patient statistics for user's department
 */
export function getPatientStatsForUser(user: User | null): {
  total: number;
  active: number;
  newThisMonth: number;
  withAllergies: number;
} {
  const filteredPatients = filterPatientsByUser(user);

  const now = new Date();
  const active = filteredPatients.filter((p) => p.status === 'active').length;
  const newThisMonth = filteredPatients.filter((p) => {
    const registeredDate = new Date(p.registrationDate);
    return (
      registeredDate.getMonth() === now.getMonth() &&
      registeredDate.getFullYear() === now.getFullYear()
    );
  }).length;
  const withAllergies = filteredPatients.filter((p) => p.allergies.length > 0).length;

  return {
    total: filteredPatients.length,
    active,
    newThisMonth,
    withAllergies,
  };
}

/**
 * Filter EMR records based on logged-in user
 * - Admin: sees all EMRs
 * - Doctor: sees only EMRs they created
 */
export function filterEMRsByUser(user: User | null, emrs: unknown[]): unknown[] {
  if (!user) return [];

  // Admin sees all EMRs
  if (user.role === 'Administrator') {
    return emrs;
  }

  // Doctors see only EMRs they created
  if (user.role === 'Doctor') {
    return emrs.filter(emr => {
      const createdBy = emrDoctorAssignments[emr.id];
      return createdBy === user.id;
    });
  }

  return [];
}

/**
 * Filter EMRs by department
 */
export function filterEMRsByDepartment(department: string, emrs: unknown[]): unknown[] {
  return emrs.filter(emr => {
    const emrDepartment = getDepartmentForEMR(emr.id);
    return emrDepartment === department;
  });
}

/**
 * Filter EMRs by specific doctor
 */
export function filterEMRsByDoctor(doctorId: string, emrs: unknown[]): unknown[] {
  return emrs.filter(emr => {
    const createdBy = emrDoctorAssignments[emr.id];
    return createdBy === doctorId;
  });
}

/**
 * Filter appointments based on logged-in user
 */
export function filterAppointmentsByUser(user: User | null, appointments: unknown[]): unknown[] {
  if (!user) return [];

  // Admin sees all appointments
  if (user.role === 'Administrator') {
    return appointments;
  }

  // Doctors see only their appointments
  if (user.role === 'Doctor') {
    return appointments.filter(apt => apt.doctorId === user.id);
  }

  return [];
}

/**
 * Filter lab orders based on logged-in user
 */
export function filterLabOrdersByUser(user: User | null, labOrders: unknown[]): unknown[] {
  if (!user) return [];

  // Admin sees all lab orders
  if (user.role === 'Administrator') {
    return labOrders;
  }

  // Doctors see only lab orders they created
  if (user.role === 'Doctor') {
    return labOrders.filter(order => order.doctorId === user.id);
  }

  return [];
}

/**
 * Filter inpatients based on logged-in user
 */
export function filterInpatientsByUser(user: User | null, inpatients: unknown[]): unknown[] {
  if (!user) return [];

  // Admin sees all inpatients
  if (user.role === 'Administrator') {
    return inpatients;
  }

  // Doctors see only inpatients in their department
  if (user.role === 'Doctor') {
    return inpatients.filter(patient => patient.department === user.department);
  }

  return [];
}

/**
 * Check if user can view a specific patient
 */
export function canUserViewPatient(user: User | null, patientId: string): boolean {
  if (!user) return false;
  if (user.role === 'Administrator') return true;

  const assignedDoctor = patientDoctorAssignments[patientId];
  return assignedDoctor === user.id;
}

/**
 * Check if user can view a specific EMR
 */
export function canUserViewEMR(user: User | null, emrId: string): boolean {
  if (!user) return false;
  if (user.role === 'Administrator') return true;

  const createdBy = emrDoctorAssignments[emrId];
  return createdBy === user.id;
}

/**
 * Get user's full name with title
 */
export function getUserFullName(user: User | null): string {
  if (!user) return 'Guest';

  if (user.role === 'Doctor') {
    return `Dr. ${user.firstName} ${user.lastName}`;
  }

  return `${user.firstName} ${user.lastName}`;
}

/**
 * Get user's display title
 */
export function getUserTitle(user: User | null): string {
  if (!user) return 'Guest';

  if (user.role === 'Administrator') {
    return 'Administrator';
  }

  if (user.role === 'Doctor') {
    return `Dr. ${user.lastName}`;
  }

  return user.role;
}

/**
 * Filter clinical consultations by user
 */
export function filterConsultationsByUser(user: User | null, consultations: unknown[]): unknown[] {
  if (!user) return [];
  if (user.role === 'Administrator') return consultations;
  if (user.role === 'AuxiliaryNurse') return []; // Nurses don't access consultations
  if (user.role === 'Doctor') {
    return consultations.filter(cons => cons.doctorId === user.id);
  }
  return [];
}

/**
 * Filter lab results by user
 */
export function filterLabResultsByUser(user: User | null, results: unknown[]): unknown[] {
  if (!user) return [];
  if (user.role === 'Administrator') return results;
  if (user.role === 'AuxiliaryNurse') return []; // Nurses don't access lab results
  if (user.role === 'Doctor') {
    // Show results for doctor's assigned patients
    const myPatients = filterPatientsByUser(user);
    const myPatientIds = myPatients.map(p => p.id);
    return results.filter(result => myPatientIds.includes(result.patientId));
  }
  return [];
}

/**
 * Filter radiology reports by user
 */
export function filterRadiologyByUser(user: User | null, reports: unknown[]): unknown[] {
  if (!user) return [];
  if (user.role === 'Administrator') return reports;
  if (user.role === 'AuxiliaryNurse') return []; // Nurses don't access radiology
  if (user.role === 'Doctor') {
    const myPatients = filterPatientsByUser(user);
    const myPatientIds = myPatients.map(p => p.id);
    return reports.filter(report => myPatientIds.includes(report.patientId));
  }
  return [];
}

/**
 * Filter billing data by user
 */
export function filterBillingByUser(user: User | null, bills: unknown[]): unknown[] {
  if (!user) return [];
  if (user.role === 'Administrator') return bills;
  if (user.role === 'AuxiliaryNurse') return []; // No billing access for nurses
  if (user.role === 'Doctor') {
    // Doctors don't typically access billing
    return [];
  }
  return [];
}

/**
 * Filter emergency patients by user
 */
export function filterEmergencyByUser(user: User | null, emergencyPatients: unknown[]): unknown[] {
  if (!user) return [];
  if (user.role === 'Administrator') return emergencyPatients;
  if (user.role === 'AuxiliaryNurse') return emergencyPatients; // All for triage
  if (user.role === 'Doctor') {
    // Filter by doctor's department
    return emergencyPatients.filter(patient => patient.department === user.department);
  }
  return [];
}
