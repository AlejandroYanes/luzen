import Head from 'next/head';
import { useRouter } from 'next/router';
import { Stack, Tabs } from '@mantine/core';
import BaseLayout from 'components/BaseLayout';
import IdeaCard from 'components/IdeaCard';
import DraftIdeaCard from 'components/DraftIdeaCard';
import AuthGuard from 'components/AuthGuard';
import { trpc } from 'utils/trpc';

const MyIdeasPage = () => {
  const { query, push } = useRouter();
  const listingDrafts = query.status === 'drafts';
  const { data = [] } = trpc.ideas.listMyIdeasByStatus.useQuery(listingDrafts);

  const ideaElements = data.map((idea) => (
    listingDrafts
      ? <DraftIdeaCard key={idea.id} idea={idea} />
      : <IdeaCard key={idea.id} idea={idea} />
  ));

  return (
    <>
      <Head>
        <title>Bucket List | My Ideas</title>
        <meta name="description" content="My ideas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Stack style={{ width: '700px', margin: '0 auto' }}>
          <AuthGuard>
            <Tabs
              value={query.status as string}
              onTabChange={(value) => push(`/me/ideas/${value}`)}
              mb="xl"
            >
              <Tabs.List>
                <Tabs.Tab value="published">Published</Tabs.Tab>
                <Tabs.Tab value="drafts">Drafts</Tabs.Tab>
              </Tabs.List>
            </Tabs>
            {ideaElements}
          </AuthGuard>
        </Stack>
      </BaseLayout>
    </>
  );
};

export default MyIdeasPage;
