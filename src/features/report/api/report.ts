import { apiClient } from '@/shared/api/axios';

import type { ReportCreateRequest, ReportSimpleResponse } from '../model/types';

export async function reportBoard(boardId: number, payload: ReportCreateRequest): Promise<ReportSimpleResponse> {
  const response = await apiClient.post<ReportSimpleResponse>(`/reports/board/${boardId}`, payload);
  return response.data;
}

export async function reportComment(commentId: number, payload: ReportCreateRequest): Promise<ReportSimpleResponse> {
  const response = await apiClient.post<ReportSimpleResponse>(`/reports/comment/${commentId}`, payload);
  return response.data;
}
