import type { NextPage } from 'next';
import Head from 'next/head';
import { Stack, Title } from '@mantine/core';
import BaseLayout from 'components/BaseLayout';
import UsersTable from 'components/UsersTable';
import { trpc } from 'utils/trpc';

const UsersPage: NextPage = () => {
  const { data: users = [], isLoading } = trpc.users.listUsers.useQuery();
  return (
    <>
      <Head>
        <title>Bucket List | Managing users</title>
        <meta name="description" content="all our users" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Stack mx="auto" sx={{ width: '700px' }}>
          <Title>Users</Title>
          <UsersTable isLoading={isLoading} data={users} />
        </Stack>
      </BaseLayout>
    </>
  );
};

export default UsersPage;
