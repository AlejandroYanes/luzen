import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDebouncedState } from '@mantine/hooks';
import { ActionIcon, Group, Pagination, Stack, TextInput, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons';
import BaseLayout from 'components/BaseLayout';
import CommentsTable from 'components/CommentsTable';
import { trpc } from 'utils/trpc';
import { calculateTotal } from 'utils/pagiantion';

const CommentsListPage: NextPage = () => {
  const { query: urlQuery, back } = useRouter();
  const [query, setQuery] = useDebouncedState('', 200);
  const [page, setPage] = useState(1);
  const {
    data: { results, count } = { results: [], count: 0 },
  } = trpc.comments.listPaginated.useQuery(
    { ideaId: urlQuery.id as string, page, query },
    { keepPreviousData: true, enabled: !!urlQuery.id },
  );

  return (
    <>
      <Head>
        <title>Bucket List | Managing comments</title>
        <meta name="description" content="all the comments for" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Stack mx="auto" sx={{ width: '700px' }}>
          <ActionIcon onClick={() => back()}>
            <IconArrowLeft />
          </ActionIcon>
          <Title>Comments for: {results.length > 0 ? results[0]?.idea.title : ''}</Title>
          <TextInput
            my="lg"
            mr="auto"
            defaultValue=""
            placeholder="Search comments"
            sx={{ width: '280px' }}
            onChange={(e) => setQuery(e.target.value)}
          />
          <CommentsTable data={results} />
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

export default CommentsListPage;
