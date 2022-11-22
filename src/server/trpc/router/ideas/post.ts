import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { protectedProcedure } from 'server/trpc/trpc';
import { notifyAdminOfNewIdea } from 'server/novu';
import { ROLES } from 'constants/roles';

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
        isDraft: false,
        author: {
          connect: {
            id: ctx.session.user.id,
          }
        },
      },
    });

    const adminUsers = await ctx.prisma.user.findMany({
      where: {
        role: ROLES.ADMIN,
      },
    });

    adminUsers.forEach((admin) => {
      notifyAdminOfNewIdea({
        idea: {
          id: idea.id,
          title: idea.title,
        },
        admin: {
          id: admin.id,
          email: admin.email || '',
        },
      });
    });

    return idea.id;
  });

export default post;
