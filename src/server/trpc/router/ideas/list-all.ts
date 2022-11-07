import { z } from 'zod';
import { adminProcedure } from 'server/trpc/trpc';
import { ITEMS_PER_PAGE_LIMIT } from 'constants/pagination';

const listAll = adminProcedure
  .input(z.object({
    page: z.number().min(1),
    query: z.string().nullish(),
  }))
  .query(async ({ ctx, input }) => {
    const { query, page } = input;
    if (query) {
      const results = await ctx.prisma.idea.findMany({
        take: ITEMS_PER_PAGE_LIMIT,
        skip: page === 1 ? 0 : ITEMS_PER_PAGE_LIMIT * (page - 1),
        orderBy: { votes: 'desc' },
        where: { title: { contains: query } },
        select: {
          id: true,
          title: true,
          summary: true,
          votes: true,
          postedAt: true,
          isDraft: true,
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
      const count = await ctx.prisma.idea.count({
        where: { title: { contains: query } },
      });
      return { results, count };
    }

    const results = await ctx.prisma.idea.findMany({
      take: ITEMS_PER_PAGE_LIMIT,
      skip: page === 1 ? 0 : ITEMS_PER_PAGE_LIMIT * (page - 1),
      orderBy: { votes: 'desc' },
      select: {
        id: true,
        title: true,
        summary: true,
        votes: true,
        postedAt: true,
        isDraft: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
    const count = await ctx.prisma.idea.count();
    return { results, count };
  });

export default listAll;
