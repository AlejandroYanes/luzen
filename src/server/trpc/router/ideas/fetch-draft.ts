import { z } from 'zod';
import type { Prisma } from '@prisma/client';

import { protectedProcedure } from 'server/trpc/trpc';
import { ROLES } from 'constants/roles';

const fetchDraft = protectedProcedure
  .input(z.string())
  .query(({ ctx, input }) => {
    const { user } = ctx.session;
    let where: Prisma.IdeaWhereInput;

    if (user.role === ROLES.ADMIN) {
      where = {
        id: input,
        isDraft: true,
      };
    } else {
      where = {
        id: input,
        isDraft: true,
        authorId: user.id,
      };
    }

    return ctx.prisma.idea.findFirst({
      where,
      select: {
        id: true,
        title: true,
        summary: true,
        description: true,
        authorId: true,
      },
    });
  });

export default fetchDraft;
