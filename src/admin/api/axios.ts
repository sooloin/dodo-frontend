import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { apiConfig } from '@/shared/config';

import { refreshAdminAccessToken, redirectToAdminLogin } from '../lib/refreshSession';
import { getAdminAccessToken, isAccessTokenExpired } from '../lib/token';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** true면 Authorization 미첨부·선제 reissue 생략 (admin-login 등) */
    skipAuthAttach?: boolean;
    /** true면 401 시 재발급·재시도를 하지 않음 */
    skipAuthRefresh?: boolean;
    _retry?: boolean;
  }
}

function isPublicAdminAuthPath(url: string | undefined): boolean {
  if (!url) return false;
  return url.includes('/auth/admin-login') || url.includes('/auth/reissue');
}

/**
 * 어드민 전용 Axios 인스턴스
 * - shared/api/axios(유저용)와 완전히 분리된 인터셉터·토큰 저장소 사용
 */
export const adminApiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function attachAdminAccessToken(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
  const url = config.url ?? '';

  if (config.skipAuthAttach || isPublicAdminAuthPath(url)) {
    if (config.headers) {
      if (typeof config.headers.delete === 'function') {
        config.headers.delete('Authorization');
      } else {
        delete config.headers.Authorization;
      }
    }
    return config;
  }

  if (config.headers?.Authorization) {
    return config;
  }

  let token = getAdminAccessToken();

  if (token && isAccessTokenExpired() && !config.skipAuthRefresh) {
    const refreshed = await refreshAdminAccessToken();
    token = refreshed ?? getAdminAccessToken();
  }

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

adminApiClient.interceptors.request.use(
  async (config) => attachAdminAccessToken(config),
  (error) => Promise.reject(error),
);

/**
 * Response Interceptor
 * - 401 시 refresh 후 원 요청 1회 재시도, 실패하면 /admin/login으로 이동
 */
adminApiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig | undefined;

    if (
      !originalRequest ||
      originalRequest.skipAuthRefresh ||
      originalRequest._retry ||
      error.response?.status !== 401
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const newToken = await refreshAdminAccessToken();
    if (!newToken) {
      redirectToAdminLogin();
      return Promise.reject(error);
    }

    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = `Bearer ${newToken}`;

    return adminApiClient(originalRequest);
  },
);
