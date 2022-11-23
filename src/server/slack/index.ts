import { env } from 'env/server.mjs';

export function sendNotification(msg: string) {
  return fetch(env.SLACK_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      text: msg,
    }),
  });
}
