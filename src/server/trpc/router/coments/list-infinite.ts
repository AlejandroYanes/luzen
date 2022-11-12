import { z } from 'zod';
import type { Prisma } from '@prisma/client';

import { publicProcedure } from 'server/trpc/trpc';
import { ITEMS_PER_PAGE_LIMIT } from 'constants/pagination';

const listInfinite = publicProcedure
  .input(z.object({
    ideaId: z.string(),
    cursor: z.number().nullish(),
  }))
  .query(async ({ ctx, input }) => {
    const { ideaId, cursor } = input;
    const page = cursor ?? 1;
    const where: Prisma.CommentWhereInput = { ideaId };

    const results = await ctx.prisma.comment.findMany({
      take: ITEMS_PER_PAGE_LIMIT,
      skip: page === 1 ? 0 : ITEMS_PER_PAGE_LIMIT * (page - 1),
      where,
      orderBy: [{ postedAt: 'asc' }],
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
      },
    });
    const count = await ctx.prisma.comment.count({ where });

    return {
      results,
      nextPage: (page * ITEMS_PER_PAGE_LIMIT) < count ? page + 1 : undefined,
    };
  });

export default listInfinite;
