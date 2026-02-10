import { Patient, Appointment, EMR, Inpatient, LabOrder, ImagingOrder, User } from '@/types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    mrn: 'MRN-2024-0001',
    firstName: 'Chukwuemeka',
    lastName: 'Okonkwo',
    dateOfBirth: new Date('1980-05-15'),
    gender: 'male',
    bloodGroup: 'A+',
    contactNumber: '+234 803 456 7890',
    email: 'chukwuemeka.okonkwo@email.com',
    address: {
      street: '15 Adeniran Ogunsanya Street',
      city: 'Surulere',
      state: 'Lagos',
      zipCode: '101241',
      country: 'Nigeria',
    },
    emergencyContact: {
      name: 'Ngozi Okonkwo',
      relationship: 'Spouse',
      contactNumber: '+234 802 345 6789',
    },
    allergies: ['Penicillin', 'Groundnuts'],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
    status: 'active',
    registeredDate: new Date('2024-01-10'),
    lastVisitDate: new Date('2024-01-25'),
  },
  {
    id: '2',
    mrn: 'MRN-2024-0002',
    firstName: 'Adanna',
    lastName: 'Okafor',
    dateOfBirth: new Date('1992-08-22'),
    gender: 'female',
    bloodGroup: 'O+',
    contactNumber: '+234 810 123 4567',
    email: 'adanna.okafor@email.com',
    address: {
      street: '42 Awolowo Road',
      city: 'Ikeja',
      state: 'Lagos',
      zipCode: '100271',
      country: 'Nigeria',
    },
    emergencyContact: {
      name: 'Chinedu Okafor',
      relationship: 'Brother',
      contactNumber: '+234 905 234 5678',
    },
    allergies: [],
    chronicConditions: ['Asthma'],
    status: 'active',
    registeredDate: new Date('2024-01-12'),
    lastVisitDate: new Date('2024-01-28'),
  },
  {
    id: '3',
    mrn: 'MRN-2024-0003',
    firstName: 'Olufemi',
    lastName: 'Adebayo',
    dateOfBirth: new Date('1965-11-03'),
    gender: 'male',
    bloodGroup: 'B+',
    contactNumber: '+234 806 789 0123',
    email: 'olufemi.adebayo@email.com',
    address: {
      street: '8 Herbert Macaulay Way',
      city: 'Yaba',
      state: 'Lagos',
      zipCode: '101212',
      country: 'Nigeria',
    },
    emergencyContact: {
      name: 'Grace Adebayo',
      relationship: 'Spouse',
      contactNumber: '+234 803 567 8901',
    },
    allergies: ['Aspirin'],
    chronicConditions: ['Coronary Artery Disease', 'Arthritis'],
    status: 'active',
    registeredDate: new Date('2024-01-15'),
    lastVisitDate: new Date('2024-01-30'),
  },
  {
    id: '4',
    mrn: 'MRN-2024-0004',
    firstName: 'Chioma',
    lastName: 'Eze',
    dateOfBirth: new Date('1988-03-12'),
    gender: 'female',
    bloodGroup: 'AB+',
    contactNumber: '+234 912 345 6789',
    email: 'chioma.eze@email.com',
    address: {
      street: '23 Airport Road',
      city: 'Ikeja',
      state: 'Lagos',
      zipCode: '100282',
      country: 'Nigeria',
    },
    emergencyContact: {
      name: 'Obiora Eze',
      relationship: 'Husband',
      contactNumber: '+234 808 765 4321',
    },
    allergies: [],
    chronicConditions: [],
    status: 'active',
    registeredDate: new Date('2024-01-08'),
    lastVisitDate: new Date('2024-01-29'),
  },
  {
    id: '5',
    mrn: 'MRN-2024-0005',
    firstName: 'Ibrahim',
    lastName: 'Musah',
    dateOfBirth: new Date('1975-07-20'),
    gender: 'male',
    bloodGroup: 'O+',
    contactNumber: '+234 804 567 8901',
    email: 'ibrahim.musah@email.com',
    address: {
      street: '7 Ahmadu Bello Way',
      city: 'Kaduna',
      state: 'Kaduna',
      zipCode: '800212',
      country: 'Nigeria',
    },
    emergencyContact: {
      name: 'Aisha Musah',
      relationship: 'Sister',
      contactNumber: '+234 813 456 7890',
    },
    allergies: ['Dust'],
    chronicConditions: ['Malaria'],
    status: 'active',
    registeredDate: new Date('2024-01-05'),
    lastVisitDate: new Date('2024-01-24'),
  },
  {
    id: '6',
    mrn: 'MRN-2024-0006',
    firstName: 'Bimpe',
    lastName: 'Alake',
    dateOfBirth: new Date('1995-12-05'),
    gender: 'female',
    bloodGroup: 'A-',
    contactNumber: '+234 908 234 5678',
    email: 'bimpe.alake@email.com',
    address: {
      street: '19 Bishop Oluwole Street',
      city: 'Ikeja',
      state: 'Lagos',
      zipCode: '100275',
      country: 'Nigeria',
    },
    emergencyContact: {
      name: 'Rotimi Alake',
      relationship: 'Father',
      contactNumber: '+234 802 345 6789',
    },
    allergies: [],
    chronicConditions: [],
    status: 'inactive',
    registeredDate: new Date('2023-11-20'),
    lastVisitDate: new Date('2024-01-15'),
  },
  // Pediatric Patients (under 18) for Dr. Aisha Yusuf
  {
    id: '7',
    mrn: 'MRN-2024-0007',
    firstName: 'Tobi',
    lastName: 'Okafor',
    dateOfBirth: new Date('2018-03-10'), // 5 years old
    gender: 'male',
    bloodGroup: 'O+',
    contactNumber: '+234 802 123 4567',
    email: 'parent.okafor@email.com',
    address: {
      street: '12 Adeola Odeku Street',
      city: 'Victoria Island',
      state: 'Lagos',
      zipCode: '101241',
      country: 'Nigeria',
    },
    emergencyContact: {
      name: 'Chioma Okafor',
      relationship: 'Mother',
      contactNumber: '+234 802 123 4567',
    },
    allergies: ['Peanuts'],
    chronicConditions: ['Asthma'],
    status: 'active',
    registeredDate: new Date('2024-01-20'),
    lastVisitDate: new Date('2024-02-01'),
  },
  {
    id: '8',
    mrn: 'MRN-2024-0008',
    firstName: 'Chisom',
    lastName: 'Eze',
    dateOfBirth: new Date('2012-07-22'), // 11 years old
    gender: 'female',
    bloodGroup: 'B+',
    contactNumber: '+234 808 765 4322',
    email: 'parent.eze@email.com',
    address: {
      street: '45 Isaac John Street',
      city: 'Ikeja GRA',
      state: 'Lagos',
      zipCode: '101271',
      country: 'Nigeria',
    },
    emergencyContact: {
      name: 'Obiora Eze',
      relationship: 'Father',
      contactNumber: '+234 808 765 4322',
    },
    allergies: [],
    chronicConditions: [],
    status: 'active',
    registeredDate: new Date('2024-01-18'),
    lastVisitDate: new Date('2024-01-30'),
  },
  {
    id: '9',
    mrn: 'MRN-2024-0009',
    firstName: 'Obiora',
    lastName: 'Nwosu',
    dateOfBirth: new Date('2016-11-05'), // 7 years old
    gender: 'male',
    bloodGroup: 'A+',
    contactNumber: '+234 809 876 5432',
    email: 'parent.nwosu@email.com',
    address: {
      street: '8 Mobolaji Bank-Anthony Way',
      city: 'Ikeja',
      state: 'Lagos',
      zipCode: '100272',
      country: 'Nigeria',
    },
    emergencyContact: {
      name: 'Ngozi Nwosu',
      relationship: 'Mother',
      contactNumber: '+234 809 876 5432',
    },
    allergies: ['Dust mites', 'Pollen'],
    chronicConditions: [],
    status: 'active',
    registeredDate: new Date('2024-01-22'),
    lastVisitDate: new Date('2024-02-02'),
  },
  {
    id: '10',
    mrn: 'MRN-2024-0010',
    firstName: 'Amina',
    lastName: 'Okonkwo',
    dateOfBirth: new Date('2020-06-18'), // 3 years old
    gender: 'female',
    bloodGroup: 'AB+',
    contactNumber: '+234 804 567 8902',
    email: 'parent.okonkwo@email.com',
    address: {
      street: '3 Awolowo Road',
      city: 'Ikeja',
      state: 'Lagos',
      zipCode: '100273',
      country: 'Nigeria',
    },
    emergencyContact: {
      name: 'Fatima Okonkwo',
      relationship: 'Mother',
      contactNumber: '+234 804 567 8902',
    },
    allergies: [],
    chronicConditions: [],
    status: 'active',
    registeredDate: new Date('2024-01-25'),
    lastVisitDate: new Date('2024-02-03'),
  },
  {
    id: '11',
    mrn: 'MRN-2024-0011',
    firstName: 'Emeka',
    lastName: 'Adebayo',
    dateOfBirth: new Date('2014-02-14'), // 9 years old
    gender: 'male',
    bloodGroup: 'O+',
    contactNumber: '+234 806 789 0124',
    email: 'parent.adebayo@email.com',
    address: {
      street: '22 Herbert Macaulay Way',
      city: 'Yaba',
      state: 'Lagos',
      zipCode: '101213',
      country: 'Nigeria',
    },
    emergencyContact: {
      name: 'Grace Adebayo',
      relationship: 'Mother',
      contactNumber: '+234 806 789 0124',
    },
    allergies: ['Penicillin'],
    chronicConditions: [],
    status: 'active',
    registeredDate: new Date('2024-01-28'),
    lastVisitDate: new Date('2024-02-04'),
  },
  {
    id: '12',
    mrn: 'MRN-2024-0012',
    firstName: 'Zainab',
    lastName: 'Musah',
    dateOfBirth: new Date('2019-09-08'), // 4 years old
    gender: 'female',
    bloodGroup: 'B-',
    contactNumber: '+234 804 567 8903',
    email: 'parent.musah@email.com',
    address: {
      street: '15 Ahmadu Bello Way',
      city: 'Kaduna',
      state: 'Kaduna',
      zipCode: '800213',
      country: 'Nigeria',
    },
    emergencyContact: {
      name: 'Aisha Musah',
      relationship: 'Mother',
      contactNumber: '+234 804 567 8903',
    },
    allergies: [],
    chronicConditions: [],
    status: 'active',
    registeredDate: new Date('2024-01-30'),
    lastVisitDate: new Date('2024-02-03'),
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Chukwuemeka Okonkwo',
    doctorId: 'd1',
    doctorName: 'Dr. Ngozi Adeleke',
    department: 'Cardiology',
    date: new Date('2024-02-05'),
    startTime: '09:00',
    endTime: '09:30',
    duration: 30,
    type: 'followup',
    status: 'scheduled',
    notes: 'Regular checkup',
    reason: 'Follow-up consultation',
    createdDate: new Date('2024-01-25'),
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Adanna Okafor',
    doctorId: 'd2',
    doctorName: 'Dr. Emeka Okoro',
    department: 'General Medicine',
    date: new Date('2024-02-05'),
    startTime: '10:00',
    endTime: '10:20',
    duration: 20,
    type: 'new',
    status: 'confirmed',
    notes: 'New patient',
    reason: 'Fever and cough',
    createdDate: new Date('2024-01-26'),
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Olufemi Adebayo',
    doctorId: 'd1',
    doctorName: 'Dr. Ngozi Adeleke',
    department: 'Cardiology',
    date: new Date('2024-02-05'),
    startTime: '11:00',
    endTime: '11:45',
    duration: 45,
    type: 'followup',
    status: 'scheduled',
    notes: 'Post-surgery follow-up',
    reason: 'Cardiac evaluation',
    createdDate: new Date('2024-01-20'),
  },
  {
    id: '4',
    patientId: '4',
    patientName: 'Chioma Eze',
    doctorId: 'd3',
    doctorName: 'Dr. Tunde Bakare',
    department: 'Orthopedics',
    date: new Date('2024-02-05'),
    startTime: '14:00',
    endTime: '14:30',
    duration: 30,
    type: 'followup',
    status: 'confirmed',
    notes: 'Knee pain',
    reason: 'Joint pain consultation',
    createdDate: new Date('2024-01-27'),
  },
];

