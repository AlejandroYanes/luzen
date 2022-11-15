import { useState } from 'react';
import Head from 'next/head';
import { Stack, Title } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';

import BaseLayout from 'components/BaseLayout';
import AuthGuard from 'components/AuthGuard';
import IdeasTable from 'components/IdeasTable';
import { trpc } from 'utils/trpc';

const MyIdeasPage = () => {
  const [query, setQuery] = useDebouncedState('', 200);
  const [page, setPage] = useState(1);
  const {
    data: { results, count } = { results: [], count: 0 },
  } = trpc.ideas.listMyIdeas.useQuery({ page, query });

  return (
    <>
      <Head>
        <title>Bucket List | My Ideas</title>
        <meta name="description" content="My ideas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Stack style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
          <AuthGuard>
            <Title>My ideas</Title>
            <IdeasTable
              isForUsers
              page={page}
              count={count}
              data={results}
              onPageChange={setPage}
              onQueryChange={setQuery}
            />
          </AuthGuard>
        </Stack>
      </BaseLayout>
    </>
  );
};

export default MyIdeasPage;
