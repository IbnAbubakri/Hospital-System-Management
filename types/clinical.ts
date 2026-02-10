export interface EMR {
  id: string;
  patientId: string;
  visitId: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  chiefComplaint: string;
  presentIllness: string;
  pastHistory: string;
  physicalExamination: PhysicalExamination;
  vitalSigns: VitalSigns;
  diagnosis: Diagnosis[];
  treatmentPlan: string;
  prescriptions: Prescription[];
  investigations: Investigation[];
  followUpDate?: Date;
  notes: string;
}

export interface PhysicalExamination {
  general: string;
  systemic: Record<string, string>;
}

export interface VitalSigns {
  temperature: number;
  pulse: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  respiratoryRate: number;
  spo2: number;
  height?: number;
  weight?: number;
  bmi?: number;
  recordedAt: Date;
  recordedBy: string;
}

export interface Diagnosis {
  code: string; // ICD-10 code
  description: string;
  type: 'primary' | 'secondary' | 'admission';
  isConfirmed: boolean;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  route: 'oral' | 'iv' | 'im' | 'topical' | 'inhaled';
  duration: number;
  durationUnit: 'days' | 'weeks' | 'months';
  instructions: string;
  status: 'active' | 'dispensed' | 'stopped';
  prescribedDate: Date;
}

export interface Investigation {
  id: string;
  type: 'lab' | 'radiology';
  test: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  status: 'ordered' | 'pending' | 'completed';
  orderedDate: Date;
}

export interface NursingNote {
  id: string;
  patientId: string;
  date: Date;
  nurseId: string;
  nurseName: string;
  note: string;
  vitalSigns?: VitalSigns;
  interventions: string[];
  response: string;
}

export interface Inpatient {
  id: string;
  patientId: string;
  patientName: string;
  admissionDate: Date;
  admissionType: 'routine' | 'emergency' | 'transfer';
  department: string;
  ward: string;
  bed: string;
  admittingDoctor: string;
  diagnosis: string;
  status: 'admitted' | 'under_observation' | 'discharged' | 'transferred' | 'deceased';
  expectedDischargeDate?: Date;
  actualDischargeDate?: Date;
}

export interface Bed {
  id: string;
  bedNumber: string;
  ward: string;
  room: string;
  bedType: 'general' | 'semi_private' | 'private' | 'icu' | 'emergency';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  currentPatientId?: string;
  floor: number;
}
