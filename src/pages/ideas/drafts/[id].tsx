import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import {
  ActionIcon,
  Badge,
  Button,
  Divider,
  Group,
  Skeleton,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons';

import BaseLayout from 'components/BaseLayout';
import SignInAlert from 'components/SignInAlert';
import RenderIf from 'components/RenderIf';
import { trpc } from 'utils/trpc';

const IdeaDetails: NextPage = () => {
  const router = useRouter();
  const { status, data: session } = useSession();
  const { data: idea, isLoading } = trpc.ideas.fetchDraft.useQuery(router.query.id as string);

  if (isLoading || status === 'loading') {
    return (
      <>
        <BaseLayout>
          <Stack mx="auto" sx={{ width: '100%', maxWidth: '700px' }}>
            <Skeleton width={480} height={44} mt={44} />
            <Skeleton width={280} height={46} mb={16} mt={16} />
            <Skeleton width={700} height={680} />
          </Stack>
        </BaseLayout>
      </>
    );
  }

  if (status === 'unauthenticated') return <SignInAlert asPage />

  if (!idea) {
    return (
      <>
        <Head>
          <title>Luzen | share your idea</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <BaseLayout>
          <Stack spacing="xl" mx="auto" style={{ width: '100%', maxWidth: '700px' }}>
            <Group>
              <ActionIcon onClick={() => router.back()}>
                <IconArrowLeft />
              </ActionIcon>
            </Group>
            <Title order={1} mb={48} align="center">Oops, we could not find this draft</Title>
            <span style={{ fontSize: '72px', textAlign: 'center' }}>😔</span>
          </Stack>
        </BaseLayout>
      </>
    );
  }

  const { user } = session!;
  const { title, tagLine, summary, authorId } = idea;

  return (
    <>
      <Head>
        <title>Luzen | {title}</title>
      </Head>
      <BaseLayout>
        <Stack spacing="xl" mx="auto" style={{ width: '100%', maxWidth: '700px' }}>
          <ActionIcon onClick={() => router.back()}>
            <IconArrowLeft />
          </ActionIcon>
          <Title order={1} >{title}</Title>
          <Group position="apart" align="center" mb="xl">
            <Badge variant="outline">Draft</Badge>
            <RenderIf condition={user!.id === authorId}>
              <Link href={`/post/${idea.id}`}>
                <Button color="orange">Edit</Button>
              </Link>
            </RenderIf>
          </Group>
          <RenderIf condition={!!tagLine}>
            <Stack spacing={0}>
              <Text color="dimmed">Tagline</Text>
              <Text mb="sm">{tagLine}</Text>
              <Divider my="xl" />
            </Stack>
          </RenderIf>
          <Text color="dimmed">Description</Text>
          <Text style={{ whiteSpace: 'break-spaces' }}>{summary}</Text>
        </Stack>
      </BaseLayout>
    </>
  );
};

export default IdeaDetails;
