import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { protectedProcedure } from 'server/trpc/trpc';

const toggleVote = protectedProcedure
  .input(z.string())
  .mutation(async ({ ctx, input: ideaId }) => {
    const loggedInUserId = ctx.session.user.id;
    const idea = await ctx.prisma.idea.findUnique({
      where: {
        id: ideaId,
      },
      select: {
        id: true,
        votes: true,
        usersWhoVoted: {
          select: {
            userId: true,
          },
          where: {
            userId: loggedInUserId,
          }
        }
      }
    });

    if (!idea) throw new TRPCError({ code: 'NOT_FOUND' });

    const userAlreadyVoted = idea.usersWhoVoted.length > 0;

    if (userAlreadyVoted) {
      await ctx.prisma.idea.update({
        where: { id: ideaId },
        data: {
          votes: idea.votes - 1,
          usersWhoVoted: {
            delete: {
              ideaId_userId: {
                ideaId: ideaId,
                userId: loggedInUserId,
              },
            },
          },
        }
      });
      return;
    }

    await ctx.prisma.idea.update({
      where: { id: ideaId },
      data: {
        votes: idea.votes + 1,
        usersWhoVoted: {
          create: {
            userId: loggedInUserId,
          },
        },
      }
    });
  });

export default toggleVote;
