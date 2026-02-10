export const ROUTES = {
  // Auth
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Dashboards
  DASHBOARD: '/',
  CLINICAL_DASHBOARD: '/clinical',
  FINANCIAL_DASHBOARD: '/financial',
  OPERATIONAL_DASHBOARD: '/operational',

  // Patients
  PATIENTS: '/patients',
  PATIENT_NEW: '/patients/new',
  PATIENT_DETAIL: '/patients/:id',
  APPOINTMENTS: '/patients/appointments',
  APPOINTMENT_CALENDAR: '/patients/appointments/calendar',
  APPOINTMENT_NEW: '/patients/appointments/new',

  // Clinical
  CONSULTATION: '/clinical/consultation',
  EMR: '/clinical/emr',
  PRESCRIPTIONS: '/clinical/prescriptions',
  NURSING: '/clinical/nursing',
  INPATIENTS: '/clinical/inpatients',
  INPATIENT_ADMISSION: '/clinical/inpatients/admission',
  INPATIENT_BEDS: '/clinical/inpatients/beds',

  // Laboratory
  LABORATORY: '/laboratory',
  LAB_ORDERS: '/laboratory/orders',
  LAB_RESULTS: '/laboratory/results',
  LAB_REPORTS: '/laboratory/reports',

  // Radiology
  RADIOLOGY: '/radiology',
  RADIOLOGY_ORDERS: '/radiology/orders',
  RADIOLOGY_SCHEDULE: '/radiology/schedule',
  RADIOLOGY_REPORTS: '/radiology/reports',
  RADIOLOGY_VIEWER: '/radiology/viewer',

  // Pharmacy
  PHARMACY: '/pharmacy',
  PHARMACY_DISPENSING: '/pharmacy/dispensing',
  PHARMACY_INVENTORY: '/pharmacy/inventory',
  PHARMACY_FORMULARY: '/pharmacy/formulary',

  // Billing
  BILLING: '/billing',
  BILLING_INVOICES: '/billing/invoices',
  BILLING_PAYMENTS: '/billing/payments',
  INSURANCE: '/billing/insurance',
  INSURANCE_PREAUTH: '/billing/insurance/preauth',
  INSURANCE_CLAIMS: '/billing/insurance/claims',
  BILLING_REPORTS: '/billing/reports',

  // Inventory
  INVENTORY: '/inventory',
  INVENTORY_ITEMS: '/inventory/items',
  INVENTORY_STOCK: '/inventory/stock',
  INVENTORY_PURCHASES: '/inventory/purchases',
  INVENTORY_VENDORS: '/inventory/vendors',

  // Staff
  STAFF: '/staff',
  STAFF_REGISTRATION: '/staff/registration',
  STAFF_SCHEDULE: '/staff/schedule',
  STAFF_ATTENDANCE: '/staff/attendance',
  STAFF_PAYROLL: '/staff/payroll',

  // Reports
  REPORTS: '/reports',
  REPORTS_CLINICAL: '/reports/clinical',
  REPORTS_OPERATIONAL: '/reports/operational',
  REPORTS_FINANCIAL: '/reports/financial',
  REPORTS_INVENTORY: '/reports/inventory',
  REPORTS_CUSTOM: '/reports/custom',

  // Admin
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_DEPARTMENTS: '/admin/departments',
  ADMIN_FACILITIES: '/admin/facilities',
  ADMIN_MASTER_DATA: '/admin/master-data',
  ADMIN_AUDIT: '/admin/audit',

  // Portal
  PORTAL: '/portal',
  PORTAL_APPOINTMENTS: '/portal/appointments',
  PORTAL_RECORDS: '/portal/records',
  PORTAL_BILLS: '/portal/bills',
  PORTAL_PROFILE: '/portal/profile',
};
