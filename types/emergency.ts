// Emergency Department Types
export interface EmergencyPatient {
  id: string;
  visitNumber: string;
  patientId: string;
  patientName: string;
  mrn: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
  arrivalDate: Date;
  arrivalMode: 'walk_in' | 'ambulance' | 'wheelchair' | 'stretcher' | 'referred';
  referredBy?: string;
  triageLevel: 1 | 2 | 3 | 4 | 5;
  chiefComplaint: string;
  vitals: {
    bloodPressure?: string;
    pulse?: number;
    temperature?: number;
    spO2?: number;
    respiratoryRate?: number;
    painScore?: number;
  };
  allergies: string[];
  assignedDoctor?: string;
  assignedNurse?: string;
  bed?: string;
  status: 'waiting' | 'triaged' | 'in_examination' | 'admitted' | 'discharged' | 'transferred' | 'deceased';
  disposition?: 'discharged_home' | 'admitted' | 'transferred' | 'left_against_advice' | 'expired';
  dispositionDate?: Date;
  dispositionNotes?: string;
  notes?: string;
}

export interface EDBoard {
  id: string;
  patientId: string;
  patientName: string;
  mrn: string;
  visitNumber: string;
  triageLevel: 1 | 2 | 3 | 4 | 5;
  chiefComplaint: string;
  arrivalTime: Date;
  duration: number; // minutes since arrival
  bed?: string;
  assignedDoctor?: string;
  status: 'waiting' | 'in_progress' | 'ready_for_discharge' | 'admitted';
}

export interface EDStats {
  totalPatients: number;
  waiting: number;
  inProgress: number;
  admitted: number;
  discharged: number;
  critical: number; // triage level 1-2
  averageWaitTime: number; // minutes
  averageTreatmentTime: number; // minutes
  bedOccupancy: number;
  totalBeds: number;
}
