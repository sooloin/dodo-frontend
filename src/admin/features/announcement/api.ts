import { adminApiClient } from '@/admin/api/axios';
import type { AdminSimpleResponse } from '@/admin/lib/types';

import type {
  AnnouncementDetailResponse,
  AnnouncementListResponse,
  CreateAnnouncementRequest,
  GetAnnouncementsParams,
  UpdateAnnouncementRequest,
} from './model/types';

export async function getAnnouncements(params?: GetAnnouncementsParams): Promise<AnnouncementListResponse> {
  const response = await adminApiClient.get<AnnouncementListResponse>('/admin/announcements', { params });
  return response.data;
}

export async function getAnnouncementDetail(boardId: number): Promise<AnnouncementDetailResponse> {
  const response = await adminApiClient.get<AnnouncementDetailResponse>(`/admin/announcements/${boardId}`);
  return response.data;
}

export async function createAnnouncement(body: CreateAnnouncementRequest): Promise<AdminSimpleResponse> {
  const response = await adminApiClient.post<AdminSimpleResponse>('/admin/announcements', body);
  return response.data;
}

export async function updateAnnouncement(
  boardId: number,
  body: UpdateAnnouncementRequest,
): Promise<AdminSimpleResponse> {
  const response = await adminApiClient.patch<AdminSimpleResponse>(`/admin/announcements/${boardId}`, body);
  return response.data;
}

export async function deleteAnnouncement(boardId: number): Promise<AdminSimpleResponse> {
  const response = await adminApiClient.delete<AdminSimpleResponse>(`/admin/announcements/${boardId}`);
  return response.data;
}
