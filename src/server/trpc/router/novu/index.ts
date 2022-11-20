import { router } from 'server/trpc/trpc';
import fetchPreferences from './fetch-preferences';
import togglePreferenceStatus from './toggle-preference-status';

export const novuRouter = router({
  fetchPreferences,
  togglePreferenceStatus,
});
