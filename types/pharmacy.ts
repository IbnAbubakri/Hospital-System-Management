export interface PrescriptionOrder {
  id: string;
  prescriptionId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  prescribedDate: Date;
  medications: MedicationItem[];
  status: 'pending' | 'partially_dispensed' | 'dispensed' | 'cancelled';
  dispensedDate?: Date;
  dispensedBy?: string;
  notes?: string;
}

export interface MedicationItem {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: number;
  route: string;
  quantity: number;
  instructions: string;
  dispensedQuantity: number;
  status: 'pending' | 'dispensed';
}

export interface Drug {
  id: string;
  name: string;
  genericName: string;
  brandName?: string;
  category: string;
  dosageForm: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'ointment' | 'drops' | 'inhaler' | 'patch';
  strength: string;
  manufacturer: string;
  unitPrice: number;
  stock: number;
  reorderLevel: number;
  expiryDate: Date;
  batchNumber: string;
  storage: string;
  controlled: boolean;
  schedule?: string;
}

export interface InventoryItem {
  id: string;
  itemCode: string;
  name: string;
  category: 'medication' | 'consumable' | 'equipment';
  description: string;
  unit: string;
  quantity: number;
  reorderLevel: number;
  location: string;
  supplier?: string;
  expiryDate?: Date;
  batchNumber?: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'submitted' | 'approved' | 'ordered' | 'received' | 'cancelled';
  approvedBy?: string;
  approvedDate?: Date;
  receivedDate?: Date;
  receivedBy?: string;
  notes?: string;
}

export interface PurchaseOrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

export interface Vendor {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  taxId?: string;
  paymentTerms: string;
  status: 'active' | 'inactive';
}
