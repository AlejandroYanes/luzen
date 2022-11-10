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
    voteCount: number;
  };
}

export async function notifyUserOfNewVote(params: Params) {
  const { author, idea } = params;
  novu.trigger(NOVU_TRIGGERS.IDEA_VOTED_UP, {
    to: {
      subscriberId: author.id,
      email: author.email,
    },
    payload: {
      ideaId: idea.id,
      ideaName: idea.title,
      voteCount: idea.voteCount,
      link: `${env.NEXTAUTH_URL}/ideas/${idea.id}`,
    }
  });
}
