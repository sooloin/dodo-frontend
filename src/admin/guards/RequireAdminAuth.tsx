import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { clearAdminTokens, getAdminAccessToken } from '@/admin/lib/token';

type RequireAdminAuthProps = {
  children: ReactNode;
};

export function RequireAdminAuth({ children }: RequireAdminAuthProps) {
  const location = useLocation();
  const hasAccess = typeof window !== 'undefined' && Boolean(getAdminAccessToken());

  if (!hasAccess) {
    clearAdminTokens();
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
