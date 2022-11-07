import { z } from 'zod';
import { adminProcedure } from 'server/trpc/trpc';

const listUsers = adminProcedure
  .input(z.string().nullish())
  .query(({ ctx, input }) => {
    if (input) {
      return ctx.prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: input } },
            { email: { contains: input } },
          ],
        },
        select: {
          id: true,
          role: true,
          name: true,
          email: true,
          image: true,
        },
      });
    }
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