export const mockInpatients: Inpatient[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Chukwuemeka Okonkwo',
    admissionDate: new Date('2024-01-28'),
    admissionType: 'emergency',
    department: 'Cardiology',
    ward: 'Male Ward A',
    bed: 'A-101',
    admittingDoctor: 'Dr. Ngozi Adeleke',
    diagnosis: 'Acute Myocardial Infarction',
    status: 'admitted',
    expectedDischargeDate: new Date('2024-02-05'),
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Adanna Okafor',
    admissionDate: new Date('2024-01-30'),
    admissionType: 'routine',
    department: 'General Medicine',
    ward: 'Female Ward B',
    bed: 'B-205',
    admittingDoctor: 'Dr. Emeka Okoro',
    diagnosis: 'Pneumonia',
    status: 'admitted',
    expectedDischargeDate: new Date('2024-02-03'),
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Olufemi Adebayo',
    admissionDate: new Date('2024-01-25'),
    admissionType: 'emergency',
    department: 'ICU',
    ward: 'Intensive Care Unit',
    bed: 'ICU-01',
    admittingDoctor: 'Dr. Ngozi Adeleke',
    diagnosis: 'Unstable Angina',
    status: 'under_observation',
    expectedDischargeDate: new Date('2024-02-02'),
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-0001',
    patientId: '1',
    patientName: 'Chukwuemeka Okonkwo',
    date: new Date('2024-01-28'),
    dueDate: new Date('2024-02-11'),
    items: [
      {
        id: '1',
        description: 'Emergency Room Visit',
        quantity: 1,
        unitPrice: 50000,
        tax: 0,
        discount: 0,
        total: 50000,
        serviceDate: new Date('2024-01-28'),
      },
      {
        id: '2',
        description: 'ECG',
        quantity: 1,
        unitPrice: 15000,
        tax: 0,
        discount: 0,
        total: 15000,
        serviceDate: new Date('2024-01-28'),
      },
    ],
    subtotal: 65000,
    tax: 0,
    discount: 0,
    total: 65000,
    paidAmount: 0,
    balance: 65000,
    status: 'pending',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-0002',
    patientId: '2',
    patientName: 'Adanna Okafor',
    date: new Date('2024-01-25'),
    dueDate: new Date('2024-02-08'),
    items: [
      {
        id: '1',
        description: 'Consultation - General Medicine',
        quantity: 1,
        unitPrice: 25000,
        tax: 0,
        discount: 0,
        total: 25000,
        serviceDate: new Date('2024-01-25'),
      },
    ],
    subtotal: 25000,
    tax: 0,
    discount: 0,
    total: 25000,
    paidAmount: 25000,
    balance: 0,
    status: 'paid',
    paymentMethod: 'cash',
  },
];

