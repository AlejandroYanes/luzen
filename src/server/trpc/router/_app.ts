import { router } from '../trpc';
import { authRouter } from './auth';
import { ideasRouter } from './ideas';
import { commentsRouter } from './coments';
import { usersRouter } from './users';

export const appRouter = router({
  auth: authRouter,
  ideas: ideasRouter,
  comments: commentsRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
