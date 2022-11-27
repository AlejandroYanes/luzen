import { protectedProcedure } from 'server/trpc/trpc';

const toggleEmailStatus = protectedProcedure
  .mutation(async ({ ctx }) => {
    const { session: { user } } = ctx;

    await ctx.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailStatus: !user.emailStatus,
      },
    });
  });

export default toggleEmailStatus;
