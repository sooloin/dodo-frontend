import { createBrowserRouter } from 'react-router-dom';

import { RequireAdminAuth } from '@/admin/guards/RequireAdminAuth';
import { AdminLayout } from '@/admin/layouts/AdminLayout';
import { AdminAnnouncementCreatePage } from '@/admin/pages/AdminAnnouncementCreatePage';
import { AdminAnnouncementDetailPage } from '@/admin/pages/AdminAnnouncementDetailPage';
import { AdminAnnouncementListPage } from '@/admin/pages/AdminAnnouncementListPage';
import { AdminBoardReportDetailPage } from '@/admin/pages/AdminBoardReportDetailPage';
import { AdminCommentReportDetailPage } from '@/admin/pages/AdminCommentReportDetailPage';
import { AdminDashboardPage } from '@/admin/pages/AdminDashboardPage';
import { AdminLoginPage } from '@/admin/pages/AdminLoginPage';
import { AdminNotificationSchedulePage } from '@/admin/pages/AdminNotificationSchedulePage';
import { AdminReportListPage } from '@/admin/pages/AdminReportListPage';
import { AdminUserListPage } from '@/admin/pages/AdminUserListPage';

export const adminRouter = createBrowserRouter(
  [
    { path: '/login', element: <AdminLoginPage /> },
    {
      path: '/',
      element: (
        <RequireAdminAuth>
          <AdminLayout />
        </RequireAdminAuth>
      ),
      children: [
        { index: true, element: <AdminDashboardPage /> },
        { path: 'reports', element: <AdminReportListPage /> },
        { path: 'reports/board/:boardId', element: <AdminBoardReportDetailPage /> },
        { path: 'reports/comment/:commentId', element: <AdminCommentReportDetailPage /> },
        { path: 'announcements', element: <AdminAnnouncementListPage /> },
        { path: 'announcements/new', element: <AdminAnnouncementCreatePage /> },
        { path: 'announcements/:boardId', element: <AdminAnnouncementDetailPage /> },
        { path: 'users', element: <AdminUserListPage /> },
        { path: 'notification-schedules', element: <AdminNotificationSchedulePage /> },
      ],
    },
  ],
  { basename: '/admin' },
);
