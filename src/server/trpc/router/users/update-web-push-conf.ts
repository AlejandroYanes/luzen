import { z } from 'zod';

import { protectedProcedure } from 'server/trpc/trpc';
import { WEB_PUSH_STATUS } from 'constants/web-push';

const updateWebPushConf = protectedProcedure
  .input(z.object({
    status: z.string(),
    data: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    const { session: { user } } = ctx;
    const { status: nextStatus, data } = input;

    await ctx.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        webPushStatus: nextStatus,
      },
    });
    const currentConf = await ctx.prisma.webPushSub.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (nextStatus === WEB_PUSH_STATUS.DENIED && currentConf) {
      await ctx.prisma.webPushSub.delete({
        where: {
          id: currentConf.id,
        }
      });
    }

    if (nextStatus === WEB_PUSH_STATUS.GRANTED && !currentConf) {
      await ctx.prisma.webPushSub.create({
        data: {
          data,
          user: {
            connect: {
              id: user.id,
            },
          },
        }
      });
    }
  });

export default updateWebPushConf;
