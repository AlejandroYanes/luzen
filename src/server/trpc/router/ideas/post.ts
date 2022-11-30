import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { protectedProcedure } from 'server/trpc/trpc';
import { notifyOfNewIdea } from 'server/slack';

const post = protectedProcedure
  .input(z.object({
    title: z.string(),
    summary: z.string(),
    id: z.string().nullish(),
    tagLine: z.string().nullish(),
  }))
  .mutation(async ({ ctx, input }) => {
    const { user } = ctx.session;
    const { id, ...values } = input;

    if (id) {
      const idea = await ctx.prisma.idea.findUnique({
        where: { id },
        select: {
          isDraft: true,
          authorId: true,
        },
      });

      if (!idea) throw new TRPCError({ code: 'NOT_FOUND' });
      if (!idea.isDraft || idea.authorId !== user.id) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      await ctx.prisma.idea.update({
        where: { id },
        data: values,
      });
      return id;
    }

    const idea = await ctx.prisma.idea.create({
      data: {
        ...values,
        isDraft: true,
        author: {
          connect: {
            id: ctx.session.user.id,
          }
        },
      },
    });

    notifyOfNewIdea({
      author: user.name!,
      id: idea.id,
    });

    return idea.id;
  });

export default post;
