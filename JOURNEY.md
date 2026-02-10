# Hospital Management System - Complete Journey Documentation

This document explains how the Hospital Management System works from the perspective of different user roles - Administrator, Doctors, Auxiliary Nurses, and the overall authentication system.

---

## Table of Contents

1. [Authentication System](#authentication-system)
2. [Administrator Role](#administrator-role-full-access)
3. [Auxiliary Nurse Role](#auxiliary-nurse-role-triage-system)
4. [Doctor Role](#doctor-role-department-restricted-access)
5. [Data Flow Architecture](#data-flow-architecture)
6. [Color Coding System](#color-coding-system)
7. [Access Control Examples](#access-control-examples)
8. [Summary Comparison](#summary-comparison)

---

## Authentication System

### Login Credentials

All users access the system through `/login` with their credentials:

| Role | Username | Password | Department | Full Name |
|------|----------|----------|------------|-----------|
| **Administrator** | admin | admin123 | Administration | System Administrator |
| **Doctor** | adeleke | adeleke123 | Cardiology | Dr. Emeka Adeleke |
| **Doctor** | ibrahim | ibrahim123 | General Medicine | Dr. Ibrahim Musa |
| **Doctor** | okonkwo | okonkwo123 | Orthopedics | Dr. Chinedu Okonkwo |
| **Doctor** | nnamani | nnamani123 | Neurology | Dr. Chioma Nnamani |
| **Doctor** | yusuf | yusuf123 | Pediatrics | Dr. Aisha Yusuf |
| **Auxiliary Nurse** | nurse_amaka | nurse123 | General Triage | Amaka Okafor |
| **Auxiliary Nurse** | nurse_grace | nurse123 | General Triage | Grace Adebayo |
| **Auxiliary Nurse** | nurse_chinedu | nurse123 | General Triage | Chinedu Eze |
| **Auxiliary Nurse** | nurse_funmilayo | nurse123 | General Triage | Funmilayo Adewale |
| **Auxiliary Nurse** | nurse_kelechi | nurse123 | General Triage | Kelechi Nnamdi |

**Total Users: 11** (1 Admin + 5 Doctors + 5 Auxiliary Nurses)

**Note:** All Auxiliary Nurses use the same password: `nurse123`

### Authentication Flow

```
1. User enters credentials at /login
   ↓
2. AuthContext validates against mockUsers array
   ↓
3. On success:
   - Store session in localStorage (key: 'hospital_user_session')
   - Store token in localStorage (key: 'hospital_token')
   - Set user state in React context
   - Redirect to dashboard (/)
   ↓
4. On page load:
   - Check localStorage for existing session
   - Restore user state from stored session
   - Show appropriate data based on role
   ↓
5. On logout:
   - Clear localStorage
   - Clear user state
   - Redirect to login page
```

### Session Storage

```javascript
// Keys used in localStorage
'hospital_user_session' → User object with role, department, etc.
'hospital_token'         → Mock authentication token
```

---

## Administrator Role (Full Access)

The Administrator has **complete access** to everything in the system.

### What They See

- **All Patients** - 12 patients total across all departments
- **All EMR Records** - 9 records from all doctors
- **All Appointments** - All scheduled appointments across hospital
- **All Doctors and Staff** - Complete staff directory
- **All Laboratory Orders** - All lab tests and results
- **All Radiology Reports** - All imaging and reports
- **All Pharmacy Data** - Medications and prescriptions
- **Inventory Management** - Full hospital inventory
- **Financial Reports** - Revenue and billing

### Dashboard Experience

```
Good Morning, Administrator!
─────────────────────────────
Today is Friday, February 4, 2026

You have full access to all hospital departments and data.

Quick Actions:
├─ New Patient
├─ Schedule
├─ Reports
└─ Settings

Stats Cards:
┌─────────────────────┐
│ Total Patients: 12  │
│ Today's Appts: 8    │
│ Admitted: 15        │
│ Revenue: ₦2.4M      │
└─────────────────────┘
```

### Key Capabilities

```
✓ View any patient's profile
✓ View all EMR records from any doctor
✓ Access all departments (Cardiology, General Medicine, etc.)
✓ Create/modify records in any department
✓ Manage user accounts
✓ View all reports and analytics
✓ Override any restrictions
```

### No Restrictions

```
NO "You can only view..." warnings
NO Pre-selected fields (can select any doctor, department)
NO Department restrictions
NO Patient assignment limitations
```

---

## Auxiliary Nurse Role (Triage System)

Auxiliary Nurses are the **first point of contact** for patients. They receive complaints, assess severity, and assign patients to appropriate doctors based on specialty and availability.

### What Nurses Can Do

```
✓ View all 12 patients (for triage purposes)
✓ Receive patient complaints
✓ Auto-detect department based on symptoms
✓ Assess severity (Routine, Urgent, Critical)
✓ View doctor availability (days and time slots)
✓ Assign patients to available doctors
✓ Schedule appointments
✗ Cannot create EMR records
✗ Cannot view EMR records
✗ No notifications (only doctors receive them)
```

### Dashboard Experience

```
Good Morning, [Nurse Name]!
────────────────────────────
Today is Friday, February 4, 2026 • General Triage

Triage patients and schedule appointments with appropriate doctors based on availability.

[Welcome banner in PINK gradient]

Quick Actions:
├─ Triage Center (NEW!)
├─ Appointments
├─ Reports
└─ Settings

Stats Cards (PERSONALIZED):
┌─────────────────────────┐
│ Today's Appointments: 8 │
│ Total Patients: 12      │
│ Active Doctors: 5       │
│ Active Patients: 10     │
└─────────────────────────┘
```

### Triage Center Page (`/triage`)

The Nurse Triage Center is the main workspace for auxiliary nurses.

**Features:**
1. **Patient Selection** - Dropdown shows all 12 patients
2. **Chief Complaint Input** - Describe patient's symptoms
3. **Auto-Department Detection** - System suggests department based on keywords
4. **Severity Assessment** - Routine, Urgent, or Critical
5. **Appointment Date Selection** - Choose appointment date
6. **Doctor Availability Display** - See which doctors are available
7. **Time Slot Selection** - Pick available time slot
8. **Assign & Schedule** - Create appointment

**Department Auto-Detection Keywords:**

| Department | Trigger Keywords |
|------------|------------------|
| Cardiology | Chest pain, heart, palpitations, shortness of breath, hypertension |
| General Medicine | Fever, malaria, flu, viral infection, diabetes, gastritis |
| Orthopedics | Fracture, bone pain, joint pain, arthritis, back pain, trauma |
| Pediatrics | Pediatric, child, baby, infant, asthma (child), well-child visit |
| Neurology | Migraine, headache, seizure, epilepsy, stroke, numbness |

### Doctor Availability Reference

Nurses can see when each doctor is available:

| Doctor | Department | Available Days | Time Slots | Max/Day |
|--------|------------|----------------|------------|---------|
| Dr. Emeka Adeleke | Cardiology | Mon, Wed, Fri | 09:00, 10:00, 11:00, 14:00, 15:00, 16:00 | 12 |
| Dr. Ibrahim Musa | General Medicine | Mon, Tue, Thu, Fri | 08:00, 09:00, 10:00, 11:00, 14:00, 15:00, 16:00, 17:00 | 16 |
| Dr. Chinedu Okonkwo | Orthopedics | Tue, Thu, Sat | 09:00, 10:00, 11:00, 14:00, 15:00 | 10 |
| Dr. Aisha Yusuf | Pediatrics | Mon-Fri | 08:00, 09:00, 10:00, 11:00, 12:00, 14:00, 15:00, 16:00 | 16 |
| Dr. Chioma Nnamani | Neurology | Wed, Fri | 10:00, 11:00, 14:00, 15:00, 16:00 | 10 |

### Triage Workflow Example

```
SCENARIO: Patient arrives with severe chest pain

1. Nurse (Amaka) goes to /triage
   ↓
2. Selects patient: "Chukwuemeka Okonkwo"
   ↓
3. Enters complaint: "Patient complains of severe chest pain, shortness of breath, and palpitations"
   ↓
4. System auto-detects: "CARDIOLOGY" ✅
   ↓
5. Nurse confirms severity: "URGENT"
   ↓
6. Selects date: "Monday, February 10, 2026"
   ↓
7. System shows available doctors for Cardiology on Monday:
   ✓ Dr. Emeka Adeleke (6 slots available)
   ↓
8. Selects doctor: "Dr. Emeka Adeleke"
   ↓
9. Selects time: "10:00"
   ↓
10. Clicks "Assign to Doctor & Schedule Appointment"
   ↓
11. SUCCESS MESSAGE: "Appointment Scheduled Successfully!"
    Patient assigned to Dr. Emeka Adeleke on February 10, 2026 at 10:00
   ↓
12. Doctor receives notification
```

### What Nurses Cannot Do

```
❌ Access EMR records
   → "You don't have permission to view EMR records"

❌ Create EMR records
   → Only doctors can create EMRs

❌ View patient medical history
   → Only for triage purposes

❌ Receive appointment notifications
   → Only doctors receive notifications
```

---

## Doctor Role (Department-Restricted Access)

Each doctor has **restricted access** based on:
1. Their department specialty
2. Their assigned patients
3. Their created EMR records

### Patient Assignment System

```
Patient → Assigned To → Doctor (Based on Medical Condition/Specialty)
```

### Complete Patient Assignments

#### Dr. Emeka Adeleke (Cardiology)
- **Chukwuemeka Okonkwo** - 45yo Male - Hypertension, Type 2 Diabetes
- **Amaka Okafor** - 38yo Female - Chest pain, palpitations
- **Total Patients:** 2
- **EMR Records:** 2 (Hypertension, Gastritis)

#### Dr. Ibrahim Musa (General Medicine)
- **Olufemi Adebayo** - 52yo Male - Malaria, fever
- **Grace Adebayo** - 28yo Female - Flu, viral infection
- **Total Patients:** 2
- **EMR Records:** 1 (Viral infection - Dengue suspected)

#### Dr. Chinedu Okonkwo (Orthopedics)
- **Ngozi Eze** - 65yo Female - Fracture, trauma
- **Emeka Okafor** - 58yo Male - Arthritis, joint pain
- **Total Patients:** 2
- **EMR Records:** 1 (Osteoarthritis)

#### Dr. Nnamani Chioma (Neurology)
- **Chioma Nnamani** - 34yo Female - Migraine, headaches
- **Total Patients:** 1
- **EMR Records:** 1 (Migraine with aura)

#### Dr. Aisha Yusuf (Pediatrics)
- **Tobi Okafor** - 5yo Male - Asthma, wheezing
- **Chisom Eze** - 11yo Female - General checkup
- **Obinna Kalu** - 3yo Male - URTI, cough
- **Chinedu Okafor** - 7yo Male - Well-child visit
- **Zara Nnamdi** - 9yo Female - Allergic rhinitis
- **Kofi Okafor** - 8yo Male - Routine health supervision
- **Total Patients:** 6 (all children ages 3-11)
- **EMR Records:** 3 (Asthma exacerbation, Well child visit, Allergic rhinitis)

---

### What Each Doctor Sees

#### 1. Dashboard Experience

**Dr. Aisha Yusuf (Pediatrics) Example:**
```
Good Morning, Dr. Yusuf!
─────────────────────────
Today is Friday, February 4, 2026 • Pediatrics

You have 6 patients under your care.

[Welcome banner in PURPLE gradient]

Quick Actions:
├─ New Patient
├─ Schedule
├─ Reports
├─ Settings
└─ New Consultation

Stats Cards (PERSONALIZED):
┌─────────────────────────┐
│ Today's Consultations: 5│
│ Pending EMRs: 2         │
│ Completed: 12           │
│ Total Patients: 6       │
└─────────────────────────┘
```

**Dr. Emeka Adeleke (Cardiology) Example:**
```
Good Morning, Dr. Adeleke!
───────────────────────────
Today is Friday, February 4, 2026 • Cardiology

You have 2 patients under your care.

[Welcome banner in RED gradient]

Stats Cards (PERSONALIZED):
┌─────────────────────────┐
│ Today's Consultations: 3│
│ Pending EMRs: 1         │
│ Completed: 4            │
│ Total Patients: 2       │
└─────────────────────────┘
```

#### 2. Notification System

When doctors log in, they receive **appointment notifications** from nurses who have scheduled patients.

**Notification Bell:**
- Located in the header (top right)
- Badge shows count of upcoming appointments
- Click to see appointment list
- Shows patient name, date, time, and type

**Example:**
```
Doctor logs in → Sees bell icon with badge "3"
                  ↓
           Clicks bell icon
                  ↓
   Dropdown shows:
   ┌────────────────────────────────┐
   │ Upcoming Appointments (3)      │
   ├────────────────────────────────┤
   │ 🔔 Tobi Okafor                 │
   │    Mon Feb 10 at 09:00         │
   │    [New Consultation]          │
   ├────────────────────────────────┤
   │ 🔔 Chisom Eze                  │
   │    Mon Feb 10 at 10:00         │
   │    [Follow-up]                 │
   ├────────────────────────────────┤
   │ 🔔 Zara Nnamdi                 │
   │    Tue Feb 11 at 14:00         │
   │    [Consultation]              │
   └────────────────────────────────┘
```

**How Notifications Work:**
1. Nurse creates appointment at `/triage`
2. Appointment is assigned to doctor
3. Next time doctor logs in → Notification count appears
4. Doctor can view all upcoming appointments
5. Click appointment → Goes to appointment details

#### 3. Patients Page

**What Dr. Yusuf sees:**
```
Patients (Dr. Yusuf's Patients)
────────────────────────────────
View and manage your 6 assigned patients

⚠ You can only view patients assigned to you in Pediatrics
[Warning box in PURPLE]

Table shows ONLY:
├─ Tobi Okafor (5yo) - MRN: P-007
├─ Chisom Eze (11yo) - MRN: P-008
├─ Obinna Kalu (3yo) - MRN: P-009
├─ Chinedu Okafor (7yo) - MRN: P-010
├─ Zara Nnamdi (9yo) - MRN: P-011
└─ Kofi Okafor (8yo) - MRN: P-012

(CANNOT see patients from other departments)
```

**What Administrator sees:**
```
Patients
─────────
Manage all patient records and information

(NO warnings - full access)

Table shows ALL 12 patients from all departments
```

#### 3. EMR Page

**What Dr. Yusuf sees:**
```
Electronic Medical Records (Dr. Yusuf's Records)
──────────────────────────────────────────────────
View and manage your 3 medical records

⚠ You can only view EMRs you created
[Warning box in PURPLE]

Table shows ONLY:
├─ Tobi Okafor - Childhood Asthma Exacerbation
├─ Chisom Eze - Routine Health Supervision
└─ Zara Nnamdi - Allergic Rhinitis

(CANNOT see EMRs from other doctors)
```

#### 4. Consultation Page

**What Dr. Yusuf sees:**
```
Doctor Consultation
───────────────────
Patient dropdown: Shows only her 6 pediatric patients
Doctor dropdown: Pre-selected to "Dr. Aisha Yusuf" (DISABLED)
Department: Pediatrics (implied)

[Info box: "You are logged in as Dr. Aisha Yusuf"]
[Style: Purple gradient background]

When creating consultation:
✓ Can only select from 6 assigned patients
✓ Automatically recorded as created by Dr. Yusuf
✓ EMR appears in her EMR list
```

**What Administrator sees:**
```
Doctor Consultation
───────────────────
Patient dropdown: Shows ALL 12 patients
Doctor dropdown: Can select ANY of 6 doctors
Department dropdown: Can select ANY department

(NO pre-selections - full flexibility)
```

#### 5. Laboratory Orders Page

**What Dr. Yusuf sees:**
```
Lab Test Orders
───────────────
Patient dropdown: Shows only her 6 patients
Doctor dropdown: Pre-selected to "Dr. Aisha Yusuf" (DISABLED)

[Warning: "Orders will be created under your name"]
[Style: Purple gradient]

Can create lab orders ONLY for:
├─ Tobi Okafor
├─ Chisom Eze
├─ Obinna Kalu
├─ Chinedu Okafor
├─ Zara Nnamdi
└─ Kofi Okafor
```

#### 6. Inpatient Admission Page

**What Dr. Yusuf sees:**
```
Patient Admission
─────────────────
You are admitting as Dr. Aisha Yusuf to Pediatrics Department

Patient dropdown: Shows only her 6 patients
Department dropdown: Pre-selected to "Pediatrics" (DISABLED)
Doctor dropdown: Pre-selected to "Dr. Aisha Yusuf" (DISABLED)

[Info box: "✓ You are pre-selected as the attending doctor"]
[Style: Purple gradient]

Department options: Pediatrics (ONLY)
```

**What Administrator sees:**
```
Patient Admission
─────────────────
Patient dropdown: Shows ALL 12 patients
Department dropdown: Can select from:
├─ Cardiology
├─ General Medicine
├─ Orthopedics
├─ Neurology
├─ Pediatrics
└─ ICU

Doctor dropdown: Can select ANY doctor

(NO restrictions)
```

---

## Data Flow Architecture

### Overall Data Flow

```
                     Raw Data (mockPatients, mockEMRs, mockAppointments, etc.)
                                      │
                                      ▼
                            ┌─────────────────────┐
                            │   AuthContext       │
                            │   (User Role)       │
                            │   - Administrator   │
                            │   - Doctor          │
                            └─────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
            ┌──────────────┐                   ┌──────────────┐
            │ Administrator │                   │   Doctor     │
            │   (Admin)    │                   │  (Any Dept)  │
            └──────────────┘                   └──────────────┘
                    │                                   │
                    │                                   │
                    ▼                                   ▼
           Return ALL data                   Filter by:
           (No filtering)                    • Patient assignments
                                               • Created EMRs
                                               • Department
                                               • User ID
```

### Key Filter Functions

```typescript
// File: lib/dataFilters.ts

// 1. Patient Filtering
export function filterPatientsByUser(user: User | null): Patient[] {
  if (!user) return [];
  if (user.role === 'Administrator') {
    return mockPatients; // ALL patients
  }
  // Doctors see ONLY assigned patients
  return mockPatients.filter(patient => {
    const assignedDoctor = patientDoctorAssignments[patient.id];
    return assignedDoctor === user.id;
  });
}

// 2. EMR Filtering
export function filterEMRsByUser(user: User | null, emrs: EMR[]): EMR[] {
  if (!user) return [];
  if (user.role === 'Administrator') {
    return emrs; // ALL EMRs
  }
  // Doctors see ONLY their created EMRs
  return emrs.filter(emr => {
    const assignedDoctor = emrDoctorAssignments[emr.id];
    return assignedDoctor === user.id;
  });
}

// 3. Appointment Filtering
export function filterAppointmentsByUser(user: User | null, appointments: Appointment[]): Appointment[] {
  if (!user) return [];
  if (user.role === 'Administrator') {
    return appointments; // ALL appointments
  }
  // Doctors see ONLY their appointments
  return appointments.filter(apt => apt.doctorId === user.id);
}

// 4. Patient Access Check
export function canUserViewPatient(user: User | null, patientId: string): boolean {
  if (!user) return false;
  if (user.role === 'Administrator') return true;
  const assignedDoctor = patientDoctorAssignments[patientId];
  return assignedDoctor === user.id;
}

// 5. EMR Access Check
export function canUserViewEMR(user: User | null, emrId: string): boolean {
  if (!user) return false;
  if (user.role === 'Administrator') return true;
  const assignedDoctor = emrDoctorAssignments[emrId];
  return assignedDoctor === user.id;
}
```

### Patient Assignment Mapping

```typescript
// File: lib/patientAssignments.ts

export const patientDoctorAssignments: Record<string, string> = {
  // Cardiology Patients → Dr. Adeleke
  '1': 'd1',  // Chukwuemeka Okonkwo (Hypertension, Diabetes)
  '5': 'd1',  // Olufemi Adebayo (Gastritis - also General Medicine)

  // General Medicine Patients → Dr. Ibrahim
  '2': 'd2',  // Amaka Okafor (Viral infection)
  '3': 'd2',  // Ngozi Eze (Malaria - also Orthopedics)

  // Orthopedics Patients → Dr. Okonkwo
  '3': 'd3',  // Ngozi Eze (Fracture - also General Medicine)
  '6': 'd3',  // Emeka Okafor (Osteoarthritis)

  // Neurology Patients → Dr. Nnamani
  '4': 'd5',  // Chioma Nnamani (Migraine)

  // Pediatrics Patients → Dr. Yusuf
  '7': 'd4',  // Tobi Okafor (5yo - Asthma)
  '8': 'd4',  // Chisom Eze (11yo - Checkup)
  '9': 'd4',  // Obinna Kalu (3yo - URTI)
  '10': 'd4', // Chinedu Okafor (7yo - Well-child)
  '11': 'd4', // Zara Nnamdi (9yo - Rhinitis)
  '12': 'd4', // Kofi Okafor (8yo - Routine supervision)
};

// Doctor IDs
export const DOCTOR_IDS = {
  ADELEKE: 'd1',      // Cardiology
  IBRAHIM: 'd2',      // General Medicine
  OKONKWO: 'd3',      // Orthopedics
  YUSUF: 'd4',        // Pediatrics
  NNAMANI: 'd5',      // Neurology
};
```

---

## Color Coding System

Each department has a unique color scheme for visual distinction and personalization.

### Department Color Schemes

| Department | Primary Color | Light | Border | Gradient | Text |
|------------|--------------|-------|--------|----------|------|
| **Cardiology** | `#EF4444` (Red) | `#FEE2E2` | `rgba(239, 68, 68, 0.2)` | Red gradient | `#991B1B` |
| **General Medicine** | `#3B82F6` (Blue) | `#DBEAFE` | `rgba(59, 130, 246, 0.2)` | Blue gradient | `#1E40AF` |
| **Orthopedics** | `#F59E0B` (Orange) | `#FEF3C7` | `rgba(245, 158, 11, 0.2)` | Orange gradient | `#92400E` |
| **Neurology** | `#10B981` (Green) | `#D1FAE5` | `rgba(16, 185, 129, 0.2)` | Green gradient | `#065F46` |
| **Pediatrics** | `#A855F7` (Purple) | `#E9D5FF` | `rgba(168, 85, 247, 0.2)` | Purple gradient | `#5B21B6` |
| **Administration** | `#6B7280` (Gray) | `#F3F4F6` | `rgba(107, 114, 128, 0.2)` | Gray gradient | `#374151` |
| **ICU** | `#8B5CF6` (Violet) | `#EDE9FE` | `rgba(139, 92, 246, 0.2)` | Violet gradient | `#5B21B6` |
| **Emergency** | `#DC2626` (Dark Red) | `#FEE2E2` | `rgba(220, 38, 38, 0.2)` | Dark red gradient | `#991B1B` |
| **Laboratory** | `#EC4899` (Pink) | `#FCE7F3` | `rgba(236, 72, 153, 0.2)` | Pink gradient | `#9F1239` |
| **Radiology** | `#6366F1` (Indigo) | `#E0E7FF` | `rgba(99, 102, 241, 0.2)` | Indigo gradient | `#4338CA` |
| **Pharmacy** | `#14B8A6` (Teal) | `#CCFBF1` | `rgba(20, 184, 166, 0.2)` | Teal gradient | `#0F766E` |

### Helper Functions

```typescript
// File: lib/departmentColors.ts

// Get color scheme for a department
export function getDepartmentColors(department: string): DepartmentColorScheme {
  return DEPARTMENT_COLORS[department] || DEPARTMENT_COLORS.General;
}

// Get department badge styles
export function getDepartmentBadgeStyle(department: string) {
  const colors = getDepartmentColors(department);
  return {
    backgroundColor: colors.light,
    color: colors.text,
    borderColor: colors.border,
  };
}

// Get department gradient background
export function getDepartmentGradient(department: string): string {
  const colors = getDepartmentColors(department);
  return colors.gradient;
}
```

### Where Colors Are Applied

1. **Dashboard Welcome Banner**
   - Administrator: Indigo gradient (`#6366F1 → #4F46E5`)
   - Dr. Adeleke: Red gradient (`#EF4444 → #DC2626`)
   - Dr. Yusuf: Purple gradient (`#A855F7 → #9333EA`)

2. **UserHeader Role Badge**
   - Shows department-specific background and border colors

3. **Warning/Info Boxes**
   - Patient page access warning
   - EMR page access warning
   - Consultation page info
   - Lab orders page warning
   - Admission page info

4. **Statistics Cards**
   - Hover effects use department colors

---

## Access Control Examples

### Scenario 1: Doctor Views Unauthorized Patient

**Action:** Dr. Yusuf tries to view Chukwuemeka Okonkwo (assigned to Dr. Adeleke)

**Flow:**
```
1. Dr. Yusuf logs in successfully
   ↓
2. Navigates to Patients page
   ↓
3. Sees ONLY her 6 pediatric patients in list
   (Chukwuemeka Okonkwo is NOT visible)
   ↓
4. Attempts to directly access: /patients/1
   ↓
5. Patient detail page loads
   ↓
6. System calls: filterPatientsByUser(user)
   Result: [7, 8, 9, 10, 11, 12] (her patients only)
   ↓
7. Searches for patient ID '1' in filtered list
   Result: NOT FOUND
   ↓
8. Displays Access Denied alert:
   ┌─────────────────────────────────────────┐
   │ ⚠ Access Denied                        │
   │─────────────────────────────────────────│
   │ You don't have permission to view this │
   │ patient's details. You can only view   │
   │ patients assigned to you.              │
   │                                         │
   │            [Go Back]                    │
   └─────────────────────────────────────────┘
```

### Scenario 2: Administrator Views Any Patient

**Action:** Administrator views any patient profile

**Flow:**
```
1. Admin logs in successfully
   ↓
2. Navigates to Patients page
   ↓
3. Sees ALL 12 patients in list
   ↓
4. Clicks on any patient (e.g., Chukwuemeka Okonkwo)
   ↓
5. Patient detail page loads
   ↓
6. System calls: filterPatientsByUser(user)
   User role = 'Administrator'
   Result: ALL patients returned
   ↓
7. Patient found successfully
   ↓
8. Displays complete patient profile with:
   ✓ Personal information
   ✓ Medical history
   ✓ All EMR records
   ✓ All appointments
   ✓ Full access to edit
```

### Scenario 3: Doctor Creates Consultation

**Action:** Dr. Adeleke creates a consultation for Chukwuemeka Okonkwo

**Flow:**
```
1. Dr. Adeleke logs in
   ↓
2. Navigates to /clinical/consultation
   ↓
3. Page loads with pre-selections:
   • Patient dropdown: Shows 2 assigned patients only
   • Doctor dropdown: "Dr. Emeka Adeleke" (DISABLED)
   ↓
4. Selects patient: "Chukwuemeka Okonkwo"
   ↓
5. Fills out consultation form:
   • Chief Complaint: "Chest pain"
   • Diagnosis: "Hypertension"
   • Treatment: "Amlodipine 10mg daily"
   ↓
6. Clicks "Save EMR"
   ↓
7. EMR is created with:
   • patientId: '1'
   • doctorId: 'd1' (Dr. Adeleke's ID)
   • date: today
   ↓
8. Redirects to EMR list
   ↓
9. New EMR appears in Dr. Adeleke's EMR list
   (Does NOT appear for other doctors)
```

### Scenario 4: Cross-Department Access Attempt

**Action:** Dr. Yusuf (Pediatrics) tries to order lab test for Ngozi Eze (Orthopedics patient)

**Flow:**
```
1. Dr. Yusuf logs in
   ↓
2. Navigates to /laboratory/orders
   ↓
3. Patient dropdown shows:
   • Tobi Okafor ✓
   • Chisom Eze ✓
   • Obinna Kalu ✓
   • Chinedu Okafor ✓
   • Zara Nnamdi ✓
   • Kofi Okafor ✓
   ✗ Ngozi Eze (NOT IN LIST - assigned to Dr. Okonkwo)
   ↓
4. Dr. Yusuf CANNOT select Ngozi Eze
   (Patient is not in accessible list)
   ↓
5. Can only order tests for her 6 pediatric patients
```

---

## Summary Comparison

### Administrator vs Doctor Access

| Feature | Administrator | Doctor |
|---------|--------------|--------|
| **Total Patients Visible** | All 12 | 1-6 (assigned only) |
| **Total EMRs Visible** | All 9 | Their own records only |
| **Dashboard Statistics** | Hospital-wide | Personalized to their patients |
| **Department Access** | All 10 departments | Their department only |
| **Color Theme** | Indigo (default) | Department-specific gradient |
| **Create EMR/Consultation** | Any patient, any department | Their assigned patients only |
| **View Patient Profile** | All patients | Assigned patients only |
| **Pre-selected Fields** | None | Doctor, department auto-selected |
| **Warning Messages** | None | Access restriction warnings |
| **Patient Dropdown** | All 12 patients | 1-6 patients (assigned) |
| **Doctor Dropdown** | Can select any 6 doctors | Pre-selected to self (disabled) |
| **Department Dropdown** | All departments | Their department (disabled for doctors) |
| **Lab Orders** | Can order for any patient | Can order for assigned patients only |
| **Admissions** | Can admit to any ward/department | Can admit to their department only |
| **Appointments** | View all hospital appointments | View their appointments only |

### Auxiliary Nurse Access

| Feature | Auxiliary Nurse |
|---------|----------------|
| **Total Patients Visible** | All 12 (for triage purposes) |
| **Total EMRs Visible** | None (cannot access EMR records) |
| **Dashboard Statistics** | Triage-focused (total patients, appointments, active doctors) |
| **Department Access** | View all departments (for assignment) |
| **Color Theme** | Pink gradient (`#EC4899` → `#DB2777`) |
| **Create EMR/Consultation** | Cannot create |
| **View Patient Profile** | All patients (for triage) |
| **Triage Patients** | Yes (main function) |
| **View Doctor Availability** | Yes (for scheduling) |
| **Schedule Appointments** | Yes (with available doctors) |
| **Receive Notifications** | No |
| **Patient Dropdown** | All 12 patients |
| **Doctor Dropdown** | Can select available doctors (based on schedule) |
| **Department Dropdown** | Auto-detected + manual override |

### Doctor-Specific Summary Table

| Doctor | Department | Patients | EMRs | Color | Patient Ages |
|--------|-----------|----------|------|-------|--------------|
| Dr. Adeleke | Cardiology | 2 | 2 | Red | 38, 45 |
| Dr. Ibrahim | General Medicine | 2 | 1 | Blue | 28, 52 |
| Dr. Okonkwo | Orthopedics | 2 | 1 | Orange | 58, 65 |
| Dr. Nnamani | Neurology | 1 | 1 | Green | 34 |
| Dr. Yusuf | Pediatrics | 6 | 3 | Purple | 3-11 (children) |

### Key Technical Components

``Authentication & Authorization:
├── AuthContext.tsx          - Global auth state management
├── ProtectedRoute.tsx       - Route protection component
├── departmentColors.ts      - Department color schemes
├── patientAssignments.ts    - Patient-to-doctor mapping
├── emrAssignments.ts        - EMR-to-doctor mapping
└── dataFilters.ts           - Filtering logic for all data types

Data Files:
├── mockData.ts             - All mock data (users, patients, doctors)
├── mockUsers (6 total)     - 1 Admin + 5 Doctors

UI Components with Role-Based Features:
├── Dashboard              - Personalized stats and welcome banner
├── Patients Page          - Filtered patient list
├── Patient Detail Page    - Access control for individual patients
├── EMR Page              - Filtered EMR records
├── Consultation Page     - Pre-selected doctor/department
├── Lab Orders Page       - Restricted patient selection
├── Admission Page        - Department restriction
├── Appointments Page     - Filtered appointments
└── UserHeader           - Role badge with department color

Error Handling:
├── ErrorBoundary.tsx     - Global error boundary
├── Access denied alerts  - Patient detail page
└── Warning info boxes    - Various pages
```

---

## Security & Data Isolation Summary

### Data Isolation Guarantees

```
DOCTOR A (Cardiology)           DOCTOR B (Pediatrics)
      │                              │
      │                              │
      ▼                              ▼
Can ONLY see:                  Can ONLY see:
• 2 Cardiology patients        • 6 Pediatric patients
• 2 Cardiology EMRs            • 3 Pediatric EMRs
• Cardiology appointments      • Pediatrics appointments
• Cardiology lab orders        • Pediatrics lab orders

      │                              │
      │                              │
      └──────┬────────────────────────┘
             │
             ▼
    ADMINISTRATOR
    Can see EVERYTHING from both doctors
```

### What This Achieves

1. **Data Privacy** - Each doctor works in isolation with their assigned patients
2. **Department Autonomy** - Departments operate independently
3. **Admin Oversight** - Administrator maintains full visibility
4. **User Experience** - Personalized interface per doctor
5. **Visual Distinction** - Color-coded departments
6. **Access Control** - Unauthorized access is blocked

---

## File Structure Reference

```
hospital-frontend/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx              # Login page with all accounts displayed
│   ├── (dashboard)/
│   │   └── page.tsx                  # Personalized dashboard
│   ├── patients/
│   │   ├── page.tsx                  # Filtered patient list
│   │   ├── [id]/
│   │   │   └── page.tsx              # Patient detail with access control
│   │   └── appointments/
│   │       ├── page.tsx              # Filtered appointments
│   │       └── calendar/
│   │           └── page.tsx          # Calendar view
│   ├── clinical/
│   │   ├── consultation/
│   │   │   └── page.tsx              # Doctor pre-selected
│   │   ├── emr/
│   │   │   └── page.tsx              # Filtered EMR list
│   │   └── inpatients/
│   │       └── admission/
│   │           └── page.tsx          # Department restriction
│   └── layout.tsx                    # Wrapped with AuthProvider + ErrorBoundary
│
├── components/
│   ├── layout/
│   │   ├── UserHeader.tsx            # Role badge + department color
│   │   └── MainLayout.tsx
│   ├── shared/
│   │   ├── ErrorBoundary.tsx         # Global error handler
│   │   └── ProtectedRoute.tsx        # Route protection
│   └── ...
│
└── lib/
    ├── contexts/
    │   └── AuthContext.tsx           # Authentication state
    ├── departmentColors.ts           # Department color schemes
    ├── patientAssignments.ts         # Patient-to-doctor mapping
    ├── emrAssignments.ts             # EMR-to-doctor mapping
    ├── dataFilters.ts                # All filtering logic
    └── mockData.ts                   # Users, patients, doctors data
```

---

## Testing Checklist

### Administrator Account
- [ ] Can view all 12 patients
- [ ] Can view all 9 EMR records
- [ ] Can access all departments
- [ ] Dashboard shows hospital-wide stats
- [ ] No access restrictions anywhere
- [ ] Can create records for any patient/department

### Doctor Accounts (Test with Dr. Yusuf - Pediatrics)
- [ ] Can only see 6 pediatric patients
- [ ] Can only see 3 pediatric EMRs
- [ ] Dashboard shows personalized stats (6 patients)
- [ ] Cannot view other doctors' patients
- [ ] Cannot view other departments' EMRs
- [ ] Patient dropdown shows only assigned patients
- [ ] Doctor dropdown pre-selected to self (disabled)
- [ ] Department pre-selected to Pediatrics (where applicable)
- [ ] Welcome banner uses purple gradient
- [ ] Warning boxes use purple color scheme
- [ ] Access denied alert when trying to view unauthorized patient

### Cross-Doctor Isolation
- [ ] Dr. Adeleke cannot see Dr. Yusuf's pediatric patients
- [ ] Dr. Yusuf cannot see Dr. Adeleke's cardiology patients
- [ ] EMRs are properly isolated
- [ ] Appointments are filtered correctly
- [ ] Lab orders restricted to assigned patients

---

## Conclusion

This Hospital Management System implements a **frontend-only role-based access control** system that:

1. **Authenticates** 6 users (1 Administrator + 5 Doctors)
2. **Filters data** based on user role and assignments
3. **Isolates departments** so doctors only see their patients
4. **Provides oversight** through Administrator's full access
5. **Personalizes experience** with department-specific colors
6. **Protects access** with authorization checks and error boundaries

The system is **production-ready for demonstration purposes** and showcases modern React/Next.js patterns including Context API, custom hooks, TypeScript, and Ant Design components.
