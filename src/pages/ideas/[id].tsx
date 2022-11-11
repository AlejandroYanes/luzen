import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { PrismaClient } from '@prisma/client';
import { ActionIcon, Divider, Group, Skeleton, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons';

import BaseLayout from 'components/BaseLayout';
import Comments from 'components/Comments';
import VoteButton from 'components/VoteButton';
import UserAvatar from 'components/UserAvatar';
import { prisma } from 'server/db/client';
import type { inferPrismaModelFromQuery } from 'utils/prisma';
import { formatDate } from 'utils/dates';

interface Props {
  idea: string;
}

const IdeaDetails: NextPage<Props> = (props) => {
  const router = useRouter();
  const { idea = '{}' } = props;
  const parsedIdea: IdeaById = JSON.parse(idea);

  if (router.isFallback) {
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

  if (!parsedIdea?.id) {
    return (
      <>
        <Head>
          <title>Bucket List | share your idea</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <BaseLayout>
          <Stack spacing="xl" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <Group>
              <ActionIcon onClick={() => router.back()}>
                <IconArrowLeft />
              </ActionIcon>
            </Group>
            <Title order={1} mb={48} align="center">Oops, we could not find this idea</Title>
            <span style={{ fontSize: '72px', textAlign: 'center' }}>😔</span>
          </Stack>
        </BaseLayout>
      </>
    );
  }

  const { id, title, summary, description, postedAt, votes, author } = parsedIdea;

  return (
    <>
      <Head>
        <title>Bucket List | {title}</title>
        <meta name="description" content={summary} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Group align="flex-start" sx={{ padding: '0 0 0 64px' }}>
          <Stack sx={{ width: '700px', margin: '0 auto' }}>
            <ActionIcon onClick={() => router.back()}>
              <IconArrowLeft />
            </ActionIcon>
            <Title order={1}>{title}</Title>
            <Group mb="xl" align="center" position="apart">
              <Group>
                <UserAvatar user={author} />
                <Stack spacing={0}>
                  <Text>{author?.name ?? 'Anonymous'}</Text>
                  <Text size="sm" color="dimmed">{formatDate(postedAt, 'en')}</Text>
                </Stack>
              </Group>
              <VoteButton ideaId={id} votes={votes} />
            </Group>
            <Text style={{ whiteSpace: 'break-spaces' }}>{description}</Text>
          </Stack>
          <Divider orientation="vertical" sx={{ minHeight: '85vh' }} />
          <Stack sx={{ width: '25%' }}>
            <Comments ideaId={id} />
          </Stack>
        </Group>
      </BaseLayout>
    </>
  );
};

export default IdeaDetails;

export async function getStaticPaths() {
  const ideas = await prisma.idea.findMany({
    take: 5,
    orderBy: { votes: 'desc' },
    where: {
      isDraft: false,
    },
  });
  const paths = ideas.map((idea) => ({ params: { id: idea.id } }));
  return {
    paths,
    fallback: true
  };
}

export async function getStaticProps(context: { params: { id: string } }) {
  const { params: { id } } = context;
  const idea = await queryIdeaById(prisma, id);

  return {
    props: {
      idea: JSON.stringify(idea || {}),
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once a day
    revalidate: 60 * 60 * 24, // In seconds
  }
}

type IdeaById = inferPrismaModelFromQuery<typeof queryIdeaById>;

function queryIdeaById(prismaClient: PrismaClient, id: string) {
  return prisma.idea.findFirst({
    where: {
      id,
      isDraft: false,
    },
    select: {
      id: true,
      title: true,
      summary: true,
      description: true,
      postedAt: true,
      votes: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
}
