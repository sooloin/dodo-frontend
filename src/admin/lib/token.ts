// 유저 세션(shared/lib/auth/token.ts)과 완전히 분리된 어드민 전용 토큰 저장소
// - 같은 브라우저에서 유저 로그인과 어드민 로그인을 동시에 유지할 수 있도록 별도 storage 키 사용
const ACCESS_TOKEN_KEY = 'admin.accessToken';
const REFRESH_TOKEN_KEY = 'admin.refreshToken';
const ACCESS_TOKEN_EXPIRES_AT_KEY = 'admin.accessTokenExpiresAt';
const ACCESS_TOKEN_TTL_MS_KEY = 'admin.accessTokenTtlMs';

/** 만료 임박 시 선제 refresh를 트리거하는 버퍼(ms) */
const ACCESS_TOKEN_REFRESH_BUFFER_MS = 60_000;

interface StoredAdminAuth {
  accessToken: string;
  refreshToken: string;
  /** ms 단위 */
  accessTokenExpiresIn: number;
}

function setAccessTokenExpiry(expiresInMs: number): void {
  const expiresAt = Date.now() + expiresInMs;
  localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, String(expiresAt));
  localStorage.setItem(ACCESS_TOKEN_TTL_MS_KEY, String(expiresInMs));
}

function getRefreshBufferMs(): number {
  const ttlRaw = localStorage.getItem(ACCESS_TOKEN_TTL_MS_KEY);
  const ttlMs = ttlRaw ? Number(ttlRaw) : NaN;
  if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
    return ACCESS_TOKEN_REFRESH_BUFFER_MS;
  }

  return Math.min(ACCESS_TOKEN_REFRESH_BUFFER_MS, Math.max(5_000, Math.floor(ttlMs * 0.1)));
}

export function getAccessTokenExpiresAt(): number | null {
  const raw = localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
  if (!raw) return null;

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isAccessTokenExpired(bufferMs = getRefreshBufferMs()): boolean {
  const expiresAt = getAccessTokenExpiresAt();
  if (expiresAt === null) return false;

  const remaining = expiresAt - Date.now();
  if (remaining <= 0) return true;

  return remaining <= bufferMs;
}

export function setAdminTokens(auth: StoredAdminAuth): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
  setAccessTokenExpiry(auth.accessTokenExpiresIn);
}

export function setAdminReissueTokens(tokens: StoredAdminAuth): void {
  setAdminTokens(tokens);
}

export function getAdminAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getAdminRefreshToken(): string | null {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function hasAdminAuthSession(): boolean {
  return Boolean(getAdminAccessToken()) && Boolean(getAdminRefreshToken());
}

export function clearAdminTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
  localStorage.removeItem(ACCESS_TOKEN_TTL_MS_KEY);
}
