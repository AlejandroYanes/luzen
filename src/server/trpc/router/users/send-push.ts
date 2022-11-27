import { protectedProcedure } from 'server/trpc/trpc';
import { sendPushNotification } from 'server/web-push';

const sendPush = protectedProcedure
  .mutation(async ({ ctx }) => {
    const pushConf = await ctx.prisma.webPushSub.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });
    if (!pushConf) return;
    return sendPushNotification(
      pushConf.data,
      JSON.stringify({ title: 'Hello', body: 'Hello world!', link: '/me/ideas' }),
    );
  });

export default sendPush;
