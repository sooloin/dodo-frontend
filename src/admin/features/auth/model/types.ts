// ---- 어드민 로그인 (POST /auth/admin-login) ----

// TODO(백엔드 확인): 요청 필드명(email/loginId 등)이 스펙에 명시돼 있지 않아 email+password로 가정
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  refreshToken: string;
  /** TODO(백엔드 확인): 단위가 ms인지 초인지 스펙에 명시 없음 — social-login(ms) 기준으로 가정 */
  accessTokenExpiresIn: number;
  role: 'ADMIN';
}
