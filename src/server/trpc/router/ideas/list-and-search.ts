import { z } from 'zod';
import type { Prisma } from '@prisma/client';

import { publicProcedure } from 'server/trpc/trpc';

const listAndSearch = publicProcedure
  .input(z.string().nullish())
  .query(async ({ ctx, input }) => {
    let where: Prisma.IdeaWhereInput = { isDraft: false };

    if (input) {
      where = { ...where, title: { contains: input } };
    }
    return ctx.prisma.idea.findMany({
      take: 5,
      orderBy: { votes: 'desc' },
      where,
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

export default listAndSearch;