export const mockLabOrders: LabOrder[] = [
  {
    id: '1',
    orderNumber: 'LAB-2024-0001',
    patientId: '1',
    patientName: 'Chukwuemeka Okonkwo',
    doctorId: 'd1',
    doctorName: 'Dr. Ngozi Adeleke',
    orderDate: new Date('2024-01-29'),
    tests: [
      {
        id: 't1',
        testCode: 'CBC',
        testName: 'Complete Blood Count',
        category: 'Hematology',
        status: 'completed',
      },
      {
        id: 't2',
        testCode: 'BMP',
        testName: 'Basic Metabolic Panel',
        category: 'Biochemistry',
        status: 'in_progress',
      },
    ],
    priority: 'urgent',
    status: 'in_progress',
    sampleCollectionDate: new Date('2024-01-29'),
    sampleCollectedBy: 'Lab Technologist 1',
  },
];

export const mockImagingOrders: ImagingOrder[] = [
  {
    id: '1',
    orderNumber: 'RAD-2024-0001',
    patientId: '1',
    patientName: 'Chukwuemeka Okonkwo',
    doctorId: 'd1',
    doctorName: 'Dr. Ngozi Adeleke',
    orderDate: new Date('2024-01-29'),
    procedure: {
      code: 'CXR',
      name: 'Chest X-Ray',
      modality: 'xray',
      bodyPart: 'Chest',
      view: 'PA and Lateral',
      contrast: false,
    },
    priority: 'urgent',
    status: 'scheduled',
    scheduledDate: new Date('2024-01-30'),
    scheduledTime: '14:00',
    clinicalIndication: 'Rule out pneumonia',
  },
];

