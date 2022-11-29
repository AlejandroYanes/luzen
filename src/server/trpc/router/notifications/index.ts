import { router } from 'server/trpc/trpc';
import listInfinite from './list-infinite';
import markAsSeen from './mark-as-seen';

export const notificationsRouter = router({
  listInfinite,
  markAsSeen,
});
