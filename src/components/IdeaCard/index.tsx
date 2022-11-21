import { Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Avatar, Button, Card, Group, Stack, Text, Title } from '@mantine/core';

import { formatDate } from 'utils/dates';
import { resolveInitials } from 'utils/strings';
import { mobileViewMediaQuery } from 'hooks/ui/useMobileView';

const VoteButton = dynamic(() => import('components/VoteButton'), {
  ssr: false,
});

interface Props {
  idea: {
    id: string;
    title: string;
    summary: string;
    postedAt: Date;
    votes: number;
    author: {
      name: string | null;
      image: string | null;
    } | null;
  };
}

const IdeaCard = (props: Props) => {
  const {
    idea: {
      id,
      title,
      summary,
      postedAt,
      votes,
      author,
    },
  } = props;

  return (
    <Card
      p="lg"
      radius="md"
      sx={(theme) => ({
        backgroundColor: 'transparent',
        [`@media ${mobileViewMediaQuery(theme)}`]: {
          padding: '0',
          borderRadius: 0,
        },
      })}
    >
      <Title order={3}>{title}</Title>
      <Group mb="lg">
        <Avatar src={author?.image} alt={author?.name as string}>
          {author?.name ? resolveInitials(author?.name as string) : 'A/N'}
        </Avatar>
        <Stack spacing={0}>
          <Text>{author?.name ?? 'Anonymous'}</Text>
          <Text size="sm" color="dimmed">{formatDate(postedAt, 'en')}</Text>
        </Stack>
      </Group>
      <Text>
        {summary}
      </Text>
      <Group position="right" mt="lg" pt="sm">
        <Group>
          <Link href={`/ideas/${id}`}>
            <Button variant="default">Visit</Button>
          </Link>
          <Suspense>
            <VoteButton ideaId={id} votes={votes} />
          </Suspense>
        </Group>
      </Group>
    </Card>
  );
};

export default IdeaCard;
