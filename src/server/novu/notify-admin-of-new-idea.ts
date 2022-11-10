import { env } from 'env/server.mjs';
import novu, { NOVU_TRIGGERS } from './_novu';

interface Params {
  admin: {
    id: string;
    email: string;
  };
  idea: {
    id: string;
    title: string;
  };
}

export async function notifyAdminOfNewIdea(params: Params) {
  const { admin, idea } = params;
  await novu.trigger(NOVU_TRIGGERS.NEW_IDEA, {
    to: {
      subscriberId: admin.id,
      email: admin.email,
    },
    payload: {
      ideaId: idea.id,
      adminLink: `${env.NEXTAUTH_URL}/management/ideas/${idea.id}`
    }
  });
}
