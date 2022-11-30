import { protectedProcedure } from 'server/trpc/trpc';

const markAsSeen = protectedProcedure
  .mutation(async ({ ctx }) => {
    await ctx.prisma.notification.updateMany({
      where: {
        receiverId: ctx.session.user.id,
        seen: false,
      },
      data: {
        seen: true,
      },
    });
  });

export default markAsSeen;
