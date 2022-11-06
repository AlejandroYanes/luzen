import Link from 'next/link';
import { Avatar, Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { formatDate } from 'utils/dates';
import VoteButton from 'components/VoteButton';
import { resolveInitials } from 'utils/strings';

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
    <Card p="lg" radius="md">
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
      <Group position="apart" style={{ marginTop: 'auto' }} pt="sm">
        <Group></Group>
        <Group>
          <Link href={`/ideas/${id}`}>
            <Button variant="default">Visit</Button>
          </Link>
          <VoteButton ideaId={id} votes={votes} />
        </Group>
      </Group>
    </Card>
  );
};

export default IdeaCard;
