export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  date: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paidAmount: number;
  balance: number;
  status: 'draft' | 'pending' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  insurance?: InsuranceInfo;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
  total: number;
  serviceDate: Date;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'insurance' | 'check';
  paymentDate: Date;
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  receivedBy: string;
  notes?: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  preAuthNumber?: string;
  claimAmount: number;
  approvedAmount?: number;
}

export interface InsuranceClaim {
  id: string;
  patientId: string;
  invoiceId: string;
  insuranceProvider: string;
  policyNumber: string;
  claimDate: Date;
  serviceDateFrom: Date;
  serviceDateTo: Date;
  totalAmount: number;
  claimedAmount: number;
  approvedAmount?: number;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'partially_approved' | 'rejected' | 'paid';
  rejectionReason?: string;
  documents: string[];
  submittedBy: string;
  reviewedBy?: string;
  reviewDate?: Date;
}

export interface BillingPreAuthorization {
  id: string;
  patientId: string;
  patientName: string;
  insuranceProvider: string;
  policyNumber: string;
  requestedDate: Date;
  requestedServices: string[];
  estimatedAmount: number;
  authorizedAmount?: number;
  status: 'pending' | 'approved' | 'partially_approved' | 'rejected';
  validFrom?: Date;
  validUntil?: Date;
  approvalNumber?: string;
  notes?: string;
}