export const mockDoctors: User[] = [
  {
    id: 'd1',
    username: 'nadeleke',
    email: 'n.adeleke@lagosmedical.com',
    firstName: 'Ngozi',
    lastName: 'Adeleke',
    role: 'Doctor',
    department: 'Cardiology',
    phoneNumber: '+234 802 345 6789',
    status: 'active',
    permissions: [],
  },
  {
    id: 'd2',
    username: 'eokoro',
    email: 'e.okoro@lagosmedical.com',
    firstName: 'Emeka',
    lastName: 'Okoro',
    role: 'Doctor',
    department: 'General Medicine',
    phoneNumber: '+234 803 456 7890',
    status: 'active',
    permissions: [],
  },
  {
    id: 'd3',
    username: 'tbakare',
    email: 't.bakare@lagosmedical.com',
    firstName: 'Tunde',
    lastName: 'Bakare',
    role: 'Doctor',
    department: 'Orthopedics',
    phoneNumber: '+234 804 567 8901',
    status: 'active',
    permissions: [],
  },
  {
    id: 'd4',
    username: 'yusuf',
    email: 'a.yusuf@lagosmedical.com',
    firstName: 'Aisha',
    lastName: 'Yusuf',
    role: 'Doctor',
    department: 'Pediatrics',
    phoneNumber: '+234 806 789 0123',
    status: 'active',
    permissions: [],
  },
  {
    id: 'd5',
    username: 'nwosu',
    email: 'c.nwosu@lagosmedical.com',
    firstName: 'Chinedu',
    lastName: 'Nwosu',
    role: 'Doctor',
    department: 'Neurology',
    phoneNumber: '+234 808 901 2345',
    status: 'active',
    permissions: [],
  },
];

