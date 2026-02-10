/**
 * EMR-to-Doctor Assignment Configuration
 *
 * This file defines which EMR records belong to which doctors
 * based on who created the consultation/medical record.
 */

import { DOCTOR_IDS } from './patientAssignments';

// EMR ID to Creating Doctor Assignment
export const emrDoctorAssignments: Record<string, string> = {
  // Cardiology EMRs by Dr. Ngozi Adeleke
  '1': DOCTOR_IDS.ADELEKE,  // Chukwuemeka Okonkwo - Hypertension consultation
  '5': DOCTOR_IDS.ADELEKE,  // Ibrahim Musah - Gastritis (referred to cardiology)

  // General Medicine EMRs by Dr. Emeka Okoro
  '2': DOCTOR_IDS.OKORO,    // Adanna Okafor - Viral infection

  // Orthopedics EMRs by Dr. Tunde Bakare
  '3': DOCTOR_IDS.BAKARE,   // Olufemi Adebayo - Osteoarthritis

  // Neurology EMRs by Dr. Chinedu Nwosu
  '4': DOCTOR_IDS.NWOSU,    // Chioma Eze - Migraine

  // Pediatrics EMRs by Dr. Aisha Yusuf
  '6': DOCTOR_IDS.YUSUF,    // Bimpe Alake - URTI
  '7': DOCTOR_IDS.YUSUF,    // Tobi Okafor - Asthma exacerbation (5yo)
  '8': DOCTOR_IDS.YUSUF,    // Chisom Eze - Well child visit (11yo)
  '9': DOCTOR_IDS.YUSUF,    // Obiora Nwosu - Allergic rhinitis (7yo)
};

// EMR ID to Department Assignment
export const emrDepartmentAssignments: Record<string, string> = {
  '1': 'Cardiology',
  '2': 'General Medicine',
  '3': 'Orthopedics',
  '4': 'Neurology',
  '5': 'Cardiology',
  '6': 'Pediatrics',
  '7': 'Pediatrics',
  '8': 'Pediatrics',
  '9': 'Pediatrics',
};

// Get doctor who created an EMR
export function getDoctorForEMR(emrId: string): string | undefined {
  return emrDoctorAssignments[emrId];
}

// Get department for an EMR
export function getDepartmentForEMR(emrId: string): string {
  return emrDepartmentAssignments[emrId] || 'General Medicine';
}

// Check if EMR was created by a specific doctor
export function isEMRCreatedByDoctor(emrId: string, doctorId: string): boolean {
  const createdBy = getDoctorForEMR(emrId);
  return createdBy === doctorId;
}

// Check if EMR belongs to a specific department
export function isEMRInDepartment(emrId: string, department: string): boolean {
  const emrDepartment = getDepartmentForEMR(emrId);
  return emrDepartment === department;
}

// Get all EMRs for a specific doctor
export function getEMRsForDoctor(doctorId: string, allEMRIds: string[]): string[] {
  return allEMRIds.filter(emrId =>
    isEMRCreatedByDoctor(emrId, doctorId)
  );
}

// Get all EMRs for a specific department
export function getEMRsForDepartment(department: string, allEMRIds: string[]): string[] {
  return allEMRIds.filter(emrId =>
    isEMRInDepartment(emrId, department)
  );
}
