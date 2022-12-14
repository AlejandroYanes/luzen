import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useDebouncedState } from '@mantine/hooks';
import { Stack, Title } from '@mantine/core';

import BaseLayout from 'components/BaseLayout';
import IdeasTable from 'components/IdeasTable';
import AuthGuard from 'components/AuthGuard';
import { trpc } from 'utils/trpc';

const IdeasListPage: NextPage = () => {
  const [query, setQuery] = useDebouncedState('', 200);
  const [page, setPage] = useState(1);
  const {
    data: { results, count } = { results: [], count: 0 },
    refetch,
  } = trpc.ideas.listPaginated.useQuery({ page, query }, { keepPreviousData: true });
  const { mutate } = trpc.ideas.toggleStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const handleToggleStatus = async (ideaId: string) => {
    mutate(ideaId);
  };

  return (
    <>
      <Head>
        <title>Luzen | Managing ideas</title>
      </Head>
      <BaseLayout>
        <Stack mx="auto" sx={{ width: '100%', maxWidth: '900px' }}>
          <AuthGuard>
            <Title>Ideas</Title>
            <IdeasTable
              isForAdmins
              page={page}
              count={count}
              data={results}
              onPageChange={setPage}
              onQueryChange={setQuery}
              onToggleStatus={handleToggleStatus}
            />
          </AuthGuard>
        </Stack>
      </BaseLayout>
    </>
  );
};

export default IdeasListPage;
