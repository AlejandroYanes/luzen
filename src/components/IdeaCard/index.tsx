import { useState } from 'react';
import Link from 'next/link';
import type { Idea } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconBulb } from '@tabler/icons';
import { formatDate } from 'utils/dates';
import { trpc } from 'utils/trpc';

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
      votes: originalVotes,
    },
  } = props;
  const { status } = useSession();
  const [votes, setVotes] = useState(originalVotes);

  const { mutate } = trpc.ideas.lightUp.useMutation({
    onSuccess: () => {
      setVotes(votes + 1);
    },
  });

  const handleLightUp = () => {
    if (status === 'unauthenticated') {
      showNotification({
        title: 'Hey',
        message: 'Thanks for the interest, please Sign In.',
        autoClose: 2500,
      });
      return;
    }
    mutate(id);
  };

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
            <Button
              color="primary"
              leftIcon={<IconBulb />}
              onClick={handleLightUp}
            >
              Light Up ({votes})
            </Button>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
};

export default IdeaCard;
