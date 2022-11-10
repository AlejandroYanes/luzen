import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { protectedProcedure } from 'server/trpc/trpc';
import { notifyUserOfNewVote } from 'server/novu';

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
        title: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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

    if (idea.author) {
      const { author } = idea;
      notifyUserOfNewVote({
        author: {
          id: author.id,
          name: author.name || '',
          email: author.email!,
        },
        idea: {
          id: idea.id,
          title: idea.title,
          voteCount: idea.votes,
        },
      });
    }
  });

export default toggleVote;
