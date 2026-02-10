// HR & Staff Management Types
export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  department: string;
  designation: string;
  employmentType: 'permanent' | 'contract' | 'probation' | 'intern';
  employmentStatus: 'active' | 'inactive' | 'resigned' | 'terminated' | 'retired';
  joinDate: Date;
  confirmDate?: Date;
  resignDate?: Date;
  qualifications: Qualification[];
  certifications: Certification[];
  experience: number; // years
  previousEmployment?: string;
  basicSalary: number;
  salaryComponent: {
    basic: number;
    hra: number;
    da: number;
    ta: number;
    other: number;
  };
  workShift: string;
  reportingManager?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'on_leave' | 'resigned' | 'terminated';
}

export interface Qualification {
  id: string;
  degree: string;
  institution: string;
  year: number;
  field: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingAuthority: string;
  issueDate: Date;
  expiryDate?: Date;
  certificateNumber: string;
}

export interface Shift {
  id: string;
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  duration: number; // hours
  breakDuration: number; // minutes
  department: string;
  status: 'active' | 'inactive';
}

export interface RosterEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: Date;
  shift: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'present' | 'absent' | 'late' | 'on_leave' | 'half_day';
  checkIn?: string;
  checkOut?: string;
  workingHours?: number;
  overtime?: number;
  approvedBy?: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: Date;
  checkIn?: string;
  checkOut?: string;
  workingHours: number;
  overtime: number;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
  lateBy?: number; // minutes
  earlyExitBy?: number; // minutes
  location?: string;
  device?: string;
  remarks?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: 'casual' | 'sick' | 'earned' | 'maternity' | 'paternity' | 'unpaid' | 'compensatory';
  fromDate: Date;
  toDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
  rejectionReason?: string;
  attachmentUrl?: string;
  balanceBefore: number;
  balanceAfter: number;
}

export interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  casualLeave: {
    total: number;
    used: number;
    balance: number;
  };
  sickLeave: {
    total: number;
    used: number;
    balance: number;
  };
  earnedLeave: {
    total: number;
    used: number;
    balance: number;
  };
  compensatoryLeave: {
    total: number;
    used: number;
    balance: number;
  };
}

export interface Payroll {
  id: string;
  payrollNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  month: number;
  year: number;
  payDate: Date;
  earnings: {
    basic: number;
    hra: number;
    da: number;
    ta: number;
    other: number;
    arrears: number;
    overtime: number;
    total: number;
  };
  deductions: {
    pf: number;
    esi: number;
    tax: number;
    professionalTax: number;
    other: number;
    total: number;
  };
  netPayable: number;
  paymentMode: 'bank_transfer' | 'cheque' | 'cash';
  status: 'draft' | 'processed' | 'paid' | 'cancelled';
  processedBy: string;
  processedDate: Date;
  remarks?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headOfDepartment?: string;
  location: string;
  floor: string;
  extension: string;
  email?: string;
  budget: number;
  spent: number;
  employees: number;
  status: 'active' | 'inactive';
  description?: string;
}
