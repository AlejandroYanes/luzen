import { router } from 'server/trpc/trpc';
import listUsers from './list-users';
import updateRole from './update-role';
import deleteAccount from './delete-account';
import storeWebPushSub from './store-web-push-sub';
import updateWebPushStatus from './update-web-push-status';
import toggleEmailStatus from './toggle-email-status';

export const usersRouter = router({
  listUsers,
  updateRole,
  deleteAccount,
  storeWebPushSub,
  updateWebPushStatus,
  toggleEmailStatus,
});
