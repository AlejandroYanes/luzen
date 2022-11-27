import { z } from 'zod';

import { protectedProcedure } from 'server/trpc/trpc';

const updateWepPushStatus = protectedProcedure
  .input(z.object({
    status: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    const { session: { user } } = ctx;
    const { status } = input;

    await ctx.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        webPushStatus: status,
      },
    });
  });

export default updateWepPushStatus;
