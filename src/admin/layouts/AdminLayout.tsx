import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { clearAdminTokens } from '@/admin/lib/token';

const NAV_ITEMS = [
  { to: '/', label: '대시보드' },
  { to: '/reports', label: '신고 관리' },
  { to: '/announcements', label: '공지사항 관리' },
  { to: '/users', label: '유저 관리' },
  { to: '/notification-schedules', label: '알림 스케줄' },
];

export function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminTokens();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="text-base font-semibold text-neutral-900">DoDo Admin</span>
          <nav className="flex gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? 'font-semibold text-brand'
                      : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg px-3 py-1.5 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          로그아웃
        </button>
      </header>
      <main className="flex flex-1 flex-col p-6">
        <Outlet />
      </main>
    </div>
  );
}
