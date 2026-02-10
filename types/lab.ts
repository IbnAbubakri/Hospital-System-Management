export interface LabOrder {
  id: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  orderDate: Date;
  tests: LabTest[];
  priority: 'routine' | 'urgent' | 'emergency';
  status: 'pending' | 'sample_collected' | 'in_progress' | 'completed' | 'approved' | 'cancelled';
  sampleCollectionDate?: Date;
  sampleCollectedBy?: string;
  resultsDate?: Date;
  approvedBy?: string;
  approvedDate?: Date;
  clinicalNotes?: string;
}

export interface LabTest {
  id: string;
  testCode: string;
  testName: string;
  category: string;
  status: 'ordered' | 'in_progress' | 'completed';
  results?: LabResult[];
}

export interface LabResult {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag?: 'normal' | 'high' | 'low' | 'critical';
  comments?: string;
}

export interface LabReport {
  id: string;
  orderId: string;
  patientId: string;
  testDate: Date;
  tests: LabTest[];
  performedBy: string;
  verifiedBy?: string;
  notes?: string;
}
