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

export async function notifyUserOfNewComment(params: Params) {
  const { author, idea } = params;
  novu.trigger(NOVU_TRIGGERS.NEW_COMMENT, {
    to: {
      subscriberId: author.id,
      email: author.email,
    },
    payload: {
      ideaId: idea.id,
      ideaName: idea.title,
      userName: author.name,
      link: `${env.NEXTAUTH_URL}/ideas/${idea.id}`,
    }
  });
}
