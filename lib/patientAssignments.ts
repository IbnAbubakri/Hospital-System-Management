/**
 * Patient-to-Doctor Assignment Configuration
 *
 * This file defines which patients are assigned to which doctors
 * based on medical conditions, specialties, and departments.
 */

// Doctor IDs from mockData
export const DOCTOR_IDS = {
  ADELEKE: 'd1',      // Dr. Ngozi Adeleke - Cardiology
  OKORO: 'd2',        // Dr. Emeka Okoro - General Medicine
  BAKARE: 'd3',       // Dr. Tunde Bakare - Orthopedics
  YUSUF: 'd4',        // Dr. Aisha Yusuf - Pediatrics
  NWOSU: 'd5',        // Dr. Chinedu Nwosu - Neurology
};

// Patient to Primary Doctor Assignment
// Based on the patient's medical condition and doctor's specialty
export const patientDoctorAssignments: Record<string, string> = {
  // Cardiology Patients - Dr. Ngozi Adeleke
  '1': DOCTOR_IDS.ADELEKE,  // Chukwuemeka Okonkwo - Hypertension, Diabetes
  '3': DOCTOR_IDS.ADELEKE,  // Olufemi Adebayo - Coronary Artery Disease (also sees Orthopedics)

  // General Medicine Patients - Dr. Emeka Okoro
  '2': DOCTOR_IDS.OKORO,    // Adanna Okafor - Viral infection, Asthma
  '5': DOCTOR_IDS.OKORO,    // Ibrahim Musah - Gastritis, Malaria

  // Orthopedics Patients - Dr. Tunde Bakare
  // No patients assigned to Orthopedics only

  // Neurology Patients - Dr. Chinedu Nwosu
  // No patients assigned to Neurology only

  // Pediatrics Patients - Dr. Aisha Yusuf
  '6': DOCTOR_IDS.YUSUF,    // Bimpe Alake - URTI (young adult, assigned to peds for demo)
  '7': DOCTOR_IDS.YUSUF,    // Tobi Okafor - 5yo, Asthma
  '8': DOCTOR_IDS.YUSUF,    // Chisom Eze - 11yo, General checkup
  '9': DOCTOR_IDS.YUSUF,    // Obiora Nwosu - 7yo, Allergies
  '10': DOCTOR_IDS.YUSUF,   // Amina Okonkwo - 3yo, Wellness check
  '11': DOCTOR_IDS.YUSUF,   // Emeka Adebayo - 9yo, Penicillin allergy
  '12': DOCTOR_IDS.YUSUF,   // Zainab Musah - 4yo, General checkup
};

// Patient to Department Assignment
export const patientDepartmentAssignments: Record<string, string> = {
  '1': 'Cardiology',           // Chukwuemeka Okonkwo
  '2': 'General Medicine',     // Adanna Okafor
  '3': 'Cardiology',           // Olufemi Adebayo (primary: Cardiology)
  '3b': 'Orthopedics',         // Olufemi Adebayo (secondary: Orthopedics)
  '4': 'Neurology',            // Chioma Eze (primary)
  '4b': 'General Medicine',    // Chioma Eze (secondary)
  '5': 'General Medicine',     // Ibrahim Musah
  '6': 'Pediatrics',           // Bimpe Alake
  '7': 'Pediatrics',           // Tobi Okafor (5yo)
  '8': 'Pediatrics',           // Chisom Eze (11yo)
  '9': 'Pediatrics',           // Obiora Nwosu (7yo)
  '10': 'Pediatrics',          // Amina Okonkwo (3yo)
  '11': 'Pediatrics',          // Emeka Adebayo (9yo)
  '12': 'Pediatrics',          // Zainab Musah (4yo)
};

// Multi-department patients (patients who see multiple specialists)
export const multiDepartmentPatients: Record<string, string[]> = {
  '3': ['Cardiology', 'Orthopedics'],  // Olufemi Adebayo - Heart + Joint issues
  '4': ['Neurology', 'General Medicine'], // Chioma Eze - Migraine + General care
};

// Get doctor for a patient
export function getDoctorForPatient(patientId: string): string | undefined {
  return patientDoctorAssignments[patientId];
}

// Get department for a patient
export function getDepartmentForPatient(patientId: string): string {
  return patientDepartmentAssignments[patientId] || 'General Medicine';
}

// Get all departments for a patient (if they see multiple specialists)
export function getDepartmentsForPatient(patientId: string): string[] {
  return multiDepartmentPatients[patientId] || [getDepartmentForPatient(patientId)];
}

// Check if patient is assigned to a specific doctor
export function isPatientAssignedToDoctor(patientId: string, doctorId: string): boolean {
  const assignedDoctor = getDoctorForPatient(patientId);
  return assignedDoctor === doctorId;
}

// Check if patient is in a specific department
export function isPatientInDepartment(patientId: string, department: string): boolean {
  const departments = getDepartmentsForPatient(patientId);
  return departments.includes(department);
}

// Get all patients for a specific doctor
export function getPatientsForDoctor(doctorId: string, allPatientIds: string[]): string[] {
  return allPatientIds.filter(patientId =>
    isPatientAssignedToDoctor(patientId, doctorId)
  );
}

// Get all patients for a specific department
export function getPatientsForDepartment(department: string, allPatientIds: string[]): string[] {
  return allPatientIds.filter(patientId =>
    isPatientInDepartment(patientId, department)
  );
}
