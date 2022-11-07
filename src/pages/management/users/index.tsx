import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { Button, Group, Stack, TextInput, Title, } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import BaseLayout from 'components/BaseLayout';
import UsersTable from 'components/UsersTable';
import { trpc } from 'utils/trpc';
import type { Role } from 'constants/roles';

const UsersPage: NextPage = () => {
  const { data: session } = useSession();
  const [query, setQuery] = useDebouncedState('', 200);
  const { data: users = [], refetch } = trpc.users.listUsers.useQuery(query);
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
        <Stack mx="auto" sx={{ width: '700px' }}>
          <Title>Users</Title>
          <TextInput
            my="lg"
            mr="auto"
            defaultValue=""
            placeholder="Search users"
            sx={{ width: '280px' }}
            onChange={(e) => setQuery(e.target.value)}
          />
          <UsersTable data={users} currentUser={session?.user?.id} updateRole={changeUserRole} />
          <Group position="center" py="lg">
            <Button variant="default">Load more</Button>
          </Group>
        </Stack>
      </BaseLayout>
    </>
  );
};

export default UsersPage;
