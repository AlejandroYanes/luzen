/* eslint-disable max-len */
import { env } from 'env/server.mjs';

function sendNotification(body: any) {
  return fetch(env.SLACK_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

interface Payload {
  author: string;
  id: string;
}

export function notifyOfNewIdea(data: Payload) {
  return sendNotification({
    text: `A new idea just got posted by:\n*${data.author}*\n\n<${env.NEXTAUTH_URL}/ideas/${data.id}|${env.NEXTAUTH_URL}/ideas/${data.id}>`,
  });
}
