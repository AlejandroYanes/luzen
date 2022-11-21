/* eslint-disable max-len */
import Head from 'next/head';
import { Stack, Title, Text, Alert } from '@mantine/core';
import { useRouter } from 'next/router';
import { IconAlertCircle } from '@tabler/icons';

import BaseLayout from 'components/BaseLayout';
import RenderIf from 'components/RenderIf';

const errorsMap: { [error: string]: string } = {
  fallback: "Seems something went wrong but we can't point to what, please contact the developers and send the url you have right now.",
  OAuthAccountNotLinked: 'Seems you already have an account with that email but with another provider.'
};

export default function SigninPage() {
  const { query } = useRouter();
  const hasErrors = !!query.error;
  const errorMessage = errorsMap[query.error as string] || errorsMap.fallback;

  return (
    <>
      <Head>
        <title>Bucket List | Share your idea</title>
      </Head>
      <BaseLayout>
        <Stack spacing="xl" style={{ maxWidth: '700px', margin: '48px auto 0' }}>
          <RenderIf condition={hasErrors}>
            <Alert
              icon={<IconAlertCircle size={16} />}
              title={<Title order={3}>Hmm...</Title>}
              variant="outline"
            >
              <Text size="lg">{errorMessage}</Text>
            </Alert>
          </RenderIf>
        </Stack>
      </BaseLayout>
    </>
  );
}
