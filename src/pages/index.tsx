import { type NextPage } from 'next';
import Head from 'next/head';
import { Stack } from '@mantine/core';

import BaseLayout from 'components/BaseLayout';
import HeroTitle from 'components/HeroTitle';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Luzen | Share your ideas</title>
        <meta name="description" content="A place to share your ideas" />
      </Head>
      <BaseLayout>
        <Stack spacing="xl" style={{ maxWidth: '700px', margin: '48px auto 0' }}>
          <HeroTitle />
        </Stack>
      </BaseLayout>
    </>
  );
};

export default Home;
