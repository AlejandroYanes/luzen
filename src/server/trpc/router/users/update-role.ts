import { z } from 'zod';

import { adminProcedure } from 'server/trpc/trpc';
import { ROLES_LIST } from 'constants/roles';

const updateRole = adminProcedure
  // had to hack the zod enum type coz it was not taking the ROLES array
  .input(z.object({ userId: z.string(), newRole: z.enum(['FAKE', ...ROLES_LIST]) }))
  .mutation(({ ctx, input }) => {
    return ctx.prisma.user.update({
      where: {
        id: input.userId,
      },
      data: {
        role: input.newRole,
      },
    });
  });

export default updateRole;
