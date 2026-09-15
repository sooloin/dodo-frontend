import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import { adminQueryClient } from '@/admin/lib/queryClient';
import { adminRouter } from '@/admin/router';

export default function AdminApp() {
  return (
    <QueryClientProvider client={adminQueryClient}>
      <RouterProvider router={adminRouter} />
    </QueryClientProvider>
  );
}
