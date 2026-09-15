import { useMutation } from '@tanstack/react-query';

import { setAdminTokens } from '@/admin/lib/token';

import { adminLogin } from '../api';
import type { AdminLoginRequest } from './types';

export function useAdminLogin() {
  return useMutation({
    mutationFn: (body: AdminLoginRequest) => adminLogin(body),
    onSuccess: (data) => {
      setAdminTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessTokenExpiresIn: data.accessTokenExpiresIn,
      });
    },
  });
}
