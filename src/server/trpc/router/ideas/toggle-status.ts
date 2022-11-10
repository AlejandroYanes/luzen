import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { adminProcedure } from 'server/trpc/trpc';
import novu, { NOVU_TRIGGERS } from 'server/novu';
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
      novu.trigger(NOVU_TRIGGERS.IDEA_MADE_PUBLIC, {
        to: {
          subscriberId: idea.author.id,
          email: idea.author.email,
        },
        payload: {
          name: idea.author.name ?? '',
          ideaId: idea.id,
          ideaName: idea.title,
          link: `${env.NEXTAUTH_URL}/ideas/id`,
        }
      });
    }
  });

export default toggleStatus;
