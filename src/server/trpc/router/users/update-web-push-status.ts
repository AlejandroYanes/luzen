import { z } from 'zod';

import { protectedProcedure } from 'server/trpc/trpc';

const updateWebPushStatus = protectedProcedure
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
    return status;
  });

export default updateWebPushStatus;
