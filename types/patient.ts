export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  contactNumber: string;
  email?: string;
  address: Address;
  emergencyContact: EmergencyContact;
  insurance?: Insurance;
  allergies: string[];
  chronicConditions: string[];
  status: 'active' | 'inactive' | 'deceased' | 'transferred';
  registeredDate: Date;
  lastVisitDate?: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  contactNumber: string;
}

export interface Insurance {
  provider: string;
  policyNumber: string;
  groupId?: string;
  expiryDate: Date;
}

export interface PatientVisit {
  id: string;
  patientId: string;
  visitDate: Date;
  visitType: 'opd' | 'emergency' | 'followup';
  department: string;
  doctor: string;
  chiefComplaint: string;
  diagnosis?: string;
  treatment?: string;
  status: 'ongoing' | 'completed';
}
