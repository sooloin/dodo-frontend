import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAdminLogin } from '@/admin/features/auth/model/useAdminLogin';

interface AdminLoginLocationState {
  from?: { pathname: string };
}

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate, isPending, error } = useAdminLogin();

  const redirectTo = (location.state as AdminLoginLocationState | null)?.from?.pathname ?? '/';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutate(
      { email, password },
      {
        onSuccess: () => navigate(redirectTo, { replace: true }),
      },
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-lg font-semibold text-neutral-900">DoDo Admin</h1>
          <p className="text-sm text-neutral-500">관리자 계정으로 로그인하세요</p>
        </div>

        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          이메일
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="username"
            className="h-11 rounded-lg border border-neutral-300 px-3 text-sm outline-none focus:border-brand"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            className="h-11 rounded-lg border border-neutral-300 px-3 text-sm outline-none focus:border-brand"
          />
        </label>

        {error && <p className="text-sm text-red-500">로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.</p>}

        <button
          type="submit"
          disabled={isPending}
          className="h-11 rounded-lg bg-brand text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}
