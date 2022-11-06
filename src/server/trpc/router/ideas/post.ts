import { z } from 'zod';
import { protectedProcedure } from 'server/trpc/trpc';

const post = protectedProcedure
  .input(z.object({ title: z.string(), summary: z.string(), description: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const idea = await ctx.prisma.idea.create({
      data: {
        ...input,
        author: {
          connect: {
            id: ctx.session.user.id,
          }
        },
      },
    });
    return idea.id;
  });

export default post;
