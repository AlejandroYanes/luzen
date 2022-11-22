import { Fragment } from 'react';
import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Stack, Title, Button, Group } from '@mantine/core';
import { Waypoint } from 'react-waypoint';

import { ITEMS_PER_PAGE_LIMIT } from 'constants/pagination';
import { prisma } from 'server/db/client';
import { trpc } from 'utils/trpc';
import type { inferPrismaModelFromQuery } from 'utils/prisma';
import { mobileViewMediaQuery } from 'hooks/ui/useMobileView';
import BaseLayout from 'components/BaseLayout';
import IdeaCard from 'components/IdeaCard';
import RenderIf from 'components/RenderIf';

interface Props {
  initialIdeas: string;
}

const noContent = (
  <>
    <Title mb="md">We have no ideas yet, want to be the first?</Title>
    <Group position="center">
      <Link href="/post/">
        <Button>Post your idea</Button>
      </Link>
    </Group>
  </>
);

const Home: NextPage<Props> = (props) => {
  const { initialIdeas } = props;
  const parsedInitialIdeas: ListedIdea[] = JSON.parse(initialIdeas);
  const initialCards = parsedInitialIdeas.map((idea) => <IdeaCard key={idea.id} idea={idea} />);

  const { data: infinite, fetchNextPage } = trpc.ideas.listInfinite.useInfiniteQuery({}, {
    getNextPageParam: (lastPage) => lastPage.nextPage,
    refetchOnWindowFocus: false,
  });

  const infiniteCards = infinite?.pages.map((page, index) => (
    <Fragment key={index}>
      {page.results.map((idea) => <IdeaCard key={idea.id} idea={idea} />)}
    </Fragment>
  )) || [];

  return (
    <>
      <Head>
        <title>Bucket List | Ideas</title>
        <meta name="title" content="Bucket List | Ideas" />
        <meta name="description" content="Our collections of ideas" />
      </Head>
      <BaseLayout>
        <Stack
          spacing="xl"
          sx={(theme) => ({
            width: '100%',
            maxWidth: '700px',
            margin: '0 auto',
            [`@media ${mobileViewMediaQuery(theme)}`]: {
              gap: '64px',
            },
          })}
        >
          <RenderIf
            condition={initialCards.length > 0 || infiniteCards.length > 0}
            fallback={noContent}
          >
            {initialCards}
            {infiniteCards}
            <Waypoint
              key="cursor"
              bottomOffset="-680px"
              scrollableAncestor={typeof window !== 'undefined' ? window : undefined}
              onEnter={() => fetchNextPage()}
            />
          </RenderIf>
        </Stack>
      </BaseLayout>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const ideas = await listTopIdeas();

  return {
    props: {
      initialIdeas: JSON.stringify(ideas || []),
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10s
    revalidate: 10, // In seconds
  }
}

export type ListedIdea = inferPrismaModelFromQuery<typeof listTopIdeas>[0];

function listTopIdeas() {
  return prisma.idea.findMany({
    take: ITEMS_PER_PAGE_LIMIT,
    orderBy: [
      { votes: 'desc' },
      { postedAt: 'desc' },
    ],
    where: {
      isDraft: false,
    },
    select: {
      id: true,
      title: true,
      summary: true,
      votes: true,
      postedAt: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
}
