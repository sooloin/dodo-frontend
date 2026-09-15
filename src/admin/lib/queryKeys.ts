export const adminQueryKeys = {
  reports: {
    list: (params: { reportType: string; reportStatus?: string; page?: number; size?: number }) =>
      [
        'admin',
        'reports',
        'list',
        params.reportType,
        params.reportStatus ?? '',
        params.page ?? 0,
        params.size ?? 20,
      ] as const,
    board: (boardId: number) => ['admin', 'reports', 'board', boardId] as const,
    comment: (commentId: number) => ['admin', 'reports', 'comment', commentId] as const,
  },
  announcements: {
    list: (params?: { page?: number; size?: number }) =>
      ['admin', 'announcements', 'list', params?.page ?? 0, params?.size ?? 20] as const,
    detail: (boardId: number) => ['admin', 'announcements', 'detail', boardId] as const,
  },
  users: {
    list: (params: { keyword?: string; status?: string; page?: number; size?: number }) =>
      [
        'admin',
        'users',
        'list',
        params.keyword ?? '',
        params.status ?? '',
        params.page ?? 0,
        params.size ?? 20,
      ] as const,
  },
} as const;
