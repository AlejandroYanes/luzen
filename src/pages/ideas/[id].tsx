import type { NextPage } from 'next';
import Head from 'next/head';
import type { Idea } from '@prisma/client';
import { Group, Stack, Text, Title, ActionIcon } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons';
import Link from 'next/link';
import { prisma } from 'server/db/client';
import BaseLayout from 'components/BaseLayout';

interface Props {
	idea: string;
}

const IdeaDetails: NextPage<Props> = (props) => {
  const { idea = '{}' } = props;
  const parsedIdea: Idea = JSON.parse(idea);

  if (!parsedIdea.id) {
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


  const { title, summary, description } = parsedIdea;

  return (
    <>
      <Head>
        <title>Bucket List | {title}</title>
        <meta name="description" content={summary} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Stack spacing="xl" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Link href="/">
            <ActionIcon>
              <IconArrowLeft />
            </ActionIcon>
          </Link>
          <Title order={1} mb="xl">{title}</Title>
          <Text>{description}</Text>
        </Stack>
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
  const idea = await prisma.idea.findUnique({ where: { id } });

  return {
    props: {
      idea: JSON.stringify(idea || {}),
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 60 * 60 * 24, // In seconds
  }
}
