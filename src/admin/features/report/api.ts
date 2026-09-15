import { adminApiClient } from '@/admin/api/axios';

import type {
  AdminReportListResponse,
  AdminSimpleResponse,
  BoardReportDetailResponse,
  CommentReportDetailResponse,
  GetAdminReportsParams,
  UpdateReportStatusRequest,
} from './model/types';

export async function getAdminReports(params: GetAdminReportsParams): Promise<AdminReportListResponse> {
  const response = await adminApiClient.get<AdminReportListResponse>('/admin/reports', { params });
  return response.data;
}

export async function getBoardReportDetail(boardId: number): Promise<BoardReportDetailResponse> {
  const response = await adminApiClient.get<BoardReportDetailResponse>(`/admin/reports/board/${boardId}`);
  return response.data;
}

export async function getCommentReportDetail(commentId: number): Promise<CommentReportDetailResponse> {
  const response = await adminApiClient.get<CommentReportDetailResponse>(`/admin/reports/comment/${commentId}`);
  return response.data;
}

export async function updateReportStatus(
  reportId: number,
  body: UpdateReportStatusRequest,
): Promise<AdminSimpleResponse> {
  const response = await adminApiClient.patch<AdminSimpleResponse>(`/admin/reports/${reportId}/status`, body);
  return response.data;
}

export async function forceDeleteBoard(boardId: number): Promise<AdminSimpleResponse> {
  const response = await adminApiClient.delete<AdminSimpleResponse>(`/admin/boards/${boardId}`);
  return response.data;
}

export async function forceDeleteComment(commentId: number): Promise<AdminSimpleResponse> {
  const response = await adminApiClient.delete<AdminSimpleResponse>(`/admin/comments/${commentId}`);
  return response.data;
}
