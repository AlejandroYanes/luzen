import { type NextPage } from "next";
import Head from 'next/head';
import type { Idea } from '@prisma/client';
import BaseLayout from 'components/BaseLayout';
import IdeaCard from 'components/IdeaCard';
// import Link from "next/link";
// import { signIn, signOut, useSession } from "next-auth/react";
import { SimpleGrid, Stack } from '@mantine/core';
// import { trpc } from "../utils/trpc";

interface Props {
  ideas: Idea[];
}

const Home: NextPage<Props> = (props) => {
  const { ideas } = props;

  const cards = ideas.map((idea) => <IdeaCard key={idea.id} idea={idea} />)

  return (
    <>
      <Head>
        <title>Bucket List | share your idea</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Stack style={{ maxWidth: '600px', margin: '0 auto' }}>
          {cards}
        </Stack>
      </BaseLayout>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/ideas');
  const ideas = await res.json();

  return {
    props: {
      ideas,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  }
}
