import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const ideasRouter = router({
  listTop: publicProcedure
    .input(z.string().nullish())
    .query(({ ctx, input }) => {
      if (input) {
        return ctx.prisma.idea.findMany({
          take: 5,
          where: { title: { contains: input } },
          orderBy: { votes: 'desc' },
        });
      }
      return ctx.prisma.idea.findMany({ take: 5, orderBy: { votes: 'desc' } });
    }),
});
