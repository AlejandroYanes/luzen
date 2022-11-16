import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import type { SpotlightAction } from '@mantine/spotlight';
import { SpotlightProvider } from '@mantine/spotlight';
import { useDebouncedState } from '@mantine/hooks';

import { trpc } from 'utils/trpc';
import CustomAction from './CustomAction';
import CustomWrapper from './CustomWrapper';
import InfiniteLoadProvider from './context';

interface Props {
  children: ReactNode;
}

const mockFilter = (_query: string, currentActions: SpotlightAction[]) => currentActions;

const SearchSpotlight = ({ children }: Props) => {
  const router = useRouter();
  const [query, setQuery] = useDebouncedState('', 200);
  const { data: infinite, fetchNextPage } = trpc.ideas.listInfinite.useInfiniteQuery(
    { initialPage: 1, query },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    },
  );

  const mappedActions: SpotlightAction[] = infinite?.pages
    .flatMap((page) => page.results)
    .map((idea) => ({
      id: idea.id,
      title: idea.title,
      description: idea.summary,
      onTrigger: () => router.push(`/ideas/${idea.id}`),
    })) || [];

  return (
    <InfiniteLoadProvider loadMore={() => fetchNextPage()}>
      <SpotlightProvider
        styles={(theme) => ({
          spotlight: {
            maxHeight: '600px',
            [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
              maxWidth: '98vw',
            },
          },
        })}
        shortcut="mod + K"
        transition="slide-down"
        transitionDuration={300}
        limit={Math.max(mappedActions.length, 10)}
        actions={mappedActions}
        actionComponent={CustomAction}
        actionsWrapperComponent={CustomWrapper}
        filter={mockFilter}
        onQueryChange={setQuery}
        onSpotlightClose={() => setQuery('')}
      >
        {children}
      </SpotlightProvider>
    </InfiniteLoadProvider>
  );
};

export default SearchSpotlight;
