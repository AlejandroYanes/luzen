import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { adminProcedure } from 'server/trpc/trpc';
import novu from 'utils/novu';
import { env } from 'env/server.mjs';

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
      novu.trigger('idea-made-public', {
        to: {
          subscriberId: env.NOVU_SUBSCRIBER,
          email: idea.author.email,
        },
        payload: {
          name: idea.author.name ?? '',
          ideaId: idea.id,
          ideaName: idea.title,
          link: 'https://test-domain.com/ideas/id',
        }
      });
    }
  });

export default toggleStatus;
