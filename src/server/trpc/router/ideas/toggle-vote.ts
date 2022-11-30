import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { env } from 'env/server.mjs';
import { protectedProcedure } from 'server/trpc/trpc';
import { sendEmail } from 'server/send-grid';
import { NOTIFICATION_TYPES } from '../../../../constants/notifications';

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
            emailStatus: true,
            webPushStatus: true,
            wePushSubs: true,
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
      const { id, author } = idea;
      await ctx.prisma.notification.create({
        data: {
          type: NOTIFICATION_TYPES.NEW_VOTE,
          idea: {
            connect: {
              id,
            },
          },
          creator: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          receiver: {
            connect: {
              id: author.id,
            },
          },
        },
      });

      if (author.emailStatus) {
        sendEmail({
          to: author.email!,
          templateId: 'NEW_VOTE',
          dynamicTemplateData: {
            link: `${env.NEXT_PUBLIC_DOMAIN}/ideas/${id}`,
          },
        });
      }
    }
  });

export default toggleVote;
