import type { NotificationTemplate } from 'models/novu';
import { protectedProcedure } from 'server/trpc/trpc';
import novu from 'server/novu/_novu';

const fetchPreferences = protectedProcedure
  .query(async ({ ctx }) => {
    const { session: { user } } = ctx;
    const preferences = await novu.subscribers.getPreference(user.id);
    return preferences.data.data as NotificationTemplate[];
  });

export default fetchPreferences;
