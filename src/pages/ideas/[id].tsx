import { Suspense } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import type { PrismaClient } from '@prisma/client';
import { ActionIcon, Divider, Group, Skeleton, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons';

import BaseLayout from 'components/BaseLayout';
import UserAvatar from 'components/UserAvatar';
import { prisma } from 'server/db/client';
import type { inferPrismaModelFromQuery } from 'utils/prisma';
import { formatDate } from 'utils/dates';
import { env } from 'env/client.mjs';

const VoteButton = dynamic(() => import('components/VoteButton'), {
  ssr: false,
});
const Comments = dynamic(() => import('components/Comments'), {
  ssr: false,
});

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
          <Stack sx={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
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
          <title>Luzen | we could not find this idea</title>
        </Head>
        <BaseLayout>
          <Stack spacing="xl" style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
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

  const { id, title, tagLine, summary, postedAt, votes, author } = parsedIdea;
  const shortSummary = tagLine || summary;

  return (
    <>
      <Head>
        <title>Luzen | {title}</title>

        <meta name="title" content={title} />
        <meta name="description" content={shortSummary} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={shortSummary} />
        <meta property="og:image" content={`${env.NEXT_PUBLIC_DOMAIN}/api/og/ideas?id=${id}`} />
        <meta property="og:url" content={`${env.NEXT_PUBLIC_DOMAIN}/ideas?id=${id}`} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={shortSummary} />
        <meta name="twitter:image" content={`${env.NEXT_PUBLIC_DOMAIN}/api/og/ideas?id=${id}`} />
        <meta name="twitter:alt" content={title} />
      </Head>
      <BaseLayout>
        <Stack sx={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
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
            <Suspense>
              <VoteButton ideaId={id} votes={votes} />
            </Suspense>
          </Group>
          <Text style={{ whiteSpace: 'break-spaces' }}>{summary}</Text>
          <Divider mt="xl" mb="lg" />
          <Suspense>
            <Comments ideaId={id} />
          </Suspense>
        </Stack>
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
    // - At most once every 10s
    revalidate: 10, // In seconds
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
      tagLine: true,
      summary: true,
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
