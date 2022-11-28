import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Group, Stack, Switch, Text, Title } from '@mantine/core';

import { trpc } from 'utils/trpc';
import GroupSkeleton from './GroupSkeleton';

export default function NotificationsSettings() {
  const { status, data } = useSession();

  const [emailStatus, setEmailStatus] = useState<boolean>(!!data?.user?.emailStatus);

  const { mutate: toggleEmailStatus } = trpc.users.toggleEmailStatus.useMutation({
    onSuccess: () => {
      setEmailStatus(!emailStatus);
    },
  });

  if (status === 'loading') {
    return (
      <Stack spacing="sm">
        <Title order={3}>Notifications</Title>
        <GroupSkeleton />
        <GroupSkeleton />
      </Stack>
    );
  }

  if (status !== 'authenticated') return null;

  return (
    <Stack spacing="sm">
      <Title order={3}>Notifications</Title>
      <Group align="center" position="apart" pl="md">
        <Text>Email</Text>
        <Switch
          onLabel="ON"
          offLabel="OFF"
          size="md"
          sx={{ display: 'flex' }}
          checked={emailStatus}
          onChange={() => toggleEmailStatus()}
        />
      </Group>
    </Stack>
  );
}
