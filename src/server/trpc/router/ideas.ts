import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

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
  post: protectedProcedure
    .input(z.object({ title: z.string(), summary: z.string(), description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const idea = await ctx.prisma.idea.create({ data: input });
      return idea.id;
    }),
  lightUp: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: ideaId }) => {
      const idea = await ctx.prisma.idea.findUnique({
        where: {
          id: ideaId,
        },
      });

      if (!idea) throw new TRPCError({ code: 'NOT_FOUND' });

      await ctx.prisma.idea.update({
        where: { id: ideaId },
        data: { votes: idea.votes + 1 }
      });
    }),
});
