import type { HealthAnalysisType } from '@/features/auth';

const ANALYSIS_TYPE_LABELS: Record<string, string> = {
  DAILY: '일간',
  WEEKLY: '주간',
  MONTHLY: '월간',
};

const ANALYSIS_STATUS_LABELS: Record<string, string> = {
  PENDING: '분석 중',
  COMPLETED: '완료',
  FAILED: '실패',
};

export const HEALTH_ANALYSIS_TYPE_OPTIONS: HealthAnalysisType[] = ['DAILY', 'WEEKLY', 'MONTHLY'];

export function formatAnalysisTypeLabel(type: string) {
  return ANALYSIS_TYPE_LABELS[type] ?? type;
}

export function formatAnalysisStatusLabel(status: string) {
  return ANALYSIS_STATUS_LABELS[status] ?? status;
}

export function formatHealthAnalysisDisplayTitle(petName: string, analysisType: string) {
  return `${petName}의 ${formatAnalysisTypeLabel(analysisType)} 건강 분석 리포트`;
}

export function formatAnalysisDate(value: string) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
