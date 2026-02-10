# Hospital Management System

A comprehensive, role-based hospital management system built with Next.js 16, TypeScript, and Ant Design.

## 🌐 Live Deployment

**URL:** https://hospital-system-management-nhk9wb47r.vercel.app

## 🔐 Login Credentials

| Role | Email | Password | Department | Access |
|------|-------|----------|------------|--------|
| **Administrator** | admin@lagosmedical.com | admin123 | Administration | Full system access |
| **Doctor** | adeleke@lagosmedical.com | adeleke123 | Cardiology | Clinical & patient data |
| **Doctor** | ibrahim@lagosmedical.com | ibrahim123 | General Medicine | Clinical & patient data |
| **Doctor** | okonkwo@lagosmedical.com | okonkwo123 | Orthopedics | Clinical & patient data |
| **Doctor** | yusuf@lagosmedical.com | yusuf123 | Pediatrics | Clinical & patient data |
| **Auxiliary Nurse** | ngozi@lagosmedical.com | ngozi123 | Emergency | Triage & admissions |
| **Auxiliary Nurse** | amina@lagosmedical.com | amina123 | Triage | Triage & admissions |
| **Auxiliary Nurse** | grace@lagosmedical.com | grace123 | Inpatient Ward | Patient care |

## 📱 Key Pages

### Main Pages
- **Root:** `/` - Redirects to login or dashboard
- **Login:** `/login` - Sign in page
- **Dashboard:** `/dashboard` - Main dashboard (after login)

### Modules (All accessible after login)
- `/patients` - Patient management
- `/clinical` - Clinical services
- `/laboratory` - Laboratory services
- `/radiology` - Radiology & imaging
- `/pharmacy` - Pharmacy management
- `/inventory` - Inventory & stock
- `/billing` - Billing & invoices
- `/staff` - Staff management
- `/reports` - Reports & analytics
- `/emergency` - Emergency services
- `/triage` - Triage center
- And 200+ more pages!

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

## User Roles & Login Credentials

### Administrator

| Field | Value |
|-------|-------|
| Email | `admin@lagosmedical.com` |
| Password | `admin123` |
| Department | Administration |
| Access | Full system access - all features and departments |

### Doctors (4)

| Username | Password | Name | Department |
|----------|----------|------|------------|
| `adeleke` | `adeleke123` | Dr. Emeka Adeleke | Cardiology |
| `ibrahim` | `ibrahim123` | Dr. Ibrahim Musa | General Medicine |
| `okonkwo` | `okonkwo123` | Dr. Chinedu Okonkwo | Orthopedics |
| `yusuf` | `yusuf123` | Dr. Yusuf Abdullahi | Pediatrics |

### Auxiliary Nurses (3)

| Username | Password | Name | Department |
|----------|----------|------|------------|
| `ngozi` | `ngozi123` | Ngozi Okafor | Emergency |
| `amina` | `amina123` | Amina Mohammed | Triage |
| `grace` | `grace123` | Grace Eze | Inpatient Ward |

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
Patient arrives → Nurse enters complaint → System detects department
→ Nurse selects date → See available doctors → Select doctor & time
→ Appointment created → Doctor receives notification
```

### 2. Doctor Availability System

Each doctor has:
- **Working days** - Specific days they see patients
- **Time slots** - Available appointment times
- **Daily capacity** - Maximum appointments per day

**Example Schedule:**
- Dr. Emeka Adeleke (Cardiology): Monday, Wednesday, Friday | 6 slots/day
- Dr. Ibrahim Musa (General Medicine): Mon, Tue, Thu, Fri | 8 slots/day
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
| Cardiology | Red | `#EF4444` → `#DC2626` |
| General Medicine | Blue | `#3B82F6` → `#2563EB` |
| Orthopedics | Orange | `#F59E0B` → `#D97706` |
| Pediatrics | Purple | `#A855F7` → `#9333EA` |
| Neurology | Green | `#10B981` → `#059669` |
| Administration | Indigo | `#6366F1` → `#4F46E5` |
| Auxiliary Nurse | Pink | `#EC4899` → `#DB2777` |

## Project Structure

```
hospital-frontend/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx          # Login page with all user accounts displayed
│   ├── (dashboard)/
│   │   └── page.tsx                 # Personalized dashboard per role
│   ├── patients/
│   │   ├── page.tsx                 # Patient list (filtered by role)
│   │   ├── [id]/page.tsx           # Patient detail (access controlled)
│   │   └── appointments/
│   │       ├── page.tsx             # Appointments list
│   │       └── calendar/page.tsx    # Calendar view
│   ├── clinical/
│   │   ├── consultation/page.tsx    # Doctor consultation (pre-selected)
│   │   ├── emr/page.tsx             # EMR records (filtered)
│   │   └── inpatients/
│   │       └── admission/page.tsx  # Patient admission
│   ├── triage/
│   │   └── page.tsx                 # Nurse triage center
│   └── layout.tsx                   # Root layout with providers
│
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx           # Main app layout
│   │   └── UserHeader.tsx            # User header with notifications
│   ├── shared/
│   │   ├── ErrorBoundary.tsx        # Global error handler
│   │   └── ProtectedRoute.tsx        # Route protection
│   └── ...
│
└── lib/
    ├── contexts/
    │   └── AuthContext.tsx           # Authentication & authorization
    ├── departmentColors.ts           # Department color schemes
    ├── patientAssignments.ts         # Patient-to-doctor mapping
    ├── emrAssignments.ts             # EMR-to-doctor mapping
    ├── dataFilters.ts                # Data filtering logic
    └── mockData.ts                   # All mock data (users, patients, doctors)
```

## Key Files

### Authentication
- `lib/contexts/AuthContext.tsx` - Complete auth system with RBAC
- `components/auth/ProtectedRoute.tsx` - Route protection component

### Data Management
- `lib/mockData.ts` - All users, patients, doctors, availability schedules
- `lib/patientAssignments.ts` - Which patient is assigned to which doctor
- `lib/emrAssignments.ts` - Which EMR was created by which doctor
- `lib/dataFilters.ts` - Filtering logic for all data types

### UI Components
- `lib/departmentColors.ts` - Color scheme definitions
- `components/layout/UserHeader.tsx` - User profile header with notifications

## Documentation

- **[JOURNEY.md](./JOURNEY.md)** - Complete system documentation explaining how everything works
- **[FRONTENDUSER.md](./FRONTENDUSER.md)** - Implementation plan and task checklist

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
| View all patients | ✅ | ❌ | ✅ |
| View assigned patients only | N/A | ✅ | N/A |
| Create EMR | ✅ | ✅ | ❌ |
| View all EMRs | ✅ | ❌ | ❌ |
| View own EMRs | N/A | ✅ | N/A |
| Triage patients | ✅ | ❌ | ✅ |
| Schedule appointments | ✅ | ✅ | ✅ |
| View doctor availability | ✅ | ❌ | ✅ |
| Receive notifications | ❌ | ✅ | ❌ |

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

## Future Enhancements

- Real backend API integration
- Real-time WebSocket notifications
- SMS/email notifications for appointments
- Patient portal
- Billing and invoicing
- Inventory management
- Staff scheduling
- Advanced reporting and analytics

## License

This project is for demonstration purposes.

## Support

For questions or issues, please refer to the documentation files:
- [JOURNEY.md](./JOURNEY.md) - Complete system guide
- [FRONTENDUSER.md](./FRONTENDUSER.md) - Implementation details
