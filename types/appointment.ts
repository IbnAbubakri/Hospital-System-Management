export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  type: 'new' | 'followup' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  reason: string;
  createdDate: Date;
}

export interface AppointmentSlot {
  date: Date;
  startTime: string;
  endTime: string;
  available: boolean;
  doctorId: string;
}
