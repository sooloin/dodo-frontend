import { adminApiClient } from '@/admin/api/axios';

import type { CreateNotificationScheduleRequest, CreateNotificationScheduleResponse } from './model/types';

export async function createNotificationSchedule(
  body: CreateNotificationScheduleRequest,
): Promise<CreateNotificationScheduleResponse> {
  const response = await adminApiClient.post<CreateNotificationScheduleResponse>('/admin/notification-schedules', body);
  return response.data;
}
