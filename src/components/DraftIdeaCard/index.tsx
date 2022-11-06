import Link from 'next/link';
import { Button, Card, Group, Text, Title } from '@mantine/core';
import { formatDate } from 'utils/dates';

interface Props {
  idea: {
    id: string;
    title: string;
    summary: string;
    postedAt: Date;
  };
}

const DraftIdeaCard = (props: Props) => {
  const {
    idea: {
      id,
      title,
      summary,
      postedAt,
    },
  } = props;


  return (
    <Card p="lg" radius="md">
      <Title order={3}>{title}</Title>
      <Text size="sm" color="dimmed" mb="lg">{formatDate(postedAt, 'en')}</Text>
      <Text>
        {summary}
      </Text>
      <Group position="apart" style={{ marginTop: 'auto' }} pt="sm">
        <Group></Group>
        <Group>
          <Link href={`/ideas/drafts/${id}`}>
            <Button variant="default">Visit</Button>
          </Link>
          <Button color="orange">Edit</Button>
        </Group>
      </Group>
    </Card>
  );
};

export default DraftIdeaCard;
