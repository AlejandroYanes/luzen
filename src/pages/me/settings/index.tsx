import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { Avatar, createStyles, Group, Stack, Text, Title, Button, Divider } from '@mantine/core';
import { IconAt } from '@tabler/icons';

import BaseLayout from 'components/BaseLayout';
import SignInAlert from 'components/SignInAlert';
import { resolveInitials } from 'utils/strings';

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
  },

  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

const SettingsPage = () => {
  const { data } = useSession();
  const { classes } = useStyles();

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
          <Title order={2} mt="xl">Notifications</Title>
          <Title order={2}>...</Title>
          <Divider mt="xl" />
          <Group position="apart">
            <Text>Tired of hanging around?</Text>
            <Button color="red">Delete Account</Button>
          </Group>
        </Stack>
      </BaseLayout>
    </>
  );
};

export default SettingsPage;
