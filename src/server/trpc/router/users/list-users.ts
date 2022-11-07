import { z } from 'zod';
import { adminProcedure } from 'server/trpc/trpc';
import { ITEMS_PER_PAGE_LIMIT } from '../../../../constants/pagination';

const listUsers = adminProcedure
  .input(z.object({
    page: z.number().min(1),
    query: z.string().nullish(),
  }))
  .query(async ({ ctx, input }) => {
    const { page, query } = input;
    if (query) {
      const results = await ctx.prisma.user.findMany({
        take: ITEMS_PER_PAGE_LIMIT,
        skip: page === 1 ? 0 : ITEMS_PER_PAGE_LIMIT * (page - 1),
        where: {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
          ],
        },
        select: {
          id: true,
          role: true,
          name: true,
          email: true,
          image: true,
        },
      });
      const count = await ctx.prisma.user.count({
        where: {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
          ],
        },
      });

      return { results, count };
    }
    const results = await ctx.prisma.user.findMany({
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        image: true,
      },
    });
    const count = await ctx.prisma.user.count();
    return { results, count };
  });

export default listUsers
