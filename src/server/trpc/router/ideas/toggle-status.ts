import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { adminProcedure } from 'server/trpc/trpc';

const toggleStatus = adminProcedure
  .input(z.string())
  .mutation(async ({ ctx, input: ideaId }) => {
    const idea = await ctx.prisma.idea.findUnique({
      where: {
        id: ideaId,
      },
      select: {
        isDraft: true,
      },
    });

    if (!idea) throw new TRPCError({ code: 'NOT_FOUND' });

    await ctx.prisma.idea.update({
      where: { id: ideaId },
      data: {
        isDraft: !idea.isDraft,
      },
    });
  });

export default toggleStatus;
