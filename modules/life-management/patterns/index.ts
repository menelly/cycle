/**
 * LIFE MANAGEMENT - PATTERNS MODULE
 * 
 * Central export file for all pattern analysis functionality
 * including correlations, analytics, reports, and AI insights.
 */

// Analytics engine exports
// export { AnalyticsEngine } from './analytics';
// export { AIProcessor } from './ai_processor';

// ============================================================================
// PATTERN ANALYSIS TYPES
// ============================================================================

export interface AnalyticsData {
  period: {
    start: string;
    end: string;
    days: number;
  };
  summary: AnalyticsSummary;
  trends: AnalyticsTrends;
  patterns: AnalyticsPattern[];
  insights: string[];
  charts: Record<string, string>;
}

export interface AnalyticsSummary {
  totalEntries: number;
  avgDailyEntries: number;
  mostActiveDay: string;
  streakDays: number;
  completionRate: number;
}

export interface AnalyticsTrends {
  survival_trend: 'increasing' | 'decreasing' | 'stable';
  pain_trend: 'increasing' | 'decreasing' | 'stable';
  mood_trend: 'increasing' | 'decreasing' | 'stable';
  activity_trend: 'increasing' | 'decreasing' | 'stable';
}

export interface AnalyticsPattern {
  type: string;
  description: string;
  confidence: number;
  data: Record<string, any>;
}

export interface CorrelationAnalysis {
  metric1: string;
  metric2: string;
  correlation: number;
  significance: number;
  description: string;
  recommendations?: string[];
}

export interface HealthInsight {
  id: string;
  type: 'correlation' | 'trend' | 'pattern' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  data?: Record<string, any>;
}

// ============================================================================
// CHART TYPES
// ============================================================================

export interface ChartConfig {
  type: 'line' | 'bar' | 'scatter' | 'heatmap' | 'pie';
  title: string;
  xAxis: string;
  yAxis: string;
  data: ChartDataPoint[];
  options?: ChartOptions;
}

export interface ChartDataPoint {
  x: string | number;
  y: string | number;
  label?: string;
  color?: string;
}

export interface ChartOptions {
  showTrend?: boolean;
  showAverage?: boolean;
  colorScheme?: string[];
  responsive?: boolean;
  height?: number;
  width?: number;
}

// ============================================================================
// REPORT TYPES
// ============================================================================

export interface MedicalReport {
  id: string;
  title: string;
  dateRange: {
    start: string;
    end: string;
  };
  patient: {
    name: string;
    dateOfBirth: string;
    medicalRecordNumber?: string;
  };
  sections: ReportSection[];
  generatedAt: string;
  format: 'pdf' | 'html' | 'json';
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'summary' | 'chart' | 'table' | 'text' | 'timeline';
  content: any;
  priority: 'high' | 'medium' | 'low';
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  targetAudience: 'doctor' | 'insurance' | 'disability' | 'personal';
}

// ============================================================================
// ANALYTICS UTILITIES
// ============================================================================

/**
 * Calculate correlation between two data series
 */
export function calculateCorrelation(data1: number[], data2: number[]): number {
  if (data1.length !== data2.length || data1.length === 0) {
    return 0;
  }

  const n = data1.length;
  const sum1 = data1.reduce((a, b) => a + b, 0);
  const sum2 = data2.reduce((a, b) => a + b, 0);
  const sum1Sq = data1.reduce((a, b) => a + b * b, 0);
  const sum2Sq = data2.reduce((a, b) => a + b * b, 0);
  const pSum = data1.reduce((a, b, i) => a + b * data2[i], 0);

  const num = pSum - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));

  return den === 0 ? 0 : num / den;
}

/**
 * Calculate moving average
 */
export function calculateMovingAverage(data: number[], windowSize: number): number[] {
  const result: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = data.slice(start, i + 1);
    const average = window.reduce((a, b) => a + b, 0) / window.length;
    result.push(average);
  }
  
  return result;
}

/**
 * Detect trends in data
 */
