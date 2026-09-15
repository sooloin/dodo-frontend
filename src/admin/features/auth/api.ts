import { adminApiClient } from '@/admin/api/axios';

import type { AdminLoginRequest, AdminLoginResponse } from './model/types';

/** 관리자 로그인 (POST /auth/admin-login) */
export async function adminLogin(body: AdminLoginRequest): Promise<AdminLoginResponse> {
  const response = await adminApiClient.post<AdminLoginResponse>('/auth/admin-login', body, {
    skipAuthAttach: true,
    skipAuthRefresh: true,
  });

  return response.data;
}
