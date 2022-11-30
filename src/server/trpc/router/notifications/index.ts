import { router } from 'server/trpc/trpc';
import listInfinite from './list-infinite';
import markAsSeen from './mark-as-seen';
import countUnseen from './count-unseen';

export const notificationsRouter = router({
  listInfinite,
  markAsSeen,
  countUnseen,
});
