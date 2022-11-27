import webPush from 'web-push';

import { env as clientEnv } from 'env/client.mjs';
import { env as serverEnv } from 'env/server.mjs';

export function sendPushNotification(pushSubscription: string, content: string) {
  webPush.setVapidDetails(
    'mailto:alejandro.yanes94@gmail.com',
    clientEnv.NEXT_PUBLIC_PUSH_KEY,
    serverEnv.PUSH_PRIVATE_KEY,
  );

  return webPush.sendNotification(JSON.parse(pushSubscription), content);
}
