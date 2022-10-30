import { router } from '../trpc';
import { authRouter } from './auth';
import { ideasRouter } from './ideas';

export const appRouter = router({
  auth: authRouter,
  ideas: ideasRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
