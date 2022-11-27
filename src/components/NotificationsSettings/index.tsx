import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Group, Stack, Switch, Text, Title } from '@mantine/core';

import { WEB_PUSH_STATUS } from 'constants/web-push';
import useWebPushSub from 'hooks/ui/useWebPushSub';
import { trpc } from 'utils/trpc';
import GroupSkeleton from './GroupSkeleton';

export default function NotificationsSettings() {
  const { status, data } = useSession();

  const [pushStatus, setPushStatus] = useState<string | undefined>(data?.user?.webPushStatus);
  const [emailStatus, setEmailStatus] = useState<boolean>(!!data?.user?.emailStatus);

  const { setupPushNotifications } = useWebPushSub(() => setPushStatus(WEB_PUSH_STATUS.GRANTED));

  const { mutate: updateWebPushStatus } = trpc.users.updateWebPushStatus.useMutation({
    onSuccess: (nextStatus) => {
      setPushStatus(nextStatus);
    },
  });

  const { mutate: toggleEmailStatus } = trpc.users.toggleEmailStatus.useMutation({
    onSuccess: () => {
      setEmailStatus(!emailStatus);
    },
  });

  const handlePushToggle = () => {
    if (!pushStatus) {
      setupPushNotifications();
      return;
    }

    const nextStatus = pushStatus === WEB_PUSH_STATUS.GRANTED
      ? WEB_PUSH_STATUS.DENIED
      : WEB_PUSH_STATUS.GRANTED;
    updateWebPushStatus({ status: nextStatus });
  };

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
        <Text>Push</Text>
        <Switch
          onLabel="ON"
          offLabel="OFF"
          size="md"
          sx={{ display: 'flex' }}
          checked={pushStatus === WEB_PUSH_STATUS.GRANTED}
          onChange={handlePushToggle}
        />
      </Group>
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
