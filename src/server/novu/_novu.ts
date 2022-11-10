import { Novu } from '@novu/node';

import { env } from 'env/server.mjs';

export enum NOVU_TRIGGERS {
  NEW_IDEA = 'new-idea',
  IDEA_MADE_PUBLIC = 'idea-made-public',
  IDEA_VOTED_UP = 'idea-voted-up',
  NEW_COMMENT = 'new-comment-for-idea',
}

const novu = new Novu(env.NOVU_API_KEY);
export default novu;
