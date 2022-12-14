import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { env } from 'env/server.mjs';
import { protectedProcedure } from 'server/trpc/trpc';
import { sendEmail } from 'server/send-grid';
import { NOTIFICATION_TYPES } from '../../../../constants/notifications';

const postComment = protectedProcedure
  .input(z.object({ idea: z.string(), content: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const idea = await ctx.prisma.idea.findUnique({
      where: {
        id: input.idea,
      },
      select: {
        id: true,
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
      },
    });

    if (!idea) throw new TRPCError({ code: 'NOT_FOUND' });

    const comment = await ctx.prisma.comment.create({
      data: {
        content: input.content,
        author: {
          connect: {
            id: ctx.session.user.id,
          },
        },
        idea: {
          connect: {
            id: input.idea,
          }
        },
      },
    });

    if (idea.author) {
      const { id, author } = idea;
      await ctx.prisma.notification.create({
        data: {
          type: NOTIFICATION_TYPES.NEW_COMMENT,
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
          templateId: 'NEW_COMMENT',
          dynamicTemplateData: {
            link: `${env.NEXT_PUBLIC_DOMAIN}/ideas/${id}`,
          },
        });
      }
    }

    return comment.id;
  });

export default postComment;
