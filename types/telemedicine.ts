// Telemedicine Types
export interface TelemedicineConsultation {
  id: string;
  consultationNumber: string;
  patientId: string;
  patientName: string;
  mrn: string;
  doctorId: string;
  doctorName: string;
  department: string;
  scheduledDate: Date;
  scheduledTime: string;
  duration: number; // minutes
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  type: 'video' | 'audio' | 'chat';
  chiefComplaint: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  rating?: number; // 1-5
  patientFeedback?: string;
  joiningLink?: string;
  recordingUrl?: string;
}

export interface TelemedicineSlot {
  id: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  available: boolean;
  bookedBy?: string;
}
