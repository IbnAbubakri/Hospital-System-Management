import {
  DashboardOutlined,
  UserOutlined,
  MonitorOutlined,
  HomeOutlined,
  ExperimentOutlined,
  ScanOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
  InboxOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  FileTextOutlined,
  HeartOutlined,
  CalendarOutlined,
  LogoutOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

export interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  children?: MenuItem[];
  roles?: string[]; // If specified, only show to these roles
}

// Administrator Navigation - Full Access to Everything
const adminMenuItems: MenuItem[] = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    path: '/',
  },
  {
    key: 'patients',
    icon: <UserOutlined />,
    label: 'Patients',
    children: [
      {
        key: 'patients-list',
        icon: <UserOutlined />,
        label: 'Patient List',
        path: '/patients',
      },
      {
        key: 'appointments',
        icon: <CalendarOutlined />,
        label: 'Appointments',
        path: '/patients/appointments',
      },
      {
        key: 'patient-registration',
        icon: <UserOutlined />,
        label: 'Register Patient',
        path: '/patients/new',
      },
    ],
  },
  {
    key: 'clinical',
    icon: <MonitorOutlined />,
    label: 'Clinical',
    children: [
      {
        key: 'consultation',
        icon: <MonitorOutlined />,
        label: 'Consultation',
        path: '/clinical/consultation',
      },
      {
        key: 'emr',
        icon: <FileTextOutlined />,
        label: 'EMR',
        path: '/clinical/emr',
      },
      {
        key: 'prescriptions',
        icon: <MedicineBoxOutlined />,
        label: 'Prescriptions',
        path: '/clinical/prescriptions',
      },
      {
        key: 'nursing',
        icon: <HeartOutlined />,
        label: 'Nursing',
        path: '/clinical/nursing',
      },
      {
        key: 'inpatients',
        icon: <HomeOutlined />,
        label: 'Inpatients',
        path: '/clinical/inpatients',
      },
    ],
  },
  {
    key: 'triage',
    icon: <WarningOutlined />,
    label: 'Triage',
    path: '/triage',
  },
  {
    key: 'laboratory',
    icon: <ExperimentOutlined />,
    label: 'Laboratory',
    children: [
      {
        key: 'lab-dashboard',
        icon: <ExperimentOutlined />,
        label: 'Dashboard',
        path: '/laboratory',
      },
      {
        key: 'lab-orders',
        icon: <FileTextOutlined />,
        label: 'Orders',
        path: '/laboratory/orders',
      },
      {
        key: 'lab-results',
        icon: <FileTextOutlined />,
        label: 'Results',
        path: '/laboratory/results',
      },
      {
        key: 'lab-reports',
        icon: <FileTextOutlined />,
        label: 'Reports',
        path: '/laboratory/reports',
      },
    ],
  },
  {
    key: 'radiology',
    icon: <ScanOutlined />,
    label: 'Radiology',
    children: [
      {
        key: 'radiology-dashboard',
        icon: <ScanOutlined />,
        label: 'Dashboard',
        path: '/radiology',
      },
      {
        key: 'radiology-orders',
        icon: <FileTextOutlined />,
        label: 'Orders',
        path: '/radiology/orders',
      },
      {
        key: 'radiology-schedule',
        icon: <CalendarOutlined />,
        label: 'Schedule',
        path: '/radiology/schedule',
      },
      {
        key: 'radiology-reports',
        icon: <FileTextOutlined />,
        label: 'Reports',
        path: '/radiology/reports',
      },
    ],
  },
  {
    key: 'pharmacy',
    icon: <MedicineBoxOutlined />,
    label: 'Pharmacy',
    children: [
      {
        key: 'pharmacy-dashboard',
        icon: <MedicineBoxOutlined />,
        label: 'Dashboard',
        path: '/pharmacy',
      },
      {
        key: 'pharmacy-dispensing',
        icon: <MedicineBoxOutlined />,
        label: 'Dispensing',
        path: '/pharmacy/dispensing',
      },
      {
        key: 'pharmacy-inventory',
        icon: <InboxOutlined />,
        label: 'Inventory',
        path: '/pharmacy/inventory',
      },
      {
        key: 'pharmacy-formulary',
        icon: <FileTextOutlined />,
        label: 'Formulary',
        path: '/pharmacy/formulary',
      },
    ],
  },
  {
    key: 'billing',
    icon: <DollarOutlined />,
    label: 'Billing',
    children: [
      {
        key: 'billing-dashboard',
        icon: <DollarOutlined />,
        label: 'Dashboard',
        path: '/billing',
      },
      {
        key: 'invoices',
        icon: <FileTextOutlined />,
        label: 'Invoices',
        path: '/billing/invoices',
      },
      {
        key: 'payments',
        icon: <DollarOutlined />,
        label: 'Payments',
        path: '/billing/payments',
      },
      {
        key: 'insurance',
        icon: <FileTextOutlined />,
        label: 'Insurance',
        path: '/billing/insurance',
      },
    ],
  },
  {
    key: 'inventory',
    icon: <InboxOutlined />,
    label: 'Inventory',
    children: [
      {
        key: 'inventory-dashboard',
        icon: <InboxOutlined />,
        label: 'Dashboard',
        path: '/inventory',
      },
      {
        key: 'inventory-items',
        icon: <InboxOutlined />,
        label: 'Items',
        path: '/inventory/items',
      },
      {
        key: 'inventory-stock',
        icon: <InboxOutlined />,
        label: 'Stock',
        path: '/inventory/stock',
      },
      {
        key: 'inventory-purchases',
        icon: <FileTextOutlined />,
        label: 'Purchase Orders',
        path: '/inventory/purchases',
      },
      {
        key: 'inventory-vendors',
        icon: <TeamOutlined />,
        label: 'Vendors',
        path: '/inventory/vendors',
      },
    ],
  },
  {
    key: 'staff',
    icon: <TeamOutlined />,
    label: 'Staff',
    children: [
      {
        key: 'staff-directory',
        icon: <TeamOutlined />,
        label: 'Directory',
        path: '/staff',
      },
      {
        key: 'staff-registration',
        icon: <UserOutlined />,
        label: 'Registration',
        path: '/staff/registration',
      },
      {
        key: 'staff-schedule',
        icon: <CalendarOutlined />,
        label: 'Schedule',
        path: '/staff/schedule',
      },
      {
        key: 'staff-attendance',
        icon: <CalendarOutlined />,
        label: 'Attendance',
        path: '/staff/attendance',
      },
      {
        key: 'staff-payroll',
        icon: <DollarOutlined />,
        label: 'Payroll',
        path: '/staff/payroll',
      },
    ],
  },
  {
    key: 'reports',
    icon: <BarChartOutlined />,
    label: 'Reports',
    children: [
      {
        key: 'reports-clinical',
        icon: <BarChartOutlined />,
        label: 'Clinical',
        path: '/reports/clinical',
      },
      {
        key: 'reports-operational',
        icon: <BarChartOutlined />,
        label: 'Operational',
        path: '/reports/operational',
      },
      {
        key: 'reports-financial',
        icon: <DollarOutlined />,
        label: 'Financial',
        path: '/reports/financial',
      },
      {
        key: 'reports-inventory',
        icon: <InboxOutlined />,
        label: 'Inventory',
        path: '/reports/inventory',
      },
      {
        key: 'reports-custom',
        icon: <FileTextOutlined />,
        label: 'Custom',
        path: '/reports/custom',
      },
    ],
  },
  {
    key: 'admin',
    icon: <SettingOutlined />,
    label: 'Administration',
    children: [
      {
        key: 'admin-users',
        icon: <UserOutlined />,
        label: 'Users',
        path: '/admin/users',
      },
      {
        key: 'admin-roles',
        icon: <TeamOutlined />,
        label: 'Roles',
        path: '/admin/roles',
      },
      {
        key: 'admin-departments',
        icon: <HomeOutlined />,
        label: 'Departments',
        path: '/admin/departments',
      },
      {
        key: 'admin-facilities',
        icon: <HomeOutlined />,
        label: 'Facilities',
        path: '/admin/facilities',
      },
      {
        key: 'admin-master-data',
        icon: <FileTextOutlined />,
        label: 'Master Data',
        path: '/admin/master-data',
      },
      {
        key: 'admin-audit',
        icon: <FileTextOutlined />,
        label: 'Audit Logs',
        path: '/admin/audit',
      },
    ],
  },
];

