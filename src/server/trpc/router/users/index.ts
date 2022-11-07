import { router } from 'server/trpc/trpc';
import listUsers from './list-users';

export const usersRouter = router({
  listUsers,
});
