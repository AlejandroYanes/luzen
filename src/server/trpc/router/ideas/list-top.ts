import { z } from 'zod';
import { publicProcedure } from 'server/trpc/trpc';

const listTop = publicProcedure
  .input(z.string().nullish())
  .query(async ({ ctx, input }) => {
    if (input) {
      return ctx.prisma.idea.findMany({
        take: 5,
        orderBy: { votes: 'desc' },
        where: { title: { contains: input } },
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
    }
    return ctx.prisma.idea.findMany({
      take: 5,
      orderBy: { votes: 'desc' },
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

export default listTop;
