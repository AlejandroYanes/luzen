import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { NOTIFICATION_TYPES } from 'constants/notifications';
import { env } from 'env/server.mjs';
import { adminProcedure } from 'server/trpc/trpc';
import { sendEmail } from 'server/send-grid';

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
      await ctx.prisma.notification.create({
        data: {
          type: NOTIFICATION_TYPES.IDEA_PUBLISHED,
          idea: {
            connect: {
              id,
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
          templateId: 'IDEA_PUBLISHED',
          dynamicTemplateData: {
            link: `${env.NEXT_PUBLIC_DOMAIN}/ideas/${id}`,
          },
        });
      }
    }
  });

export default toggleStatus;
