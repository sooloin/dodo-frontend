import axios from 'axios';

import { apiConfig } from '@/shared/config';

import { clearAdminTokens, getAdminRefreshToken, setAdminReissueTokens } from './token';

interface AdminReissueResponse {
  accessToken: string;
  refreshToken: string;
  /** OpenAPI 기준 초 단위 (POST /auth/reissue와 동일 스펙) */
  accessTokenExpiresIn: number;
}

let refreshPromise: Promise<string | null> | null = null;
let isRedirecting = false;

/** 어드민 refreshToken으로 재발급 — /auth/reissue는 role 구분 없이 토큰 쌍만으로 동작 */
export async function refreshAdminAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = getAdminRefreshToken();
  if (!refreshToken) {
    return null;
  }

  refreshPromise = (async () => {
    try {
      const response = await axios.post<AdminReissueResponse>(
        `${apiConfig.baseURL}/auth/reissue`,
        { refreshToken },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: apiConfig.timeout,
        },
      );

      setAdminReissueTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        accessTokenExpiresIn: response.data.accessTokenExpiresIn * 1000,
      });
      return response.data.accessToken;
    } catch (error) {
      console.error('[admin/auth/reissue] 실패', error);
      clearAdminTokens();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export function redirectToAdminLogin(): void {
  if (typeof window === 'undefined') return;
  if (isRedirecting) return;

  if (window.location.pathname === '/admin/login') return;

  isRedirecting = true;
  window.location.assign('/admin/login');
}