export const mockStats = {
  totalPatients: 1250,
  todayAppointments: 45,
  admittedPatients: 68,
  todaySurgeries: 8,
  pendingLabResults: 23,
  pendingRadiologyReports: 15,
  pendingInvoices: 34,
  totalRevenue: 85000000, // in Naira
  occupancyRate: 78,
  patientSatisfaction: 92,
};

// Department-wise statistics
export const mockStatsByDepartment = {
  Cardiology: {
    patients: 245,
    revenue: 25000000,
    admitted: 18,
    todayAppointments: 12,
    pendingLabResults: 5,
    occupancyRate: 72,
  },
  'General Medicine': {
    patients: 356,
    revenue: 18000000,
    admitted: 22,
    todayAppointments: 18,
    pendingLabResults: 8,
    occupancyRate: 73,
  },
  Orthopedics: {
    patients: 198,
    revenue: 15000000,
    admitted: 15,
    todayAppointments: 8,
    pendingLabResults: 4,
    occupancyRate: 75,
  },
  Pediatrics: {
    patients: 267,
    revenue: 12000000,
    admitted: 12,
    todayAppointments: 14,
    pendingLabResults: 6,
    occupancyRate: 60,
  },
  Neurology: {
    patients: 184,
    revenue: 15000000,
    admitted: 8,
    todayAppointments: 6,
    pendingLabResults: 3,
    occupancyRate: 53,
  },
};

// Triage-specific statistics
export const mockTriageStats = {
  totalTriageToday: 24,
  pendingTriage: 7,
  completedTriage: 17,
  averageTriageTime: 15, // minutes
  acuityDistribution: {
    critical: 3,
    urgent: 8,
    routine: 13,
  },
  byDepartment: {
    Cardiology: 5,
    'General Medicine': 8,
    Orthopedics: 4,
    Pediatrics: 4,
    Neurology: 3,
  },
};

