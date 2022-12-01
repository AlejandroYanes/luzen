import { IconAlertCircle } from '@tabler/icons';
import { Alert, Button, Group, Stack } from '@mantine/core';
import Head from 'next/head';

import { openSignInModal } from '../SignInModal';
import BaseLayout from '../BaseLayout';

interface Props {
  asPage?: boolean;
}

export default function SignInAlert(props: Props) {
  const { asPage } = props;

  if (asPage) {
    return (
      <>
        <Head>
          <title>Luzen | Oops...</title>
          <meta name="description" content="Un-authenticated" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <BaseLayout>
          <Stack mx="auto" style={{ maxWidth: '700px' }}>
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Hmm..."
              variant="outline"
            >
              {`Seems we're not sure who you are, do you mind signing in?`}
              <Group position="right" mt="md">
                <Button onClick={() => openSignInModal()}>Sign in</Button>
              </Group>
            </Alert>
          </Stack>
        </BaseLayout>
      </>
    );
  }

  return (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title="Hmm..."
      variant="outline"
    >
      {`Seems we're not sure who you are, do you mind signing in?`}
      <Group position="right" mt="md">
        <Button onClick={() => openSignInModal()}>Sign in</Button>
      </Group>
    </Alert>
  );
}
