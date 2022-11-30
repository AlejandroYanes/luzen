import { protectedProcedure } from '../../trpc';

const countUnseen = protectedProcedure
  .query(({ ctx }) => {
    return ctx.prisma.notification.count({
      where: {
        receiverId: ctx.session.user.id,
        seen: false,
      },
    });
  });

export default countUnseen;
