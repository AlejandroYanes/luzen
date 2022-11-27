import { z } from 'zod';

import { protectedProcedure } from 'server/trpc/trpc';
import { WEB_PUSH_STATUS } from 'constants/web-push';

const storeWebPushSub = protectedProcedure
  .input(z.object({
    data: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    const { session: { user } } = ctx;
    const { data } = input;

    if (user.webPushStatus !== WEB_PUSH_STATUS.GRANTED) {
      await ctx.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          webPushStatus: WEB_PUSH_STATUS.GRANTED,
        },
      });
    }

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
  });

export default storeWebPushSub;
