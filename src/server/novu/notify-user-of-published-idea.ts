import { env } from 'env/server.mjs';
import novu, { NOVU_TRIGGERS } from './_novu';

interface Params {
  author: {
    id: string;
    email: string;
    name: string;
  };
  idea: {
    id: string;
    title: string;
  };
}

export async function notifyUserOfPublishedIdea(params: Params) {
  const { author, idea } = params;
  await novu.trigger(NOVU_TRIGGERS.IDEA_MADE_PUBLIC, {
    to: {
      subscriberId: author.id,
      email: author.email,
    },
    payload: {
      name: author.name,
      ideaId: idea.id,
      ideaName: idea.title,
      link: `${env.NEXT_PUBLIC_DOMAIN}/ideas/${idea.id}`,
    }
  });
}
