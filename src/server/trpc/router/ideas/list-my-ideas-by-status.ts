import { z } from 'zod';
import { protectedProcedure } from 'server/trpc/trpc';

const listMyIdeasByStatus = protectedProcedure
  .input(z.boolean())
  .query(async ({ ctx, input: status }) => {
    return ctx.prisma.idea.findMany({
      orderBy: { votes: 'desc' },
      where: {
        authorId: ctx.session.user.id,
        isDraft: status,
      },
      select: {
        id: true,
        title: true,
        summary: true,
        votes: true,
        postedAt: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  });

export default listMyIdeasByStatus;
