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
} from '@ant-design/icons';

export interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
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
