import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { Stack, Title, } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import BaseLayout from 'components/BaseLayout';
import UsersTable from 'components/UsersTable';
import AuthGuard from 'components/AuthGuard';
import { trpc } from 'utils/trpc';
import type { Role } from 'constants/roles';

const UsersPage: NextPage = () => {
  const { data: session } = useSession();
  const [query, setQuery] = useDebouncedState('', 200);
  const [page, setPage] = useState(1);
  const {
    data: { results, count } = { results: [], count: 0 },
    refetch,
  } = trpc.users.listUsers.useQuery({ query, page }, { keepPreviousData: true });
  const { mutate } = trpc.users.updateRole.useMutation({
    onSuccess: () => refetch(),
  });

  const changeUserRole = (userId: string, newRole: Role) => {
    mutate({ userId, newRole });
  };

  return (
    <>
      <Head>
        <title>Bucket List | Managing users</title>
        <meta name="description" content="all our users" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Stack mx="auto" sx={{ width: '900px' }}>
          <AuthGuard>
            <Title>Users</Title>
            <UsersTable
              page={page}
              count={count}
              data={results}
              currentUser={session?.user?.id}
              updateRole={changeUserRole}
              onPageChange={setPage}
              onQueryChange={setQuery}
            />
          </AuthGuard>
        </Stack>
      </BaseLayout>
    </>
  );
};

export default UsersPage;
