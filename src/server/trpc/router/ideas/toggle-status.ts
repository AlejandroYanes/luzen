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
        id: true,
        title: true,
        isDraft: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!idea) throw new TRPCError({ code: 'NOT_FOUND' });

    await ctx.prisma.idea.update({
      where: { id: ideaId },
      data: {
        isDraft: !idea.isDraft,
      },
    });

    if (idea.isDraft && idea.author?.email) {
      const { id, title, author } = idea;
    }
  });

export default toggleStatus;
