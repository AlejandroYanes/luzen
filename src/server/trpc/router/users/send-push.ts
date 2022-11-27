import { protectedProcedure } from 'server/trpc/trpc';
import { sendPushNotification } from 'server/web-push';

const sendPush = protectedProcedure
  .mutation(async ({ ctx }) => {
    const configurations = await ctx.prisma.webPushSub.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    if (configurations.length === 0) return;

    try {
      configurations.forEach((conf) => {
        sendPushNotification(
          conf.data,
          JSON.stringify({ title: 'Hello', body: 'Hello world!', link: '/me/ideas' }),
        );
      });
    } catch (e) {
      console.log('-------------------------');
      console.log('failed to send web-push notifications');
      console.log(e);
    }
  });

export default sendPush;
