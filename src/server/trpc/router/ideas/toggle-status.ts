import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { env } from 'env/server.mjs';
import { PUSH_UPDATE_TYPES, WEB_PUSH_STATUS } from 'constants/web-push';
import { adminProcedure } from 'server/trpc/trpc';
import { sendEmail } from 'server/send-grid';
import { sendPushNotification } from 'server/web-push';

const toggleStatus = adminProcedure
  .input(z.string())
  .mutation(async ({ ctx, input: ideaId }) => {
    const idea = await ctx.prisma.idea.findUnique({
      where: {
        id: ideaId,
      },
      select: {
        id: true,
        title: true,
        isDraft: true,
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
      },
    });

    if (!idea) throw new TRPCError({ code: 'NOT_FOUND' });

    await ctx.prisma.idea.update({
      where: { id: ideaId },
      data: {
        isDraft: !idea.isDraft,
      },
    });

    if (idea.isDraft && idea.author?.email) {
      const { id, author } = idea;
      if (author.emailStatus) {
        sendEmail({
          to: author.email!,
          templateId: 'IDEA_PUBLISHED',
          dynamicTemplateData: {
            link: `${env.NEXT_PUBLIC_DOMAIN}/ideas/${id}`,
          },
        });
      }

      if (author.webPushStatus === WEB_PUSH_STATUS.GRANTED) {
        const subscriptions = author.wePushSubs;
        subscriptions.forEach(sub => {
          sendPushNotification(sub.data, JSON.stringify({
            id: PUSH_UPDATE_TYPES.IDEA_PUBLISHED,
            title: 'Your idea just got published!',
            message: idea.title,
            link: `/ideas/${id}`,
          }));
        });
      }
    }
  });

export default toggleStatus;
