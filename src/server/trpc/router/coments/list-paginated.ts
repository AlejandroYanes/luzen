import { z } from 'zod';
import { adminProcedure } from 'server/trpc/trpc';
import { ITEMS_PER_PAGE_LIMIT } from 'constants/pagination';

const listPaginated = adminProcedure
  .input(z.object({
    ideaId: z.string(),
    page: z.number().min(1),
    query: z.string().nullish(),
  }))
  .query(async ({ ctx, input }) => {
    const { ideaId, query, page } = input;

    if (query) {
      const where = {
        AND: [
          { ideaId },
          {
            author: {
              OR: [
                {
                  name: {
                    contains: query,
                  }
                },
                {
                  email: {
                    contains: query,
                  }
                },
              ],
            },
          },
        ],
      };
      const results = await ctx.prisma.comment.findMany({
        take: ITEMS_PER_PAGE_LIMIT,
        skip: page === 1 ? 0 : ITEMS_PER_PAGE_LIMIT * (page - 1),
        where,
        orderBy: { postedAt: 'asc' },
        select: {
          id: true,
          content: true,
          postedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          idea: {
            select: {
              title: true,
            },
          },
        },
      });

      const count = await ctx.prisma.comment.count({ where });

      return { results, count };
    }

    const results = await ctx.prisma.comment.findMany({
      take: ITEMS_PER_PAGE_LIMIT,
      skip: page === 1 ? 0 : ITEMS_PER_PAGE_LIMIT * (page - 1),
      where: { ideaId },
      orderBy: { postedAt: 'asc' },
      select: {
        id: true,
        content: true,
        postedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        idea: {
          select: {
            title: true,
          },
        },
      },
    });

    const count = await ctx.prisma.comment.count({ where: { ideaId } });

    return { results, count };
  });

export default listPaginated;
