import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { protectedProcedure } from 'server/trpc/trpc';

const checkIfUserVoted = protectedProcedure
  .input(z.string())
  .query(async ({ ctx, input: ideaId }) => {
    const loggedInUserId = ctx.session.user.id;
    const idea = await ctx.prisma.idea.findUnique({
      where: { id: ideaId },
      select: {
        usersWhoVoted: {
          where: {
            userId: loggedInUserId,
          }
        }
      },
    });

    if (!idea) throw new TRPCError({ code: 'NOT_FOUND' });

    return idea.usersWhoVoted.length > 0;
  });

export default checkIfUserVoted;
