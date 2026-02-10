export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'dashboard:view',

  // Patients
  VIEW_PATIENTS: 'patients:view',
  REGISTER_PATIENT: 'patients:register',
  EDIT_PATIENT: 'patients:edit',
  DELETE_PATIENT: 'patients:delete',
  VIEW_PATIENT_HISTORY: 'patients:view_history',

  // Appointments
  VIEW_APPOINTMENTS: 'appointments:view',
  BOOK_APPOINTMENT: 'appointments:book',
  EDIT_APPOINTMENT: 'appointments:edit',
  CANCEL_APPOINTMENT: 'appointments:cancel',

  // Clinical
  VIEW_EMR: 'clinical:view_emr',
  CREATE_EMR: 'clinical:create_emr',
  EDIT_EMR: 'clinical:edit_emr',
  WRITE_PRESCRIPTION: 'clinical:write_prescription',
  VIEW_NURSING_NOTES: 'clinical:view_nursing',
  WRITE_NURSING_NOTES: 'clinical:write_nursing',

  // Inpatients
  ADMIT_PATIENT: 'inpatients:admit',
  DISCHARGE_PATIENT: 'inpatients:discharge',
  MANAGE_BEDS: 'inpatients:manage_beds',
  VIEW_INPATIENTS: 'inpatients:view',

  // Laboratory
  ORDER_LAB: 'lab:order',
  VIEW_LAB_RESULTS: 'lab:view_results',
  ENTER_LAB_RESULTS: 'lab:enter_results',
  APPROVE_LAB_RESULTS: 'lab:approve_results',

  // Radiology
  ORDER_IMAGING: 'radiology:order',
  SCHEDULE_SCAN: 'radiology:schedule',
  VIEW_IMAGES: 'radiology:view_images',
  WRITE_RADIOLOGY_REPORT: 'radiology:write_report',

  // Pharmacy
  DISPENSE_MEDICATION: 'pharmacy:dispense',
  MANAGE_PHARMACY_INVENTORY: 'pharmacy:manage_inventory',
  PRESCRIBE_MEDICATION: 'pharmacy:prescribe',
  APPROVE_PRESCRIPTION: 'pharmacy:approve',

  // Billing
  CREATE_INVOICE: 'billing:create_invoice',
  VIEW_INVOICE: 'billing:view_invoice',
  COLLECT_PAYMENT: 'billing:collect_payment',
  PROCESS_REFUND: 'billing:process_refund',
  MANAGE_INSURANCE: 'billing:manage_insurance',
  SUBMIT_CLAIM: 'billing:submit_claim',

  // Inventory
  MANAGE_INVENTORY: 'inventory:manage',
  CREATE_PURCHASE_ORDER: 'inventory:create_po',
  APPROVE_PURCHASE_ORDER: 'inventory:approve_po',
  MANAGE_VENDORS: 'inventory:manage_vendors',

  // Staff
  VIEW_STAFF: 'staff:view',
  REGISTER_STAFF: 'staff:register',
  MANAGE_SCHEDULE: 'staff:manage_schedule',
  MANAGE_ATTENDANCE: 'staff:manage_attendance',
  PROCESS_PAYROLL: 'staff:process_payroll',
  MANAGE_LEAVE: 'staff:manage_leave',

  // Reports
  VIEW_REPORTS: 'reports:view',
  VIEW_CLINICAL_REPORTS: 'reports:clinical:view',
  VIEW_PATIENT_REPORTS: 'reports:patient:view',
  VIEW_FINANCIAL_REPORTS: 'reports:financial:view',
  VIEW_DISEASE_TRENDS: 'reports:disease_trends:view',
  VIEW_OUTCOMES_REPORTS: 'reports:outcomes:view',
  VIEW_DOCTOR_METRICS: 'reports:doctor_metrics:view',
  VIEW_UTILIZATION_REPORTS: 'reports:utilization:view',
  VIEW_SCHEDULED_REPORTS: 'reports:scheduled:view',
  EXPORT_REPORTS: 'reports:export',
  CREATE_CUSTOM_REPORTS: 'reports:create_custom',

  // Admin
  MANAGE_USERS: 'admin:manage_users',
  MANAGE_ROLES: 'admin:manage_roles',
  MANAGE_DEPARTMENTS: 'admin:manage_departments',
  MANAGE_FACILITIES: 'admin:manage_facilities',
  MANAGE_MASTER_DATA: 'admin:manage_master_data',
  VIEW_AUDIT_LOGS: 'admin:view_audit',
  MANAGE_SYSTEM_SETTINGS: 'admin:system_settings',
};

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  RECEPTIONIST: 'Receptionist',
  PHARMACIST: 'Pharmacist',
  LAB_TECHNICIAN: 'Lab Technician',
  RADIOLOGIST: 'Radiologist',
  BILLING_STAFF: 'Billing Staff',
  INVENTORY_MANAGER: 'Inventory Manager',
  HR_MANAGER: 'HR Manager',
  PATIENT: 'Patient',
};
