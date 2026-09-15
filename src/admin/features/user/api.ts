import { adminApiClient } from '@/admin/api/axios';
import type { AdminSimpleResponse } from '@/admin/lib/types';

import type { AdminUserListResponse, GetAdminUsersParams, UpdateUserStatusRequest } from './model/types';

export async function getAdminUsers(params?: GetAdminUsersParams): Promise<AdminUserListResponse> {
  const response = await adminApiClient.get<AdminUserListResponse>('/admin/users', { params });
  return response.data;
}

export async function updateUserStatus(userId: string, body: UpdateUserStatusRequest): Promise<AdminSimpleResponse> {
  const response = await adminApiClient.patch<AdminSimpleResponse>(`/admin/users/${userId}/status`, body);
  return response.data;
}
