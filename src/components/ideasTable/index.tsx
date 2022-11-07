import { Button, Group, Table, Text } from '@mantine/core';
import RenderIf from '../RenderIf';

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
}

const IdeasTable = (props: Props) => {
  const { data } = props;
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
          <RenderIf condition={idea.isDraft}>
            <Button>Publish</Button>
          </RenderIf>
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
          <th>Votes</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

export default IdeasTable;
