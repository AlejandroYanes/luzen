import type { ReactNode } from 'react';
import { useState } from 'react';
import { debounce } from 'radash';
import { SpotlightProvider } from '@mantine/spotlight';
import type { SpotlightAction } from '@mantine/spotlight';
import { useRouter } from 'next/router';
import { trpc } from 'utils/trpc';

interface Props {
  children: ReactNode;
}

const mockFilter = (_query: string, currentActions: SpotlightAction[]) => currentActions;

const SearchSpotlight = ({ children }: Props) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { data: ideas = [] } = trpc.ideas.listTop.useQuery(query);

  const mappedActions: SpotlightAction[] = ideas.map((idea) => ({
    title: idea.title,
    description: idea.summary,
    onTrigger: () => router.push(`/ideas/${idea.id}`),
  }));

  const handleSearch = debounce({ delay: 200 }, (nextQ: string) => setQuery(nextQ));

  return (
    <SpotlightProvider
      actions={mappedActions}
      filter={mockFilter}
      onQueryChange={handleSearch}
      onSpotlightClose={() => setQuery('')}
    >
      {children}
    </SpotlightProvider>
  );
};

export default SearchSpotlight;
