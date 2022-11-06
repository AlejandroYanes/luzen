import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Skeleton,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons';
import BaseLayout from 'components/BaseLayout';
import { trpc } from 'utils/trpc';

const IdeaDetails: NextPage = () => {
  const router = useRouter();
  const { data: idea, isLoading } = trpc.ideas.fetchDraft.useQuery(router.query.id as string);

  if (isLoading) {
    return (
      <>
        <BaseLayout>
          <Stack sx={{ width: '700px', margin: '0 auto' }}>
            <Skeleton width={480} height={44} mt={44} />
            <Skeleton width={280} height={46} mb={16} mt={16} />
            <Skeleton width={700} height={680} />
          </Stack>
        </BaseLayout>
      </>
    );
  }

  if (!idea) {
    return (
      <>
        <Head>
          <title>Bucket List | share your idea</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <BaseLayout>
          <Stack spacing="xl" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Group>
              <ActionIcon onClick={() => router.back()}>
                <IconArrowLeft />
              </ActionIcon>
            </Group>
            <Title order={1} mb={48}>Oops, we could not find this draft</Title>
            <span style={{ fontSize: '72px', textAlign: 'center' }}>😔</span>
          </Stack>
        </BaseLayout>
      </>
    );
  }


  const { title, summary, description } = idea;

  return (
    <>
      <Head>
        <title>Bucket List | {title}</title>
        <meta name="description" content={summary} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Stack spacing="xl" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <ActionIcon onClick={() => router.back()}>
            <IconArrowLeft />
          </ActionIcon>
          <Title order={1} >{title}</Title>
          <Group position="apart" align="center" mb="xl">
            <Badge variant="outline">Draft</Badge>
            <Button color="orange">Edit</Button>
          </Group>
          <Text style={{ whiteSpace: 'break-spaces' }}>{description}</Text>
        </Stack>
      </BaseLayout>
    </>
  );
};

export default IdeaDetails;
