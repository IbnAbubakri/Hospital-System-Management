# Hospital Management System

A comprehensive, role-based hospital management system built with Next.js 16, TypeScript, and Ant Design.

## Live Deployment

**URL:** https://hospital-system-management-nhk9wb47r.vercel.app

## Login Credentials

### Administrator

| Field | Value |
|-------|-------|
| Email | admin@lagosmedical.com |
| Password | admin123 |
| Department | Administration |
| Access | Full system access - all features and departments |

### Doctors

| Username | Password | Name | Department |
|----------|----------|------|------------|
| adeleke | adeleke123 | Dr. Ngozi Adeleke | Cardiology |
| okoro | okoro123 | Dr. Emeka Okoro | General Medicine |
| bakare | bakare123 | Dr. Tunde Bakare | Orthopedics |
| yusuf | yusuf123 | Dr. Aisha Yusuf | Pediatrics |
| nwosu | nwosu123 | Dr. Chinedu Nwosu | Neurology |

### Auxiliary Nurses

| Username | Password | Name | Department |
|----------|----------|------|------------|
| nurse_amaka | nurse123 | Amaka Okafor | General Triage |
| nurse_grace | nurse123 | Grace Adebayo | General Triage |
| nurse_chinedu | nurse123 | Chinedu Eze | General Triage |
| nurse_funmilayo | nurse123 | Funmilayo Adewale | General Triage |
| nurse_kelechi | nurse123 | Kelechi Nnamdi | General Triage |

## Key Pages

### Main Pages

- **Root:** `/` - Redirects to login or dashboard
- **Login:** `/login` - Sign in page
- **Dashboard:** `/dashboard` - Main dashboard (after login)

### Modules (All accessible after login)

- `/patients` - Patient management
- `/clinical` - Clinical services
- `/laboratory` - Laboratory services
- `/radiology` - Radiology and imaging
- `/pharmacy` - Pharmacy management
- `/inventory` - Inventory and stock
- `/billing` - Billing and invoices
- `/staff` - Staff management
- `/reports` - Reports and analytics
- `/emergency` - Emergency services
- `/triage` - Triage center
- `/admin` - Administration
- And 200+ more pages

## Features

- **Role-Based Access Control (RBAC)** - Administrator, Doctors, and Auxiliary Nurses
- **Frontend-Only Authentication** - No backend required for demonstration
- **Department-Based Data Segregation** - Each doctor sees only their assigned patients
- **Auxiliary Nurse Triage System** - Nurses receive complaints and assign patients to doctors
- **Doctor Availability Scheduling** - Track doctor availability by day and time slots
- **Real-time Notifications** - Doctors receive appointment alerts
- **Department Color Coding** - Visual distinction per department
- **Comprehensive Patient Management** - 12 patients with realistic medical data
- **EMR System** - Electronic Medical Records with 9 records
- **Multi-Department Support** - Cardiology, General Medicine, Orthopedics, Pediatrics, Neurology

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript 5.0
- **UI Library:** Ant Design 6.2.2
- **Styling:** Tailwind CSS 4.0
- **State Management:** React Context API
- **Icons:** Ant Design Icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Overview

### 1. Auxiliary Nurse Triage System

Located at `/triage`

Nurses can:
- **Receive patient complaints** - Enter symptoms and chief complaints
- **Auto-detect department** - System suggests appropriate department based on complaint
- **Assess severity** - Routine, Urgent, or Critical
- **View doctor availability** - See which doctors are available on selected date
- **Assign to doctor** - Select available doctor and time slot
- **Schedule appointment** - Create appointment that doctor will see

**Workflow:**

```
Patient arrives -> Nurse enters complaint -> System detects department
-> Nurse selects date -> See available doctors -> Select doctor and time
-> Appointment created -> Doctor receives notification
```

### 2. Doctor Availability System

