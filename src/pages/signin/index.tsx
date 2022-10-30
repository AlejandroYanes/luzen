import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { Title, Text, Stack } from '@mantine/core';
import BaseLayout from 'components/BaseLayout';
import { GoogleButton } from 'components/SocialButtons';

const Signin: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();

  if (status === 'authenticated') {
    router.replace('/');
  }

  return (
    <>
      <Head>
        <title>Bucket List | share your idea</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Stack spacing={0} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Title>{`Let's get stared`}</Title>
          <Text mb="xl">Start sharing your ideas and helping others get real</Text>
          <GoogleButton onClick={() => signIn('google', { callbackUrl: '/' })} />
        </Stack>
      </BaseLayout>
    </>
  );
};

export default Signin;