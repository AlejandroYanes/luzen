import Head from 'next/head';
import { signOut, useSession } from 'next-auth/react';
import {
  Avatar,
  Button,
  createStyles,
  Divider,
  Group,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { IconAt } from '@tabler/icons';

import BaseLayout from 'components/BaseLayout';
import SignInAlert from 'components/SignInAlert';
import NotificationsSettings from 'components/NotificationsSettings';
import { resolveInitials } from 'utils/strings';
import { trpc } from 'utils/trpc';

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

  if (status === 'unauthenticated') {
    return <SignInAlert asPage />;
  }

  if (!data?.user) return null; // added to please TS, don't really like & might delete later

  const { user } = data;

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
          <NotificationsSettings />
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