Each doctor has:
- **Working days** - Specific days they see patients
- **Time slots** - Available appointment times
- **Daily capacity** - Maximum appointments per day

**Example Schedule:**

- Dr. Ngozi Adeleke (Cardiology): Monday, Wednesday, Friday | 6 slots/day
- Dr. Emeka Okoro (General Medicine): Mon, Tue, Thu, Fri | 8 slots/day
- Dr. Aisha Yusuf (Pediatrics): Mon-Fri | 8 slots/day

### 3. Notification System

Doctors receive:
- **Notification bell** in header with badge count
- **Upcoming appointments list** in dropdown
- **Auto-refresh** on login
- **Quick access** to appointment details

### 4. Department Color Coding

| Department | Primary Color | Gradient |
|------------|--------------|----------|
| Cardiology | Red | #EF4444 -> #DC2626 |
| General Medicine | Blue | #3B82F6 -> #2563EB |
| Orthopedics | Orange | #F59E0B -> #D97706 |
| Pediatrics | Purple | #A855F7 -> #9333EA |
| Neurology | Green | #10B981 -> #059669 |
| Administration | Indigo | #6366F1 -> #4F46E5 |
| Auxiliary Nurse | Pink | #EC4899 -> #DB2777 |

## Project Structure

```
hospital-frontend/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx          # Login page with all user accounts displayed
│   ├── (dashboard)/
│   │   └── page.tsx               # Personalized dashboard per role
│   ├── patients/
│   │   ├── page.tsx               # Patient list (filtered by role)
│   │   ├── [id]/page.tsx         # Patient detail (access controlled)
│   │   └── appointments/
│   │       ├── page.tsx           # Appointments list
│   │       └── calendar/page.tsx   # Calendar view
│   ├── clinical/
│   │   ├── consultation/page.tsx   # Doctor consultation (pre-selected)
│   │   ├── emr/page.tsx          # EMR records (filtered)
│   │   └── inpatients/
│   │       └── admission/page.tsx  # Patient admission
│   ├── triage/
│   │   └── page.tsx               # Nurse triage center
│   └── layout.tsx                 # Root layout with providers
│
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx         # Main app layout
│   │   └── UserHeader.tsx         # User header with notifications
│   ├── shared/
│   │   ├── ErrorBoundary.tsx      # Global error handler
│   │   ├── PermissionGuard.tsx    # Permission wrapper
│   │   └── ProtectedRoute.tsx      # Route protection
│   └── ...
│
└── lib/
    ├── contexts/
    │   └── AuthContext.tsx        # Authentication and authorization
    ├── departmentColors.ts          # Department color schemes
    ├── patientAssignments.ts       # Patient-to-doctor mapping
    ├── emrAssignments.ts           # EMR-to-doctor mapping
    ├── dataFilters.ts              # Data filtering logic
    └── mockData.ts                 # All mock data (users, patients, doctors)
```

## Key Files

### Authentication

- `lib/contexts/AuthContext.tsx` - Complete auth system with RBAC
- `components/auth/ProtectedRoute.tsx` - Route protection component
- `components/auth/PermissionGuard.tsx` - Permission wrapper component

### Data Management

- `lib/mockData.ts` - All users, patients, doctors, availability schedules
- `lib/patientAssignments.ts` - Which patient is assigned to which doctor
- `lib/emrAssignments.ts` - Which EMR was created by which doctor
- `lib/dataFilters.ts` - Filtering logic for all data types

### UI Components

- `lib/departmentColors.ts` - Color scheme definitions
- `components/layout/UserHeader.tsx` - User profile header with notifications

## Data Summary

### Users

- 1 Administrator
- 5 Doctors (one per department)
- 5 Auxiliary Nurses
- **Total: 11 user accounts**

### Patients

- 12 total patients
- 6 pediatric patients (ages 3-11)
- Assigned to doctors based on medical specialty

### EMR Records

- 9 medical records
- Created by respective doctors
- Realistic medical data with Nigerian names

