import { router } from 'server/trpc/trpc';
import listUsers from './list-users';
import updateRole from './update-role';
import deleteAccount from './delete-account';

export const usersRouter = router({
  listUsers,
  updateRole,
  deleteAccount,
});
