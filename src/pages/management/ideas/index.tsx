import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useDebouncedState } from '@mantine/hooks';
import { Group, Pagination, Stack, TextInput, Title } from '@mantine/core';
import BaseLayout from 'components/BaseLayout';
import IdeasTable from 'components/ideasTable';
import { trpc } from 'utils/trpc';
import { ITEMS_PER_PAGE_LIMIT } from 'constants/pagination';

const IdeasListPage: NextPage = () => {
  const [query, setQuery] = useDebouncedState('', 200);
  const [page, setPage] = useState(1);
  const {
    data: { results, count } = { results: [], count: 0 },
  } = trpc.ideas.listAll.useQuery({ page, query }, { keepPreviousData: true });

  return (
    <>
      <Head>
        <title>Bucket List | Managing ideas</title>
        <meta name="description" content="all our users" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Stack mx="auto" sx={{ width: '700px' }}>
          <Title>Ideas</Title>
          <TextInput
            my="lg"
            mr="auto"
            defaultValue=""
            placeholder="Search ideas"
            sx={{ width: '280px' }}
            onChange={(e) => setQuery(e.target.value)}
          />
          <IdeasTable data={results} />
          <Group position="right" py="lg">
            <Pagination
              page={page}
              onChange={setPage}
              total={count / ITEMS_PER_PAGE_LIMIT}
              disabled={count < ITEMS_PER_PAGE_LIMIT}
            />
          </Group>
        </Stack>
      </BaseLayout>
    </>
  );
};

export default IdeasListPage;
