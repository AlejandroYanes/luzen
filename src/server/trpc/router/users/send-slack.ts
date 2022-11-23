import { protectedProcedure } from 'server/trpc/trpc';
import { sendNotification } from 'server/slack';

const sendSlack = protectedProcedure
  .mutation(() => {
    return sendNotification('hello World from BucketList');
  });

export default sendSlack;

