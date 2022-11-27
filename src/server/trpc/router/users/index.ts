import { router } from 'server/trpc/trpc';
import listUsers from './list-users';
import updateRole from './update-role';
import deleteAccount from './delete-account';
import sendEmail from './send-email';
import sendSlack from './send-slack';
import sendPush from './send-push';
import storeWebPushSub from './store-web-push-sub';
import updateWebPushStatus from './update-web-push-status';

export const usersRouter = router({
  listUsers,
  updateRole,
  deleteAccount,
  sendEmail,
  sendSlack,
  sendPush,
  storeWebPushSub,
  updateWebPushStatus,
});
