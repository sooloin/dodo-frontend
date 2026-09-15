import type { AdminUserStatus } from '../model/types';

export const USER_STATUS_LABELS: Record<AdminUserStatus, string> = {
  ACTIVE: '활성',
  SUSPENDED: '정지',
  DORMANT: '휴면',
  DELETED: '탈퇴',
  REGISTER: '가입중',
};

export const USER_STATUS_OPTIONS: AdminUserStatus[] = ['ACTIVE', 'SUSPENDED', 'DORMANT', 'DELETED', 'REGISTER'];
