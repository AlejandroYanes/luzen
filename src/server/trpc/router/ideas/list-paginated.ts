import { z } from 'zod';
import type { Prisma } from '@prisma/client';

import { adminProcedure } from 'server/trpc/trpc';
import { ITEMS_PER_PAGE_LIMIT } from 'constants/pagination';

const listPaginated = adminProcedure
  .input(z.object({
    page: z.number().min(1),
    query: z.string().nullish(),
    isDraft: z.boolean().nullish(),
  }))
  .query(async ({ ctx, input }) => {
    const { query, page, isDraft } = input;
    let where: Prisma.IdeaWhereInput = {};

    if (query) {
      where = { ...where, title: { contains: query } };
    }

    if (isDraft !== undefined && isDraft !== null) {
      where = { ...where, isDraft };
    }

    const results = await ctx.prisma.idea.findMany({
      take: ITEMS_PER_PAGE_LIMIT,
      skip: page === 1 ? 0 : ITEMS_PER_PAGE_LIMIT * (page - 1),
      orderBy: [
        { votes: 'desc' },
        { postedAt: 'asc' },
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
    return { results, count };
  });

export default listPaginated;