// Triage queue data
export const mockTriageQueue = [
  {
    id: 'tq1',
    patientId: 'p101',
    patientName: 'Chukwuemeka Okonkwo',
    complaint: 'Chest pain',
    acuity: 'critical',
    arrivalTime: new Date('2024-02-06T09:15:00'),
    estimatedDepartment: 'Cardiology',
    status: 'waiting',
  },
  {
    id: 'tq2',
    patientId: 'p102',
    patientName: 'Adanna Okafor',
    complaint: 'High fever',
    acuity: 'urgent',
    arrivalTime: new Date('2024-02-06T09:30:00'),
    estimatedDepartment: 'General Medicine',
    status: 'waiting',
  },
  {
    id: 'tq3',
    patientId: 'p103',
    patientName: 'Baby Ibrahim',
    complaint: 'Pediatric fever',
    acuity: 'urgent',
    arrivalTime: new Date('2024-02-06T09:45:00'),
    estimatedDepartment: 'Pediatrics',
    status: 'in_triage',
  },
];

export const dashboardChartData = {
  patientVisits: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    data: [1200, 1350, 1100, 1450, 1380, 1520, 1480],
  },
  revenue: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    data: [75000000, 82000000, 78000000, 95000000, 88000000, 105000000, 98000000], // in Naira
  },
  departmentDistribution: [
    { name: 'Cardiology', value: 25 },
    { name: 'Orthopedics', value: 20 },
    { name: 'Neurology', value: 15 },
    { name: 'General Medicine', value: 18 },
    { name: 'Pediatrics', value: 12 },
    { name: 'Others', value: 10 },
  ],
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  date: Date;
  dueDate: Date;
  items: unknown[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paidAmount: number;
  balance: number;
  status: string;
  paymentMethod?: string;
};

// Login Users with credentials
export const mockUsers = [
  // Administrator
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@lagosmedical.com',
    password: 'admin123',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'Administrator',
    department: 'Administration',
    status: 'active',
  },
  // Doctors
  {
    id: 'd1',
    username: 'adeleke',
    email: 'adeleke@lagosmedical.com',
    password: 'adeleke123',
    firstName: 'Emeka',
    lastName: 'Adeleke',
    role: 'Doctor',
    department: 'Cardiology',
    status: 'active',
  },
  {
    id: 'd2',
    username: 'ibrahim',
    email: 'ibrahim@lagosmedical.com',
    password: 'ibrahim123',
    firstName: 'Ibrahim',
    lastName: 'Musa',
    role: 'Doctor',
    department: 'General Medicine',
    status: 'active',
  },
  {
    id: 'd3',
    username: 'okonkwo',
    email: 'okonkwo@lagosmedical.com',
    password: 'okonkwo123',
    firstName: 'Chinedu',
    lastName: 'Okonkwo',
    role: 'Doctor',
    department: 'Orthopedics',
    status: 'active',
  },
  {
    id: 'd4',
    username: 'yusuf',
    email: 'yusuf@lagosmedical.com',
    password: 'yusuf123',
    firstName: 'Aisha',
    lastName: 'Yusuf',
    role: 'Doctor',
    department: 'Pediatrics',
    status: 'active',
  },
  {
    id: 'd5',
    username: 'nnamani',
    email: 'nnamani@lagosmedical.com',
    password: 'nnamani123',
    firstName: 'Chioma',
    lastName: 'Nnamani',
    role: 'Doctor',
    department: 'Neurology',
    status: 'active',
  },
  // Auxiliary Nurses
  {
    id: 'n1',
    username: 'nurse_amaka',
    email: 'amaka.nurse@lagosmedical.com',
    password: 'nurse123',
    firstName: 'Amaka',
    lastName: 'Okafor',
    role: 'AuxiliaryNurse',
    department: 'General Triage',
    status: 'active',
  },
  {
    id: 'n2',
    username: 'nurse_grace',
    email: 'grace.nurse@lagosmedical.com',
    password: 'nurse123',
    firstName: 'Grace',
    lastName: 'Adebayo',
    role: 'AuxiliaryNurse',
    department: 'General Triage',
    status: 'active',
  },
  {
    id: 'n3',
    username: 'nurse_chinedu',
    email: 'chinedu.nurse@lagosmedical.com',
    password: 'nurse123',
    firstName: 'Chinedu',
    lastName: 'Eze',
    role: 'AuxiliaryNurse',
    department: 'General Triage',
    status: 'active',
  },
  {
    id: 'n4',
    username: 'nurse_funmilayo',
    email: 'funmilayo.nurse@lagosmedical.com',
    password: 'nurse123',
    firstName: 'Funmilayo',
    lastName: 'Adewale',
    role: 'AuxiliaryNurse',
    department: 'General Triage',
    status: 'active',
  },
  {
    id: 'n5',
    username: 'nurse_kelechi',
    email: 'kelechi.nurse@lagosmedical.com',
    password: 'nurse123',
    firstName: 'Kelechi',
    lastName: 'Nnamdi',
    role: 'AuxiliaryNurse',
    department: 'General Triage',
    status: 'active',
  },
];

