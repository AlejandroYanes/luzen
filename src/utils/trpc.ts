import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { type GetInferenceHelpers } from '@trpc/server';
import superjson from 'superjson';

import { type AppRouter } from '../server/trpc/router/_app';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  // SSR should use Vercel url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // dev SSR should use localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  ssr: false,
});

/**
 * Inference helpers
 * @example type HelloOutput = RouterTypes['example']['hello']['output']
 **/
export type RouterTypes = GetInferenceHelpers<AppRouter>;
