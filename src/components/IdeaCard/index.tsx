import Link from 'next/link';
import type { Idea } from '@prisma/client';
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { formatDate } from 'utils/dates';
import VoteButton from 'components/VoteButton';

interface Props {
	idea: Idea;
}

const IdeaCard = (props: Props) => {
  const {
    idea: {
      id,
      title,
      summary,
      postedAt,
      votes,
    },
  } = props;


  return (
    <Card p="lg" radius="md">
      <Stack style={{ height: '100%' }}>
        <Stack spacing={0}>
          <Title order={3}>{title}</Title>
          <Text size="sm" color="dimmed">{formatDate(postedAt, 'en')}</Text>
        </Stack>
        <Text>
          {summary}
        </Text>
        <Group position="apart" style={{ marginTop: 'auto' }} pt="sm">
          <Group></Group>
          <Group>
            <Link href={`/ideas/${id}`}>
              <Button variant="default">Visit</Button>
            </Link>
            <VoteButton ideaId={id} votes={votes} />
          </Group>
        </Group>
      </Stack>
    </Card>
  );
};

export default IdeaCard;
