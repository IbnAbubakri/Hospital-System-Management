/**
 * Report Filtering Utilities
 *
 * Functions to filter report data based on logged-in user's role and department
 * Following the pattern of dataFilters.ts
 */

// User type (matching dataFilters.ts)
interface User {
  id: string;
  role: string;
  department?: string;
  firstName: string;
  lastName: string;
}

// Report data interfaces
interface FinancialData {
  id: string;
  department?: string;
  category: string;
  item: string;
  amount: number;
  change: number;
  changePercent: number;
}

interface ClinicalReport {
  id: string;
  reportName: string;
  category: 'clinical' | 'operational' | 'financial' | 'inventory';
  generatedBy: string;
  generatedDate: Date;
  status: 'ready' | 'generating';
  fileUrl: string;
  department?: string;
  isTriageRelated?: boolean;
}

interface PatientStats {
  id: string;
  ageGroup: string;
  count: number;
  percentage: number;
  department?: string;
}

interface DoctorMetrics {
  id: string;
  doctorId: string;
  doctorName: string;
  department: string;
  patientsSeen: number;
  averageTime: number;
  satisfactionRate: number;
  outcomes: number;
}

interface DiseaseTrend {
  id: string;
  diseaseName: string;
  category: 'communicable' | 'non-communicable' | 'chronic';
  count: number;
  department?: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface UtilizationData {
  id: string;
  resourceType: 'bed' | 'equipment' | 'room' | 'facility';
  resourceName: string;
  department?: string;
  utilized: number;
  capacity: number;
  percentage: number;
  isTriageRelated?: boolean;
}

/**
 * Filter financial data based on logged-in user
 * - Administrator: sees all financial data
 * - Doctor: sees only their department's financial data
 * - AuxiliaryNurse: no access (returns empty array)
 */
export function filterFinancialDataByUser(user: User | null, data: FinancialData[]): FinancialData[] {
  if (!user) return [];

  // Admin sees all financial data
  if (user.role === 'Administrator') {
    return data;
  }

  // Doctors see only their department's financial data
  if (user.role === 'Doctor' && user.department) {
    return data.filter(item => item.department === user.department);
  }

  // AuxiliaryNurses have no access to financial data
  return [];
}

/**
 * Filter clinical reports based on logged-in user
 * - Administrator: sees all clinical reports
 * - Doctor: sees only their department's clinical reports
 * - AuxiliaryNurse: sees only triage-related clinical reports
 */
export function filterClinicalReportsByUser(user: User | null, data: ClinicalReport[]): ClinicalReport[] {
  if (!user) return [];

  // Admin sees all clinical reports
  if (user.role === 'Administrator') {
    return data;
  }

  // Doctors see only their department's clinical reports
  if (user.role === 'Doctor' && user.department) {
    return data.filter(report => report.department === user.department);
  }

  // AuxiliaryNurses see only triage-related clinical reports
  if (user.role === 'AuxiliaryNurse') {
    return data.filter(report => report.isTriageRelated === true);
  }

  return [];
}

/**
 * Filter patient statistics based on logged-in user
 * - Administrator: sees all patient statistics
 * - Doctor: sees only their department's patient statistics
 * - AuxiliaryNurse: sees all patient statistics (for triage duties)
 */
export function filterPatientStatsByUser(user: User | null, data: PatientStats[]): PatientStats[] {
  if (!user) return [];

  // Admin sees all patient statistics
  if (user.role === 'Administrator') {
    return data;
  }

  // AuxiliaryNurses see all patient statistics for triage purposes
  if (user.role === 'AuxiliaryNurse') {
    return data;
  }

  // Doctors see only their department's patient statistics
  if (user.role === 'Doctor' && user.department) {
    return data.filter(stat => !stat.department || stat.department === user.department);
  }

  return [];
}

/**
 * Filter doctor metrics based on logged-in user
 * - Administrator: sees all doctor metrics
 * - Doctor: sees only their own metrics
 * - AuxiliaryNurse: sees all doctor metrics (for scheduling purposes)
 */
export function filterDoctorMetricsByUser(user: User | null, data: DoctorMetrics[]): DoctorMetrics[] {
  if (!user) return [];

  // Admin sees all doctor metrics
  if (user.role === 'Administrator') {
    return data;
  }

  // AuxiliaryNurses see all doctor metrics for scheduling purposes
  if (user.role === 'AuxiliaryNurse') {
    return data;
  }

  // Doctors see only their own metrics
  if (user.role === 'Doctor') {
    return data.filter(metric => metric.doctorId === user.id);
  }

  return [];
}

/**
 * Filter disease trends based on logged-in user
 * - Administrator: sees all disease trends
 * - Doctor: sees only their department's disease trends
 * - AuxiliaryNurse: sees only communicable disease trends (for triage/infection control)
 */
export function filterDiseaseTrendsByUser(user: User | null, data: DiseaseTrend[]): DiseaseTrend[] {
  if (!user) return [];

  // Admin sees all disease trends
  if (user.role === 'Administrator') {
    return data;
  }

  // AuxiliaryNurses see only communicable diseases for infection control
  if (user.role === 'AuxiliaryNurse') {
    return data.filter(trend => trend.category === 'communicable');
  }

  // Doctors see only their department's disease trends
  if (user.role === 'Doctor' && user.department) {
    return data.filter(trend => !trend.department || trend.department === user.department);
  }

  return [];
}

/**
 * Filter utilization data based on logged-in user
 * - Administrator: sees all utilization data
 * - Doctor: sees only their department's utilization
 * - AuxiliaryNurse: sees only bed utilization and triage-related facilities
 */
export function filterUtilizationByUser(user: User | null, data: UtilizationData[]): UtilizationData[] {
  if (!user) return [];

  // Admin sees all utilization data
  if (user.role === 'Administrator') {
    return data;
  }

  // AuxiliaryNurses see only bed utilization and triage-related facilities
  if (user.role === 'AuxiliaryNurse') {
    return data.filter(item =>
      item.resourceType === 'bed' || item.isTriageRelated === true
    );
  }

  // Doctors see only their department's utilization
  if (user.role === 'Doctor' && user.department) {
    return data.filter(item => !item.department || item.department === user.department);
  }

  return [];
}

/**
 * Check if user can view a specific report type
 */
export function canUserViewReport(user: User | null, reportType: string): boolean {
  if (!user) return false;

  // Admin can view all reports
  if (user.role === 'Administrator') {
    return true;
  }

  // Define report access by role
  const roleReportAccess: Record<string, string[]> = {
    Doctor: [
      'clinical',
      'patient-stats',
      'doctor-metrics',
      'disease-trends',
      'outcomes',
      'utilization',
    ],
    AuxiliaryNurse: [
      'patient-stats',
      'utilization',
    ],
  };

  const allowedReports = roleReportAccess[user.role] || [];
  return allowedReports.includes(reportType);
}

/**
 * Get report data summary with filtering metadata
 * Returns information about what data is being shown
 */
export function getReportDataSummary(user: User | null, reportType: string, totalCount: number, filteredCount: number): {
  isFiltered: boolean;
  filterReason: string;
  filterScope: string;
  userRole: string;
  userDepartment?: string;
} {
  if (!user) {
    return {
      isFiltered: false,
      filterReason: 'Not authenticated',
      filterScope: 'None',
      userRole: 'None',
    };
  }

  // Admin sees all data
  if (user.role === 'Administrator') {
    return {
      isFiltered: false,
      filterReason: 'None',
      filterScope: 'All data',
      userRole: user.role,
    };
  }

  // Determine filtering reason based on role and report type
  let filterReason = 'None';
  let filterScope = 'All data';

  if (user.role === 'Doctor') {
    filterReason = `Doctor in ${user.department || 'your'} department`;
    filterScope = `${user.department || 'your'} department only`;
  } else if (user.role === 'AuxiliaryNurse') {
    if (reportType === 'clinical') {
      filterReason = 'Triage-related reports only';
      filterScope = 'Triage-related data';
    } else if (reportType === 'disease-trends') {
      filterReason = 'Communicable diseases only';
      filterScope = 'Communicable diseases';
    } else if (reportType === 'utilization') {
      filterReason = 'Bed utilization and triage facilities';
      filterScope = 'Beds and triage facilities';
    } else {
      filterReason = 'Triage duties access';
      filterScope = 'Triage-related data';
    }
  }

  const isFiltered = totalCount !== filteredCount || user.role !== 'Administrator';

  return {
    isFiltered,
    filterReason,
    filterScope,
    userRole: user.role,
    userDepartment: user.department,
  };
}

/**
 * Get financial summary for a user
 * Returns total revenue filtered by user role
 */
export function getFinancialSummaryForUser(user: User | null, data: FinancialData[]): {
  totalRevenue: number;
  totalChange: number;
  averageChangePercent: number;
  itemCount: number;
} {
  const filteredData = filterFinancialDataByUser(user, data);

  const totalRevenue = filteredData.reduce((sum, item) => sum + item.amount, 0);
  const totalChange = filteredData.reduce((sum, item) => sum + item.change, 0);
  const averageChangePercent = filteredData.length > 0
    ? filteredData.reduce((sum, item) => sum + item.changePercent, 0) / filteredData.length
    : 0;

  return {
    totalRevenue,
    totalChange,
    averageChangePercent,
    itemCount: filteredData.length,
  };
}

/**
 * Get clinical report count for a user
 */
export function getClinicalReportCountForUser(user: User | null, data: ClinicalReport[]): {
  total: number;
  ready: number;
  generating: number;
} {
  const filteredData = filterClinicalReportsByUser(user, data);

  return {
    total: filteredData.length,
    ready: filteredData.filter(r => r.status === 'ready').length,
    generating: filteredData.filter(r => r.status === 'generating').length,
  };
}

/**
 * Get patient statistics summary for a user
 */
export function getPatientStatsSummaryForUser(user: User | null, data: PatientStats[]): {
  totalPatients: number;
  averageAge: number;
  departmentCount: number;
} {
  const filteredData = filterPatientStatsByUser(user, data);

  const totalPatients = filteredData.reduce((sum, stat) => sum + stat.count, 0);
  const averageAge = filteredData.length > 0
    ? filteredData.reduce((sum, stat) => {
        const midAge = getMidAge(stat.ageGroup);
        return sum + (midAge * stat.count);
      }, 0) / totalPatients
    : 0;

  const departments = new Set(filteredData.map(stat => stat.department).filter(Boolean));

  return {
    totalPatients,
    averageAge: Math.round(averageAge),
    departmentCount: departments.size,
  };
}

/**
 * Helper function to get mid-point of age group
 */
function getMidAge(ageGroup: string): number {
  const match = ageGroup.match(/(\d+)-(\d+)/);
  if (match) {
    return (parseInt(match[1]) + parseInt(match[2])) / 2;
  }
  return 0; // Default for non-matching patterns
}

/**
 * Get doctor performance metrics for a user
 */
export function getDoctorMetricsForUser(user: User | null, data: DoctorMetrics[]): {
  totalPatientsSeen: number;
  averageSatisfactionRate: number;
  averageConsultationTime: number;
  totalDoctors: number;
} {
  const filteredData = filterDoctorMetricsByUser(user, data);

  if (filteredData.length === 0) {
    return {
      totalPatientsSeen: 0,
      averageSatisfactionRate: 0,
      averageConsultationTime: 0,
      totalDoctors: 0,
    };
  }

  const totalPatientsSeen = filteredData.reduce((sum, metric) => sum + metric.patientsSeen, 0);
  const averageSatisfactionRate = filteredData.reduce((sum, metric) => sum + metric.satisfactionRate, 0) / filteredData.length;
  const averageConsultationTime = filteredData.reduce((sum, metric) => sum + metric.averageTime, 0) / filteredData.length;

  return {
    totalPatientsSeen,
    averageSatisfactionRate: Math.round(averageSatisfactionRate * 10) / 10,
    averageConsultationTime: Math.round(averageConsultationTime),
    totalDoctors: filteredData.length,
  };
}

/**
 * Get disease trends summary for a user
 */
export function getDiseaseTrendsSummaryForUser(user: User | null, data: DiseaseTrend[]): {
  totalCases: number;
  increasingTrends: number;
  decreasingTrends: number;
  stableTrends: number;
  mostCommonCategory: string;
} {
  const filteredData = filterDiseaseTrendsByUser(user, data);

  const totalCases = filteredData.reduce((sum, trend) => sum + trend.count, 0);
  const increasingTrends = filteredData.filter(t => t.trend === 'increasing').length;
  const decreasingTrends = filteredData.filter(t => t.trend === 'decreasing').length;
  const stableTrends = filteredData.filter(t => t.trend === 'stable').length;

  // Find most common category
  const categoryCounts = filteredData.reduce((acc, trend) => {
    acc[trend.category] = (acc[trend.category] || 0) + trend.count;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  return {
    totalCases,
    increasingTrends,
    decreasingTrends,
    stableTrends,
    mostCommonCategory,
  };
}

/**
 * Get utilization summary for a user
 */
export function getUtilizationSummaryForUser(user: User | null, data: UtilizationData[]): {
  averageUtilizationRate: number;
  totalCapacity: number;
  totalUtilized: number;
  underutilizedResources: number;
  overutilizedResources: number;
} {
  const filteredData = filterUtilizationByUser(user, data);

  if (filteredData.length === 0) {
    return {
      averageUtilizationRate: 0,
      totalCapacity: 0,
      totalUtilized: 0,
      underutilizedResources: 0,
      overutilizedResources: 0,
    };
  }

  const totalCapacity = filteredData.reduce((sum, item) => sum + item.capacity, 0);
  const totalUtilized = filteredData.reduce((sum, item) => sum + item.utilized, 0);
  const averageUtilizationRate = (totalUtilized / totalCapacity) * 100;
  const underutilizedResources = filteredData.filter(item => item.percentage < 50).length;
  const overutilizedResources = filteredData.filter(item => item.percentage > 90).length;

  return {
    averageUtilizationRate: Math.round(averageUtilizationRate),
    totalCapacity,
    totalUtilized,
    underutilizedResources,
    overutilizedResources,
  };
}
