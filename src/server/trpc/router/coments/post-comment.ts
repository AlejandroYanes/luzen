import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { protectedProcedure } from 'server/trpc/trpc';

const postComment = protectedProcedure
  .input(z.object({ idea: z.string(), content: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const idea = await ctx.prisma.idea.findUnique({
      where: {
        id: input.idea,
      },
      select: {
        id: true,
        title: true,
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

    const comment = await ctx.prisma.comment.create({
      data: {
        content: input.content,
        author: {
          connect: {
            id: ctx.session.user.id,
          },
        },
        idea: {
          connect: {
            id: input.idea,
          }
        },
      },
    });

    if (idea.author) {
      const { author } = idea;
    }

    return comment.id;
  });

export default postComment;
