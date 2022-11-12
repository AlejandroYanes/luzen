import { protectedProcedure } from '../../trpc';

const deleteAccount = protectedProcedure
  .mutation(async ({ ctx }) => {
    return ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.id,
      },
    });
  });

export default deleteAccount;
