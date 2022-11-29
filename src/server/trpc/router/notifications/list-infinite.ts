import { z } from 'zod';

import { protectedProcedure } from 'server/trpc/trpc';
import { ITEMS_PER_PAGE_LIMIT } from 'constants/pagination';

const listInfinite = protectedProcedure
  .input(z.object({
    initialPage: z.number().default(1),
    cursor: z.number().nullish(),
  }))
  .query(async ({ ctx, input }) => {
    const { cursor, initialPage } = input;
    const page = cursor ?? initialPage;

    const results = await ctx.prisma.notification.findMany({
      take: ITEMS_PER_PAGE_LIMIT,
      skip: page === 1 ? 0 : ITEMS_PER_PAGE_LIMIT * (page - 1),
      orderBy: [{ sentOn: 'desc' }],
      where: {
        receiverId: ctx.session.user.id,
      },
      select: {
        id: true,
        type: true,
        sentOn: true,
        creator: {
          select: {
            name: true,
          },
        },
        idea: {
          select: {
            title: true,
          },
        },
      },
    });
    const count = await ctx.prisma.notification.count({
      where: {
        receiverId: ctx.session.user.id,
      }
    });

    return {
      results,
      nextPage: (page * ITEMS_PER_PAGE_LIMIT) < count ? page + 1 : undefined,
    };
  });

export default listInfinite;