// Doctor Availability Schedule
export interface DoctorAvailability {
  doctorId: string;
  doctorName: string;
  department: string;
  availableDays: string[]; // Days of week: ['Monday', 'Tuesday', etc.]
  timeSlots: string[]; // Available time slots
  maxAppointmentsPerDay: number;
}

export const doctorAvailability: DoctorAvailability[] = [
  {
    doctorId: 'd1',
    doctorName: 'Dr. Emeka Adeleke',
    department: 'Cardiology',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    maxAppointmentsPerDay: 12,
  },
  {
    doctorId: 'd2',
    doctorName: 'Dr. Ibrahim Musa',
    department: 'General Medicine',
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    timeSlots: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    maxAppointmentsPerDay: 16,
  },
  {
    doctorId: 'd3',
    doctorName: 'Dr. Chinedu Okonkwo',
    department: 'Orthopedics',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    maxAppointmentsPerDay: 10,
  },
  {
    doctorId: 'd4',
    doctorName: 'Dr. Aisha Yusuf',
    department: 'Pediatrics',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'],
    maxAppointmentsPerDay: 16,
  },
  {
    doctorId: 'd5',
    doctorName: 'Dr. Chioma Nnamani',
    department: 'Neurology',
    availableDays: ['Wednesday', 'Friday'],
    timeSlots: ['10:00', '11:00', '14:00', '15:00', '16:00'],
    maxAppointmentsPerDay: 10,
  },
];

// Department to Condition Mapping for Triage
export const departmentConditionMapping: Record<string, string[]> = {
  'Cardiology': [
    'Chest pain', 'Heart palpitations', 'Shortness of breath', 'High blood pressure',
    'Hypertension', 'Arrhythmia', 'Heart failure', 'Coronary artery disease',
    'Myocardial infarction', 'Angina', 'Cardiac arrest',
  ],
  'General Medicine': [
    'Fever', 'Malaria', 'Flu', 'Viral infection', 'Bacterial infection',
    'Diabetes', 'Gastritis', 'Ulcer', 'Abdominal pain', 'Nausea',
    'Vomiting', 'Diarrhea', 'Headache', 'Fatigue', 'General checkup',
  ],
  'Orthopedics': [
    'Fracture', 'Bone pain', 'Joint pain', 'Arthritis', 'Back pain',
    'Sprain', 'Strain', 'Dislocation', 'Osteoporosis', 'Sports injury',
    'Trauma', 'Swelling', 'Limited mobility',
  ],
  'Pediatrics': [
    'Pediatric', 'Child', 'Baby', 'Infant', 'Asthma', 'Allergy',
    'Well-child visit', 'Immunization', 'Growth', 'Development',
    'Pediatric fever', 'Childhood illness',
  ],
  'Neurology': [
    'Migraine', 'Headache', 'Seizure', 'Epilepsy', 'Stroke',
    'Numbness', 'Tingling', 'Dizziness', 'Memory loss', 'Confusion',
    'Neuropathic pain', 'Multiple sclerosis', 'Parkinson',
  ],
};

// Helper function to get department based on complaint
export function getDepartmentByComplaint(complaint: string | undefined | null): string | null {
  if (!complaint) {
    return 'General Medicine'; // Default to General Medicine
  }

  const lowerComplaint = complaint.toLowerCase();

  for (const [department, conditions] of Object.entries(departmentConditionMapping)) {
    for (const condition of conditions) {
      if (lowerComplaint.includes(condition.toLowerCase())) {
        return department;
      }
    }
  }

  return 'General Medicine'; // Default to General Medicine
}

// Helper function to get available doctors for a department and day
export function getAvailableDoctorsForDay(department: string, day: string): DoctorAvailability[] {
  return doctorAvailability.filter(
    (doc) => doc.department === department && doc.availableDays.includes(day)
  );
}
