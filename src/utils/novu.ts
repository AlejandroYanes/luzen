import { Novu } from '@novu/node';

import { env } from 'env/server.mjs';

const novu = new Novu(env.NOVU_API_KEY);
export default novu;
