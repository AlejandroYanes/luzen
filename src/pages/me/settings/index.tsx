import Head from 'next/head';
import { signOut, useSession } from 'next-auth/react';
import { Avatar, Button, createStyles, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { IconAt } from '@tabler/icons';

import BaseLayout from 'components/BaseLayout';
import SignInAlert from 'components/SignInAlert';
import { resolveInitials } from 'utils/strings';
import { trpc } from 'utils/trpc';

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
  },

  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

const SettingsPage = () => {
  const { classes } = useStyles();
  const { data } = useSession();
  const { mutate: deleteMyAccount } = trpc.users.deleteAccount.useMutation({
    onSuccess: () => {
      signOut({ callbackUrl: '/' });
    },
  });

  if (!data?.user) {
    return <SignInAlert asPage />;
  }

  const { user } = data;

  return (
    <>
      <Head>
        <title>Bucket List | My Settings</title>
        <meta name="description" content="My ideas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Stack style={{ width: '900px', margin: '0 auto' }}>
          <Title mb="xl">Settings</Title>
          <Group noWrap>
            <Avatar src={user.image} size="lg" radius="md">
              {user?.name ? resolveInitials(user?.name as string) : null}
            </Avatar>
            <div>
              <Text size="lg" weight={500} className={classes.name}>
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
          <Text>
            {`
            There's not really anything else to do here, 
            to manage your notifications check the notification bell.
            `}
          </Text>
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
