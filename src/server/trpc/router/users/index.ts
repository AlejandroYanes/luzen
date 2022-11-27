import { router } from 'server/trpc/trpc';
import listUsers from './list-users';
import updateRole from './update-role';
import deleteAccount from './delete-account';
import sendEmail from './send-email';
import sendSlack from './send-slack';
import sendPush from './send-push';
import updateWebPushConf from './update-web-push-conf';

export const usersRouter = router({
  listUsers,
  updateRole,
  deleteAccount,
  sendEmail,
  sendSlack,
  sendPush,
  updateWebPushConf,
});