export function detectTrend(data: number[]): 'increasing' | 'decreasing' | 'stable' {
  if (data.length < 2) return 'stable';
  
  const firstHalf = data.slice(0, Math.floor(data.length / 2));
  const secondHalf = data.slice(Math.floor(data.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const threshold = 0.1; // 10% change threshold
  const change = (secondAvg - firstAvg) / firstAvg;
  
  if (change > threshold) return 'increasing';
  if (change < -threshold) return 'decreasing';
  return 'stable';
}

/**
 * Find patterns in weekly data
 */
export function findWeeklyPatterns(data: Array<{ date: string; value: number }>): AnalyticsPattern | null {
  if (data.length < 14) return null; // Need at least 2 weeks
  
  const dayOfWeekData: Record<string, number[]> = {
    'Sunday': [],
    'Monday': [],
    'Tuesday': [],
    'Wednesday': [],
    'Thursday': [],
    'Friday': [],
    'Saturday': []
  };
  
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  data.forEach(entry => {
    const date = new Date(entry.date);
    const dayName = daysOfWeek[date.getDay()];
    dayOfWeekData[dayName].push(entry.value);
  });
  
  const weeklyAverages = daysOfWeek.map(day => {
    const values = dayOfWeekData[day];
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  });
  
  const maxDay = daysOfWeek[weeklyAverages.indexOf(Math.max(...weeklyAverages))];
  const minDay = daysOfWeek[weeklyAverages.indexOf(Math.min(...weeklyAverages))];
  
  const maxAvg = Math.max(...weeklyAverages);
  const minAvg = Math.min(...weeklyAverages);
  
  if (maxAvg > minAvg * 1.3) { // 30% difference threshold
    return {
      type: 'weekly_pattern',
      description: `Higher activity on ${maxDay}, lower on ${minDay}`,
      confidence: 0.7,
      data: {
        high_day: maxDay,
        low_day: minDay,
        averages: Object.fromEntries(daysOfWeek.map((day, i) => [day, weeklyAverages[i]]))
      }
    };
  }
  
  return null;
}

/**
 * Generate health insights from data
 */
export function generateHealthInsights(data: Record<string, any>): HealthInsight[] {
  const insights: HealthInsight[] = [];
  
  // Example insight generation logic
  if (data.pain_scores && data.pain_scores.length > 7) {
    const recentPain = data.pain_scores.slice(-7);
    const avgPain = recentPain.reduce((a: number, b: number) => a + b, 0) / recentPain.length;
    
    if (avgPain > 7) {
      insights.push({
        id: 'high_pain_week',
        type: 'trend',
        title: 'High Pain Week',
        description: `Your average pain level this week (${avgPain.toFixed(1)}) is higher than usual. Consider reviewing your pain management strategies.`,
        confidence: 0.8,
        actionable: true,
        data: { avgPain, recentPain }
      });
    }
  }
  
  return insights;
}

// ============================================================================
// REPORT UTILITIES
// ============================================================================

/**
 * Generate medical report template
 */
export function generateReportTemplate(type: 'doctor' | 'insurance' | 'disability'): ReportTemplate {
  const baseTemplate: ReportTemplate = {
    id: `${type}_report_${Date.now()}`,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
    description: `Medical report template for ${type} purposes`,
    sections: ['summary', 'symptoms', 'medications', 'timeline'],
    targetAudience: type
  };
  
  switch (type) {
    case 'doctor':
      baseTemplate.sections.push('recent_changes', 'questions');
      break;
    case 'insurance':
      baseTemplate.sections.push('functional_impact', 'treatment_history');
      break;
    case 'disability':
      baseTemplate.sections.push('functional_limitations', 'work_impact', 'daily_activities');
      break;
  }
  
  return baseTemplate;
}

/**
 * Export data for external analysis
 */
export function exportDataForAnalysis(data: Record<string, any>, format: 'csv' | 'json' | 'xlsx'): string {
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);
    case 'csv':
      // Simple CSV export - would need proper CSV library for production
      const headers = Object.keys(data);
      const rows = [headers.join(',')];
      // Add data rows here
      return rows.join('\n');
    default:
      return JSON.stringify(data, null, 2);
  }
}

// ============================================================================
// PATTERN ANALYSIS CONSTANTS
// ============================================================================

export const ANALYSIS_TYPES = {
  CORRELATION: 'correlation',
  TREND: 'trend',
  PATTERN: 'pattern',
  INSIGHT: 'insight'
} as const;

export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  SCATTER: 'scatter',
  HEATMAP: 'heatmap',
  PIE: 'pie'
} as const;

export const REPORT_FORMATS = {
  PDF: 'pdf',
  HTML: 'html',
  JSON: 'json'
} as const;
