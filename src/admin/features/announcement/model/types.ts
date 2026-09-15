import type { PageInfo } from '@/admin/lib/types';

export type NoticeTag = 'URGENT' | 'INFO';

// ---- 공지 목록 (GET /admin/announcements) ----
// 응답에 noticeTag가 내려오지 않아 목록/상세에서 태그를 표시할 수 없음 (생성 시에만 지정 가능)

export interface AnnouncementListItem {
  boardId: number;
  boardTitle: string;
  boardContent: string;
  imageFileUrl: string | null;
  viewCount: number;
  boardCreatedAt: string;
}

export interface AnnouncementListResponse {
  pageInfo: PageInfo;
  data: AnnouncementListItem[];
  message: string;
}

export interface GetAnnouncementsParams {
  page?: number;
  size?: number;
  sort?: string;
}

// ---- 공지 상세 (GET /admin/announcements/{boardId}) ----

export interface AnnouncementDetailResponse {
  boardId: number;
  boardTitle: string;
  boardContent: string;
  imageFileUrl: string | null;
  viewCount: number;
  boardCreatedAt: string;
  boardModifiedAt: string;
  message: string;
}

// ---- 공지 작성 (POST /admin/announcements) ----

export interface CreateAnnouncementRequest {
  boardTitle: string;
  boardContent: string;
  imageFileUrl?: string;
  viewCount?: number;
  noticeTag?: NoticeTag;
}

// ---- 공지 수정 (PATCH /admin/announcements/{boardId}) ----
// noticeTag는 수정 대상에서 제외되어 있음 (생성 시에만 설정 가능)

export interface UpdateAnnouncementRequest {
  boardTitle?: string;
  boardContent?: string;
  imageFileUrl?: string;
}
