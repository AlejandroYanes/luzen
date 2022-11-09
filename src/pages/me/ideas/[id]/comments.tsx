import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDebouncedState } from '@mantine/hooks';
import { ActionIcon, Stack, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons';

import BaseLayout from 'components/BaseLayout';
import CommentsTable from 'components/CommentsTable';
import AuthGuard from 'components/AuthGuard';
import { trpc } from 'utils/trpc';

const CommentsListPage: NextPage = () => {
  const { query: urlQuery, back } = useRouter();
  const [query, setQuery] = useDebouncedState('', 200);
  const [page, setPage] = useState(1);
  const {
    data: { results, count } = { results: [], count: 0 },
  } = trpc.comments.listCommentsForMyIdeas.useQuery(
    { ideaId: urlQuery.id as string, page, query },
    { keepPreviousData: true, enabled: !!urlQuery.id },
  );

  return (
    <>
      <Head>
        <title>Bucket List | Comments for my idea</title>
        <meta name="description" content="all the comments for" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Stack mx="auto" sx={{ width: '900px' }}>
          <AuthGuard>
            <ActionIcon onClick={() => back()}>
              <IconArrowLeft />
            </ActionIcon>
            <Title>Comments for: {results.length > 0 ? results[0]?.idea.title : '...'}</Title>
            <CommentsTable
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

export default CommentsListPage;
