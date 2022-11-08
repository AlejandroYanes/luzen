import { Button, Group, Table, Text } from '@mantine/core';
import { formatDate } from 'utils/dates';

interface Props {
  data: {
    id: string;
    postedAt: Date;
    content: string;
    author: {
      name: string | null;
      image: string | null;
    } | null;
  }[];
}

const CommentsTable = (props: Props) => {
  const { data } = props;
  const rows = data.map((comment) => (
    <tr key={comment.id}>
      <td style={{ verticalAlign: 'top' }}>
        <div>
          <Text weight={500}>
            {comment.author?.name || 'Anonymous'}
          </Text>
          <Text size="xs" color="dimmed">
            {formatDate(comment.postedAt, 'en')}
          </Text>
        </div>
      </td>
      <td>
        {comment.content}
      </td>
      <td style={{ verticalAlign: 'top' }}>
        <Button variant="outline" color="red" mt={2}>Block</Button>
      </td>
    </tr>
  ));

  return (
    <Table verticalSpacing="sm">
      <thead>
        <tr>
          <th style={{ width: '200px' }}>Author</th>
          <th>Content</th>
          <th style={{ width: '80px' }}></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

export default CommentsTable;
