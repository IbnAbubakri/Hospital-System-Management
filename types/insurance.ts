// Insurance Management Types
export interface InsurancePartner {
  id: string;
  code: string;
  name: string;
  type: 'tpa' | 'insurance' | 'government';
  category: 'primary' | 'secondary';
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  taxId?: string;
  logo?: string;
  networkType: 'cashless' | 'reimbursement' | 'both';
  paymentTerms: number; // days
  status: 'active' | 'inactive' | 'suspended';
  contractStart: Date;
  contractEnd?: Date;
  panelDoctors: number;
  panelHospitals: number;
}

export interface PreAuthorization {
  id: string;
  preAuthNumber: string;
  patientId: string;
  patientName: string;
  mrn: string;
  insurancePartnerId: string;
  insurancePartnerName: string;
  policyNumber: string;
  policyHolderName: string;
  relationship: 'self' | 'spouse' | 'child' | 'parent';
  requestedDate: Date;
  requestedBy: string;
  department: string;
  doctor: string;
  diagnosis: string;
  icdCode: string;
  procedures: PreAuthProcedure[];
  estimatedAmount: number;
  approvedAmount?: number;
  status: 'pending' | 'under_review' | 'approved' | 'partially_approved' | 'rejected' | 'cancelled';
  reviewedBy?: string;
  reviewedDate?: Date;
  approvalNumber?: string;
  validFrom?: Date;
  validUntil?: Date;
  remarks?: string;
  documents: PreAuthDocument[];
}

export interface PreAuthProcedure {
  id: string;
  procedureCode: string;
  procedureName: string;
  category: 'ipd' | 'opd' | 'day_care';
  estimatedCost: number;
  approvedCost?: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface PreAuthDocument {
  id: string;
  documentName: string;
  documentType: 'prescription' | 'estimate' | 'id_proof' | 'policy_copy' | 'medical_report' | 'other';
  uploadDate: Date;
  uploadedBy: string;
  fileUrl: string;
}

export interface Claim {
  id: string;
  claimNumber: string;
  patientId: string;
  patientName: string;
  mrn: string;
  insurancePartnerId: string;
  insurancePartnerName: string;
  policyNumber: string;
  claimType: 'cashless' | 'reimbursement';
  admissionDate?: Date;
  dischargeDate?: Date;
  submittedDate: Date;
  submittedBy: string;
  preAuthId?: string;
  billNumber: string;
  billedAmount: number;
  claimedAmount: number;
  approvedAmount?: number;
  settledAmount?: number;
  deductionAmount?: number;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'partially_approved' | 'rejected' | 'settled' | 'cancelled';
  reviewedBy?: string;
  reviewedDate?: Date;
  approvedBy?: string;
  approvedDate?: Date;
  settlementDate?: Date;
  settlementReference?: string;
  deductionReason?: string;
  remarks?: string;
  documents: ClaimDocument[];
}

export interface ClaimDocument {
  id: string;
  documentName: string;
  documentType: 'bill' | 'discharge_summary' | 'lab_report' | 'prescription' | 'claim_form' | 'id_proof' | 'policy_copy' | 'other';
  uploadDate: Date;
  uploadedBy: string;
  fileUrl: string;
}

export interface ClaimSettlement {
  id: string;
  settlementNumber: string;
  claimId: string;
  claimNumber: string;
  insurancePartnerId: string;
  insurancePartnerName: string;
  settlementDate: Date;
  settledAmount: number;
  paymentMode: 'bank_transfer' | 'cheque' | 'upi';
  transactionReference?: string;
  chequeNumber?: string;
  bankName?: string;
  accountNumber?: string;
  settledBy: string;
  remarks?: string;
  status: 'processing' | 'completed' | 'failed';
}

export interface PayerTariff {
  id: string;
  insurancePartnerId: string;
  insurancePartnerName: string;
  procedureCode: string;
  procedureName: string;
  category: string;
  roomType: 'general' | 'semi_private' | 'private' | 'deluxe';
  tariffAmount: number;
  copayAmount?: number;
  copayPercentage?: number;
  effectiveDate: Date;
  endDate?: Date;
  status: 'active' | 'inactive';
}