// Doctor Navigation - Department-Specific Access
const doctorMenuItems: MenuItem[] = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    path: '/',
  },
  {
    key: 'patients',
    icon: <UserOutlined />,
    label: 'My Patients',
    children: [
      {
        key: 'patients-list',
        icon: <UserOutlined />,
        label: 'Patient List',
        path: '/patients',
      },
      {
        key: 'appointments',
        icon: <CalendarOutlined />,
        label: 'Appointments',
        path: '/patients/appointments',
      },
    ],
  },
  {
    key: 'clinical',
    icon: <MonitorOutlined />,
    label: 'Clinical',
    children: [
      {
        key: 'consultation',
        icon: <MonitorOutlined />,
        label: 'Start Consultation',
        path: '/clinical/consultation',
      },
      {
        key: 'emr',
        icon: <FileTextOutlined />,
        label: 'EMR',
        path: '/clinical/emr',
      },
      {
        key: 'prescriptions',
        icon: <MedicineBoxOutlined />,
        label: 'Prescriptions',
        path: '/clinical/prescriptions',
      },
      {
        key: 'inpatients',
        icon: <HomeOutlined />,
        label: 'Inpatients',
        path: '/clinical/inpatients',
      },
    ],
  },
  {
    key: 'laboratory',
    icon: <ExperimentOutlined />,
    label: 'Lab Orders',
    children: [
      {
        key: 'lab-orders',
        icon: <FileTextOutlined />,
        label: 'Orders',
        path: '/laboratory/orders',
      },
      {
        key: 'lab-results',
        icon: <FileTextOutlined />,
        label: 'Results',
        path: '/laboratory/results',
      },
    ],
  },
  {
    key: 'radiology',
    icon: <ScanOutlined />,
    label: 'Radiology',
    children: [
      {
        key: 'radiology-orders',
        icon: <FileTextOutlined />,
        label: 'Orders',
        path: '/radiology/orders',
      },
      {
        key: 'radiology-reports',
        icon: <FileTextOutlined />,
        label: 'Reports',
        path: '/radiology/reports',
      },
    ],
  },
  {
    key: 'reports',
    icon: <BarChartOutlined />,
    label: 'Reports',
    children: [
      {
        key: 'reports-clinical',
        icon: <BarChartOutlined />,
        label: 'Clinical Reports',
        path: '/reports/clinical',
      },
      {
        key: 'reports-patient',
        icon: <UserOutlined />,
        label: 'Patient Statistics',
        path: '/reports/patient-stats',
      },
      {
        key: 'reports-doctor-metrics',
        icon: <BarChartOutlined />,
        label: 'My Performance',
        path: '/reports/doctor-metrics',
      },
    ],
  },
];

