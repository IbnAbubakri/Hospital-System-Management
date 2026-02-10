export interface ImagingOrder {
  id: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  orderDate: Date;
  procedure: ImagingProcedure;
  priority: 'routine' | 'urgent' | 'emergency';
  status: 'scheduled' | 'in_progress' | 'completed' | 'reported' | 'cancelled';
  scheduledDate?: Date;
  scheduledTime?: string;
  performedDate?: Date;
  performedBy?: string;
  clinicalIndication: string;
  report?: ImagingReport;
}

export interface ImagingProcedure {
  code: string;
  name: string;
  modality: 'xray' | 'ct' | 'mri' | 'ultrasound' | 'mammography' | 'fluoroscopy' | 'pet';
  bodyPart: string;
  view?: string;
  contrast: boolean;
}

export interface ImagingReport {
  id: string;
  orderId: string;
  radiologistId: string;
  radiologistName: string;
  reportDate: Date;
  findings: string;
  impression: string;
  technique: string;
  comparison?: string;
  status: 'draft' | 'final' | 'amended';
  attachedImages: string[];
  recommendation?: string;
}

export interface Schedule {
  id: string;
  modality: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  available: boolean;
  technicianId?: string;
  orderId?: string;
}
