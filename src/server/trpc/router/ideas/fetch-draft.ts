import { z } from 'zod';
import { protectedProcedure } from '../../trpc';

const fetchDraft = protectedProcedure
  .input(z.string())
  .query(({ ctx, input }) => {
    return ctx.prisma.idea.findFirst({
      where: {
        id: input,
        isDraft: true,
      },
      select: {
        id: true,
        title: true,
        summary: true,
        description: true,
      },
    });
  });

export default fetchDraft;
