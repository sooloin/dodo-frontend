import { useLocation } from 'react-router-dom';

import { useCurrentUser } from '@/features/auth/model/useCurrentUser';
import { getMyDodoMenuKeyByPathname } from '@/pages/my/model/menu';
import { MyDodoLayout } from '@/pages/my/ui/MyDodoLayout';
import { NotificationSettingsForm } from '@/pages/my/ui/NotificationSettingsForm';
import { MyDodoSidebarPanel } from '@/pages/my/ui/MyDodoSidebarPanel';

export function NotificationSettingsPage() {
  const location = useLocation();
  const activeKey = getMyDodoMenuKeyByPathname(location.pathname);
  const { user, isLoading, profileUrl, displayName } = useCurrentUser();

  return (
    <MyDodoLayout
      sidebar={
        <MyDodoSidebarPanel
          user={user}
          profileUrl={profileUrl}
          displayName={displayName}
          isLoading={isLoading}
          activeKey={activeKey}
        />
      }
      content={
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-brand">NOTICE</p>
            <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">알림 설정</h1>
          </div>

          <NotificationSettingsForm />
        </div>
      }
    />
  );
}