// Auxiliary Nurse Navigation - Triage Focus
const nurseMenuItems: MenuItem[] = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    path: '/',
  },
  {
    key: 'triage',
    icon: <WarningOutlined />,
    label: 'Triage Center',
    path: '/triage',
  },
  {
    key: 'patients',
    icon: <UserOutlined />,
    label: 'Patients',
    children: [
      {
        key: 'patients-list',
        icon: <UserOutlined />,
        label: 'All Patients',
        path: '/patients',
      },
      {
        key: 'patient-registration',
        icon: <UserOutlined />,
        label: 'Register Patient',
        path: '/patients/new',
      },
    ],
  },
  {
    key: 'appointments',
    icon: <CalendarOutlined />,
    label: 'Appointments',
    path: '/patients/appointments',
  },
  {
    key: 'doctor-availability',
    icon: <ClockCircleOutlined />,
    label: 'Doctor Availability',
    path: '/staff/schedule',
  },
  {
    key: 'reports',
    icon: <BarChartOutlined />,
    label: 'Reports',
    children: [
      {
        key: 'reports-patient',
        icon: <UserOutlined />,
        label: 'Patient Statistics',
        path: '/reports/patient-stats',
      },
      {
        key: 'reports-utilization',
        icon: <BarChartOutlined />,
        label: 'Bed Utilization',
        path: '/reports/utilization',
      },
    ],
  },
];

/**
 * Get menu items based on user role
 */
export function getMenuItemsForRole(role: string): MenuItem[] {
  switch (role) {
    case 'Administrator':
      return adminMenuItems;
    case 'Doctor':
      return doctorMenuItems;
    case 'AuxiliaryNurse':
      return nurseMenuItems;
    default:
      // Default to doctor menu for unknown roles
      return doctorMenuItems;
  }
}

/**
 * Filter menu items based on user role
 */
export function filterMenuItemsByRole(items: MenuItem[], role: string): MenuItem[] {
  return items.filter(item => {
    // If item has roles specified, check if user's role matches
    if (item.roles && item.roles.length > 0) {
      return item.roles.includes(role);
    }
    // If no roles specified, item is visible to all
    return true;
  }).map(item => {
    // Recursively filter children
    if (item.children && item.children.length > 0) {
      const filteredChildren = filterMenuItemsByRole(item.children, role);
      return {
        ...item,
        children: filteredChildren,
      };
    }
    return item;
  });
}
