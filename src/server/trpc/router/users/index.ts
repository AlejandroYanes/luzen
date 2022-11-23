import { router } from 'server/trpc/trpc';
import listUsers from './list-users';
import updateRole from './update-role';
import deleteAccount from './delete-account';
import sendEmail from './send-email';
import sendSlack from './send-slack';

export const usersRouter = router({
  listUsers,
  updateRole,
  deleteAccount,
  sendEmail,
  sendSlack,
});
