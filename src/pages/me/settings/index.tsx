import Head from 'next/head';
import { signOut, useSession } from 'next-auth/react';
import { Avatar, Button, createStyles, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconAt } from '@tabler/icons';

import BaseLayout from 'components/BaseLayout';
import SignInAlert from 'components/SignInAlert';
import NotificationsSettings from 'components/NotificationsSettings';
import RenderIf from 'components/RenderIf';
import { resolveInitials } from 'utils/strings';
import { trpc } from 'utils/trpc';
import {
  askPermission,
  showPushPermissionModal,
  subscribeToPushNotifications
} from 'utils/web-push';
import { ROLES } from 'constants/roles';

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
  },
}));

const SettingsPage = () => {
  const { classes } = useStyles();
  const { data, status } = useSession();
  const { mutate: deleteMyAccount } = trpc.users.deleteAccount.useMutation({
    onSuccess: async () => {
      await signOut({ callbackUrl: '/' });
    },
  });

  const { mutate: sendEmail } = trpc.users.sendEmail.useMutation();
  const { mutate: sendSlack } = trpc.users.sendSlack.useMutation();
  const { mutate: sendPush } = trpc.users.sendPush.useMutation();
  const { mutate: storeWebPushSub } = trpc.users.storeWebPushSub.useMutation({
    onSuccess: () => {
      showNotification({
        title: 'Done',
        message: `
            You're now set to receive notifications.\n
            You can disable notifications at any time on the Settings page.
          `,
      });
    },
  });

  if (status === 'unauthenticated') {
    return <SignInAlert asPage />;
  }

  if (!data?.user) return null; // added to please TS, don't really like & might delete later

  const { user } = data;

  const handlePushSubscription = () => {
    showPushPermissionModal(async () => {
      const permission = await askPermission();
      if (permission === 'granted') {
        const subscription = await subscribeToPushNotifications();
        console.log(JSON.stringify(subscription));
        storeWebPushSub({ data: JSON.stringify(subscription) });
      }
    });
  };

  return (
    <>
      <Head>
        <title>Bucket List | My Settings</title>
        <meta name="description" content="My ideas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Stack style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
          <Title mb="xl">Settings</Title>
          <Group noWrap>
            <Avatar src={user.image} size="lg" radius="md">
              {user?.name ? resolveInitials(user?.name as string) : null}
            </Avatar>
            <div>
              <Text size="lg">
                {user.name}
              </Text>
              <Group noWrap spacing={10} mt={3}>
                <IconAt stroke={1.5} size={16} className={classes.icon} />
                <Text size="xs" color="dimmed">
                  {user.email}
                </Text>
              </Group>
            </div>
          </Group>
          <Divider mt="xl" />
          <Group position="apart">
            <Text>Email test</Text>
            <Button onClick={() => sendEmail()}>Send email</Button>
          </Group>
          <Group position="apart">
            <Text>Slack test</Text>
            <Button onClick={() => sendSlack()}>Send Slack</Button>
          </Group>
          <Group position="apart">
            <Text>Web push test</Text>
            <Button onClick={() => sendPush()}>Send web push</Button>
          </Group>
          <RenderIf condition={!user?.webPushStatus}>
            <Group position="apart">
              <Text>Web push permissions</Text>
              <Button onClick={handlePushSubscription}>
                Ask for push notifications
              </Button>
            </Group>
          </RenderIf>
          <Divider mt="xl" />
          <NotificationsSettings showAdminSettings={user?.role === ROLES.ADMIN} />
          <Divider mt="xl" />
          <Group position="apart">
            <Text>Tired of hanging around?</Text>
            <Button color="red" onClick={() => deleteMyAccount()}>
              Delete Account
            </Button>
          </Group>
        </Stack>
      </BaseLayout>
    </>
  );
};

export default SettingsPage;
