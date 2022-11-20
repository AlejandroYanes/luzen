import { z } from 'zod';
import type { ChannelTypeEnum } from '@novu/shared';

import { protectedProcedure } from 'server/trpc/trpc';
import novu from 'server/novu/_novu';

const togglePreferenceStatus = protectedProcedure
  .input(z.object({
    template: z.string(),
    channel: z.string(),
    enabled: z.boolean(),
  }))
  .mutation(async ({ ctx, input }) => {
    const { session: { user } } = ctx;
    const { template, channel, enabled } = input;
    await novu.subscribers.updatePreference(
      user.id,
      template,
      {
        channel: {
          type: channel as ChannelTypeEnum,
          enabled,
        },
      },
    );
  });

export default togglePreferenceStatus;
