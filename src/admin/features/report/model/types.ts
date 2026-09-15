import type { PageInfo } from '@/admin/lib/types';
import type { ReportReason } from '@/features/report/model/types';

export type { AdminSimpleResponse } from '@/admin/lib/types';

// 유저(작성자) 신고는 스코프에서 제외 — BOARD/COMMENT만 다룸
export type AdminReportType = 'BOARD' | 'COMMENT';
export type AdminReportStatus = 'PENDING' | 'COMPLETED';

export interface UserInfo {
  userId: string;
  nickname: string;
}

// ---- 신고 목록 (GET /admin/reports) ----

export interface ReportTargetInfo {
  /** 숫자 ID를 문자열로 반환 */
  id: string;
  summary: string;
}

export interface AdminReportListItem {
  reportType: AdminReportType;
  targetInfo: ReportTargetInfo;
  reportedUser: UserInfo;
  totalReportCount: number;
  representativeReason: ReportReason;
  reportStatus: AdminReportStatus;
  lastReportedAt: string;
}

export interface AdminReportListResponse {
  pageInfo: PageInfo;
  data: AdminReportListItem[];
}

export interface GetAdminReportsParams {
  reportType: AdminReportType;
  reportStatus?: AdminReportStatus;
  page?: number;
  size?: number;
  sort?: string;
}

// ---- 개별 신고 레코드 (신고 상세 공통) ----

export interface ReportDetailItem {
  reportId: number;
  reporterInfo: UserInfo;
  reportReason: ReportReason;
  reportStatus: AdminReportStatus;
  reportCreatedAt: string;
}

// ---- 게시글 신고 상세 (GET /admin/reports/board/{boardId}) ----

export interface BoardInfo {
  boardTitle: string;
  boardContent: string;
  boardCreatedAt: string;
}

export interface BoardReportDetailResponse {
  boardId: number;
  boardInfo: BoardInfo;
  reportedUserInfo: UserInfo;
  totalReportCount: number;
  reports: ReportDetailItem[];
}

// ---- 댓글 신고 상세 (GET /admin/reports/comment/{commentId}) ----

export interface CommentReportItem {
  reportId: number;
  /** 신고자 유저 정보가 없으면 null */
  reporterNickname: string | null;
  reportReason: ReportReason;
  reportCreatedAt: string;
}

export interface CommentReportDetailResponse {
  commentId: number;
  commentContent: string;
  /** 댓글 작성자 유저 정보가 없으면 null */
  reportedNickname: string | null;
  totalReportCount: number;
  reports: CommentReportItem[];
}

// ---- 신고 처리 상태 변경 (PATCH /admin/reports/{reportId}/status) ----

export interface UpdateReportStatusRequest {
  status: AdminReportStatus;
}
