import Link from 'next/link';
import { ActionIcon, Button, Group, Table, Text } from '@mantine/core';
import { IconEye } from '@tabler/icons';

interface Props {
  data: {
    id: string;
    title: string;
    summary: string;
    postedAt: Date;
    votes: number;
    isDraft: boolean;
    author: {
      name: string | null;
      image: string | null;
    } | null;
    _count: {
      comments: number;
    };
  }[];
  toggleStatus: (ideaId: string) => void;
}

const IdeasTable = (props: Props) => {
  const { data, toggleStatus } = props;
  const rows = data.map((idea) => (
    <tr key={idea.id}>
      <td>
        <Link href={`/management/ideas/${idea.id}/comments`}>
          <ActionIcon><IconEye size={14} /></ActionIcon>
        </Link>
      </td>
      <td>
        <div>
          <Text weight={500}>
            {idea.title}
          </Text>
          <Text size="xs" color="dimmed">
            {idea.author?.name || 'Anonymous'}
          </Text>
        </div>
      </td>
      <td style={{ textAlign: 'center' }}>
        {idea.votes}
      </td>
      <td style={{ textAlign: 'center' }}>
        {idea._count.comments}
      </td>
      <td>
        <Group position="right">
          <Button
            onClick={() => toggleStatus(idea.id)}
            variant={idea.isDraft ? 'filled' : 'outline'}
          >
            {idea.isDraft ? 'Publish' : 'Turn Draft'}
          </Button>
          <Button variant="outline" color="red">Block</Button>
        </Group>
      </td>
    </tr>
  ));

  return (
    <Table verticalSpacing="sm">
      <thead>
        <tr>
          <th style={{ width: '32px' }}></th>
          <th>Title</th>
          <th style={{ width: '70px', textAlign: 'center' }}>Votes</th>
          <th style={{ width: '100px', textAlign: 'center' }}>Comments</th>
          <th style={{ width: '280px' }}></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

export default IdeasTable;
