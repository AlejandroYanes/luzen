import { Button, Group, Table, Text } from '@mantine/core';

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
  }[];
  toggleStatus: (ideaId: string) => void;
}

const IdeasTable = (props: Props) => {
  const { data, toggleStatus } = props;
  const rows = data.map((idea) => (
    <tr key={idea.id}>
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

      <td>
        {idea.votes}
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
          <th>Title</th>
          <th style={{ width: '120px' }}>Votes</th>
          <th style={{ width: '280px' }}></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

export default IdeasTable;
