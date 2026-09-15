import type { PageInfo } from '@/admin/lib/types';

export type AdminUserStatus = 'ACTIVE' | 'SUSPENDED' | 'DORMANT' | 'DELETED' | 'REGISTER';

export interface AdminUserListItem {
  userId: string;
  email: string;
  name: string;
  nickname: string;
  region: string;
  profileUrl: string | null;
  role: 'USER' | 'ADMIN';
  status: AdminUserStatus;
  userCreatedAt: string;
  /** 상태 변경 이력이 없으면 null */
  userStatusUpdatedAt: string | null;
  /** 기간 정지 상태가 아니면 null */
  suspendedEndAt: string | null;
}

export interface AdminUserListResponse {
  pageInfo: PageInfo;
  data: AdminUserListItem[];
}

export interface GetAdminUsersParams {
  keyword?: string;
  status?: AdminUserStatus;
  page?: number;
  size?: number;
  sort?: string;
}

export interface UpdateUserStatusRequest {
  status: AdminUserStatus;
}
