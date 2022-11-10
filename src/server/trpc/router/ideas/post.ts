import { z } from 'zod';

import { protectedProcedure } from 'server/trpc/trpc';
import { notifyAdminOfNewIdea } from 'server/novu';
import { ROLES } from 'constants/roles';

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
