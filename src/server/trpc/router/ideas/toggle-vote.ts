import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { protectedProcedure } from 'server/trpc/trpc';
import { sendEmail } from 'server/send-grid';
import { env } from 'env/server.mjs';
import { PUSH_UPDATE_TYPES, WEB_PUSH_STATUS } from '../../../../constants/web-push';
import { sendPushNotification } from '../../../web-push';

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

      if (author.emailStatus) {
        sendEmail({
          to: author.email!,
          templateId: 'NEW_VOTE',
          dynamicTemplateData: {
            link: `${env.NEXT_PUBLIC_DOMAIN}/ideas/${id}`,
          },
        });
      }

      if (author.webPushStatus === WEB_PUSH_STATUS.GRANTED) {
        const subscriptions = author.wePushSubs;
        subscriptions.forEach(sub => {
          sendPushNotification(sub.data, JSON.stringify({
            id: PUSH_UPDATE_TYPES.NEW_VOTE,
            title: 'Your idea just got a new vote!',
            message: idea.title,
            link: `/ideas/${id}`,
          }));
        });
      }
    }
  });

export default toggleVote;
