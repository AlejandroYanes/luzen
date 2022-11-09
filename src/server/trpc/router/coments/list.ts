import { z } from 'zod';

import { publicProcedure } from 'server/trpc/trpc';

const list = publicProcedure
  .input(z.string())
  .query(({ ctx, input }) => {
    return ctx.prisma.comment.findMany({
      take: 5,
      where: { ideaId: input },
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
  });

export default list;
