import { z } from 'zod';
import type { Prisma } from '@prisma/client';

import { publicProcedure } from 'server/trpc/trpc';
import { ITEMS_PER_PAGE_LIMIT } from 'constants/pagination';

const listInfinite = publicProcedure
  .input(z.object({
    initialPage: z.number().default(2),
    query: z.string().nullish(),
    cursor: z.number().nullish(),
  }))
  .query(async ({ ctx, input }) => {
    const { query, cursor, initialPage } = input;
    const page = cursor ?? initialPage;
    console.log('listInfinite', input);
    let where: Prisma.IdeaWhereInput = {};
    if (query) {
      where = { ...where, title: { contains: query } };
    }

    const results = await ctx.prisma.idea.findMany({
      take: ITEMS_PER_PAGE_LIMIT,
      skip: page === 1 ? 0 : ITEMS_PER_PAGE_LIMIT * (page - 1),
      orderBy: [
        { votes: 'desc' },
        { postedAt: 'desc' },
      ],
      where,
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
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    const count = await ctx.prisma.idea.count({ where });

    return {
      results,
      nextPage: (page * ITEMS_PER_PAGE_LIMIT) < count ? page + 1 : undefined,
    };
  });

export default listInfinite;

