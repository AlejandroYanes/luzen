import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { protectedProcedure } from 'server/trpc/trpc';
import { ITEMS_PER_PAGE_LIMIT } from 'constants/pagination';

const listCommentsForMyIdeas = protectedProcedure
  .input(z.object({
    ideaId: z.string(),
    page: z.number().min(1),
    query: z.string().nullish(),
  }))
  .query(async ({ ctx, input }) => {
    const { ideaId, query, page } = input;
    let where: Prisma.CommentWhereInput = {
      idea: {
        id: ideaId,
        authorId: ctx.session.user.id,
      },
    };

    if (query) {
      where = {
        ...where,
        AND: [
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
    }

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
  });

export default listCommentsForMyIdeas;
