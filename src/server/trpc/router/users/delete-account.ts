import { protectedProcedure } from 'server/trpc/trpc';

const deleteAccount = protectedProcedure
  .mutation(async ({ ctx }) => {
    const { session: { user } } = ctx;
    return ctx.prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  });

export default deleteAccount;
