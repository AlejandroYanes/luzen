import { protectedProcedure } from 'server/trpc/trpc';
import novu from 'server/novu/_novu';

const deleteAccount = protectedProcedure
  .mutation(async ({ ctx }) => {
    const { session: { user } } = ctx;
    await novu.subscribers.delete(user.id);
    return ctx.prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  });

export default deleteAccount;
