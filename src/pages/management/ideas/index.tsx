import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useDebouncedState } from '@mantine/hooks';
import { Group, Pagination, Stack, TextInput, Title } from '@mantine/core';
import BaseLayout from 'components/BaseLayout';
import IdeasTable from 'components/IdeasTable';
import { trpc } from 'utils/trpc';
import { calculateTotal } from 'utils/pagiantion';

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
        <title>Bucket List | Managing ideas</title>
        <meta name="description" content="all our users" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Stack mx="auto" sx={{ width: '900px' }}>
          <Title>Ideas</Title>
          <TextInput
            my="lg"
            mr="auto"
            defaultValue=""
            placeholder="Search ideas"
            sx={{ width: '280px' }}
            onChange={(e) => setQuery(e.target.value)}
          />
          <IdeasTable data={results} toggleStatus={handleToggleStatus} />
          <Group position="right" py="lg">
            <Pagination
              page={page}
              onChange={setPage}
              total={calculateTotal(count)}
            />
          </Group>
        </Stack>
      </BaseLayout>
    </>
  );
};

export default IdeasListPage;
