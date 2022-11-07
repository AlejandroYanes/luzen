import { router } from 'server/trpc/trpc';
import listUsers from './list-users';
import updateRole from './update-role';

export const usersRouter = router({
  listUsers,
  updateRole,
});
