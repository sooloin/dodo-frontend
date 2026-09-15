const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  WALKING: '산책',
  RUNNING: '달리기',
};

const ACTIVITY_STATUS_LABELS: Record<string, string> = {
  COMPLETED: '완료',
  CANCELED: '취소됨',
  IN_PROGRESS: '진행 중',
};

export function formatActivityTypeLabel(activityType: string): string {
  return ACTIVITY_TYPE_LABELS[activityType] ?? activityType;
}

export function formatActivityStatusLabel(status: string): string {
  return ACTIVITY_STATUS_LABELS[status] ?? status;
}

export function formatDistanceLabel(distanceKm: number): string {
  return `${distanceKm.toFixed(2)}km`;
}

export function formatDateTimeLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/** 시작~종료 시각으로 활동 소요 시간을 "N시간 M분" 형태로 계산 */
export function formatDurationLabel(startAt: string, endAt: string): string {
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return '-';

  const totalMinutes = Math.round((end - start) / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}
