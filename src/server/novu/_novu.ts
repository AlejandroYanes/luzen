import { Novu } from '@novu/node';

import { env } from 'env/server.mjs';

export enum NOVU_TRIGGERS {
  IDEA_MADE_PUBLIC = 'idea-made-public',
  NEW_IDEA = 'new-idea',
  IDEA_VOTED_UP = 'idea-voted-up',
}

const novu = new Novu(env.NOVU_API_KEY);
export default novu;