### Departments

- Cardiology
- General Medicine
- Orthopedics
- Pediatrics
- Neurology
- General Triage (Nurses)

## Role Permissions

| Permission | Admin | Doctor | Nurse |
|-----------|-------|--------|-------|
| View all patients | Yes | No | Yes |
| View assigned patients only | N/A | Yes | N/A |
| Create EMR | Yes | Yes | No |
| View all EMRs | Yes | No | No |
| View own EMRs | N/A | Yes | N/A |
| Triage patients | Yes | No | Yes |
| Schedule appointments | Yes | Yes | Yes |
| View doctor availability | Yes | No | Yes |
| Receive notifications | No | Yes | No |

## Patient-Doctor Assignments

| Patient | Doctor | Department |
|---------|--------|-----------|
| 1 - Chukwuemeka Okonkwo | Dr. Ngozi Adeleke | Cardiology |
| 2 - Adanna Okafor | Dr. Emeka Okoro | General Medicine |
| 3 - Olufemi Adebayo | Dr. Ngozi Adeleke | Cardiology |
| 4 - Chioma Eze | Dr. Chinedu Nwosu | Neurology |
| 5 - Ibrahim Musah | Dr. Emeka Okoro | General Medicine |
| 6 - Bimpe Alake | Dr. Aisha Yusuf | Pediatrics |
| 7 - Tobi Okafor | Dr. Aisha Yusuf | Pediatrics |
| 8 - Chisom Eze | Dr. Aisha Yusuf | Pediatrics |
| 9 - Obiora Nwosu | Dr. Aisha Yusuf | Pediatrics |
| 10 - Amina Okonkwo | Dr. Aisha Yusuf | Pediatrics |
| 11 - Emeka Adebayo | Dr. Aisha Yusuf | Pediatrics |
| 12 - Zainab Musah | Dr. Aisha Yusuf | Pediatrics |

## User Guide

### Administrator

As an administrator, you have access to:

- **Full Patient List** - View and manage all 12 patients
- **User Management** - View all user accounts
- **Clinical Modules** - Access all clinical features
- **Reports** - Generate and view all reports
- **Admin Panel** - System configuration

### Doctor

Your dashboard shows:

- **Your Patients** - Only patients assigned to you
- **Your Appointments** - Scheduled appointments
- **Notifications** - New appointment alerts
- **Department Stats** - Your department metrics

**Note:** Doctors can only see their assigned patients. This is by design for data privacy.

### Auxiliary Nurse

Your dashboard shows:

- **Triage Center** - Main triage interface
- **Patient List** - All patients for selection
- **Quick Actions** - Common tasks

**Triage Workflow:**

1. Select patient from dropdown
2. Enter chief complaint
3. System auto-detects department
4. Assess severity (Routine/Urgent/Critical)
5. Choose appointment date
6. View available doctors
7. Select doctor and time
8. Submit - Doctor receives notification

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Environment Variables

No environment variables required - this is a frontend-only demo using mock data.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### I cannot see all patients

If you are logged in as a Doctor, you can only see patients assigned to you. This is by design for data privacy. Administrators and Nurses can see all patients.

### How do I create an EMR?

Only Doctors and Administrators can create EMRs. Navigate to Clinical -> EMR, then click "New EMR Record".

### My triage appointment did not create

Check:
1. All fields are filled
2. A doctor is available on selected date
3. A time slot is selected

### I do not see notifications

Only Doctors receive notifications. Notifications appear when a nurse schedules an appointment for you.

### Where is my data stored?

Currently, all data is stored in your browser's localStorage. This means:
- Data persists across sessions
- Data is specific to your browser
- Clearing browser data will reset the system

## Future Enhancements

- Real backend API integration
- Real-time WebSocket notifications
- SMS/email notifications for appointments
- Advanced reporting and analytics
- Multi-facility support

## License

This project is for demonstration purposes.