export interface PetSummary {
  id: number;
  name: string;
  age: number;
  profileImageUrl: string | null;
}

export interface ActivityHistorySummary {
  historyId: number;
  activityType: string;
  /** km */
  distance: number;
  activityHistoryStartAt: string;
  activityHistoryEndAt: string;
  activityHistoryStatus: string;
  reactionCount: number;
  heartAverage: number | null;
  pet: PetSummary;
}

export interface GetActivityHistoryListParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface ActivityHistoryPageResponse {
  histories: ActivityHistorySummary[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}

export interface GetNearbyPopularActivitiesParams {
  latitude: number;
  longitude: number;
  limit?: number;
  reactionType?: 'LIKE' | 'DISLIKE';
  cursor?: number;
}

export interface ActivityHistoryDetailResponse {
  historyId: number;
  petId: number;
  /** km */
  distance: number;
  activityHistoryStartAt: string;
  activityHistoryEndAt: string;
  startLatitude: number;
  startLongitude: number;
  reactionCount: number;
  isLikedByMe: boolean;
}
