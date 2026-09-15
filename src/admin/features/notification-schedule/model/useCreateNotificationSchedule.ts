import { useMutation } from '@tanstack/react-query';

import { createNotificationSchedule } from '../api';

export function useCreateNotificationSchedule() {
  return useMutation({
    mutationFn: createNotificationSchedule,
  });
}
