import { adminProcedure } from '../../trpc';

const listUsers = adminProcedure
  .query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        image: true,
      },
    });
  });

export default listUsers
