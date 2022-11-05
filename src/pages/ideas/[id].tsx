import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import type { PrismaClient } from '@prisma/client';
import { ActionIcon, Avatar, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons';
import { prisma } from 'server/db/client';
import type { inferPrismaModelFromQuery } from 'utils/prisma';
import { resolveInitials } from 'utils/strings';
import { formatDate } from 'utils/dates';
import BaseLayout from 'components/BaseLayout';
import Comments from 'components/Comments';
import VoteButton from 'components/VoteButton';

interface Props {
	idea: string;
}

const IdeaDetails: NextPage<Props> = (props) => {
  const { idea = '{}' } = props;
  const parsedIdea: IdeaById = JSON.parse(idea);

  if (!parsedIdea?.id) {
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
              <Link href="/">
                <ActionIcon>
                  <IconArrowLeft />
                </ActionIcon>
              </Link>
            </Group>
            <Title order={1} mb={48}>Oops, we could not find this idea</Title>
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
        {/*<Stack spacing="xl" style={{ maxWidth: '700px', margin: '0 auto' }}>*/}
        {/*  <Link href="/">*/}
        {/*    <ActionIcon>*/}
        {/*      <IconArrowLeft />*/}
        {/*    </ActionIcon>*/}
        {/*  </Link>*/}
        {/*  <Title order={1} mb="xl">{title}</Title>*/}
        {/*  <Text style={{ whiteSpace: 'break-spaces' }}>{description}</Text>*/}
        {/*  <Divider my="xl" />*/}
        {/*  <Title order={3}>Comments</Title>*/}
        {/*  <Comments ideaId={id} />*/}
        {/*</Stack>*/}
        <Group align="flex-start" sx={{ padding: '0 0 0 64px' }}>
          <Stack sx={{ width: '700px', margin: '0 auto' }}>
            <Link href="/">
              <ActionIcon>
                <IconArrowLeft />
              </ActionIcon>
            </Link>
            <Title order={1}>{title}</Title>
            <Group mb="xl" align="center" position="apart">
              <Group>
                <Avatar src={author?.image} alt={author?.name as string}>
                  {author?.name ? resolveInitials(author?.name as string) : 'A/N'}
                </Avatar>
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
  const ideas = await prisma.idea.findMany();
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
  return prisma.idea.findUnique({
    where: { id },
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
