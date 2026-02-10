export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  phoneNumber: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  permissions: string[];
}

export interface Staff extends User {
  employeeId: string;
  dateOfJoining: Date;
  employmentType: 'full_time' | 'part_time' | 'contract' | 'consultant';
  specialization?: string;
  qualification?: string;
  licenseNumber?: string;
  licenseExpiry?: Date;
}

export interface UserDepartment {
  id: string;
  name: string;
  code: string;
  description: string;
  headId?: string;
  floor?: number;
  status: 'active' | 'inactive';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystemRole: boolean;
}
